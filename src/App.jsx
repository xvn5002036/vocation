import React, { useState, useRef } from 'react';
import { 
  Shield, Sparkles, Scroll, User, MapPin, Compass, 
  Flame, Zap, Sword, Droplets, Sun, Moon, 
  Camera, RotateCcw, BookOpen, Info 
} from 'lucide-react';
import html2canvas from 'html2canvas';

// 引入常數資料
import { STEMS, BRANCHES, STEM_ELEMENT, STEM_CORRELATION } from './constants/basic';
import { JIAZI_ZHI_MAPPING, ZODIAC_MAPPING, LUNAR_MONTHS, LUNAR_DAYS, LUNAR_HOURS } from './constants/mapping';
import { LU_OPTIONS, RANK_SYSTEM } from './constants/rank';
import { MARSHAL_TITLES, STEM_MARSHALS } from './constants/marshals_meta';
import { MARSHAL_DATA_STATIC } from './constants/marshals_data';

const InputSection = ({ formData, setFormData, handleStart }) => (
  <div className="max-w-xl mx-auto bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl">
    <div className="text-center mb-6">
      <h2 className="text-xl font-bold text-yellow-500 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" /> 請輸入法職資料 (農曆)
      </h2>
      <p className="text-slate-400 text-xs mt-1">正一法統 · 依農曆干支準確分發</p>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">道友法名 / 姓名</label>
        <input 
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
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
              className={`flex-1 py-2 rounded-lg text-xs transition ${formData.gender === 'm' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >乾道 (男)</button>
            <button 
              onClick={() => setFormData({...formData, gender: 'f'})}
              className={`flex-1 py-2 rounded-lg text-xs transition ${formData.gender === 'f' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}
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
            <option value="">-- 依農曆干支自動推算 --</option>
            {Object.entries(MARSHAL_DATA_STATIC).map(([id, m]) => (
              <option key={id} value={id}>{m.shortName}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">授籙等級</label>
        <select 
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm"
          value={formData.rank}
          onChange={(e) => setFormData({...formData, rank: e.target.value})}
        >
          {LU_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">農曆出生年 (西元數值)</label>
          <input 
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm"
            placeholder="例如: 1987"
            value={formData.birthYear}
            onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">農曆月份</label>
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
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">農曆日期</label>
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm"
            value={formData.birthDay}
            onChange={(e) => setFormData({...formData, birthDay: e.target.value})}
          >
            {LUNAR_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">農曆出生時辰</label>
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm"
            value={formData.birthHour}
            onChange={(e) => setFormData({...formData, birthHour: e.target.value})}
          >
            {LUNAR_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
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

  // 準確計算農曆年命干支
  const getGanZhiYear = (year) => {
    if (!year) return null;
    const baseYear = 1984; // 甲子年
    const diff = (parseInt(year) - baseYear) % 60;
    const index = diff < 0 ? diff + 60 : diff;
    const stem = STEMS[index % 10];
    const branch = BRANCHES[index % 12];
    return { stem, branch, name: `${stem}${branch}`, element: STEM_ELEMENT[stem] };
  };

  const handleStart = () => {
    if (!formData.name || !formData.birthYear) { alert("請完整輸入法名與農曆年份"); return; }
    
    const gz = getGanZhiYear(formData.birthYear);
    const hourBranch = formData.birthHour.substring(0, 1); 
    
    // 1. 本命星君
    const starInfo = ZODIAC_MAPPING[gz.branch];
    const roleIdx = starInfo.roleType === 'admin' ? 0 : (starInfo.roleType === 'warrior' ? 1 : 2);
    
    // 2. 治所壇靖 (準確對應 60 甲子)
    const zhiData = JIAZI_ZHI_MAPPING[gz.name] || JIAZI_ZHI_MAPPING["甲子"];

    // 3. 職銜分配
    const rankKey = Object.keys(RANK_SYSTEM).find(key => RANK_SYSTEM[key].label === formData.rank) || "dugong";
    const rankData = RANK_SYSTEM[rankKey];
    
    const appoint = rankData.appoints[formData.gender][roleIdx];
    const office = rankData.offices[roleIdx];

    // 4. 元帥判定修正 (根據農曆天干與時辰地支)
    let mId = formData.selectedMarshalId;
    if (!mId) {
      // 修正周元帥判定：地祇系統對應「土」性天干 (戊己) 或特定時辰
      if ((gz.stem === '戊' || gz.stem === '己') && (['申', '酉', '戌'].includes(hourBranch))) {
        mId = 'zhou';
      } else {
        const pool = STEM_MARSHALS[gz.stem] || STEM_MARSHALS["甲"];
        mId = pool[roleIdx % pool.length];
      }
    }

    const marshalInfo = MARSHAL_DATA_STATIC[mId];
    const mTitleData = MARSHAL_TITLES[mId]?.find(t => t.type === starInfo.roleType) || MARSHAL_TITLES[mId]?.[0];

    setResult({
      gz, zhiInfo: zhiData, rankData, appoint, office, marshalInfo,
      variantDesc: mTitleData?.desc || "護壇大將",
      starInfo,
      correlation: STEM_CORRELATION[gz.stem],
      powers: rankData.powers
    });
    setActiveTab('decree');
  };

  const exportImage = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0f172a', scale: 2 });
      const link = document.createElement('a');
      link.download = `Taoist_Decree_${formData.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-serif p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-2xl md:text-5xl font-bold mb-2 tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600">
          ※ 正一法壇 · 職官分發 ※
        </h1>
        <div className="h-1 w-24 bg-yellow-600 mx-auto rounded-full" />
      </header>

      {!result ? (
        <InputSection formData={formData} setFormData={setFormData} handleStart={handleStart} />
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
          <div className="flex justify-center gap-4 text-sm">
            <button onClick={() => setActiveTab('decree')} className={`px-6 py-2 rounded-full flex items-center gap-2 transition ${activeTab === 'decree' ? 'bg-yellow-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>
              <Scroll className="w-4 h-4" /> 奏職寶誥
            </button>
            <button onClick={() => setActiveTab('marshal')} className={`px-6 py-2 rounded-full flex items-center gap-2 transition ${activeTab === 'marshal' ? 'bg-yellow-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>
              <Shield className="w-4 h-4" /> 本命元帥
            </button>
          </div>

          <div ref={cardRef} className="bg-slate-900 border-4 border-double border-yellow-600/50 p-6 md:p-10 rounded-sm shadow-2xl relative overflow-hidden">
            {activeTab === 'decree' ? (
              <div className="space-y-8">
                <div className="text-center border-b border-yellow-600/30 pb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 mb-2">錄壇奏職寶誥</h2>
                  <p className="text-slate-400 text-xs tracking-[0.2em]">TAOIST DIVINE DECREE</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4 text-sm md:text-base border-b md:border-b-0 md:border-r border-yellow-600/10 pb-4 md:pr-4">
                    <p className="flex items-center gap-3"><User className="w-4 h-4 text-yellow-600" /> <span className="text-slate-400">授籙信士：</span> {formData.name}</p>
                    <p className="flex items-center gap-3"><Compass className="w-4 h-4 text-yellow-600" /> <span className="text-slate-400">農曆生辰：</span> {result.gz.name}年 {formData.birthMonth}{formData.birthDay} {formData.birthHour}</p>
                    <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-yellow-600" /> <span className="text-slate-400">本命治所：</span> {result.zhiInfo.name}</p>
                    <p className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-yellow-600" /> <span className="text-slate-400">所配壇靖：</span> {result.zhiInfo.tan} / {result.zhiInfo.jing}</p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-600/10 rounded-lg border border-yellow-600/20">
                      <p className="text-xs text-yellow-600 mb-1">分發官署</p>
                      <p className="text-lg font-bold text-white">{result.office}</p>
                      <p className="text-xs text-slate-400 mt-2">封受職銜</p>
                      <p className="text-xl font-bold text-yellow-500">{result.appoint}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded border border-yellow-600/10 text-xs italic text-slate-400">
                  「依據{result.correlation.direction}方{result.correlation.color}帝{result.correlation.qi}炁之法力，授以此籙，統御鬼神。」
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`flex flex-col md:flex-row items-center gap-6 ${result.marshalInfo.color} p-6 rounded-xl border-2 border-white/10 shadow-lg`}>
                  <Shield className="w-16 h-16 text-white" />
                  <div className="text-center md:text-left flex-1">
                    <span className="px-3 py-1 bg-black/30 rounded-full text-[10px] font-bold text-white tracking-widest uppercase">本命護法元帥</span>
                    <h3 className="text-3xl font-bold text-white mt-2">{result.marshalInfo.name}</h3>
                    <p className="text-white/80 italic mt-1 text-sm">「{result.marshalInfo.slogan}」</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="flex items-center gap-2 text-yellow-500 font-bold mb-3 text-sm"><Info className="w-4 h-4" /> 神蹟與職務</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">{result.marshalInfo.intro}</p>
                    <p className="text-yellow-600/80 text-[10px] mt-2 italic border-t border-yellow-600/20 pt-2">職任：{result.variantDesc}</p>
                  </div>
                  <div className="bg-slate-800/80 p-5 rounded-xl border-2 border-yellow-600/20 shadow-inner">
                    <h4 className="flex items-center gap-2 text-yellow-500 font-bold mb-3 text-sm"><Flame className="w-4 h-4" /> 修持法門</h4>
                    <ul className="space-y-2">
                      {result.marshalInfo.practice.guide.map((step, idx) => (
                        <li key={idx} className="flex gap-2 text-[10px] text-slate-300">
                          <span className="flex-shrink-0 w-4 h-4 bg-yellow-600/20 text-yellow-500 rounded-full flex items-center justify-center font-bold">{idx + 1}</span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 pb-12">
            <button onClick={exportImage} className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 transition text-sm"><Camera className="w-4 h-4" /> 保存</button>
            <button onClick={() => setResult(null)} className="px-8 py-3 bg-slate-800 text-slate-300 rounded-xl flex items-center gap-2 transition text-sm"><RotateCcw className="w-4 h-4" /> 重新開壇</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
