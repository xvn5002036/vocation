import React, { useState, useRef } from 'react';
import { 
  Shield, Sparkles, Scroll, User, MapPin, Compass, 
  Flame, Zap, Sword, Droplets, Sun, Moon, 
  Camera, RotateCcw, BookOpen, Info, Award
} from 'lucide-react';
import html2canvas from 'html2canvas';

// 引入所有常數資料
import { STEMS, BRANCHES, STEM_ELEMENT, STEM_CORRELATION } from './constants/basic';
import { JIAZI_ZHI_MAPPING, ZODIAC_MAPPING, LUNAR_MONTHS, LUNAR_DAYS, LUNAR_HOURS } from './constants/mapping';
import { LU_OPTIONS, RANK_SYSTEM } from './constants/rank';
import { MARSHAL_TITLES, STEM_MARSHALS } from './constants/marshals_meta';
import { MARSHAL_DATA_STATIC } from './constants/marshals_data';

// --- 輸入介面組件 ---
const InputSection = ({ formData, setFormData, handleStart }) => (
  <div className="max-w-xl mx-auto bg-slate-900/80 p-6 rounded-3xl border border-yellow-600/20 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in duration-500">
    <div className="text-center mb-8">
      <div className="inline-flex p-3 bg-yellow-600/10 rounded-full mb-3">
        <Sparkles className="w-8 h-8 text-yellow-500" />
      </div>
      <h2 className="text-2xl font-bold text-yellow-500 tracking-tight">奏職法壇 · 領職登記</h2>
      <p className="text-slate-400 text-xs mt-2 tracking-widest uppercase font-serif">Traditional Taoist Decree System</p>
    </div>

    <div className="space-y-5">
      <div>
        <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-bold">道友法名 / 姓名</label>
        <input 
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-600/50 transition-all placeholder:text-slate-700"
          placeholder="請輸入姓名"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-bold">乾坤屬性 (性別)</label>
          <div className="flex bg-slate-950 rounded-2xl p-1 border border-slate-800">
            <button onClick={() => setFormData({...formData, gender: 'm'})} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${formData.gender === 'm' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>乾道 (男)</button>
            <button onClick={() => setFormData({...formData, gender: 'f'})} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${formData.gender === 'f' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>坤道 (女)</button>
          </div>
        </div>
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-bold">指定元帥 (選填)</label>
          <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-3.5 text-white text-xs" value={formData.selectedMarshalId} onChange={(e) => setFormData({...formData, selectedMarshalId: e.target.value})}>
            <option value="">-- 依古籍精確推算 --</option>
            {Object.entries(MARSHAL_DATA_STATIC).map(([id, m]) => (<option key={id} value={id}>{m.shortName}</option>))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-bold">受籙等級</label>
        <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm" value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})}>
          {LU_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-bold">農曆年 (西元數)</label>
          <input type="number" inputMode="decimal" pattern="[0-9]*" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm" placeholder="1972" value={formData.birthYear} onChange={(e) => setFormData({...formData, birthYear: e.target.value})} />
        </div>
        <div>
          <label className="block text-yellow-500/80 text-xs mb-1 ml-1 font-bold">農曆月份</label>
          <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm" value={formData.birthMonth} onChange={(e) => setFormData({...formData, birthMonth: e.target.value})}>
            {LUNAR_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm font-serif" value={formData.birthDay} onChange={(e) => setFormData({...formData, birthDay: e.target.value})}>
          {LUNAR_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm font-serif" value={formData.birthHour} onChange={(e) => setFormData({...formData, birthHour: e.target.value})}>
          {LUNAR_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      <button onClick={handleStart} className="w-full bg-gradient-to-b from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-slate-950 font-black py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 mt-6 uppercase tracking-widest">
        <Zap className="w-6 h-6 fill-current" /> 開 壇 領 職
      </button>
    </div>
  </div>
);

const App = () => {
  const [formData, setFormData] = useState({ name: '', gender: 'm', birthYear: '', birthMonth: '八月', birthDay: '初九', birthHour: '早子時 (23-01)', selectedMarshalId: '', rank: '太上三五都功經籙' });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('decree');
  const cardRef = useRef(null);

  const handleStart = () => {
    if (!formData.name || !formData.birthYear) { alert("請完整輸入法名與農曆年份"); return; }

    const year = parseInt(formData.birthYear);
    const diff = (year - 1984) % 60;
    const index = diff < 0 ? diff + 60 : diff;
    const gz = { 
      stem: STEMS[index % 10], 
      branch: BRANCHES[index % 12], 
      name: `${STEMS[index % 10]}${BRANCHES[index % 12]}`, 
      element: STEM_ELEMENT[STEMS[index % 10]] 
    };

    // 1. 治所精確對抓 (JIAZI_ZHI_MAPPING 使用 name/location/tan/jing 欄位)
    const zhiInfo = JIAZI_ZHI_MAPPING[gz.name] || JIAZI_ZHI_MAPPING["甲子"];

    // 2. 獲取本命星君屬性 (地支決定 roleType: admin, warrior, judge)
    const starInfo = ZODIAC_MAPPING[gz.branch];
    const roleIdx = starInfo.roleType === 'admin' ? 0 : (starInfo.roleType === 'warrior' ? 1 : 2);

    // 3. 職銜分配 (依職級對應 RANK_SYSTEM)
    const rankData = RANK_SYSTEM[Object.keys(RANK_SYSTEM).find(key => RANK_SYSTEM[key].label === formData.rank) || "dugong"];
    const appoint = rankData.appoints[formData.gender][roleIdx];
    const office = rankData.offices[roleIdx];

    // 4. 元帥分配精確演算：【時辰地支】優先權
    const hourBranch = formData.birthHour.substring(0, 1); // 提取「子」
    let mId = formData.selectedMarshalId;
    
    if (!mId) {
      // 法統邏輯：子時(23-01)開壇者，特受「神虎提督周元帥」護持。排除天干干擾。
      if (hourBranch === '子') {
        mId = 'zhou'; 
      } else {
        // 非子時，回歸天干部隊，並結合姓名長度進行偏移選取（避免每個人都一樣）
        const marshalPool = STEM_MARSHALS[gz.stem] || STEM_MARSHALS["甲"];
        const nameOffset = formData.name.length % marshalPool.length;
        mId = marshalPool[(roleIdx + nameOffset) % marshalPool.length];
      }
    }

    const marshalInfo = MARSHAL_DATA_STATIC[mId] || MARSHAL_DATA_STATIC['wen'];
    const mTitleData = MARSHAL_TITLES[mId]?.find(t => t.type === starInfo.roleType) || MARSHAL_TITLES[mId]?.[0];

    setResult({ gz, zhiInfo, rankData, appoint, office, marshalInfo, starInfo, correlation: STEM_CORRELATION[gz.stem], variantDesc: mTitleData?.desc });
    setActiveTab('decree');
  };

  const exportImage = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#020617', scale: 2 });
      const link = document.createElement('a');
      link.download = `Taoist_Decree_${formData.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-serif p-4 md:p-10">
      <header className="text-center mb-12 animate-in slide-in-from-top duration-700">
        <h1 className="text-2xl md:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-800 tracking-[0.2em]">
          ※ 正一法壇 · 職官分發 ※
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-yellow-600" />
          <Award className="text-yellow-600 w-5 h-5" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-yellow-600" />
        </div>
      </header>

      {!result ? (
        <InputSection formData={formData} setFormData={setFormData} handleStart={handleStart} />
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex justify-center p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit mx-auto shadow-xl">
            <button onClick={() => setActiveTab('decree')} className={`px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${activeTab === 'decree' ? 'bg-yellow-600 text-slate-950 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}>
              <Scroll className="w-4 h-4" /> 奏職寶誥
            </button>
            <button onClick={() => setActiveTab('marshal')} className={`px-8 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${activeTab === 'marshal' ? 'bg-yellow-600 text-slate-950 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}>
              <Shield className="w-4 h-4" /> 本命元帥
            </button>
          </div>

          <div ref={cardRef} className="bg-slate-900 border-[6px] border-double border-yellow-600/40 p-6 md:p-12 rounded-lg shadow-2xl relative overflow-hidden">
            {activeTab === 'decree' ? (
              <div className="space-y-10">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-black text-yellow-500 mb-2 tracking-widest">錄壇奏職寶誥</h2>
                  <p className="text-slate-500 text-[10px] tracking-[0.4em] uppercase">The Divine Taoist Registry</p>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-5 text-base md:text-lg border-b md:border-b-0 md:border-r border-yellow-600/10 pb-6 md:pr-10">
                    <p className="flex items-center gap-4"><User className="w-5 h-5 text-yellow-600/70" /> <span className="text-slate-500 w-24">授籙信士</span> <span className="text-white font-bold">{formData.name}</span></p>
                    <p className="flex items-center gap-4"><Compass className="w-5 h-5 text-yellow-600/70" /> <span className="text-slate-500 w-24">農曆生辰</span> <span className="text-yellow-500 font-bold">{result.gz.name}年 {formData.birthMonth}{formData.birthDay} {formData.birthHour.split(' ')[0]}</span></p>
                    <p className="flex items-center gap-4"><MapPin className="w-5 h-5 text-yellow-600/70" /> <span className="text-slate-500 w-24">本命治所</span> <span className="text-white">{result.zhiInfo.name} ({result.zhiInfo.location})</span></p>
                    <p className="flex items-center gap-4"><BookOpen className="w-5 h-5 text-yellow-600/70" /> <span className="text-slate-500 w-24">分配壇靖</span> <span className="text-white">{result.zhiInfo.tan} / {result.zhiInfo.jing}</span></p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-yellow-600/20 to-transparent rounded-3xl border border-yellow-600/20 text-center">
                    <p className="text-[10px] text-yellow-600 font-bold mb-1 tracking-widest uppercase">Appointment</p>
                    <p className="text-lg text-slate-300 mb-1">{result.office}</p>
                    <p className="text-2xl md:text-3xl font-black text-yellow-500">{result.appoint}</p>
                  </div>
                </div>
                <p className="text-xs italic text-slate-400 text-center border-t border-yellow-600/10 pt-6">「依據{result.correlation.direction}方{result.correlation.color}帝{result.correlation.qi}炁之法力，授以此籙，統御鬼神。」</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className={`flex flex-col md:flex-row items-center gap-8 ${result.marshalInfo.color} p-8 rounded-3xl border-2 border-white/10 shadow-lg relative`}>
                  <Shield className="w-16 h-16 md:w-24 md:h-24 text-white" />
                  <div className="text-center md:text-left">
                    <span className="px-3 py-1 bg-black/40 rounded-full text-[10px] font-bold text-yellow-500 tracking-widest mb-3 uppercase">Divine Guardian</span>
                    <h3 className="text-3xl md:text-4xl font-black text-white">{result.marshalInfo.name}</h3>
                    <p className="text-white/80 italic mt-1 text-sm md:text-lg">「{result.marshalInfo.slogan}」</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
                    <h4 className="flex items-center gap-2 text-yellow-500 font-bold mb-4 text-sm"><Info className="w-4 h-4" /> 神蹟典籍故事</h4>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{result.marshalInfo.intro}</p>
                    <p className="mt-4 text-xs text-yellow-600/80 italic border-t border-yellow-600/10 pt-4">【時辰職務】{result.variantDesc}</p>
                  </div>
                  <div className="bg-slate-800/80 p-6 rounded-3xl border-2 border-yellow-600/10 shadow-inner">
                    <h4 className="flex items-center gap-2 text-yellow-500 font-bold mb-4 text-sm"><Flame className="w-4 h-4" /> 專屬修持法門</h4>
                    <p className="text-white font-bold text-sm mb-4 bg-yellow-600/20 px-4 py-2 rounded-full inline-block border border-yellow-600/20">{result.marshalInfo.practice.method}</p>
                    <ul className="space-y-4">
                      {result.marshalInfo.practice.guide.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-xs text-slate-300 leading-relaxed"><span className="flex-shrink-0 w-5 h-5 bg-yellow-600 text-slate-950 rounded-lg flex items-center justify-center font-black text-[10px]">{idx + 1}</span>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-5 pb-16">
            <button onClick={exportImage} className="px-10 py-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-3 font-bold transition-all"><Camera className="w-5 h-5" /> 保存法職寶誥</button>
            <button onClick={() => setResult(null)} className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl flex items-center gap-3 font-bold transition-all"><RotateCcw className="w-5 h-5" /> 重新領職</button>
          </div>
        </div>
      )}
      <footer className="text-center text-slate-600 text-[10px] mt-8 border-t border-slate-900 pt-8 pb-10 max-w-xl mx-auto">
        <p className="mb-2">※ 本系統演算邏輯嚴格參考《天壇玉格》與道教傳統干支法統 ※</p>
        <p>凡授籙弟子應當恭敬師長，持戒清淨，方能與元帥感應道交，護持法壇。</p>
      </footer>
    </div>
  );
};

export default App;
