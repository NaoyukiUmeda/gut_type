import { NextRequest,NextResponse } from "next/server";
import { pushMessage,Message } from "@/lib/line";
import { isAuthorizedOperator } from "@/lib/line-auth";
export const runtime="edge";
export async function POST(req:NextRequest){
  if(!isAuthorizedOperator(req))return NextResponse.json({ok:false},{status:401});
  const {line_user_id,messages}=await req.json() as {line_user_id:string;messages:Message[]};
  if(typeof line_user_id!=="string"||!Array.isArray(messages)||messages.length<1||messages.length>5)return NextResponse.json({ok:false},{status:400});
  return NextResponse.json({ok:await pushMessage(line_user_id,messages)});
}
