import React from 'react';
import { BRANCHES } from '../../constants.tsx';
import { OrdinationManager } from '../../hooks/useOrdinationManager.ts';
import Icon from '../ui/Icon.tsx';

const lunarDays=['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
const lunarMonths=['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','臘月'];

const RegistrationForm:React.FC<{manager:OrdinationManager}>=({manager:m})=><aside className="control-panel">
  <div className="panel-heading"><span>農曆生辰</span><small>系統自動換算八字</small></div>
  <section className="form-section"><label className="field-label" htmlFor="disciple-name">姓名（選填）</label><input id="disciple-name" className="text-input name-input" placeholder="供清冊辨識使用" value={m.discipleName} onChange={e=>m.setDiscipleName(e.target.value)}/></section>
  <section className="form-section"><label className="field-label" htmlFor="roc-year">出生年</label><div className="year-input-wrap"><span>民國</span><input id="roc-year" className="text-input year-input" type="number" min="1" max="200" inputMode="numeric" placeholder="請輸入" value={m.rocYear} onChange={e=>m.setRocYear(e.target.value===''?'':Math.max(1,Math.min(200,Number(e.target.value))))}/><span>年</span></div>{m.rocYear!==''&&<p className="field-help">民國 {m.rocYear} 年＝西元 {m.rocYear+1911} 年</p>}</section>
  <section className="form-section"><label className="field-label">農曆月日</label><div className="date-grid two-date"><label><span>月份</span><select className="select" value={m.lunarMonth} onChange={e=>{m.setLunarMonth(e.target.value===''?'':Number(e.target.value));m.setLunarDay('');}}><option value="">請選擇</option>{lunarMonths.map((name,i)=><option key={name} value={i+1}>{name}</option>)}</select></label><label><span>日期</span><select className="select" value={m.lunarDay} disabled={m.lunarMonth===''} onChange={e=>m.setLunarDay(e.target.value===''?'':Number(e.target.value))}><option value="">請選擇</option>{Array.from({length:m.monthDays},(_,i)=>i+1).map(v=><option key={v} value={v}>{lunarDays[v-1]}</option>)}</select></label></div>{m.lunarMonth!==''&&m.lunarYearInfo.leapMonth===m.lunarMonth&&<label className="leap-toggle"><input type="checkbox" checked={m.isLeapMonth} onChange={e=>m.setIsLeapMonth(e.target.checked)}/><span>這一天是閏{lunarMonths[m.lunarMonth-1]}</span></label>}</section>
  <section className="form-section"><label className="field-label">出生時辰</label><div className="hour-grid">{BRANCHES.map((branch,index)=><button key={branch} type="button" className={m.hourBranch===branch?'selected':''} onClick={()=>m.setHourBranch(branch)}><b>{branch}時</b><small>{branch==='子'?'23–01':`${String(index*2-1).padStart(2,'0')}–${String(index*2+1).padStart(2,'0')}`}</small></button>)}</div><p className="field-help">只要選常見的十二時辰，不必自行計算干支。</p></section>
  <button className="primary-action" disabled={!m.canGenerate} onClick={m.generate}>換算八字並查考玉格<Icon name="arrow"/></button>{m.result&&<button className="secondary-action" onClick={m.saveDisciple}>儲存至本機清冊</button>}<p className="privacy-note">資料只儲存在此裝置的瀏覽器</p>
</aside>;
export default RegistrationForm;
