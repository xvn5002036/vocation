import React from 'react';
import { OrdinationManager } from '../hooks/useOrdinationManager.ts';
import RegistrationForm from '../components/ordination/RegistrationForm.tsx';
import OrdinationDocument from '../components/ordination/OrdinationDocument.tsx';
import ReportingPanel from '../components/ordination/ReportingPanel.tsx';
import Icon from '../components/ui/Icon.tsx';

const OrdinationPage: React.FC<{ manager: OrdinationManager }> = ({ manager }) => (
  <main className="workspace">
    <RegistrationForm manager={manager} />
    <section className="result-area">
      {manager.result ? <>
        <div className="result-toolbar no-print">
          <div><span className="status-dot"/>職牒已生成<small>{manager.discipleName.trim() || '未具名弟子'}・{manager.yearGanzhi.stem}{manager.yearGanzhi.branch}年</small></div>
          <button onClick={() => window.print()}><Icon name="print"/>列印職牒</button>
        </div>
        <OrdinationDocument manager={manager} />
        <ReportingPanel manager={manager} />
      </> : <div className="empty-state">
        <div className="empty-seal"><Icon name="seal"/></div><span>職牒預覽</span>
        <h2>填寫左側資料<br/>生成授籙職牒</h2>
        <p>系統將依生辰、受籙級別與法事項目，自動推演法銜、主副帥及行法報號。</p>
        <div className="preview-tags"><span>法銜職級</span><span>策役兵馬</span><span>報號全銜</span></div>
      </div>}
    </section>
  </main>
);

export default OrdinationPage;
