import React, { useState, useRef } from 'react';
import { Shield, Sparkles, Scroll, User, MapPin, Compass, Flame, Zap, Sword, Droplets, Sun, Moon, Camera, RotateCcw, BookOpen, Info, ArrowRight } from 'lucide-react';
import html2canvas from 'html2canvas';

import { STEMS, BRANCHES, STEM_ELEMENT, ELEMENT_COLORS, STEM_CORRELATION } from './constants/basic';
import { JIAZI_ZHI_MAPPING, ZODIAC_MAPPING, LUNAR_MONTHS, LUNAR_DAYS, LUNAR_HOURS } from './constants/mapping';
import { LU_OPTIONS, RANK_SYSTEM } from './constants/rank';
import { MARSHAL_TITLES, ELEMENT_GROUP_META, STEM_MARSHALS } from './constants/marshals_meta';
import { MARSHAL_DATA_STATIC } from './constants/marshals_data';

const App = () => {
  const [formData, setFormData] = useState({ name: '', gender: 'm', birthYear: '', birthMonth: '正月', birthDay: '初一', birthHour: '早子時 (23-01)', selectedMarshalId: '', rank: '太上三五都功經籙' });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('decree');
  const cardRef = useRef(null);

  const getGanZhiYear = (year) => {
    if (!year) return null;
    const baseYear = 1984;
    const diff = (year - baseYear) % 60;
    const index = diff < 0 ? diff + 60 : diff;
    const stem = STEMS[index % 10];
    const branch = BRANCHES[index % 12];
    return { stem, branch, name: `${stem}${branch}`, element: STEM_ELEMENT[stem] };
  };

  const handleStart = () => {
    if (!formData.name || !formData.birthYear) { alert("請完整輸入法名與出生年份"); return; }
    const gz = getGanZhiYear(parseInt(formData.birthYear));
    const score = formData.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 4;
    const zhiInfo = JIAZI_ZHI_MAPPING[gz.name] || JIAZI_ZHI_MAPPING["甲子"];
    const rankKey = Object.keys(RANK_SYSTEM).find(k => RANK_SYSTEM[k].label === formData.rank) || "dugong";
    const rankData = RANK_SYSTEM[rankKey];
    const marshalPool = STEM_MARSHALS[gz.stem] || STEM_MARSHALS["甲"];
    const marshalId = formData.selectedMarshalId || marshalPool[score % marshalPool.length];
    const marshalInfo = MARSHAL_DATA_STATIC[marshalId];
    const starInfo = ZODIAC_MAPPING[gz.branch];
    const variantDesc = MARSHAL_TITLES[marshalId]?.[score % (MARSHAL_TITLES[marshalId]?.length || 1)]?.desc || "護壇大將";
    const correlation = STEM_CORRELATION[gz.stem];

    setResult({ gz, zhiInfo, rankData, appoint: rankData.appoints[formData.gender][score % rankData.appoints[formData.gender].length], office: rankData.offices[score % rankData.offices.length], marshalInfo, variantDesc, starInfo, correlation, powers: rankData.powers });
    setActiveTab('decree');
  };

  const exportImage = async () => { if (cardRef.current) { const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0f172a', scale: 2 }); const link = document.createElement('a'); link.download = `Taoist_Decree_${formData.name}.png`; link.href = canvas.toDataURL(); link.click(); } };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-serif p-4 md:p-8">
      {!result ? (
        <div className="max-w-xl mx-auto bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <div className="text-center mb-6"><h2 className="text-2xl font-bold text-yellow-500">請輸入法職資料</h2></div>
          <div className="space-y-4">
            <input className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" placeholder="請輸入姓名" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-700">
                <button onClick={() => setFormData({...formData, gender: 'm'})} className={`flex-1 py-2 rounded-lg text-sm ${formData.gender === 'm' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>乾道</button>
                <button onClick={() => setFormData({...formData, gender: 'f'})} className={`flex-1 py-2 rounded-lg text-sm ${formData.gender === 'f' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}>坤道</button>
              </div>
              <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" placeholder="出生西元年" value={formData.birthYear} onChange={(e) => setFormData({...formData, birthYear: e.target.value})} />
            </div>
            <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})}>{LU_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
            <button onClick={handleStart} className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-4"><Zap className="w-5 h-5" /> 開壇領職</button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-center gap-4">
            <button onClick={() => setActiveTab('decree')} className={`px-6 py-2 rounded-full ${activeTab === 'decree' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400'}`}>奏職寶誥</button>
            <button onClick={() => setActiveTab('marshal')} className={`px-6 py-2 rounded-full ${activeTab === 'marshal' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400'}`}>本命元帥</button>
          </div>

          <div ref={cardRef} className="bg-slate-900 border-4 border-double border-yellow-600/50 p-6 md:p-10 rounded-sm shadow-2xl relative overflow-hidden">
            {activeTab === 'decree' ? (
              <div className="space-y-6">
                <div className="text-center border-b border-yellow-600/30 pb-6"><h2 className="text-3xl font-bold text-yellow-500 mb-2">錄壇奏職寶誥</h2></div>
                <div className="bg-orange-50/10 border border-yellow-600/20 p-6 rounded-xl font-serif text-yellow-100 leading-loose text-lg shadow-inner">
                  <p>一奏立<span className="text-yellow-400 font-bold mx-1">「{result.zhiInfo.tan}」</span>壇<span className="text-yellow-400 font-bold mx-1">「{result.zhiInfo.jing}」</span>靖</p>
                  <p>一奏玄都省正一平炁宮炁 天師<span className="text-yellow-400 font-bold mx-1">「{result.zhiInfo.name}」</span>治<span className="text-yellow-400 font-bold mx-1">「{result.zhiInfo.official}」</span>炁</p>
                  <p>三然君赤天三五步罡元命應<span className="text-yellow-400 font-bold mx-1">「{result.zhiInfo.title}」</span>先生<span className="text-yellow-400 font-bold mx-1">「{result.correlation.direction}」</span>嶽<span className="text-yellow-400 font-bold mx-1">「{result.correlation.color}」</span>帝<span className="text-yellow-400 font-bold mx-1">「{result.correlation.qi}」</span>炁真人</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-800 rounded-lg border border-yellow-600/20">
                    <p className="text-sm text-yellow-600">分發官署</p><p className="text-xl font-bold text-white mb-2">{result.office}</p>
                    <p className="text-sm text-yellow-600">封受職銜</p><p className="text-2xl font-bold text-yellow-500">{result.appoint}</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg border border-yellow-600/20 text-sm">
                    <p className="text-yellow-600 font-bold mb-2">年命資料</p>
                    <p>信士姓名：{formData.name}</p>
                    <p>本命元辰：{result.gz.name}年 ({result.gz.element})</p>
                    <p>治所地點：{result.zhiInfo.location}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`flex flex-col md:flex-row items-center gap-8 ${result.marshalInfo.color} p-8 rounded-xl`}>
                  <div className="text-center md:text-left">
                    <span className="px-3 py-1 bg-black/30 rounded-full text-xs font-bold text-white tracking-widest">本命護法元帥</span>
                    <h3 className="text-4xl font-bold text-white my-2">{result.marshalInfo.name}</h3>
                    <p className="text-white font-medium italic opacity-80">「{result.marshalInfo.slogan}」</p>
                  </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-yellow-600/20 shadow-inner">
                  <h4 className="flex items-center gap-2 text-yellow-500 font-bold mb-4 text-xl"><Flame className="w-6 h-6" /> 專屬行法修持</h4>
                  <p className="text-white font-bold text-lg mb-4 bg-yellow-600/20 px-3 py-1 rounded inline-block">{result.marshalInfo.practice.method}</p>
                  <ul className="space-y-4">{result.marshalInfo.practice.guide.map((step, idx) => (<li key={idx} className="flex gap-3 text-sm text-slate-300"><span className="flex-shrink-0 w-6 h-6 bg-yellow-600/20 text-yellow-500 rounded-full flex items-center justify-center font-bold">{idx + 1}</span><span className="leading-relaxed text-base">{step}</span></li>))}</ul>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 right-8 opacity-5 font-bold text-9xl pointer-events-none select-none">敕</div>
          </div>
          <div className="flex justify-center gap-4 pb-12"><button onClick={exportImage} className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 transition"><Camera className="w-5 h-5" /> 保存法職寶誥</button><button onClick={() => setResult(null)} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl shadow-lg flex items-center gap-2 transition"><RotateCcw className="w-5 h-5" /> 重新開壇</button></div>
        </div>
      )}
    </div>
  );
};

export default App;
