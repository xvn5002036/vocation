import React from 'react';
import Icon from '../components/ui/Icon.tsx';

interface Props {
  onStart: () => void;
}

const IntroductionPage: React.FC<Props> = ({ onStart }) => (
  <main className="introduction-page">
    <header className="introduction-hero">
      <div className="intro-seal" aria-hidden="true">正一</div>
      <div>
        <small>龍虎山正一派・高功科儀觀念說明</small>
        <h1>先明生辰，再依玉格查考</h1>
        <p>本頁以正一派高功道士熟悉的科儀脈絡，說明這套工具如何從農曆生辰換算四柱，再依各柱分別查考壇靖、職司與本命相關資料。</p>
      </div>
    </header>

    <section className="intro-opening">
      <span>高功解說</span>
      <blockquote>
        生辰之用，不可只取一年便作論斷。年、月、日、時各有所屬，先把農曆年月日與時辰填實，由系統換成完整四柱，再依玉格逐項查考，方能看清各項資料從何而來。
      </blockquote>
    </section>

    <section className="intro-section">
      <div className="section-heading">
        <small>THE FOUR PILLARS</small>
        <h2>為什麼不能只看出生年份</h2>
      </div>
      <div className="pillar-explanations">
        <article><b>年柱</b><h3>先查生年所屬</h3><p>用於對照生年壇、靖與治炁等項目，是整體查考的一部分，不能代替其餘三柱。</p></article>
        <article><b>月柱</b><h3>再查月令規則</h3><p>農曆月份須連同年份正確換算；若逢閏月，也要依實際生日選取，不能自行省略。</p></article>
        <article><b>日柱</b><h3>日主須由日期推得</h3><p>日柱不是只靠農曆日數直接判定，需先完成曆法轉換，才可依規則查考對應內容。</p></article>
        <article><b>時柱</b><h3>時辰補足完整八字</h3><p>同一日出生者，因時辰不同，所得時柱也可能不同，因此必須選擇實際出生時辰。</p></article>
      </div>
    </section>

    <section className="intro-section intro-process">
      <div className="section-heading">
        <small>HOW TO USE</small>
        <h2>查考時依三步進行</h2>
      </div>
      <ol>
        <li><span>壹</span><div><h3>填寫農曆生辰</h3><p>輸入民國出生年、農曆月日、是否閏月，並選擇十二時辰；不需要自行填寫干支。</p></div></li>
        <li><span>貳</span><div><h3>自動換算四柱</h3><p>系統先將農曆生日換算為年、月、日、時四柱，確認完整資料後才進入玉格查考。</p></div></li>
        <li><span>參</span><div><h3>分項閱讀結果</h3><p>各項結果依不同柱位與規則產生，應連同畫面標示的查考依據一起閱讀，不以單一年份概括。</p></div></li>
      </ol>
    </section>

    <section className="intro-section">
      <div className="section-heading">
        <small>RITUAL CONTEXT</small>
        <h2>高功與科儀的意義</h2>
      </div>
      <div className="intro-context">
        <p>在正一科儀傳統中，高功是主持科儀、宣行法事的重要職分，須依師承與法脈學習經籙、科範、步罡、存思及文檢等內容。網站所呈現的道職、壇靖、本命星君、寶庫與將班等名稱，宜放回這套科儀文化中理解，而不是當作只憑生肖便可決定一切的簡單標籤。</p>
        <p>本工具的作用，是協助使用者以容易理解的農曆欄位完成換算，並清楚列出查考結果。它不代替正式傳度、授籙、奏職或道壇認證；涉及實際科儀與法職者，仍應由有師承的道壇依傳統規制核定。</p>
      </div>
    </section>

    <aside className="intro-notice">
      <Icon name="seal" />
      <div><h2>資料與使用提醒</h2><p>姓名為選填，生日不會預先帶入任何人的範例。清冊只有在使用者自行儲存時，才保留在目前裝置的瀏覽器中。</p></div>
    </aside>

    <div className="intro-action">
      <button className="intro-start" onClick={onStart}>開始填寫農曆生辰 <Icon name="arrow" /></button>
    </div>
  </main>
);

export default IntroductionPage;
