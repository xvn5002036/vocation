import React from 'react';
import { OrdinationManager } from '../hooks/useOrdinationManager.ts';
import Icon from '../components/ui/Icon.tsx';

const RegistryPage: React.FC<{ manager: OrdinationManager }> = ({ manager }) => (
  <main className="registry-page">
    <header className="page-heading">
      <div><small>PERSONNEL REGISTER</small><h1>弟子清冊</h1><p>集中檢視、搜尋與管理已錄籍資料</p></div>
      <button className="primary-compact" onClick={() => manager.setView('generate')}>＋ 新增錄籍</button>
    </header>
    <section className="registry-panel">
      <div className="registry-tools"><div className="search-box"><Icon name="search"/><input value={manager.query} onChange={event => manager.setQuery(event.target.value)} placeholder="搜尋姓名、法銜或主副帥" /></div><span>共 {manager.personnel.length} 筆資料</span></div>
      {manager.filteredPersonnel.length ? <div className="registry-grid">{manager.filteredPersonnel.map(record => (
        <article className="person-card" key={record.id}>
          <header><div className="avatar">{record.name.slice(0, 1)}</div><div><h2>{record.name}</h2><p>{record.lunarInfo}</p></div><span className="level-tag">{record.level}</span></header>
          <div className="person-title"><small>{record.mainJingLu}</small><strong>{record.title}・{record.hourVocation}{record.genderTitle}</strong></div>
          <dl><div><dt>首席主帥</dt><dd>{manager.formatMarshalName(record.primaryMarshal)}</dd></div><div><dt>輔助副帥</dt><dd>{manager.formatMarshalName(record.secondaryMarshal)}</dd></div></dl>
          <footer><button className="view-button" onClick={() => manager.openRecord(record)}>檢視完整職牒<Icon name="arrow"/></button><button className="delete-button" onClick={() => manager.deletePersonnel(record)} aria-label={`刪除 ${record.name}`}><Icon name="trash"/></button></footer>
        </article>
      ))}</div> : <div className="registry-empty">
        <div className="empty-seal"><Icon name="book"/></div><h2>{manager.personnel.length ? '找不到符合的資料' : '清冊目前尚無資料'}</h2>
        <p>{manager.personnel.length ? '請更換關鍵字再搜尋' : '完成職牒推演後，即可將弟子錄入清冊。'}</p>
        {!manager.personnel.length && <button className="primary-compact" onClick={() => manager.setView('generate')}>前往錄籍</button>}
      </div>}
    </section>
  </main>
);

export default RegistryPage;
