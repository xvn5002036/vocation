import React from 'react';
import { BRANCHES } from '../../constants.tsx';
import { EarthlyBranch, OrdinationLevel, Vocation } from '../../types.ts';
import { getYearStemBranch } from '../../utils.ts';
import { OrdinationManager } from '../../hooks/useOrdinationManager.ts';
import Icon from '../ui/Icon.tsx';

const RegistrationForm: React.FC<{ manager: OrdinationManager }> = ({ manager: m }) => (
  <aside className="control-panel">
    <div className="panel-heading"><span>錄籍資料</span><small>依生辰推演法職</small></div>
    <section className="form-section"><label className="field-label">弟子姓名</label><input className="text-input name-input" placeholder="請輸入姓名" value={m.discipleName} onChange={event => m.setDiscipleName(event.target.value)} /></section>
    <section className="form-section"><label className="field-label">性別</label><div className="segmented two"><button className={m.gender === '男' ? 'selected' : ''} onClick={() => m.setGender('男')}><b>乾造</b><small>男</small></button><button className={m.gender === '女' ? 'selected' : ''} onClick={() => m.setGender('女')}><b>坤造</b><small>女</small></button></div></section>
    <section className="form-section"><label className="field-label">受籙級別</label><div className="segmented three">{(['初授', '加授', '晉授'] as OrdinationLevel[]).map(level => <button key={level} className={m.ordLevel === level ? 'selected' : ''} onClick={() => m.setOrdLevel(level)}>{level}</button>)}</div></section>
    <section className="form-section"><label className="field-label">法事項目</label><div className="segmented two">{(['一般科儀', '驅邪考召'] as Vocation[]).map(item => <button key={item} className={m.vocation === item ? 'selected' : ''} onClick={() => m.setVocation(item)}>{item}</button>)}</div></section>
    <section className="form-section date-section">
      <div className="label-row"><label className="field-label">農曆生辰</label><span>{m.yearGanzhi.stem}{m.yearGanzhi.branch}年</span></div>
      <select className="select full" value={m.lunarYear} onChange={event => m.setLunarYear(Number(event.target.value))} aria-label="農曆年份">{Array.from({ length: 120 }, (_, i) => i + 1).map(year => <option key={year} value={year}>民國 {year} 年・{getYearStemBranch(year).stem}{getYearStemBranch(year).branch}</option>)}</select>
      <div className="date-grid">
        <label><span>月份</span><select className="select" value={m.lunarMonth} onChange={event => m.setLunarMonth(Number(event.target.value))}>{Array.from({ length: 12 }, (_, i) => i + 1).map(month => <option key={month} value={month}>{month === 1 ? '正月' : `${month} 月`}</option>)}</select></label>
        <label><span>日期</span><select className="select" value={m.lunarDay} onChange={event => m.setLunarDay(Number(event.target.value))}>{Array.from({ length: 30 }, (_, i) => i + 1).map(day => <option key={day} value={day}>{day} 日</option>)}</select></label>
        <label><span>時辰</span><select className="select" value={m.hourBranch} onChange={event => m.setHourBranch(event.target.value as EarthlyBranch)}>{BRANCHES.map(branch => <option key={branch} value={branch}>{branch}時</option>)}</select></label>
      </div>
    </section>
    <button className="primary-action" onClick={m.generate}>推演並生成職牒<Icon name="arrow"/></button>
    {m.result && <button className="secondary-action" onClick={m.saveDisciple}>錄入弟子清冊</button>}
    <p className="privacy-note">資料僅儲存在此裝置的瀏覽器中</p>
  </aside>
);

export default RegistrationForm;
