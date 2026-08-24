import React from 'react';
import { OrdinationManager } from '../../hooks/useOrdinationManager.ts';

const Card=({source,label,value,detail}:{source:string;label:string;value:string;detail?:string})=><div className="source-card"><span className="source-badge">取用 {source}</span><small>{label}</small><strong>{value}</strong>{detail&&<p>{detail}</p>}</div>;

const OrdinationDocument:React.FC<{manager:OrdinationManager}>=({manager:m})=>{
  if(!m.result)return null;
  const r=m.result;
  return <article className="ordination-document"><div className="document-border"><div className="vertical-ribbon">新刊天壇玉格</div>
    <header className="document-header"><span>農曆自動排盤</span><h1>本命玉格</h1><p>依生辰換算・分項查考</p></header>
    <div className="identity-block"><span className="eyebrow">民國 {r.rocYear} 年・農曆 {r.isLeapMonth?'閏':''}{r.lunarMonth} 月 {r.lunarDay} 日・{r.hourBranch}時</span><div className="disciple"><small>查考姓名</small><strong>{m.discipleName.trim()||'未具名'}</strong></div></div>
    <section className="ordination-summary"><div className="summary-heading"><small>奏職摘要</small><h2>依換算結果逐項生成</h2></div>{r.ordinationLines.map((line,index)=><p key={`${index}-${line}`}>{line}</p>)}</section>
    <details className="bazi-details"><summary>查看系統自動換算的四柱</summary><div className="bazi-table"><div><small>年柱</small><b>{r.yearPillar}</b></div><div><small>月柱</small><b>{r.monthPillar}</b></div><div><small>日柱</small><b>{r.dayPillar}</b></div><div><small>時柱</small><b>{r.hourPillar}</b></div></div><p>對應國曆 {r.solarDate}；四柱由農曆生日與時辰自動換算，不以年份代替月、日、時柱。</p></details>
    <section className="source-results bazi-results"><Card source="生年干支" label="雷壇、法靖與治炁" value={`${r.yearAltar.altar}・${r.yearAltar.jing}`} detail={r.yearAltar.governance}/><Card source="出生時辰" label="仙職與便宜事" value={r.hourVocation} detail={r.hourAuthority}/><Card source="生年生肖" label="本命星君" value={r.originPerson.star} detail={`${r.originPerson.palace}・姓 ${r.originPerson.surname}`}/><Card source="生年天干" label="本命所屬寶庫" value={r.treasury.treasury} detail={`${r.treasury.office}・庫官 ${r.treasury.official}`}/><Card source="生日天干" label="心將／恩將" value={`${r.heartMarshal}・${r.graceMarshal}`} detail="心將本身五行；恩將取生我之五行"/><Card source="生日地支" label="本命支將與撥兵" value={r.branchMarshal} detail={`兵馬 ${r.soldiers}`}/><Card source="農曆生日" label="道門師尊" value={r.daoMaster} detail={r.ceremonySeason}/><Card source="生日五行" label="五系所屬" value={`${r.mountain}${r.fiveSystem.deity}`} detail={`${r.fiveSystem.direction}・${r.fiveSystem.phrases.join('・')}`}/></section>
    <p className="document-disclaimer">依提供的簡化資料與《新刊天壇玉格》校錄規則生成；所有結果均由使用者當次輸入動態計算。</p>
  </div></article>;
};
export default OrdinationDocument;
