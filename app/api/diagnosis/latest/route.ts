import { NextRequest,NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { AuthError,requireLineUser } from "@/lib/line-auth";
import { isTypeId } from "@/lib/types";
export const runtime="edge";
export async function GET(req:NextRequest){
  try{
    const user=await requireLineUser(req);
    if(!process.env.SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)return NextResponse.json({ok:false,error:"SAVE_NOT_CONFIGURED"},{status:503});
    const {data,error}=await getServerSupabase().from("diagnoses").select("main_type,sub_type,diagnosed_at").eq("line_user_id",user.userId).order("diagnosed_at",{ascending:false}).limit(1).maybeSingle();
    if(error)throw new Error("RESULT_LOAD_FAILED");
    if(!data||!isTypeId(data.main_type))return NextResponse.json({ok:false,error:"NO_RESULT"},{status:404});
    return NextResponse.json({ok:true,diagnosis:{main_type:data.main_type,sub_type:isTypeId(data.sub_type)?data.sub_type:null,diagnosed_at:data.diagnosed_at}},{headers:{"Cache-Control":"no-store"}});
  }catch(error){
    return NextResponse.json({ok:false,error:error instanceof AuthError?error.message:"LOAD_FAILED"},{status:error instanceof AuthError?error.status:500,headers:{"Cache-Control":"no-store"}});
  }
}
