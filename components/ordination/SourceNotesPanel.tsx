import React from 'react';

const SourceNotesPanel: React.FC = () => (
  <section className="source-notes no-print">
    <header><span className="report-mark">格</span><div><small>原典使用說明</small><h3>品秩與本命分開查考</h3></div></header>
    <div className="source-note-grid">
      <div><b>本頁自動對照</b><p>只使用出生農曆年，查得天干靖、三元地支靖、六十甲子靖與本命心將。</p></div>
      <div><b>不由生辰判定</b><p>上清、玉府、神霄等品秩與職銜，原典另列遷轉、功德與保舉規則（第 13–38 頁），不可由生日自動授予。</p></div>
    </div>
  </section>
);
export default SourceNotesPanel;
