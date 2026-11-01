import {test,afterEach,beforeEach} from "node:test";
import assert from "node:assert/strict";
import {NextRequest} from "next/server";
import {scoreAnswers} from "../lib/judge";
import {QUESTIONS} from "../lib/questions";
import {requireLineUser,isAuthorizedOperator,AuthError} from "../lib/line-auth";
import {POST as save} from "../app/api/diagnosis/save/route";
import {GET as latest} from "../app/api/diagnosis/latest/route";
import {PRIVACY_VERSION} from "../lib/site";
const verifiedId="U"+"a".repeat(32),foreignId="U"+"b".repeat(32);
const answers=Object.fromEntries(QUESTIONS.map(q=>[q.id,q.choices[0].id]));
const savedEnv={...process.env};const nativeFetch=globalThis.fetch;
beforeEach(()=>{process.env.LINE_LOGIN_CHANNEL_ID="12345";process.env.SUPABASE_URL="https://example.supabase.co";process.env.SUPABASE_SERVICE_ROLE_KEY="test-only";process.env.LINE_CHANNEL_ACCESS_TOKEN="test-only";process.env.CRON_SECRET="test-operator";});
afterEach(()=>{globalThis.fetch=nativeFetch;for(const key of Object.keys(process.env))if(!(key in savedEnv))delete process.env[key];Object.assign(process.env,savedEnv);});
const response=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json"}});
function fixtures(options:{clientId?:string;expires?:number;pushOk?:boolean}={}){
  const calls:{url:string;method:string;body:any}[]=[];
  globalThis.fetch=async(input,init)=>{
    const url=String(input),body=typeof init?.body==="string"?JSON.parse(init.body):null;
    calls.push({url,method:init?.method||"GET",body});
    if(url.includes("/oauth2/v2.1/verify"))return response({client_id:options.clientId??"12345",expires_in:options.expires??300});
    if(url.endsWith("/v2/profile"))return response({userId:verifiedId,displayName:"Test"});
    if(url.includes("/rest/v1/line_users"))return new Response(null,{status:204});
    if(url.includes("/rest/v1/diagnoses")&&init?.method==="POST")return response({id:"test-diagnosis"});
    if(url.includes("/rest/v1/diagnoses"))return response([{main_type:"D",sub_type:null,diagnosed_at:"2026-11-01T00:00:00Z"}]);
    if(url.includes("/rest/v1/step_deliveries"))return new Response(null,{status:204});
    if(url.endsWith("/message/push"))return response({},options.pushOk===false?503:200);
    throw new Error("Unexpected request: "+url);
  };
  return calls;
}
const request=(body:unknown,authenticated=true)=>new NextRequest("https://gut-type.pages.dev/api/diagnosis/save/",{method:"POST",headers:{"Content-Type":"application/json",...(authenticated?{Authorization:"Bearer fake-access-token"}:{})},body:JSON.stringify(body)});
test("all questions are required and wrong/extra choice ids fail",()=>{
  assert.doesNotThrow(()=>scoreAnswers(answers));
  assert.throws(()=>scoreAnswers({}));
  assert.throws(()=>scoreAnswers({...answers,1:"q2_1"}));
  assert.throws(()=>scoreAnswers({...answers,8:"q8_1"}));
  assert.throws(()=>scoreAnswers(null));
});
test("valid old question IDs retain their scoring meaning",()=>{
  const a=scoreAnswers(answers);assert.equal(a.scores.A,13);assert.equal(a.scores.B,6);assert.equal(a.scores.D,4);assert.equal(a.main,"A");
  const balanced=Object.fromEntries(QUESTIONS.map(q=>[q.id,q.choices[4].id]));
  assert.equal(scoreAnswers(balanced).main,"E");
});
test("missing authentication never reaches LINE or storage",async()=>{
  const calls=fixtures();
  assert.equal((await save(request({answers,consent:PRIVACY_VERSION,subscribeSteps:false},false))).status,401);
  assert.equal((await latest(new NextRequest("https://gut-type.pages.dev/api/diagnosis/latest/?line_user_id="+foreignId))).status,401);
  assert.equal(calls.length,0);
});
test("wrong channel and expired tokens are rejected before profile or database",async()=>{
  for(const options of [{clientId:"another-channel"},{expires:0}]){
    const calls=fixtures(options);
    await assert.rejects(()=>requireLineUser(new Request("https://example.com",{headers:{Authorization:"Bearer fake-token"}})),(error:unknown)=>error instanceof AuthError&&error.status===401);
    assert.equal(calls.length,1);
  }
});
test("missing login-channel configuration fails closed",async()=>{
  delete process.env.LINE_LOGIN_CHANNEL_ID;const calls=fixtures();
  assert.equal((await save(request({answers,consent:PRIVACY_VERSION,subscribeSteps:false}))).status,503);
  assert.equal(calls.length,0);
});
test("save requires consent and valid complete answers, with no DB write on failure",async()=>{
  const calls=fixtures();
  assert.equal((await save(request({answers,subscribeSteps:false}))).status,400);
  assert.equal((await save(request({answers:{},consent:PRIVACY_VERSION,subscribeSteps:false}))).status,400);
  assert.equal(calls.filter(c=>c.url.includes("supabase")).length,0);
});
test("save uses verified identity and recomputed scores, and never silently enrolls",async()=>{
  const calls=fixtures();
  const result=await save(request({answers,consent:PRIVACY_VERSION,subscribeSteps:false,line_user_id:foreignId,main_type:"E",scores:{A:999}}));
  assert.equal(result.status,200);
  assert.deepEqual(await result.json(),{ok:true,lineSent:true,stepsScheduled:false});
  const write=calls.find(c=>c.url.includes("/rest/v1/diagnoses")&&c.method==="POST")!;
  assert.equal(write.body.line_user_id,verifiedId);assert.equal(write.body.main_type,"A");assert.equal(write.body.score_a,13);
  assert.equal(write.body.answers_json._meta.subscribeSteps,false);
  assert.equal(calls.filter(c=>c.url.includes("step_deliveries")).length,0);
  assert.equal(calls.find(c=>c.url.endsWith("/message/push"))!.body.to,verifiedId);
});
test("explicit subscription schedules and records consent without a schema change",async()=>{
  const calls=fixtures();
  const result=await save(request({answers,consent:PRIVACY_VERSION,subscribeSteps:true}));
  assert.equal((await result.json()).stepsScheduled,true);
  assert.equal(calls.filter(c=>c.url.includes("step_deliveries")&&c.method==="POST").length,1);
});
test("LINE failure does not misreport saved data as unsaved",async()=>{
  fixtures({pushOk:false});
  const result=await save(request({answers,consent:PRIVACY_VERSION,subscribeSteps:false}));
  assert.deepEqual(await result.json(),{ok:true,lineSent:false,stepsScheduled:false});
});
test("latest ignores a supplied user ID and queries only the verified identity",async()=>{
  const calls=fixtures();
  const result=await latest(new NextRequest("https://gut-type.pages.dev/api/diagnosis/latest/?line_user_id="+foreignId,{headers:{Authorization:"Bearer fake-token"}}));
  assert.equal(result.status,200);
  const query=calls.find(c=>c.url.includes("supabase"))!.url;
  assert.ok(query.includes(verifiedId));assert.ok(!query.includes(foreignId));
  assert.equal(result.headers.get("cache-control"),"no-store");
});
test("an empty operator secret cannot be bypassed with Bearer undefined",()=>{
  delete process.env.CRON_SECRET;
  assert.equal(isAuthorizedOperator(new Request("https://example.com",{headers:{Authorization:"Bearer undefined"}})),false);
});
