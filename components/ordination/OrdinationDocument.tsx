import React from 'react';
import { OrdinationManager } from '../../hooks/useOrdinationManager.ts';

const OrdinationDocument: React.FC<{ manager: OrdinationManager }> = ({ manager: m }) => {
  if (!m.result) return null;
  const r = m.result;
  return <article className="ordination-document"><div className="document-border">
    <span className="corner corner-tl">✦</span><span className="corner corner-tr">✦</span><span className="corner corner-bl">✦</span><span className="corner corner-br">✦</span><div className="vertical-ribbon">雷霆都司</div>
    <header className="document-header"><span>龍虎山正一</span><h1>授籙職牒</h1><p>天師門下 · 依格錄職</p></header>
    <div className="identity-block"><span className="eyebrow">{r.mainJingLu}</span><h2>{r.title}<br className="mobile-break"/> {r.hourVocation}{r.genderTitle}</h2><div className="disciple"><small>正一盟威位下・{r.juWei}</small><strong>{m.discipleName.trim() || '未具名弟子'}</strong></div></div>
    <div className="office-text">{r.office}</div>
    <section className="marshal-section"><div className="section-title"><span>策役兵馬</span><small>{m.stemPair}年・{m.marshalInfo.element}命</small></div><div className="marshal-grid"><div className="marshal-card primary"><small>首席主帥・{m.marshalInfo.primaryType}</small><strong>{m.formatMarshalName(r.primaryMarshal)}</strong></div><div className="marshal-card"><small>輔助副帥・{m.marshalInfo.secondaryType}</small><strong>{m.formatMarshalName(r.secondaryMarshal)}</strong></div></div><div className="soldiers"><small>天壇玉格撥發兵馬</small><strong>{r.soldiers}</strong></div></section>
    <section className="detail-grid"><div><small>壇靖治炁</small><b>{r.tan}</b><span>{r.jing}</span><span>{r.governance}</span></div><div><small>隨身職權</small><b>{r.quanName}</b><span>{r.quanDesc}</span><span>心將：{r.heartMarshal}</span></div><div><small>庫府與神司</small><b>{r.treasury}</b><span>庫官：{r.official}</span><span>{r.deity}</span></div></section>
    <details className="baogao"><summary>查看主副帥聖號寶誥</summary><div><p><b>主帥寶誥</b>{r.primaryBaoGao}</p><p><b>副帥寶誥</b>{r.secondaryBaoGao}</p></div></details>
  </div></article>;
};

export default OrdinationDocument;
