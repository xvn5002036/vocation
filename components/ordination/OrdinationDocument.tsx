import React from 'react';
import { OrdinationManager } from '../../hooks/useOrdinationManager.ts';
const SourceBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => <span className="source-badge">原典 {children}</span>;

const OrdinationDocument: React.FC<{ manager: OrdinationManager }> = ({ manager: m }) => {
  if (!m.result) return null;
  const r = m.result;
  return <article className="ordination-document"><div className="document-border">
    <span className="corner corner-tl">✦</span><span className="corner corner-tr">✦</span><span className="corner corner-bl">✦</span><span className="corner corner-br">✦</span><div className="vertical-ribbon">神霄天壇玉格</div>
    <header className="document-header"><span>原典本命對照</span><h1>本命玉格</h1><p>據掃描本逐頁校錄</p></header>
    <div className="identity-block"><span className="eyebrow">民國 {r.rocYear} 年 · 西元 {r.gregorianYear} 年</span><h2>{r.ganzhi}年 · {r.yuan}</h2><div className="disciple"><small>本命資料</small><strong>{m.discipleName.trim() || '未具名'}</strong></div></div>
    <section className="source-results">
      <div className="source-card"><SourceBadge>第 1 頁</SourceBadge><small>天干靖 · {r.stem}干</small><strong>{r.stemJing}</strong></div>
      <div className="source-card"><SourceBadge>第 1–2 頁</SourceBadge><small>海上三十六靖 · {r.yuan}{r.branch}支</small><strong>{r.branchJing}</strong></div>
      <div className="source-card featured"><SourceBadge>第 5–9 頁</SourceBadge><small>六十甲子靖 · {r.ganzhi}</small><strong>{r.ganzhiJing}</strong></div>
      <div className="source-card"><SourceBadge>第 49–50 頁</SourceBadge><small>法官所屬本命心將 · {r.branch}命</small><strong>{r.heartMarshal}</strong></div>
    </section>
    <section className="yuan-note"><div><small>三元推算依據</small><b>洪武十七年為上元甲子</b></div><p>依原典所記，以六十年為一元，按上元、中元、下元循環；本年落在第 {r.yuanIndex + 1} 元，故取「{r.yuan}」地支靖。</p></section>
    <p className="document-disclaimer">此頁為原典條目查考，不等同授籙證明、職帖或宗教資格認定。</p>
  </div></article>;
};
export default OrdinationDocument;
