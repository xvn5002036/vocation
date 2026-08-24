import React from 'react';
import { OrdinationManager } from '../../hooks/useOrdinationManager.ts';
import Icon from '../ui/Icon.tsx';

const RegistrationForm: React.FC<{ manager: OrdinationManager }> = ({ manager: m }) => (
  <aside className="control-panel">
    <div className="panel-heading"><span>本命資料</span><small>依《神霄天壇玉格》</small></div>
    <section className="form-section"><label className="field-label" htmlFor="disciple-name">姓名（選填）</label><input id="disciple-name" className="text-input name-input" placeholder="供清冊辨識使用" value={m.discipleName} onChange={event => m.setDiscipleName(event.target.value)} /></section>
    <section className="form-section date-section">
      <div className="label-row"><label className="field-label" htmlFor="birth-year">出生農曆年份</label><span>{m.yearGanzhi.stem}{m.yearGanzhi.branch}年</span></div>
      <div className="year-input-wrap"><span>民國</span><input id="birth-year" className="text-input year-input" type="number" min="1" max="300" value={m.lunarYear} onChange={event => m.setLunarYear(Number(event.target.value))} /><span>年</span></div>
      <p className="field-help">以農曆年的干支為準；只需年份即可查得原典中的本命條目。</p>
    </section>
    <button className="primary-action" onClick={m.generate}>查詢本命玉格<Icon name="arrow"/></button>
    {m.result && <button className="secondary-action" onClick={m.saveDisciple}>儲存至本機清冊</button>}
    <p className="privacy-note">姓名與清冊只儲存在此裝置的瀏覽器</p>
  </aside>
);
export default RegistrationForm;
