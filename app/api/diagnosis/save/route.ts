import { NextRequest,NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { pushMessage } from "@/lib/line";
import { TYPES } from "@/lib/types";
import { scoreAnswers } from "@/lib/judge";
import { AuthError,requireLineUser } from "@/lib/line-auth";
import { PRIVACY_VERSION,SITE } from "@/lib/site";
export const runtime="edge";
export async function POST(req:NextRequest){
  try{
    const user=await requireLineUser(req);
    const raw=await req.text();
    if(raw.length>8000)return NextResponse.json({ok:false,error:"TOO_LARGE"},{status:413});
    let body;
    try{body=JSON.parse(raw);}catch{return NextResponse.json({ok:false,error:"INVALID_JSON"},{status:400});}
    if(body?.consent!==PRIVACY_VERSION || typeof body.subscribeSteps!=="boolean")return NextResponse.json({ok:false,error:"CONSENT_REQUIRED"},{status:400});
    let result;
    try{result=scoreAnswers(body.answers);}catch{return NextResponse.json({ok:false,error:"INVALID_ANSWERS"},{status:400});}
    if(!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY||!process.env.LINE_CHANNEL_ACCESS_TOKEN || (body.subscribeSteps&&!process.env.CRON_SECRET))return NextResponse.json({ok:false,error:"SAVE_NOT_CONFIGURED"},{status:503});
    const supabase=getServerSupabase();
    const {error:userError}=await supabase.from("line_users").upsert({line_user_id:user.userId,display_name:user.displayName,updated_at:new Date().toISOString()},{onConflict:"line_user_id"});
    if(userError)throw new Error("USER_SAVE_FAILED");
    const {data:diagnosis,error}=await supabase.from("diagnoses").insert({
      line_user_id:user.userId,main_type:result.main,sub_type:result.sub,
      score_a:result.scores.A,score_b:result.scores.B,score_c:result.scores.C,score_d:result.scores.D,score_e:result.scores.E,
      answers_json:{...body.answers,_meta:{consentVersion:PRIVACY_VERSION,consentedAt:new Date().toISOString(),subscribeSteps:body.subscribeSteps,copyVersion:"reflection-2026-11-01"}},
      diagnosed_at:new Date().toISOString(),
    }).select("id").single();
    if(error||!diagnosis)throw new Error("RESULT_SAVE_FAILED");
    let stepsScheduled=false;
    if(body.subscribeSteps){
      const stopped=await supabase.from("step_deliveries").update({status:"stopped",updated_at:new Date().toISOString()}).eq("line_user_id",user.userId).in("status",["pending","in_progress"]);
      if(!stopped.error){
        const next=new Date();next.setUTCDate(next.getUTCDate()+1);next.setUTCHours(0,0,0,0);
        const scheduled=await supabase.from("step_deliveries").insert({line_user_id:user.userId,diagnosis_id:diagnosis.id,main_type:result.main,current_day:0,status:"pending",next_send_at:next.toISOString()});
        stepsScheduled=!scheduled.error;
      }
    }
    const sent=await pushMessage(user.userId,[{type:"text",text:"GutTypeのチェック結果\n\n"+TYPES[result.main].resultText+"\n\n行動例：\n"+TYPES[result.main].todos.map((item,i)=>(i+1)+". "+item).join("\n")+"\n\n記録の方法を図で確認する\n"+SITE.foodGuideUrl+"\n\nこの結果は病気の診断や腸内細菌の測定ではありません。"}]);
    return NextResponse.json({ok:true,lineSent:sent,stepsScheduled},{headers:{"Cache-Control":"no-store"}});
  }catch(error){
    if(error instanceof AuthError)return NextResponse.json({ok:false,error:error.message},{status:error.status,headers:{"Cache-Control":"no-store"}});
    console.error("GutType save failed");
    return NextResponse.json({ok:false,error:"SAVE_FAILED"},{status:500,headers:{"Cache-Control":"no-store"}});
  }
}
