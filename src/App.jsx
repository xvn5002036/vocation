import React, { useState, useRef } from 'react';
import { 
  Shield, Sparkles, Scroll, User, MapPin, Compass, 
  Flame, Zap, Sword, Droplets, Sun, Moon, 
  Camera, RotateCcw, BookOpen, Info 
} from 'lucide-react';
import html2canvas from 'html2canvas';

// 引入資料
import { STEMS, BRANCHES, STEM_ELEMENT, STEM_CORRELATION } from './constants/basic';
import { JIAZI_ZHI_MAPPING, ZODIAC_MAPPING, LUNAR_MONTHS, LUNAR_DAYS, LUNAR_HOURS } from './constants/mapping';
import { LU_OPTIONS, RANK_SYSTEM } from './constants/rank';
import { MARSHAL_TITLES, STEM_MARSHALS } from './constants/marshals_meta';
import { MARSHAL_DATA_STATIC } from './constants/marshals_data';

// --- 修復問題 2：將 InputSection 移到主組件外面，防止重新定義組件導致輸入框失去焦點 ---
const InputSection = ({ formData, setFormData, handleStart }) => (
  <div className="max-w-xl mx-auto bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl">
    <div className="text-center mb-6">
      <h2 className="text-xl font-bold text-yellow-500 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" /> 請輸入法職資料
      </h2>
      <p className="text-slate-400 text-xs mt-1">正一法統 · 本命星君 · 籙職對應</p>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">道友法名 / 姓名</label>
        <input 
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 placeholder:text-slate-600 text-sm"
          placeholder="請輸入姓名"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">性別</label>
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-700">
            <button 
              onClick={() => setFormData({...formData, gender: 'm'})}
              className={`flex-1 py-2 rounded-lg text-xs transition ${formData.gender === 'm' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
            >乾道 (男)</button>
            <button 
              onClick={() => setFormData({...formData, gender: 'f'})}
              className={`flex-1 py-2 rounded-lg text-xs transition ${formData.gender === 'f' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400'}`}
            >坤道 (女)</button>
          </div>
        </div>
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">指定元帥 (選填)</label>
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-white text-xs"
            value={formData.selectedMarshalId}
            onChange={(e) => setFormData({...formData, selectedMarshalId: e.target.value})}
          >
            <option value="">-- 依天干推算 --</option>
            {Object.entries(MARSHAL_DATA_STATIC).map(([id, m]) => (
              <option key={id} value={id}>{m.shortName}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">目前授籙</label>
        <select 
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-yellow-500/50"
          value={formData.rank}
          onChange={(e) => setFormData({...formData, rank: e.target.value})}
        >
          {LU_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">出生西元年 (修復焦點)</label>
          <input 
            type="number"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm"
            placeholder="例如: 1987"
            value={formData.birthYear}
            onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">農曆月</label>
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm"
            value={formData.birthMonth}
            onChange={(e) => setFormData({...formData, birthMonth: e.target.value})}
          >
            {LUNAR_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select 
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm"
          value={formData.birthDay}
          onChange={(e) => setFormData({...formData, birthDay: e.target.value})}
        >
          {LUNAR_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select 
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm"
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

const App = () => {
  const [formData, setFormData] = useState({
    name: '', gender: 'm', birthYear: '', birthMonth: '正月',
    birthDay: '初一', birthHour: '早子時 (23-01)',
    selectedMarshalId: '', rank: '太上三五都功經籙'
  });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('decree');
  const cardRef = useRef(null);

  const getGanZhiYear = (year) => {
    if (!year) return null;
    const diff = (year - 1984) % 60;
    const index = diff < 0 ? diff + 60 : diff;
    const stem = STEMS[index % 10];
    const branch = BRANCHES[index % 12];
    return { stem, branch, name: `${stem}${branch}`, element: STEM_ELEMENT[stem] };
  };

  const handleStart = () => {
    if (!formData.name || !formData.birthYear) { alert("請完整輸入法名與出生年份"); return; }
    const gz = getGanZhiYear(parseInt(formData.birthYear));
    const score = formData.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 3;
    const zhiInfo = JIAZI_ZHI_MAPPING[gz.name] || JIAZI_ZHI_MAPPING["甲子"];
    const rankKey = Object.keys(RANK_SYSTEM).find(key => RANK_SYSTEM[key].label === formData.rank);
    const rankData = RANK_SYSTEM[rankKey];
    
    let mId = formData.selectedMarshalId || STEM_MARSHALS[gz.stem][score % STEM_MARSHALS[gz.stem].length];
    
    setResult({
      gz, zhiInfo, rankData,
      appoint: rankData.appoints[formData.gender][score],
      office: rankData.offices[score],
      marshalInfo: MARSHAL_DATA_STATIC[mId],
      starInfo: ZODIAC_MAPPING[gz.branch],
      correlation: STEM_CORRELATION[gz.stem],
      powers: rankData.powers
    });
  };

  const exportImage = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0f172a', scale: 2 });
      const link = document.createElement('a');
      link.download = `Taoist_${formData.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-serif p-4 md:p-8">
      {/* 修復問題 1：調整手機標題字體大小 */}
      <header className="text-center mb-8">
        <h1 className="text-2xl md:text-5xl font-bold mb-2 tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600">
          ※ 正一法壇 · 職官分發 ※
        </h1>
        <div className="h-0.5 w-24 bg-yellow-600 mx-auto rounded-full" />
      </header>

      {!result ? (
        <InputSection formData={formData} setFormData={setFormData} handleStart={handleStart} />
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
          <div className="flex justify-center gap-4">
            <button onClick={() => setActiveTab('decree')} className={`px-6 py-2 rounded-full flex items-center gap-2 transition ${activeTab === 'decree' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <Scroll className="w-4 h-4" /> 奏職寶誥
            </button>
            <button onClick={() => setActiveTab('marshal')} className={`px-6 py-2 rounded-full flex items-center gap-2 transition ${activeTab === 'marshal' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <Shield className="w-4 h-4" /> 本命元帥
            </button>
          </div>

          <div ref={cardRef} className="bg-slate-900 border-4 border-double border-yellow-600/50 p-6 md:p-10 rounded-sm shadow-2xl relative overflow-hidden">
             {/* 渲染結果代碼省略，保持您原有的邏輯即可... */}
             {/* 此處確保內容顯示正常 */}
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-yellow-500">{activeTab === 'decree' ? '錄壇奏職寶誥' : result.marshalInfo.name}</h2>
             </div>
             <div className="space-y-4 text-sm text-slate-300">
                {activeTab === 'decree' ? (
                  <>
                    <p>授籙信士：{formData.name}</p>
                    <p>年命干支：{result.gz.name}年 ({result.gz.element})</p>
                    <p>本命治所：{result.zhiInfo.zhi}</p>
                    <p>受封職銜：{result.appoint}</p>
                  </>
                ) : (
                  <>
                    <div className={`${result.marshalInfo.color} p-4 rounded-lg text-white mb-4`}>
                      <p className="font-bold">{result.marshalInfo.title}</p>
                      <p className="italic text-xs">「{result.marshalInfo.slogan}」</p>
                    </div>
                    <p>{result.marshalInfo.intro}</p>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mt-4">
                       <p className="text-yellow-500 font-bold mb-2">最強法門：{result.marshalInfo.practice.method}</p>
                       <ul className="list-disc list-inside space-y-1 text-xs">
                          {result.marshalInfo.practice.guide.map((g, i) => <li key={i}>{g}</li>)}
                       </ul>
                    </div>
                  </>
                )}
             </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pb-12">
            <button onClick={exportImage} className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2"><Camera className="w-5 h-5" /> 保存</button>
            <button onClick={() => setResult(null)} className="px-8 py-3 bg-slate-800 text-slate-300 rounded-xl flex items-center gap-2"><RotateCcw className="w-5 h-5" /> 重選</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
