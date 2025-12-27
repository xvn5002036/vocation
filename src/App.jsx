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
        <Sparkles className="w-5 h-5" /> 請輸入法職資料
      </h2>
      <p className="text-slate-400 text-xs mt-1">正一法統 · 時辰元帥 · 職官準確對應</p>
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
            <option value="">-- 依干支時辰準確推算 --</option>
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
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">出生年份 (西元)</label>
          <input 
            type="number"
            inputMode="decimal"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm"
            placeholder="1987"
            value={formData.birthYear}
            onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">出生時辰</label>
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
        className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg mt-4"
      >
        開壇領職
      </button>
    </div>
  </div>
);

const App = () => {
  const [formData, setFormData] = useState({
    name: '', gender: 'm', birthYear: '', birthMonth: '正月',
    birthDay: '初一', birthHour: '午時 (11-13)',
    selectedMarshalId: '', rank: '太上三五都功經籙'
  });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('decree');
  const cardRef = useRef(null);

  const getGanZhiYear = (year) => {
    if (!year) return null;
    const baseYear = 1984; 
    const diff = (year - baseYear) % 60;
    const index = diff < 0 ? diff + 60 : diff;
    return { stem: STEMS[index % 10], branch: BRANCHES[index % 12], name: `${STEMS[index % 10]}${BRANCHES[index % 12]}` };
  };

  const handleStart = () => {
    if (!formData.name || !formData.birthYear) return;
    
    const gz = getGanZhiYear(parseInt(formData.birthYear));
    const hourBranch = formData.birthHour.substring(0, 1); // 提取「子、丑、寅...」
    
    // 1. 抓取本命治所
    const zhiData = JIAZI_ZHI_MAPPING[gz.name] || JIAZI_ZHI_MAPPING["甲子"];
    
    // 2. 抓取地支星君與職能
    const starInfo = ZODIAC_MAPPING[gz.branch];
    const roleIdx = starInfo.roleType === 'admin' ? 0 : (starInfo.roleType === 'warrior' ? 1 : 2);
    
    // 3. 分配職銜
    const rankKey = Object.keys(RANK_SYSTEM).find(key => RANK_SYSTEM[key].label === formData.rank) || "dugong";
    const rankData = RANK_SYSTEM[rankKey];
    const appoint = rankData.appoints[formData.gender][roleIdx];
    const office = rankData.offices[roleIdx];

    // 4. 元帥判定修正：加入時辰邏輯
    let mId = formData.selectedMarshalId;
    if (!mId) {
      // 周元帥 (zhou) 對應地祇系統，通常與「申、酉、戌」等時辰或土性天干連動
      if (['申', '酉', '戌'].includes(hourBranch) && (gz.stem === '戊' || gz.stem === '己')) {
        mId = 'zhou';
      } else {
        const marshalPool = STEM_MARSHALS[gz.stem];
        mId = marshalPool[roleIdx % marshalPool.length];
      }
    }

    const marshalInfo = MARSHAL_DATA_STATIC[mId] || MARSHAL_DATA_STATIC['wen'];
    const mTitleData = MARSHAL_TITLES[mId]?.find(t => t.type === starInfo.roleType) || MARSHAL_TITLES[mId]?.[0];

    setResult({
      gz, zhiInfo: zhiData, rankData, appoint, office, marshalInfo,
      variantDesc: mTitleData?.desc, starInfo, correlation: STEM_CORRELATION[gz.stem]
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-serif p-4">
      <header className="text-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-yellow-500 tracking-widest">※ 正一法壇 · 職官分發 ※</h1>
      </header>

      {!result ? (
        <InputSection formData={formData} setFormData={setFormData} handleStart={handleStart} />
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <div ref={cardRef} className="bg-slate-900 border-4 border-yellow-600/50 p-6 rounded-lg shadow-2xl">
            <h2 className="text-center text-2xl font-bold text-yellow-500 border-b border-yellow-600/30 pb-4 mb-6">錄壇奏職寶誥</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p><span className="text-slate-400">授籙信士：</span> {formData.name}</p>
                <p><span className="text-slate-400">年命干支：</span> {result.gz.name} ({STEM_ELEMENT[result.gz.stem]}年)</p>
                <p><span className="text-slate-400">出生時辰：</span> {formData.birthHour}</p>
                <p><span className="text-slate-400">本命治所：</span> {result.zhiInfo.name}</p>
                <p><span className="text-slate-400">壇靖對應：</span> {result.zhiInfo.tan} / {result.zhiInfo.jing}</p>
              </div>
              <div className="bg-yellow-600/10 p-4 rounded border border-yellow-600/20">
                <p className="text-xs text-yellow-600">分發官署：{result.office}</p>
                <p className="text-xl font-bold text-yellow-500 mt-2">{result.appoint}</p>
              </div>
            </div>
            
            <div className={`mt-8 p-4 rounded-xl border-2 ${result.marshalInfo.color} border-white/10`}>
              <div className="flex items-center gap-4">
                <Shield className="w-12 h-12 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">{result.marshalInfo.name}</h3>
                  <p className="text-xs text-white/80 tracking-tighter">時辰護法：{result.variantDesc}</p>
                </div>
              </div>
              <p className="text-xs text-white/70 mt-3 leading-relaxed">{result.marshalInfo.intro}</p>
            </div>
          </div>
          <button onClick={() => setResult(null)} className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl">重新開壇</button>
        </div>
      )}
    </div>
  );
};

export default App;
