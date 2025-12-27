import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, Shield, Sword, Award, Zap, Wind, Star, RefreshCw, 
  Share2, Sun, BookOpen, ArrowRight, ChevronDown, 
  CloudLightning, Cloud, Droplets, PenTool, Scroll 
} from 'lucide-react';

// 引入拆分後的常數資料 (路徑需對應您的目錄結構)
import { 
  STEMS, 
  BRANCHES, 
  STEM_ELEMENT, 
  BRANCH_ELEMENT, 
  STEM_CORRELATION 
} from './constants/basic';

import { 
  RANK_SYSTEM, 
  LU_OPTIONS 
} from './constants/rank';

import { 
  MARSHAL_TITLES, 
  ELEMENT_GROUP_META, 
  STEM_MARSHALS 
} from './constants/marshals_meta';

import { 
  MARSHAL_DATA_STATIC 
} from './constants/marshals_data';

import { 
  ZODIAC_MAPPING, 
  JIAZI_ZHI_MAPPING,
  LUNAR_MONTHS,
  LUNAR_DAYS,
  LUNAR_HOURS
} from './constants/mapping';

// --- 工具：載入截圖套件 ---
const loadHtml2Canvas = () => {
  return new Promise((resolve, reject) => {
    if (window.html2canvas) { resolve(window.html2canvas); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => resolve(window.html2canvas);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const App = () => {
  // 狀態管理
  const [step, setStep] = useState('input'); // input, loading, result
  const [activeTab, setActiveTab] = useState('overview');
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    gender: 'm',
    birthYear: '',
    lunarMonth: '正月',
    lunarDay: '初一',
    birthHour: '早子時 (23-01)',
    luRank: '太上三五都功經籙',
    preferredMarshal: ''
  });

  const [calcData, setCalcData] = useState(null);
  const [resultKey, setResultKey] = useState('wang');

  // 計算干支與五行
  const getGanZhi = (year) => {
    if (!year) return { name: '', element: '' };
    const baseYear = 1984; // 甲子年
    let diff = (year - baseYear) % 60;
    if (diff < 0) diff += 60;
    const stem = STEMS[diff % 10];
    const branch = BRANCHES[diff % 12];
    return { name: `${stem}${branch}`, element: STEM_ELEMENT[stem] };
  };

  const currentGanZhi = getGanZhi(parseInt(formData.birthYear));

  // 核心邏輯：開壇領職
  const handleStart = () => {
    if (!formData.name) { alert("請輸入道友法名或姓名"); return; }
    if (!formData.birthYear) { alert("請輸入生年"); return; }

    setStep('loading');

    setTimeout(() => {
      const ganZhi = currentGanZhi.name;
      const stem = ganZhi.charAt(0);
      const branch = ganZhi.charAt(1);

      // 1. 決定主帥 (依據天干或手動選擇)
      let mKey = formData.preferredMarshal || (STEM_MARSHALS[stem] ? STEM_MARSHALS[stem][0] : 'wang');
      
      // 2. 決定職等與官署
      let selectedLuKey = "dugong";
      if (formData.luRank.includes("盟威")) selectedLuKey = "mengwei";
      else if (formData.luRank.includes("五雷")) selectedLuKey = "wulei";
      
      const rankData = RANK_SYSTEM[selectedLuKey] || RANK_SYSTEM["dugong"];
      const seed = formData.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      
      const finalOffice = rankData.offices[seed % rankData.offices.length];
      const genderKey = formData.gender === 'female' ? 'f' : 'm';
      const appointList = rankData.appoints[genderKey];
      const finalAppoint = appointList[seed % appointList.length];
      const finalPower = rankData.powers[seed % rankData.powers.length];

      // 3. 查詢治所與五行數理 (疏文關鍵)
      const benMingZhi = JIAZI_ZHI_MAPPING[ganZhi] || JIAZI_ZHI_MAPPING["甲子"];
      const stemInfo = STEM_CORRELATION[stem] || { direction: '中', color: '黃', qi: '五' };

      setResultKey(mKey);
      setCalcData({
        luRank: formData.luRank,
        office: finalOffice,
        appointment: finalAppoint,
        power: finalPower,
        zhi: benMingZhi,
        stemInfo: stemInfo,
        ganZhi: ganZhi
      });

      setStep('result');
      setActiveTab('overview');
    }, 1500);
  };

  // 保存為圖片
  const handleShare = async () => {
    setIsSharing(true);
    try {
      const h2c = await loadHtml2Canvas();
      if (cardRef.current) {
        const canvas = await h2c(cardRef.current, {
          backgroundColor: '#f8fafc',
          scale: 2,
          useCORS: true
        });
        const link = document.createElement('a');
        link.download = `奏職寶誥_${formData.name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error("截圖失敗:", err);
    }
    setIsSharing(false);
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-orange-200 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
          <Zap className="absolute inset-0 m-auto w-10 h-10 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">正在恭請法職...</h2>
        <p className="text-slate-500">撥雲見聖，即將開壇</p>
      </div>
    );
  }

  if (step === 'result' && calcData) {
    const currentMarshal = MARSHAL_DATA_STATIC[resultKey];
    
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-serif">
        <div className="max-w-md mx-auto space-y-4">
          
          {/* 頁籤切換 */}
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            <button onClick={() => setActiveTab('overview')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}><Scroll className="w-4 h-4" /> 奏職疏文</button>
            <button onClick={() => setActiveTab('marshal')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'marshal' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}><Shield className="w-4 h-4" /> 護身元帥</button>
          </div>

          {/* 主要內容區 */}
          <div ref={cardRef} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
            <div className={`h-2 ${currentMarshal.color}`}></div>
            
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* 標題與信士資料 */}
                  <div className="text-center space-y-1">
                    <p className="text-slate-400 text-xs tracking-widest uppercase">Daoist Vocation Certificate</p>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tighter">授職錄壇寶誥</h1>
                    <div className="flex justify-center items-center gap-2 text-sm text-slate-500 mt-2">
                      <span className="font-bold text-slate-700">{formData.name}</span>
                      <span className="text-slate-300">|</span>
                      <span>{calcData.ganZhi}年命</span>
                    </div>
                  </div>

                  {/* 疏文格式區塊 (無底線優化版) */}
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 font-serif text-slate-800 shadow-inner relative">
                    <div className="flex items-center gap-2 mb-3 border-b border-orange-200 pb-2">
                      <Scroll className="w-4 h-4 text-orange-700" />
                      <span className="text-sm font-bold text-orange-800">錄壇奏職寶誥</span>
                    </div>
                    <div className="space-y-4 leading-relaxed text-[16px]">
                      <p>
                        一奏立
                        <span className="font-bold text-orange-800 mx-1">「{calcData.zhi.tan}」</span>
                        壇
                        <span className="font-bold text-orange-800 mx-1">「{calcData.zhi.jing}」</span>
                        靖
                      </p>
                      <p>
                        一奏玄都省正一平炁宮炁 天師
                        <span className="font-bold text-orange-800 mx-1">「{calcData.zhi.name}」</span>
                        治
                        <span className="font-bold text-orange-800 mx-1">「{calcData.zhi.official}」</span>
                        炁
                      </p>
                      <p>
                        三然君赤天三五步罡元命應
                        <span className="font-bold text-orange-800 mx-1">「{calcData.zhi.title}」</span>
                        先生
                        <span className="font-bold text-orange-800 mx-1">「{calcData.stemInfo.direction}」</span>
                        嶽
                        <span className="font-bold text-orange-800 mx-1">「{calcData.stemInfo.color}」</span>
                        帝
                        <span className="font-bold text-orange-800 mx-1">「{calcData.stemInfo.qi}」</span>
                        炁真人
                      </p>
                    </div>
                    <div className="absolute bottom-2 right-4 opacity-10 font-bold text-4xl select-none">敕</div>
                  </div>

                  {/* 官署職銜 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">分發官署</p>
                      <p className="text-sm font-bold text-slate-700">{calcData.office}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">封受職銜</p>
                      <p className="text-sm font-bold text-orange-600">{calcData.appointment}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'marshal' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className={`p-6 rounded-2xl ${currentMarshal.color} text-white relative overflow-hidden shadow-lg`}>
                    <div className="relative z-10">
                      <p className="text-xs font-bold opacity-80 mb-1">本命隨身護法元帥</p>
                      <h2 className="text-3xl font-black mb-2">{currentMarshal.name}</h2>
                      <p className="text-sm opacity-90 leading-relaxed font-light">{currentMarshal.title}</p>
                    </div>
                    <currentMarshal.icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 rotate-12" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm"><Flame className="w-4 h-4 text-orange-500" /> 元帥聖諱與職權</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{currentMarshal.desc}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 按鈕區 */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setStep('input')} className="flex items-center justify-center gap-2 py-3 bg-white text-slate-600 rounded-xl border border-slate-200 font-bold active:scale-95 transition-all shadow-sm"><RefreshCw className="w-4 h-4" /> 重選</button>
            <button onClick={handleShare} disabled={isSharing} className={`flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold active:scale-95 transition-all shadow-lg ${isSharing ? 'opacity-50' : ''}`}>
              {isSharing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />} {isSharing ? '生成中' : '保存寶誥'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 輸入表單頁面
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-8">
        <div className="text-center">
          <div className="inline-block p-3 bg-orange-100 rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">正一奏職系統</h1>
          <p className="text-slate-500 mt-2">請輸入信士資料以恭請法職</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-widest">信士法名</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700" placeholder="例如：葛洪" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-widest">生年(西元)</label>
              <input type="number" value={formData.birthYear} onChange={(e) => setFormData({...formData, birthYear: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700" placeholder="1995" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-widest">受錄等級</label>
              <select value={formData.luRank} onChange={(e) => setFormData({...formData, luRank: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none">
                {LU_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <button onClick={handleStart} className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            開壇領職 <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
