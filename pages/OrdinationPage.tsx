import React from 'react';
import { OrdinationManager } from '../hooks/useOrdinationManager.ts';
import RegistrationForm from '../components/ordination/RegistrationForm.tsx';
import OrdinationDocument from '../components/ordination/OrdinationDocument.tsx';
import SourceNotesPanel from '../components/ordination/SourceNotesPanel.tsx';
import Icon from '../components/ui/Icon.tsx';

const OrdinationPage:React.FC<{manager:OrdinationManager}>=({manager})=><main className="workspace"><RegistrationForm manager={manager}/><section className="result-area">{manager.result?<><div className="result-toolbar no-print"><div><span className="status-dot"/>農曆生辰換算完成<small>{manager.result.yearPillar}・{manager.result.monthPillar}・{manager.result.dayPillar}・{manager.result.hourPillar}</small></div><button onClick={()=>window.print()}><Icon name="print"/>列印本命玉格</button></div><OrdinationDocument manager={manager}/><SourceNotesPanel/></>:<div className="empty-state"><div className="empty-seal"><Icon name="seal"/></div><span>新刊天壇玉格</span><h2>填寫農曆生日<br/>自動換算完整八字</h2><p>不需要看懂四柱干支。請填民國農曆年月日並選擇時辰，系統會完成換算後再逐項查考。</p><div className="preview-tags"><span>農曆自動轉換</span><span>完整四柱</span><span>動態奏職</span><span>本機清冊</span></div></div>}</section></main>;
export default OrdinationPage;
