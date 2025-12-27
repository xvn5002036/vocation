import React, { useState, useRef } from 'react';
import { 
  Shield, 
  Sparkles, 
  Scroll, 
  User, 
  MapPin, 
  Compass, 
  Flame, 
  Zap, 
  Sword, 
  Droplets, 
  Sun, 
  Moon, 
  Camera,
  RotateCcw,
  BookOpen,
  Info
} from 'lucide-react';
import html2canvas from 'html2canvas';

// 引入拆分後的常數資料
import { 
  STEMS, 
  BRANCHES, 
  STEM_ELEMENT, 
  ELEMENT_COLORS, 
  STEM_CORRELATION 
} from './constants/basic';

import { 
  JIAZI_ZHI_MAPPING, 
  ZODIAC_MAPPING, 
  LUNAR_MONTHS, 
  LUNAR_DAYS, 
  LUNAR_HOURS 
} from './constants/mapping';

import { 
  LU_OPTIONS, 
  RANK_SYSTEM 
} from './constants/rank';

import { 
  MARSHAL_TITLES, 
  ELEMENT_GROUP_META, 
  STEM_MARSHALS 
} from './constants/marshals_meta';

import { MARSHAL_DATA_STATIC } from './constants/marshals_data';

const App = () => {
  // --- 狀態管理 ---
  const [formData, setFormData] = useState({
    name: '',
    gender: 'm',
    birthYear: '',
    birthMonth: '正月',
    birthDay: '初一',
    birthHour: '早子時 (23-01)',
    selectedMarshalId: '', // 手動指定元帥
    rank: '太上三五都功經籙'
  });

  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('decree'); // 'decree' | 'marshal'
  const cardRef = useRef(null);

  // --- 核心邏輯演算法 ---
  
  // 1. 計算年命干支
  const getGanZhiYear = (year) => {
    if (!year) return null;
    const baseYear = 1984; // 甲子年
    const diff = (year - baseYear) % 60;
    const index = diff < 0 ? diff + 60 : diff;
    const stem = STEMS[index % 10];
    const branch = BRANCHES[index % 12];
    const name = `${stem}${branch}`;
    return { stem, branch, name, element: STEM_ELEMENT[stem] };
  };

  // 2. 計算姓名靈數 (用於職位分配)
  const getNameScore = (name) => {
    if (!name) return 0;
    return name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 4;
  };

  // --- 執行分發 ---
  const handleStart = () => {
    if (!formData.name || !formData.birthYear) {
      alert("請完整輸入法名與出生年份");
      return;
    }

    const gz = getGanZhiYear(parseInt(formData.birthYear));
    const score = getNameScore(formData.name);
    
    // 獲取壇靖治資料
    const zhiInfo = JIAZI_ZHI_MAPPING[gz.name] || JIAZI_ZHI_MAPPING["甲子"];
    
    // 獲取職等資料
    const rankKey = Object.keys(RANK_SYSTEM).find(key => RANK_SYSTEM[key].label === formData.rank) || "dugong";
    const rankData = RANK_SYSTEM[rankKey];
    
    // 根據性別與靈數分配職稱
    const appoint = rankData.appoints[formData.gender][score];
    const office = rankData.offices[score % rankData.offices.length];

    // 判定元帥
    let marshalId = formData.selectedMarshalId;
    if (!marshalId) {
      const marshalPool = STEM_MARSHALS[gz.stem] || STEM_MARSHALS["甲"];
      marshalId = marshalPool[score % marshalPool.length];
    }
    const marshalInfo = MARSHAL_DATA_STATIC[marshalId];

    // 判定星君判詞
    const zodiac = gz.branch; // 以年支為生肖
    const starInfo = ZODIAC_MAPPING[zodiac];
    const variantDesc = MARSHAL_TITLES[marshalId]?.[starInfo.roleType] || "護壇大將";

    // 五方數理對應
    const correlation = STEM_CORRELATION[gz.stem];

    setResult({
      gz,
      zhiInfo,
      rankData,
      appoint,
      office,
      marshalInfo,
      variantDesc,
      starInfo,
      correlation,
      powers: rankData.powers
    });
    setActiveTab('decree');
  };

  // --- 截圖功能 ---
  const exportImage = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f172a',
        scale: 2
      });
      const link = document.createElement('a');
      link.download = `Taoist_Decree_${formData.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // --- UI 組件: 輸入表單 ---
  const InputSection = () => (
    <div className="max-w-xl mx-auto bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6" /> 請輸入法職資料
        </h2>
        <p className="text-slate-400 text-sm">正一法統 · 本命星君 · 籙職對應</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-yellow-500/80 text-sm mb-1 ml-1">道友法名 / 姓名</label>
          <input 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 placeholder:text-slate-600"
            placeholder="請輸入姓名"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-yellow-500/80 text-sm mb-1 ml-1">性別</label>
            <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-700">
              <button 
                onClick={() => setFormData({...formData, gender: 'm'})}
                className={`flex-1 py-2 rounded-lg text-sm transition ${formData.gender === 'm' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
              >乾道 (男)</button>
              <button 
                onClick={() => setFormData({...formData, gender: 'f'})}
                className={`flex-1 py-2 rounded-lg text-sm transition ${formData.gender === 'f' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400'}`}
              >坤道 (女)</button>
            </div>
          </div>
          <div>
            <label className="block text-yellow-500/80 text-sm mb-1 ml-1">指定元帥 (選填)</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white text-sm"
              value={formData.selectedMarshalId}
              onChange={(e) => setFormData({...formData, selectedMarshalId: e.target.value})}
            >
              <option value="">-- 依年命天干推算 --</option>
              {Object.entries(MARSHAL_DATA_STATIC).map(([id, m]) => (
                <option key={id} value={id}>{m.shortName}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-yellow-500/80 text-sm mb-1 ml-1">目前授籙</label>
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500/50"
            value={formData.rank}
            onChange={(e) => setFormData({...formData, rank: e.target.value})}
          >
            {LU_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-yellow-500/80 text-sm mb-1 ml-1">出生西元年</label>
            <input 
              type="number"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              placeholder="例如: 1987"
              value={formData.birthYear}
              onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-yellow-500/80 text-sm mb-1 ml-1">農曆月</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
              value={formData.birthMonth}
              onChange={(e) => setFormData({...formData, birthMonth: e.target.value})}
            >
              {LUNAR_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
            value={formData.birthDay}
            onChange={(e) => setFormData({...formData, birthDay: e.target.value})}
          >
            {LUNAR_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
            value={formData.birthHour}
            onChange={(e) => setFormData({...formData, birthHour: e.target.value})}
          >
            {LUNAR_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <button 
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mt-4"
        >
          <Zap className="w-5 h-5 fill-current" /> 開壇領職
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-serif p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600">
          ※ 正一法壇 · 職官分發 ※
        </h1>
        <div className="h-1 w-32 bg-yellow-600 mx-auto rounded-full" />
      </header>

      {!result ? (
        <InputSection />
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* 切換頁籤 */}
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setActiveTab('decree')}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition ${activeTab === 'decree' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              <Scroll className="w-4 h-4" /> 奏職寶誥
            </button>
            <button 
              onClick={() => setActiveTab('marshal')}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition ${activeTab === 'marshal' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              <Shield className="w-4 h-4" /> 本命元帥
            </button>
          </div>

          {/* 分發結果卡片 */}
          <div ref={cardRef} className="bg-slate-900 border-4 border-double border-yellow-600/50 p-6 md:p-10 rounded-sm shadow-2xl relative overflow-hidden">
            
            {activeTab === 'decree' ? (
              <div className="space-y-8">
                <div className="text-center border-b border-yellow-600/30 pb-6">
                  <h2 className="text-3xl font-bold text-yellow-500 mb-2">錄壇奏職寶誥</h2>
                  <p className="text-slate-400 tracking-[0.3em]">TAOIST DIVINE DECREE</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 text-lg">
                  <div className="space-y-4 border-r border-yellow-600/10 pr-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-yellow-600" />
                      <span className="text-slate-400">授籙信士：</span>
                      <span className="text-white border-b border-yellow-600/30 px-2">{formData.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Compass className="w-5 h-5 text-yellow-600" />
                      <span className="text-slate-400">年命干支：</span>
                      <span className="text-yellow-500 font-bold">{result.gz.name}年 ({result.gz.element})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-yellow-600" />
                      <span className="text-slate-400">本命治所：</span>
                      <span className="text-white">{result.zhiInfo.zhi} ({result.zhiInfo.region})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                      <span className="text-slate-400">所配壇靖：</span>
                      <span className="text-white">{result.zhiInfo.tan} / {result.zhiInfo.jing}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-600/10 rounded-lg border border-yellow-600/20">
                      <p className="text-sm text-yellow-600 mb-1">分發官署</p>
                      <p className="text-xl font-bold text-white">{result.office}</p>
                      <p className="text-sm text-slate-400 mt-2">封受職銜</p>
                      <p className="text-2xl font-bold text-yellow-500">{result.appoint}</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-slate-400">具備法權：</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {result.powers.map(p => (
                          <span key={p} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 text-xs">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/50 p-4 rounded border border-yellow-600/10 text-sm leading-relaxed text-slate-400 italic">
                  「依據{result.correlation.direction}方{result.correlation.color}帝{result.correlation.qi}炁之法力，
                  授以此籙，統御鬼神，掃除氛穢。凡我信士，當恭敬奉行。」
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`flex flex-col md:flex-row items-center gap-8 ${result.marshalInfo.color} p-8 rounded-xl border-2 border-white/10`}>
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                    {result.marshalInfo.iconType === 'flame' && <Flame className="w-16 h-16 text-white" />}
                    {result.marshalInfo.iconType === 'zap' && <Zap className="w-16 h-16 text-white" />}
                    {result.marshalInfo.iconType === 'sword' && <Sword className="w-16 h-16 text-white" />}
                    {result.marshalInfo.iconType === 'shield' && <Shield className="w-16 h-16 text-white" />}
                    {result.marshalInfo.iconType === 'award' && <Sun className="w-16 h-16 text-white" />}
                    {result.marshalInfo.iconType === 'book' && <BookOpen className="w-16 h-16 text-white" />}
                    {result.marshalInfo.iconType === 'lightning' && <Zap className="w-16 h-16 text-yellow-300" />}
                    {result.marshalInfo.iconType === 'wind' && <Compass className="w-16 h-16 text-white" />}
                    {result.marshalInfo.iconType === 'cloud' && <Droplets className="w-16 h-16 text-white" />}
                    {result.marshalInfo.iconType === 'droplets' && <Droplets className="w-16 h-16 text-white" />}
                    {result.marshalInfo.iconType === 'sun' && <Sun className="w-16 h-16 text-white" />}
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <span className="px-3 py-1 bg-black/30 rounded-full text-xs font-bold text-white tracking-widest">
                        本命護法元帥
                      </span>
                      <span className="text-white/60 text-sm">{result.marshalInfo.title}</span>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">{result.marshalInfo.name}</h3>
                    <p className="text-white/90 text-xl font-medium italic opacity-80">「{result.marshalInfo.slogan}」</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                      <h4 className="flex items-center gap-2 text-yellow-500 font-bold mb-3">
                        <Info className="w-4 h-4" /> 神蹟典籍故事
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {result.marshalInfo.intro}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                      <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-3">
                        <Moon className="w-4 h-4" /> 本命星君鑑察
                      </h4>
                      <div className="space-y-2">
                        <p className="text-white font-bold">{result.starInfo.name}</p>
                        <p className="text-xs text-slate-400 bg-blue-900/20 p-2 rounded border border-blue-900/30">
                           {result.starInfo.desc}
                        </p>
                        <p className="text-sm text-yellow-600 font-bold mt-2">
                          於元帥麾下擔任：{result.variantDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-6 rounded-xl border-2 border-yellow-600/20 shadow-inner">
                    <h4 className="flex items-center gap-2 text-yellow-500 font-bold mb-4">
                      <Flame className="w-5 h-5" /> 專屬修持法門
                    </h4>
                    <p className="text-white font-bold text-lg mb-4 bg-yellow-600/20 px-3 py-1 rounded inline-block">
                      {result.marshalInfo.practice.method}
                    </p>
                    <ul className="space-y-4">
                      {result.marshalInfo.practice.guide.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-300">
                          <span className="flex-shrink-0 w-6 h-6 bg-yellow-600/20 text-yellow-500 rounded-full flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 水印 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
              <div className="w-96 h-96 border-[20px] border-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-8xl font-bold text-yellow-600">正一</span>
              </div>
            </div>
          </div>

          {/* 按鈕組 */}
          <div className="flex flex-wrap justify-center gap-4 pb-12">
            <button 
              onClick={exportImage}
              className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 transition"
            >
              <Camera className="w-5 h-5" /> 保存法職寶誥
            </button>
            <button 
              onClick={() => {
                setResult(null);
                setActiveTab('decree');
              }}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl shadow-lg flex items-center gap-2 transition"
            >
              <RotateCcw className="w-5 h-5" /> 重新開壇
            </button>
          </div>
        </div>
      )}

      <footer className="text-center text-slate-600 text-xs mt-12 pb-8 max-w-2xl mx-auto border-t border-slate-900 pt-8">
        <p className="mb-2">※ 本系統演算邏輯參考《天壇玉格》與道教傳統干支法統 ※</p>
        <p>凡授籙弟子應當恭敬師長，持戒清淨，方能與元帥感應道交，護持法壇。</p>
      </footer>
    </div>
  );
};

export default App;
