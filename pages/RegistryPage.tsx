import React from 'react';
import { OrdinationManager } from '../hooks/useOrdinationManager.ts';
import Icon from '../components/ui/Icon.tsx';

const RegistryPage: React.FC<{ manager: OrdinationManager }> = ({ manager }) => (
  <main className="registry-page">
    <header className="page-heading"><div><small>LOCAL JADE REGISTER</small><h1>本命清冊</h1><p>管理此裝置已儲存的原典對照資料</p></div><button className="primary-compact" onClick={() => manager.setView('generate')}>＋ 新增查考</button></header>
    <section className="registry-panel">
      <div className="registry-tools"><div className="search-box"><Icon name="search"/><input value={manager.query} onChange={event => manager.setQuery(event.target.value)} placeholder="搜尋姓名、干支、靖名或心將" /></div><span>共 {manager.personnel.length} 筆資料</span></div>
      {manager.filteredPersonnel.length ? <div className="registry-grid">{manager.filteredPersonnel.map(record => (
        <article className="person-card" key={record.id}>
          <header><div className="avatar">{record.name.slice(0,1)}</div><div><h2>{record.name}</h2><p>{record.lunarInfo}</p></div><span className="level-tag">{record.yuan}</span></header>
          <div className="person-title"><small>六十甲子靖 · {record.ganzhi}</small><strong>{record.ganzhiJing}</strong></div>
          <dl><div><dt>天干／地支靖</dt><dd>{record.stemJing}・{record.branchJing}</dd></div><div><dt>本命心將</dt><dd>{record.heartMarshal}</dd></div></dl>
          <footer><button className="view-button" onClick={() => manager.openRecord(record)}>檢視本命玉格<Icon name="arrow"/></button><button className="delete-button" onClick={() => manager.deletePersonnel(record)} aria-label={`刪除 ${record.name}`}><Icon name="trash"/></button></footer>
        </article>
      ))}</div> : <div className="registry-empty"><div className="empty-seal"><Icon name="book"/></div><h2>{manager.personnel.length ? '找不到符合的資料' : '清冊目前尚無資料'}</h2><p>{manager.personnel.length ? '請更換關鍵字再搜尋' : '完成本命查考後，可將具名資料儲存在此裝置。'}</p>{!manager.personnel.length && <button className="primary-compact" onClick={() => manager.setView('generate')}>前往查考</button>}</div>}
    </section>
  </main>
);
export default RegistryPage;
