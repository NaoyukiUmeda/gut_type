import { NextRequest,NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { pushMessage } from "@/lib/line";
import { isAuthorizedOperator } from "@/lib/line-auth";
import { isTypeId,TYPES } from "@/lib/types";
import { SITE } from "@/lib/site";
export const runtime="edge";
export async function GET(req:NextRequest){
  if(!isAuthorizedOperator(req))return NextResponse.json({ok:false},{status:401});
  if(!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY||!process.env.LINE_CHANNEL_ACCESS_TOKEN)return NextResponse.json({ok:false,error:"NOT_CONFIGURED"},{status:503});
  try{
    const supabase=getServerSupabase(),now=new Date().toISOString();
    const {data,error}=await supabase.from("step_deliveries").select("*, line_users!inner(is_blocked)").in("status",["pending","in_progress"]).lte("next_send_at",now).eq("line_users.is_blocked",false);
    if(error)throw new Error("LOAD_FAILED");
    let sent=0,failed=0;
    for(const delivery of data||[]){
      if(!isTypeId(delivery.main_type)){failed++;continue;}
      const day=delivery.current_day+1,type=TYPES[delivery.main_type as keyof typeof TYPES];
      if(day<1||day>3){failed++;continue;}
      const text=day===1?"【1回目】記録するものを決める\n\n"+type.resultText+"\n\n今日の行動例：\n"+type.todos[0]:
        day===2?"【2回目】記録を見返す\n\n"+type.todos[1]+"。写真に残せない時刻や材料も、メモで補えます。\n\n"+SITE.foodGuideUrl:
        "【3回目】次に試したいことを選ぶ\n\n"+type.todos[2]+"。記録から体調の原因を断定せず、分かったことと分からないことを分けて考えましょう。\n\n"+SITE.researchGuideUrl;
      if(!await pushMessage(delivery.line_user_id,[{type:"text",text}])){failed++;continue;}
      const next=new Date();next.setUTCDate(next.getUTCDate()+1);next.setUTCHours(0,0,0,0);
      const updated=await supabase.from("step_deliveries").update({current_day:day,status:day===3?"completed":"in_progress",next_send_at:day===3?null:next.toISOString(),completed_at:day===3?now:null,updated_at:now}).eq("id",delivery.id);
      if(updated.error)failed++;else sent++;
    }
    return NextResponse.json({ok:true,sent,failed},{headers:{"Cache-Control":"no-store"}});
  }catch{return NextResponse.json({ok:false,error:"DELIVERY_FAILED"},{status:500});}
}
