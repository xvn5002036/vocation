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

// 輸入組件：獨立出來以修復 iPhone 鍵盤閃退與喚起九宮格數字鍵盤
const InputSection = ({ formData, setFormData, handleStart }) => (
  <div className="max-w-xl mx-auto bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl">
    <div className="text-center mb-6">
      <h2 className="text-xl font-bold text-yellow-500 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" /> 請輸入法職資料 (農曆)
      </h2>
      <p className="text-slate-400 text-xs mt-1">正一法統 · 依農曆干支與時辰精確分發</p>
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
            <button onClick={() => setFormData({...formData, gender: 'm'})} className={`flex-1 py-2 rounded-lg text-xs transition ${formData.gender === 'm' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>乾道 (男)</button>
            <button onClick={() => setFormData({...formData, gender: 'f'})} className={`flex-1 py-2 rounded-lg text-xs transition ${formData.gender === 'f' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400'}`}>坤道 (女)</button>
          </div>
        </div>
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">指定元帥 (選填)</label>
          <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-white text-xs" value={formData.selectedMarshalId} onChange={(e) => setFormData({...formData, selectedMarshalId: e.target.value})}>
            <option value="">-- 依農曆干支自動推算 --</option>
            {Object.entries(MARSHAL_DATA_STATIC).map(([id, m]) => (<option key={id} value={id}>{m.shortName}</option>))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">授籙等級</label>
        <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})}>
          {LU_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">農曆年 (西元數值)</label>
          <input type="number" inputMode="decimal" pattern="[0-9]*" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" placeholder="1972" value={formData.birthYear} onChange={(e) => setFormData({...formData, birthYear: e.target.value})} />
        </div>
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-medium">農曆月份</label>
          <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" value={formData.birthMonth} onChange={(e) => setFormData({...formData, birthMonth: e.target.value})}>
            {LUNAR_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" value={formData.birthDay} onChange={(e) => setFormData({...formData, birthDay: e.target.value})}>
          {LUNAR_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" value={formData.birthHour} onChange={(e) => setFormData({...formData, birthHour: e.target.value})}>
          {LUNAR_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      <button onClick={handleStart} className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2"><Zap className="w-5 h-5" /> 開壇領職</button>
    </div>
  </div>
);

const App = () => {
  const [formData, setFormData] = useState({ name: '', gender: 'm', birthYear: '', birthMonth: '八月', birthDay: '初九', birthHour: '早子時 (23-01)', selectedMarshalId: '', rank: '太上三五都功經籙' });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('decree');
  const cardRef = useRef(null);

  const handleStart = () => {
    if (!formData.name || !formData.birthYear) return;
    const year = parseInt(formData.birthYear);
    const diff = (year - 1984) % 60;
    const index = diff < 0 ? diff + 60 : diff;
    const gz = { stem: STEMS[index % 10], branch: BRANCHES[index % 12], name: `${STEMS[index % 10]}${BRANCHES[index % 12]}`, element: STEM_ELEMENT[STEMS[index % 10]] };
    
    // 1. 治所與星君 (地支精確讀取)
    const zhiInfo = JIAZI_ZHI_MAPPING[gz.name] || JIAZI_ZHI_MAPPING["甲子"];
    const starInfo = ZODIAC_MAPPING[gz.branch];
    const roleIdx = starInfo.roleType === 'admin' ? 0 : (starInfo.roleType === 'warrior' ? 1 : 2);
    
    // 2. 職銜精確分配 (依職能對應而非隨機)
    const rankData = RANK_SYSTEM[Object.keys(RANK_SYSTEM).find(key => RANK_SYSTEM[key].label === formData.rank) || "dugong"];
    const appoint = rankData.appoints[formData.gender][roleIdx];
    const office = rankData.offices[roleIdx];

    // 3. 元帥判定修正 (子時對應周元帥)
    const hourBranch = formData.birthHour.substring(0, 1);
    let mId = formData.selectedMarshalId;
    if (!mId) {
      mId = (hourBranch === '子') ? 'zhou' : (STEM_MARSHALS[gz.stem][roleIdx % STEM_MARSHALS[gz.stem].length]);
    }
    
    setResult({ gz, zhiInfo, rankData, appoint, office, marshalInfo: MARSHAL_DATA_STATIC[mId], starInfo, correlation: STEM_CORRELATION[gz.stem], variantDesc: MARSHAL_TITLES[mId]?.find(t => t.type === starInfo.roleType)?.desc });
    setActiveTab('decree');
  };

  const exportImage = async () => { if (cardRef.current) { const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0f172a', scale: 2 }); const link = document.createElement('a'); link.download = `Taoist_Decree.png`; link.href = canvas.toDataURL(); link.click(); } };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-serif p-4">
      <header className="text-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600">※ 正一法壇 · 職官分發 ※</h1>
        <div className="h-1 w-24 bg-yellow-600 mx-auto rounded-full" />
      </header>
      {!result ? ( <InputSection formData={formData} setFormData={setFormData} handleStart={handleStart} /> ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center gap-4 text-sm">
            <button onClick={() => setActiveTab('decree')} className={`px-6 py-2 rounded-full transition ${activeTab === 'decree' ? 'bg-yellow-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>奏職寶誥</button>
            <button onClick={() => setActiveTab('marshal')} className={`px-6 py-2 rounded-full transition ${activeTab === 'marshal' ? 'bg-yellow-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>本命元帥</button>
          </div>
          <div ref={cardRef} className="bg-slate-900 border-4 border-yellow-600/50 p-6 md:p-10 rounded shadow-2xl relative">
            {activeTab === 'decree' ? (
              <div className="space-y-6">
                <div className="text-center border-b border-yellow-600/30 pb-4"><h2 className="text-2xl font-bold text-yellow-500">錄壇奏職寶誥</h2></div>
                <div className="grid md:grid-cols-2 gap-6 text-sm md:text-base">
                  <div className="space-y-3">
                    <p><User className="inline w-4 h-4 mr-2 text-yellow-600" /> <span className="text-slate-400">授籙信士：</span> {formData.name}</p>
                    <p><Compass className="inline w-4 h-4 mr-2 text-yellow-600" /> <span className="text-slate-400">農曆生辰：</span> {result.gz.name}年 {formData.birthMonth}{formData.birthDay} {formData.birthHour}</p>
                    <p><MapPin className="inline w-4 h-4 mr-2 text-yellow-600" /> <span className="text-slate-400">本命治所：</span> {result.zhiInfo.name} ({result.zhiInfo.location})</p>
                    <p><Sparkles className="inline w-4 h-4 mr-2 text-yellow-600" /> <span className="text-slate-400">所配壇靖：</span> {result.zhiInfo.tan} / {result.zhiInfo.jing}</p>
                  </div>
                  <div className="p-4 bg-yellow-600/10 rounded border border-yellow-600/20 text-center">
                    <p className="text-xs text-yellow-600">分發官署：{result.office}</p>
                    <p className="text-xl font-bold text-yellow-500 mt-2">{result.appoint}</p>
                  </div>
                </div>
                <p className="text-xs italic text-slate-400 text-center">「依據{result.correlation.direction}方{result.correlation.color}帝{result.correlation.qi}炁之法力，授以此籙，統御鬼神。」</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`flex items-center gap-4 ${result.marshalInfo.color} p-4 rounded-xl text-white shadow-lg`}>
                  <Shield className="w-12 h-12" />
                  <div><h3 className="text-2xl font-bold">{result.marshalInfo.name}</h3><p className="text-xs opacity-80">時辰守護：{result.variantDesc}</p></div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-xs md:text-sm leading-relaxed text-slate-300">{result.marshalInfo.intro}</div>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 pb-8"><button onClick={exportImage} className="px-8 py-3 bg-emerald-700 text-white rounded-xl shadow-lg flex items-center gap-2"><Camera className="w-5 h-5" /> 保存</button><button onClick={() => setResult(null)} className="px-8 py-3 bg-slate-800 text-slate-300 rounded-xl">重新重選</button></div>
        </div>
      )}
    </div>
  );
};

export default App;
