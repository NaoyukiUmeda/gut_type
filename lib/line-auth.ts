export class AuthError extends Error {
  constructor(public status:number, message:string){super(message);}
}
export async function requireLineUser(request: Request, fetcher:typeof fetch=fetch) {
  const authorization=request.headers.get("authorization")||"";
  if(!authorization.startsWith("Bearer ")||authorization.length<10) throw new AuthError(401,"LINE_LOGIN_REQUIRED");
  const channelId=process.env.LINE_LOGIN_CHANNEL_ID;
  if(!channelId || !/^\d+$/.test(channelId)) throw new AuthError(503,"LINE_LOGIN_NOT_CONFIGURED");
  const token=authorization.slice(7);
  try{
    const verification=await fetcher("https://api.line.me/oauth2/v2.1/verify?access_token="+encodeURIComponent(token),{signal:AbortSignal.timeout(10000),cache:"no-store"});
    if(!verification.ok) throw new AuthError(401,"INVALID_LINE_TOKEN");
    const data=await verification.json();
    if(data.client_id!==channelId || !(typeof data.expires_in==="number"&&data.expires_in>0)) throw new AuthError(401,"INVALID_LINE_TOKEN");
    const response=await fetcher("https://api.line.me/v2/profile",{headers:{Authorization:"Bearer "+token},signal:AbortSignal.timeout(10000),cache:"no-store"});
    if(!response.ok) throw new AuthError(401,"INVALID_LINE_TOKEN");
    const profile=await response.json();
    if(typeof profile.userId!=="string"||!/^U[0-9a-f]{32}$/i.test(profile.userId)) throw new AuthError(401,"INVALID_LINE_PROFILE");
    return {userId:profile.userId as string,displayName:typeof profile.displayName==="string"?profile.displayName:null};
  }catch(error){if(error instanceof AuthError)throw error;throw new AuthError(503,"LINE_UNAVAILABLE");}
}
export function isAuthorizedOperator(request:Request):boolean {
  const secret=process.env.CRON_SECRET;
  return !!secret && request.headers.get("authorization")==="Bearer "+secret;
}
