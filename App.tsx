
import React, { useState, useCallback, useEffect } from 'react';
import { HeavenlyStem, EarthlyBranch, PersonnelRecord } from './types.ts';
import { BRANCHES, CELESTIAL_GENERALS } from './constants.tsx';
import { calculateOrdination, getYearStemBranch } from './utils.ts';

const App: React.FC = () => {
  const [lunarYear, setLunarYear] = useState<number>(76);
  const [lunarMonth, setLunarMonth] = useState<number>(4);
  const [lunarDay, setLunarDay] = useState<number>(10);
  const [hourBranch, setHourBranch] = useState<EarthlyBranch>('申');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [discipleName, setDiscipleName] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);
  const [personnel, setPersonnel] = useState<PersonnelRecord[]>([]);
  const [view, setView] = useState<'generate' | 'list'>('generate');
  const [ritualType, setRitualType] = useState<'general' | 'combat'>('general');

  const yearOptions = Array.from({ length: 120 }, (_, i) => i + 1);

  useEffect(() => {
    const saved = localStorage.getItem('ordination_personnel');
    if (saved) setPersonnel(JSON.parse(saved));
  }, []);

  const handleSearch = useCallback(() => {
    const { stem, branch } = getYearStemBranch(lunarYear);
    const data = calculateOrdination(stem, branch, lunarMonth, lunarDay, hourBranch, gender);
    setResult(data);
  }, [lunarYear, lunarMonth, lunarDay, hourBranch, gender]);

  const saveDisciple = () => {
    if (!result) return;
    const name = discipleName.trim() || '未具名弟子';
    const { stem, branch } = getYearStemBranch(lunarYear);
    const newRecord: PersonnelRecord = {
      ...result,
      id: Date.now().toString(),
      name,
      lunarInfo: `民國 ${lunarYear}年 (${stem}${branch}) ${lunarMonth}月${lunarDay}日 ${hourBranch}時`
    };
    const updated = [...personnel, newRecord];
    setPersonnel(updated);
    localStorage.setItem('ordination_personnel', JSON.stringify(updated));
    alert(`${name} 已正式錄入天師府清冊。`);
  };

  const deleteRecord = (id: string) => {
    if (window.confirm('確定要從清冊中移除此位弟子嗎？')) {
      const updated = personnel.filter(p => p.id !== id);
      setPersonnel(updated);
      localStorage.setItem('ordination_personnel', JSON.stringify(updated));
    }
  };

  const getPureOffice = () => {
    if (!result) return "";
    const lines = result.office.split('\n');
    const fuGong = lines[1]?.replace('一執「', '').replace('」、掌「', '').replace('」', '') || "";
    const si = lines[2]?.split('及')[0]?.replace('一兼領「', '').replace('」', '').trim() || "";
    return `${fuGong}，兼領${si}及「${result.quanName}」`;
  };

  const getReportingText = () => {
    if (!result) return "";
    const name = discipleName.trim() || "[姓名]";
    const office = getPureOffice();
    const marshals = `${result.marshal}及心恩主將${result.heartMarshal}`;
    
    if (ritualType === 'combat') {
      return `嗣漢天師府門下受籙弟子 ${name}，現授「${result.title}」，職司「${office}」，領「${marshals}」麾下「${result.soldiers}」兵馬。奉道旨令，斬妖除邪，催罡敕法，急急如律令！`;
    }
    
    return `嗣漢天師府門下受籙弟子 ${name}，現授「${result.title}」，職司「${office}」，領「${marshals}」麾下「${result.soldiers}」兵馬。茲以此香，啟奏上聖，恭行科事，祈恩賜福。`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#fdfaf2] pb-12 text-stone-900">
      <nav className="w-full bg-[#7a0000] text-white py-4 px-6 md:px-12 flex justify-between items-center shadow-xl z-20 sticky top-0">
        <div className="flex flex-col">
          <span className="text-sm md:text-base font-bold tracking-widest text-[#fdfaf2] opacity-90">龍虎山正一</span>
          <h1 className="text-base md:text-xl font-calligraphy tracking-widest text-[#fdfaf2] -mt-1">授籙管理系統</h1>
          <span className="text-[8px] opacity-50 tracking-tighter uppercase font-sans">LONGHU MANSION MANAGEMENT</span>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setView('generate')} className={`px-3 py-2 rounded-lg font-bold transition-all text-[10px] md:text-xs ${view === 'generate' ? 'bg-[#fdfaf2] text-[#7a0000] shadow-md' : 'hover:bg-red-800'}`}>錄籍查詢</button>
          <button onClick={() => setView('list')} className={`px-3 py-2 rounded-lg font-bold transition-all text-[10px] md:text-xs ${view === 'list' ? 'bg-[#fdfaf2] text-[#7a0000] shadow-md' : 'hover:bg-red-800'}`}>清冊管理 ({personnel.length})</button>
        </div>
      </nav>

      {view === 'generate' ? (
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-t-8 border-[#7a0000] sticky top-24">
              <h2 className="text-xl md:text-2xl font-bold text-red-950 mb-6 border-b-2 border-red-50 pb-4 font-serif flex items-center">
                <span className="mr-3 text-2xl">🖋️</span>弟子生辰錄入
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest">弟子姓名</label>
                  <input placeholder="請輸入弟子姓名" value={discipleName} onChange={e => setDiscipleName(e.target.value)} className="w-full border-2 border-stone-200 rounded-xl py-3 px-4 focus:border-red-800 focus:ring-1 focus:ring-red-800 outline-none text-lg bg-white text-stone-900 transition-all font-bold" />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest">農曆年份 (民國)</label>
                    <select value={lunarYear} onChange={e => setLunarYear(parseInt(e.target.value))} className="w-full border-2 border-stone-200 rounded-xl py-3 px-4 bg-white text-lg font-bold text-red-950 outline-none focus:border-red-800 transition-all appearance-auto">
                      {yearOptions.map(y => (
                        <option key={y} value={y} className="text-stone-900">民國 {y} 年 ({getYearStemBranch(y).stem}{getYearStemBranch(y).branch}年)</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest">月份</label>
                      <select value={lunarMonth} onChange={e => setLunarMonth(parseInt(e.target.value))} className="w-full border-2 border-stone-200 rounded-xl py-3 text-center font-bold text-red-950 bg-white focus:border-red-800 outline-none appearance-auto">
                        {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}月</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest">日期</label>
                      <select value={lunarDay} onChange={e => setLunarDay(parseInt(e.target.value))} className="w-full border-2 border-stone-200 rounded-xl py-3 text-center font-bold text-red-950 bg-white focus:border-red-800 outline-none appearance-auto">
                        {Array.from({length:30},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}日</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest">時辰</label>
                    <select value={hourBranch} onChange={e => setHourBranch(e.target.value as EarthlyBranch)} className="w-full border-2 border-stone-200 rounded-xl py-3 text-center font-bold text-red-950 bg-white focus:border-red-800 outline-none appearance-auto">
                      {BRANCHES.map(b => <option key={b} value={b}>{b}時</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>setGender('男')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm ${gender==='男'?'bg-red-950 text-white shadow-md':'bg-stone-100 text-stone-400 border border-stone-200'}`}>乾造 (男)</button>
                  <button onClick={()=>setGender('女')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm ${gender==='女'?'bg-red-950 text-white shadow-md':'bg-stone-100 text-stone-400 border border-stone-200'}`}>坤造 (女)</button>
                </div>
                <div className="pt-2 space-y-3">
                  <button onClick={handleSearch} className="w-full bg-[#7a0000] text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-red-800 active:scale-95 transition-all text-lg tracking-widest">生成職牒</button>
                  {result && (
                    <button onClick={saveDisciple} className="w-full border-2 border-red-900 text-red-900 py-3 rounded-2xl font-bold hover:bg-red-50 transition-all text-sm flex items-center justify-center gap-2">
                      <span>💾</span> 將弟子登錄清冊
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {result ? (
              <>
                <div className="tao-scroll p-6 md:p-12 border-[12px] md:border-[20px] border-double border-[#5c2e14] rounded-sm shadow-2xl bg-[#fffef7] relative animate-in fade-in zoom-in-95 duration-700 overflow-hidden">
                  <div className="absolute top-4 left-4 border border-red-900/10 w-[calc(100%-32px)] h-[calc(100%-32px)] pointer-events-none"></div>
                  <div className="relative z-10 font-serif">
                    <div className="text-center mb-10 md:mb-16">
                      <h3 className="text-5xl md:text-8xl font-calligraphy text-[#4a0000]">授 籙 職 牒</h3>
                    </div>
                    <div className="space-y-8 md:space-y-12 text-stone-900">
                      <div className="border-b border-stone-200 pb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row md:items-center">
                          <span className="bg-[#7a0000] text-white px-4 py-1.5 text-xs font-bold md:mr-8 mb-3 md:mb-0 shadow-lg rounded-r-lg">法 銜 職 級</span>
                          <span className="text-3xl md:text-6xl font-bold text-red-950 tracking-widest">{result.title}</span>
                        </div>
                        {discipleName && (
                          <div className="text-center md:text-right">
                            <span className="text-stone-400 text-[10px] block font-bold mb-1">正一弟子</span>
                            <span className="text-2xl md:text-4xl font-calligraphy text-red-900 border-b-2 border-red-100 px-4">{discipleName}</span>
                          </div>
                        )}
                      </div>
                      <div className="bg-[#fcf8ed] p-6 md:p-10 border-l-[8px] md:border-l-[15px] border-red-900 rounded-r-2xl shadow-inner relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 text-[8rem] md:text-[12rem] text-red-900/5 font-calligraphy rotate-12 pointer-events-none">籙</div>
                        <p className="text-xl md:text-3xl font-bold text-red-950 leading-[1.8] md:leading-[2.2] whitespace-pre-line font-serif">{result.office}</p>
                        <div className="mt-4 p-4 bg-white/60 rounded-xl border border-red-900/10">
                           <p className="text-red-950 font-bold text-xs md:text-sm mb-1">職能特性：</p>
                           <p className="text-stone-600 text-xs md:text-sm italic">{result.quanDesc}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 md:gap-8 py-8 border-y border-stone-200">
                        <div className="text-center border-r border-stone-100 px-2">
                          <p className="text-[10px] md:text-xs font-bold text-stone-400 mb-3 tracking-[0.4em]">奏 立 壇 號</p>
                          <p className="text-2xl md:text-5xl text-red-950 font-bold font-calligraphy">{result.tan}</p>
                        </div>
                        <div className="text-center px-2">
                          <p className="text-[10px] md:text-xs font-bold text-stone-400 mb-3 tracking-[0.4em]">所 屬 靖 號</p>
                          <p className="text-2xl md:text-5xl text-red-950 font-bold font-calligraphy">{result.jing}</p>
                        </div>
                      </div>

                      <div className="p-8 md:p-12 bg-gradient-to-br from-red-50 to-white border-2 border-red-900/20 rounded-[2.5rem] shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2.5 h-full bg-red-900"></div>
                        <div className="flex flex-col items-center justify-center relative z-10 py-2">
                          <h4 className="text-red-900 font-bold mb-6 flex items-center justify-center text-xs md:text-sm tracking-[0.5em] uppercase opacity-50">
                            <span className="mr-4 text-3xl">⚔️</span> 撥發召請元帥與兵馬
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                            <div className="text-center">
                              <p className="text-stone-400 text-[10px] font-bold mb-2 tracking-widest">本命主將 (天干)</p>
                              <p className="text-2xl md:text-4xl font-bold text-red-950 font-calligraphy">{result.marshal}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-stone-400 text-[10px] font-bold mb-2 tracking-widest">心恩主將 (地支)</p>
                              <p className="text-2xl md:text-4xl font-bold text-red-950 font-calligraphy">{result.heartMarshal}</p>
                            </div>
                          </div>
                          <div className="mt-8 flex flex-col items-center">
                            <div className="bg-red-900 text-white px-8 py-3 rounded-full shadow-xl mb-3 flex items-center gap-3 animate-pulse">
                              <span className="text-xs opacity-60 font-serif">撥發兵馬</span>
                              <span className="text-2xl md:text-4xl font-bold font-calligraphy">{result.soldiers}</span>
                            </div>
                            <p className="text-stone-400 text-[10px] md:text-xs font-bold tracking-[0.6em] opacity-60 uppercase">依照《天壇玉格》與時辰法格撥發</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 md:p-10 border-2 border-stone-100 rounded-3xl bg-stone-50/50">
                        <h5 className="text-center text-stone-400 font-bold text-[10px] tracking-[0.5em] mb-6 uppercase">張 天 師 三 十 六 員 天 將 參 隨</h5>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-y-3 gap-x-1">
                          {CELESTIAL_GENERALS.map((g, idx) => (
                            <div key={idx} className="text-center">
                              <span className="text-[10px] md:text-xs font-serif text-stone-400 font-bold hover:text-red-900 transition-colors cursor-default">{g}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-center text-[8px] text-stone-300 mt-6 font-serif italic">※ 依據《新刊天壇玉格》第九頁完整錄入</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between bg-white/50 p-4 md:p-6 rounded-xl border border-stone-100 shadow-sm">
                          <span className="text-stone-400 font-bold text-[10px] md:text-xs tracking-widest uppercase">受 治 名 稱</span>
                          <span className="text-lg md:text-2xl font-bold text-stone-800">{result.governance.split('係')[0]}</span>
                        </div>
                        <div className="flex items-center justify-between bg-white/50 p-4 md:p-6 rounded-xl border border-stone-100 shadow-sm">
                          <span className="text-stone-400 font-bold text-[10px] md:text-xs tracking-widest uppercase">領 座 仙 官</span>
                          <span className="text-lg md:text-2xl font-bold text-stone-800">{result.deity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-16 md:mt-24 flex justify-between items-end">
                      <div className="text-[8px] md:text-[10px] font-bold tracking-tighter text-stone-300">TIAN TAN YU GE STANDARD ARCHIVE<br/>LUNGHU MANSION RECORD OFFICE</div>
                      <div className="w-20 h-20 md:w-28 md:h-28 border-4 border-red-900/50 flex items-center justify-center font-bold text-red-900 text-xs md:text-sm text-center border-double rotate-12 shadow-md bg-white">天師府<br/>錄籍印</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border-l-[12px] border-red-900 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl md:text-3xl">⚡</span>
                        <h4 className="text-xl md:text-2xl font-serif font-bold text-red-900">行法申報範式 (時辰職權校對)</h4>
                      </div>
                      <div className="flex p-1 bg-stone-100 rounded-xl w-fit">
                        <button onClick={() => setRitualType('general')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${ritualType === 'general' ? 'bg-white text-red-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>一般科儀 (祈福)</button>
                        <button onClick={() => setRitualType('combat')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${ritualType === 'combat' ? 'bg-[#7a0000] text-white shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>驅邪殺罰 (制煞)</button>
                      </div>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(getReportingText()); alert("報號文字已複製。"); }} className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-900 px-6 py-2.5 rounded-full text-xs font-bold transition-all border border-red-100 shadow-sm active:scale-95"><span>📋</span> 複製報號文字</button>
                  </div>
                  <div className={`p-6 md:p-10 rounded-2xl border transition-all duration-500 relative group overflow-hidden ${ritualType === 'combat' ? 'bg-red-50/50 border-red-200' : 'bg-stone-50 border-stone-100'}`}>
                    <div className={`absolute top-0 right-0 p-4 opacity-[0.05] text-7xl font-calligraphy pointer-events-none transition-all ${ritualType === 'combat' ? 'text-red-900' : 'text-stone-900'}`}>{ritualType === 'combat' ? '敕' : '奏'}</div>
                    <p className="text-xl md:text-3xl text-stone-800 font-serif leading-relaxed md:leading-loose tracking-wider relative z-10">
                      「嗣漢天師府門下受籙弟子 <span className="text-red-950 font-bold border-b-2 border-red-200 px-2">{discipleName || "[姓名]"}</span>，
                      現授<span className="text-red-950 font-bold">「{result.title}」</span>，
                      職司<span className="text-red-950 font-bold">「{getPureOffice()}」</span>，
                      領<span className="text-red-950 font-bold">「{result.marshal}及心恩主將{result.heartMarshal}」</span>麾下<span className="text-red-900 font-bold underline decoration-dotted">「{result.soldiers}」</span>兵馬。
                      {ritualType === 'combat' ? (
                        <span className="text-red-900 font-bold">奉道旨令，斬妖除邪，催罡敕法，急急如律令！</span>
                      ) : (
                        <span>茲以此香，啟奏上聖，恭行科事，祈恩賜福。</span>
                      )}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full min-h-[500px] md:min-h-[700px] flex flex-col items-center justify-center border-4 md:border-8 border-dashed border-stone-200 rounded-[2rem] md:rounded-[3rem] bg-white/50 p-10 md:p-20 text-stone-300">
                <span className="text-6xl md:text-[10rem] mb-6 md:mb-10 opacity-10 animate-pulse">📜</span>
                <p className="text-2xl md:text-4xl font-calligraphy tracking-[0.5em] mb-4">靜 候 錄 籍</p>
                <p className="text-stone-400 text-sm md:text-base italic text-center">請於左側輸入弟子生辰資料後點擊生成職牒</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-7xl p-4 md:p-12 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
            <div className="p-6 md:p-8 bg-stone-50 border-b flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl">🗃️</span>
                <h2 className="text-2xl md:text-3xl font-bold text-red-950 font-serif">天師府授籙弟子清冊</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-stone-50 text-stone-400 uppercase font-bold text-[10px] tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-4">弟子姓名</th>
                    <th className="px-6 py-4">生辰八字</th>
                    <th className="px-6 py-4">法銜職級</th>
                    <th className="px-6 py-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {personnel.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-24 text-center text-stone-300"><p className="text-3xl mb-4">🏮</p><p className="font-serif italic text-lg">清冊目前尚無登記人員。</p></td></tr>
                  ) : (
                    personnel.map(p => (
                      <tr key={p.id} className="hover:bg-red-50/20 transition-all group">
                        <td className="px-6 py-5 font-bold text-red-950 text-lg">{p.name}</td>
                        <td className="px-6 py-5 text-xs text-stone-500">{p.lunarInfo}</td>
                        <td className="px-6 py-5">
                          <span className="font-serif font-bold text-stone-800 bg-stone-100 px-3 py-1 rounded text-xs">{p.title}</span>
                          <div className="text-[10px] text-stone-400 mt-1">{p.tan} / {p.marshal}</div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button onClick={() => { setView('generate'); setResult(p); setDiscipleName(p.name); }} className="bg-red-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-800 shadow-sm transition-all active:scale-95">檢視職牒</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <footer className="mt-16 text-stone-400 text-[10px] text-center w-full max-w-4xl border-t border-stone-200 pt-8 opacity-60 px-6">
        <p className="tracking-widest font-bold mb-2 uppercase">LONGHU ARCHIVE RECORD OFFICE</p>
        <p>江西龍虎山正一派法務委員會 · 錄籍處 · 依據《天壇玉格》與古法規範製作</p>
      </footer>
    </div>
  );
};

export default App;
