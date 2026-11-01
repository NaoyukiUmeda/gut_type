"use client";
import { useEffect,useRef,useState } from "react";
import Link from "next/link";
import { QUESTIONS } from "@/lib/questions";
import { isTypeId,TYPE_IDS,TYPES,TypeId } from "@/lib/types";
import { scoreAnswers,JudgeResult } from "@/lib/judge";
import { SITE,PRIVACY_VERSION } from "@/lib/site";
import Disclaimer from "@/components/Disclaimer";
type Answers=Record<number,string>;
const PENDING_KEY="guttype-line-pending-v1";
const liffId=process.env.NEXT_PUBLIC_LIFF_ID;
const lineEnabled=!!liffId&&/^\d+-[A-Za-z0-9]+$/.test(liffId);
export default function CheckPage(){
  const [step,setStep]=useState<"start"|"quiz"|"result">("start");
  const [answers,setAnswers]=useState<Answers>({});
  const [current,setCurrent]=useState(0);
  const [result,setResult]=useState<JudgeResult|null>(null);
  const [example,setExample]=useState<TypeId|null>(null);
  const [consent,setConsent]=useState(false);
  const [subscribeSteps,setSubscribeSteps]=useState(false);
  const [saveState,setSaveState]=useState<"idle"|"busy"|"done">("idle");
  const [status,setStatus]=useState("");
  const [restored,setRestored]=useState(false);
  const heading=useRef<HTMLHeadingElement>(null);
  const saving=useRef(false);
  useEffect(()=>{
    try{
      const pending=sessionStorage.getItem(PENDING_KEY);
      if(pending){
        sessionStorage.removeItem(PENDING_KEY);
        const stored=JSON.parse(pending);
        if(Date.now()-stored.createdAt<15*60*1000){
          const calculated=scoreAnswers(stored.answers);
          setAnswers(stored.answers);setResult(calculated);setConsent(false);setSubscribeSteps(false);setStep("result");
          setStatus("チェック結果を復元しました。LINEに保存する場合は、内容を確認して同意欄を選び、保存ボタンを押してください。");
          return;
        }
      }
    }catch{/* Private browsing or an expired pending result: keep the normal start screen. */}
    const value=new URLSearchParams(window.location.search).get("result");
    if(isTypeId(value)){setExample(value);setStep("result");}
  },[]);
  useEffect(()=>{if(step!=="start")heading.current?.focus();},[current,step]);
  function reset(){
    window.history.replaceState({},"","/liff/diagnosis/");
    try{sessionStorage.removeItem(PENDING_KEY);}catch{/* Storage may be unavailable. */}setAnswers({});setCurrent(0);setResult(null);setExample(null);setRestored(false);setConsent(false);setSubscribeSteps(false);setSaveState("idle");setStatus("");setStep("start");
  }
  function next(){
    if(!answers[QUESTIONS[current].id])return;
    if(current<QUESTIONS.length-1){setCurrent(current+1);return;}
    setResult(scoreAnswers(answers));setStep("result");
  }
  async function lineAccess(){
    if(!lineEnabled||!liffId)throw new Error("LINE_NOT_READY");
    const liff=(await import("@line/liff")).default;
    await liff.init({liffId});
    if(!liff.isLoggedIn()){
      if(result)sessionStorage.setItem(PENDING_KEY,JSON.stringify({answers,createdAt:Date.now()}));
      liff.login({redirectUri:window.location.href});
      return null;
    }
    const token=liff.getAccessToken();
    if(!token)throw new Error("LINE_LOGIN_REQUIRED");
    return token;
  }
  async function save(){
    if(saving.current||!result||!consent||saveState==="done")return;
    saving.current=true;setSaveState("busy");setStatus("");
    try{
      const token=await lineAccess();if(!token)return;
      const response=await fetch("/api/diagnosis/save/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({answers,consent:PRIVACY_VERSION,subscribeSteps})});
      const data=await response.json();
      if(!response.ok||!data.ok)throw new Error("SAVE_FAILED");
      sessionStorage.removeItem(PENDING_KEY);setSaveState("done");
      setStatus(data.lineSent?"結果を保存し、LINEに送りました。":"結果は保存されましたが、LINEへの送信はできませんでした。");
      if(subscribeSteps&&!data.stepsScheduled)setStatus(s=>s+" 3回の配信は登録できませんでした。");
      else if(subscribeSteps)setStatus(s=>s+" 3回の案内配信を登録しました。");
    }catch{setSaveState("idle");setStatus("LINEへの保存を完了できませんでした。画面の結果はそのまま確認できます。繰り返し押さず、時間をおいてからご確認ください。");}
    finally{saving.current=false;setSaveState(s=>s==="busy"?"idle":s);}
  }
  async function loadSaved(){
    if(saving.current)return;saving.current=true;setSaveState("busy");setStatus("");
    try{
      const token=await lineAccess();if(!token)return;
      const response=await fetch("/api/diagnosis/latest/",{headers:{Authorization:"Bearer "+token}});
      const data=await response.json();
      if(!response.ok||!isTypeId(data.diagnosis?.main_type))throw new Error("LOAD_FAILED");
      setExample(data.diagnosis.main_type);setRestored(true);setStatus("LINEに保存されている最新の結果を表示しています。");
    }catch{setStatus("保存済みの結果を確認できませんでした。下の内容は結果の例です。自分の回答でチェックを始められます。");}
    finally{saving.current=false;setSaveState("idle");}
  }
  if(step==="start")return <main id="main" className="check-main"><div className="check-start">
    <p className="eyebrow">無料の生活習慣チェック / 全7問</p><h1>最近の食事や生活を<br/>思い出してみましょう。</h1>
    <p className="hero-description">各質問で、今の自分に最も近い選択肢を1つ選びます。回答を送信せずに、この画面で結果を確認できます。</p>
    <p>結果は振り返る項目と行動例です。実際の腸内環境や、不調の原因を判定するものではありません。</p>
    <button className="button" onClick={()=>setStep("quiz")}>チェックを始める →</button><p className="small-note"><Link href="/notice/">集計方法</Link>・<Link href="/privacy-policy/">個人情報の取扱い</Link></p>
  </div><Disclaimer/></main>;
  const selectedId=result?.main??example;
  if(step==="result"&&selectedId){
    const data=TYPES[selectedId];
    return <main id="main" className="check-main">
      <header className="result-heading"><p className="eyebrow">{result?"今回の振り返り項目":restored?"保存済みの振り返り項目":"結果の例"}</p><h1 ref={heading} tabIndex={-1}>{data.name}</h1><p>{data.catchphrase}</p></header>
      {!result&&!restored&&<div className="callout">このURLで表示しているのは結果の例です。あなたの回答を集計した結果ではありません。</div>}
      {example&&lineEnabled&&!restored&&<button className="button secondary" disabled={saveState==="busy"} onClick={loadSaved}>LINEに保存した結果を確認する</button>}
      <section className="result-section"><h2>まず確認すること</h2><p>{data.focus}</p><p className="small-note">5つの項目から、回答の得点が最も高い候補を表示しています。健康状態の良し悪しを示すものではありません。</p>
        <ol className="chart-list" aria-label="5つの振り返り項目">{TYPE_IDS.map((id,i)=><li key={id} data-active={id===selectedId}><span>{i+1}</span>{TYPES[id].name}{id===selectedId&&<em>今回の候補</em>}</li>)}</ol>
      </section>
      <section className="result-section"><h2>試したいことを、1つ選ぶ</h2><ol className="action-list">{data.todos.map(item=><li key={item}>{item}</li>)}</ol><p className="small-note">行動例は、記録や振り返りのためのものです。特定の期間で体調が変わることを約束しません。</p></section>
      <section className="result-section result-guide"><p className="eyebrow">GutMediaの図解ガイド</p><h2>写真とメモに、何を残す？</h2><p>料理の見た目は写真に、時刻や材料はメモに。比較図とコピーできる記入欄があります。</p><a className="button" href={SITE.foodGuideUrl}>記録の方法を図で見る ↗</a></section>
      {result&&<details className="answer-review"><summary>今回の回答を確認する</summary><dl>{QUESTIONS.map(q=><div key={q.id}><dt>{q.text}</dt><dd>{q.choices.find(c=>c.id===answers[q.id])?.label}</dd></div>)}</dl></details>}
      {result&&lineEnabled&&<section className="result-section save-form"><h2>結果をLINEにも残す</h2><p>希望する場合だけ、LINEで本人確認し、回答と結果を保存します。</p>
        <label><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} disabled={saveState!=="idle"}/><span><Link href="/privacy-policy/" target="_blank" rel="noopener">個人情報の取扱い</Link>を確認し、回答・結果をLINEユーザーIDと関連付けて保存し、結果をLINEに送ることに同意します。</span></label>
        <label><input type="checkbox" checked={subscribeSteps} onChange={e=>setSubscribeSteps(e.target.checked)} disabled={saveState!=="idle"}/><span>記録を振り返る案内を、LINEで3回受け取る（任意）</span></label>
        <button className="button" disabled={!consent||saveState!=="idle"} onClick={save}>{saveState==="busy"?"LINEに接続しています…":saveState==="done"?"保存済み":"同意してLINEに保存する"}</button>
      </section>}
      <p className="status" role="status">{status}</p>
      <div className="check-actions result-actions"><button className="plain-button" onClick={reset}>{result?"回答を消して、もう一度チェック":"自分の回答でチェックする"}</button><a className="text-link" href={SITE.lineUrl}>公式LINEを開く ↗</a></div>
      <Disclaimer/>
    </main>;
  }
  const question=QUESTIONS[current];
  return <main id="main" className="check-main"><p className="eyebrow">生活習慣チェック</p><div className="progress-meta"><span>最も近いものを1つ選択</span><span>質問 {current+1} / {QUESTIONS.length}</span></div><progress className="progress" value={current+1} max={QUESTIONS.length} aria-label={"質問 "+(current+1)+" / "+QUESTIONS.length}/>
    <h1 className="question-title" ref={heading} tabIndex={-1} id="question-title">{question.text}</h1>
    <fieldset aria-labelledby="question-title" className="choices">{question.choices.map(choice=><label key={choice.id} className="choice"><input type="radio" name={"question-"+question.id} value={choice.id} checked={answers[question.id]===choice.id} onChange={()=>setAnswers({...answers,[question.id]:choice.id})}/><span>{choice.label}</span></label>)}</fieldset>
    <div className="check-actions"><button className="plain-button" onClick={()=>current>0?setCurrent(current-1):setStep("start")}>← {current>0?"前の質問":"説明に戻る"}</button><button className="button" disabled={!answers[question.id]} onClick={next}>{current===QUESTIONS.length-1?"結果を見る":"次の質問へ"} →</button></div>
    <p className="small-note">この画面を閉じると回答は消えます。LINEへの保存を選ぶまで、回答をサーバーに送りません。</p>
  </main>;
}
