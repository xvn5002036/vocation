import React from 'react';
import { OrdinationManager } from '../hooks/useOrdinationManager.ts';
import RegistrationForm from '../components/ordination/RegistrationForm.tsx';
import OrdinationDocument from '../components/ordination/OrdinationDocument.tsx';
import SourceNotesPanel from '../components/ordination/SourceNotesPanel.tsx';
import Icon from '../components/ui/Icon.tsx';

const OrdinationPage: React.FC<{ manager: OrdinationManager }> = ({ manager }) => (
  <main className="workspace">
    <RegistrationForm manager={manager} />
    <section className="result-area">
      {manager.result ? <>
        <div className="result-toolbar no-print"><div><span className="status-dot"/>原典對照完成<small>{manager.discipleName.trim() || '未具名'}・{manager.result.ganzhi}年・{manager.result.yuan}</small></div><button onClick={() => window.print()}><Icon name="print"/>列印本命玉格</button></div>
        <OrdinationDocument manager={manager} />
        <SourceNotesPanel />
      </> : <div className="empty-state">
        <div className="empty-seal"><Icon name="seal"/></div><span>神霄天壇玉格</span><h2>輸入出生農曆年<br/>查考本命原典條目</h2>
        <p>內容依您提供的 50 頁掃描本校錄，不加入原典未載的自動職銜或兵馬推算。</p>
        <div className="preview-tags"><span>天干靖</span><span>三元地支靖</span><span>六十甲子靖</span><span>本命心將</span></div>
      </div>}
    </section>
  </main>
);
export default OrdinationPage;
