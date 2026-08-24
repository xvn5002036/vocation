import React from 'react';
import { OrdinationManager } from '../../hooks/useOrdinationManager.ts';
import Icon from '../ui/Icon.tsx';

const ReportingPanel: React.FC<{ manager: OrdinationManager }> = ({ manager: m }) => (
  <section className="report-card no-print">
    <header><div><span className="report-mark">令</span><span><small>行法應用</small><h3>報號全銜</h3></span></div><div className="report-actions"><div className="dark-segmented"><button className={m.reportingMode === 'general' ? 'active' : ''} onClick={() => m.setReportingMode('general')}>祈福</button><button className={m.reportingMode === 'expel' ? 'active danger' : ''} onClick={() => m.setReportingMode('expel')}>驅邪</button></div><button className="copy-button" onClick={m.copyReportingText}><Icon name="copy"/>複製全文</button></div></header>
    <div className="report-text">{m.reportingText}</div>
  </section>
);

export default ReportingPanel;
