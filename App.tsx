
import React, { useState, useCallback, useEffect } from 'react';
import { HeavenlyStem, EarthlyBranch, PersonnelRecord, OrdinationLevel } from './types.ts';
import { BRANCHES, CELESTIAL_GENERALS } from './constants.tsx';
import { calculateOrdination, getYearStemBranch } from './utils.ts';

const App: React.FC = () => {
  const [lunarYear, setLunarYear] = useState<number>(114); 
  const [lunarMonth, setLunarMonth] = useState<number>(4);
  const [lunarDay, setLunarDay] = useState<number>(10);
  const [hourBranch, setHourBranch] = useState<EarthlyBranch>('申');
  const [ordLevel, setOrdLevel] = useState<OrdinationLevel>('初授');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [discipleName, setDiscipleName] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);
  const [personnel, setPersonnel] = useState<PersonnelRecord[]>([]);
  const [view, setView] = useState<'generate' | 'list'>('generate');
  const [ritualType, setRitualType] = useState<'general' | 'combat'>('general');

  useEffect(() => {
    const saved = localStorage.getItem('ordination_personnel');
    if (saved) setPersonnel(JSON.parse(saved));
  }, []);

  const handleSearch = useCallback(() => {
    const { stem, branch } = getYearStemBranch(lunarYear);
    const data = calculateOrdination(stem, branch, lunarMonth, lunarDay, hourBranch, gender, ordLevel);
    setResult(data);
  }, [lunarYear, lunarMonth, lunarDay, hourBranch, gender, ordLevel]);

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

  const getPureOffice = () => {
    if (!result) return "";
    const lines = result.office.split('\n');
    const fuGong = lines[1]?.replace('一執「', '').replace('」、掌「', '').replace('」', '') || "";
    const si = lines[2]?.split('及')[0]?.replace('一兼領「', '').replace('」', '').trim() || "";
    const auth = lines[2]?.split('及')[1]?.replace('「', '').replace('」', '').trim() || "";
    return `${fuGong}，兼領${si}及「${auth}」`;
  };

  const getReportingText = () => {
    if (!result) return "";
    const name = discipleName.trim() || "[姓名]";
    const office = getPureOffice();
    const marshals = `${result.marshal}及心恩主將${result.heartMarshal}`;
    
    if (ritualType === 'combat') {
      return `嗣漢天師府門下 ${result.department} 受籙弟子 ${name}，現授「${result.mainJingLu} ${result.title}」，具位「${result.juWei}」，職司「${office}」，領「${marshals}」麾下「${result.soldiers}」兵馬。奉道旨令，斬妖除邪，催罡敕法，急急如律令！`;
    }
    
    return `嗣漢天師府門下 ${result.department} 受籙弟子 ${name}，現授「${result.mainJingLu} ${result.title}」，具位「${result.juWei}」，職司「${office}」，領「${marshals}」麾下「${result.soldiers}」兵馬。茲以此香，啟奏上聖，恭行科事，祈恩賜福。`;
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
                  <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest uppercase">受籙級別 (決定院司)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['初授', '加授', '晉授'] as OrdinationLevel[]).map(lvl => (
                      <button key={lvl} onClick={() => setOrdLevel(lvl)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${ordLevel === lvl ? 'bg-red-900 text-white border-red-900 shadow-sm' : 'bg-stone-50 text-stone-400 border-stone-200'}`}>{lvl}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest uppercase">弟子姓名</label>
                  <input placeholder="請輸入弟子姓名" value={discipleName} onChange={e => setDiscipleName(e.target.value)} className="w-full border-2 border-stone-200 rounded-xl py-3 px-4 focus:border-red-800 focus:ring-1 focus:ring-red-800 outline-none text-lg bg-white text-stone-900 transition-all font-bold" />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest uppercase text-stone-400">農曆年命 (民國年份)</label>
                    <select value={lunarYear} onChange={e => setLunarYear(parseInt(e.target.value))} className="w-full border-2 border-stone-200 rounded-xl py-3 px-4 bg-white text-lg font-bold text-red-950 outline-none focus:border-red-800 transition-all appearance-auto">
                      {Array.from({ length: 120 }, (_, i) => i + 1).map(y => (
                        <option key={y} value={y} className="text-stone-900">民國 {y} 年 ({getYearStemBranch(y).stem}{getYearStemBranch(y).branch}年)</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest uppercase">月份</label>
                      <select value={lunarMonth} onChange={e => setLunarMonth(parseInt(e.target.value))} className="w-full border-2 border-stone-200 rounded-xl py-3 text-center font-bold text-red-950 bg-white focus:border-red-800 outline-none appearance-auto">
                        {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}月</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest uppercase">日期</label>
                      <select value={lunarDay} onChange={e => setLunarDay(parseInt(e.target.value))} className="w-full border-2 border-stone-200 rounded-xl py-3 text-center font-bold text-red-950 bg-white focus:border-red-800 outline-none appearance-auto">
                        {Array.from({length:30},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}日</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest uppercase">時辰 (職司與權責)</label>
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
                  
                  {/* 部門院司大標印 */}
                  <div className={`absolute top-0 right-12 w-16 md:w-24 text-center py-6 text-white font-bold text-xs md:text-sm shadow-xl z-20 ${result.department === '雷霆都司' ? 'bg-[#4a0000]' : 'bg-[#003300]'}`}>
                    <div className="writing-mode-vertical tracking-[0.8em] py-2 mx-auto font-serif">{result.department}</div>
                  </div>

                  <div className="relative z-10 font-serif">
                    <div className="text-center mb-10 md:mb-16">
                      <h3 className="text-5xl md:text-8xl font-calligraphy text-[#4a0000] tracking-widest">授 籙 職 牒</h3>
                      <p className="text-[10px] text-stone-400 font-bold tracking-widest mt-2 uppercase tracking-[0.3em]">乙巳年 正一授籙職銜彙編標準</p>
                    </div>
                    
                    <div className="space-y-8 md:space-y-12 text-stone-900">
                      <div className="border-b-2 border-red-900/10 pb-10 flex flex-col items-center gap-6">
                        <div className="flex flex-col items-center">
                          <span className="bg-[#7a0000] text-white px-10 py-2 text-xs font-bold shadow-lg rounded-full mb-6 tracking-[0.4em]">法 銜 職 級</span>
                          <span className="text-2xl md:text-5xl font-bold text-red-950 tracking-[0.2em]">{result.mainJingLu}</span>
                          <span className="text-4xl md:text-7xl font-bold text-red-900 tracking-[0.3em] mt-3">{result.title}</span>
                        </div>
                        {discipleName && (
                          <div className="text-center mt-4">
                            <p className="text-stone-400 text-[10px] font-bold mb-2 tracking-widest uppercase opacity-60">正一盟威位下 <span className="text-red-900">{result.juWei}</span></p>
                            <span className="text-3xl md:text-6xl font-calligraphy text-red-900 border-b-2 border-red-100 px-16 inline-block">{discipleName}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* 院司系統隸屬展示 */}
                      <div className="flex justify-center -mt-6">
                         <div className={`px-6 py-2 rounded-full text-xs font-bold tracking-[0.6em] border-2 shadow-sm ${result.department === '雷霆都司' ? 'text-red-900 border-red-900/20 bg-red-50' : 'text-green-900 border-green-900/20 bg-green-50'}`}>
                           系 隸 「 {result.department} 」 位 下
                        </div>
                      </div>

                      <div className="bg-[#fcf8ed] p-8 md:p-12 border-l-[10px] md:border-l-[20px] border-red-900 rounded-r-3xl shadow-inner relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 text-[10rem] md:text-[15rem] text-red-900/5 font-calligraphy rotate-12 pointer-events-none">籙</div>
                        <p className="text-xl md:text-3xl font-bold text-red-950 leading-[2.2] md:leading-[2.8] whitespace-pre-line font-serif">{result.office}</p>
                      </div>

                      <div className="p-10 md:p-16 bg-gradient-to-br from-red-50 to-white border-2 border-red-900/20 rounded-[3rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-3 h-full bg-red-900"></div>
                        <div className="flex flex-col items-center justify-center relative z-10 py-2">
                          <h4 className="text-red-900 font-bold mb-10 flex items-center justify-center text-xs md:text-sm tracking-[0.8em] uppercase opacity-50">
                            <span className="mr-6 text-4xl">⚔️</span> {result.department} 撥發元帥
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full mb-10">
                            <div className="text-center p-6 bg-white/50 rounded-[2rem] border border-red-900/10 shadow-sm">
                              <p className="text-stone-400 text-[10px] font-bold mb-4 tracking-widest uppercase">本命主將 (2025年命天干)</p>
                              <p className="text-xl md:text-3xl font-bold text-red-950 font-serif leading-relaxed">{result.marshal}</p>
                            </div>
                            <div className="text-center p-6 bg-white/50 rounded-[2rem] border border-red-900/10 shadow-sm">
                              <p className="text-stone-400 text-[10px] font-bold mb-4 tracking-widest uppercase">心恩主將 (2025年命地支)</p>
                              <p className="text-xl md:text-3xl font-bold text-red-950 font-serif leading-relaxed">{result.heartMarshal}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="bg-red-900 text-white px-12 py-5 rounded-full shadow-2xl mb-5 flex items-center gap-6 animate-pulse">
                              <span className="text-sm opacity-60 font-serif tracking-[0.2em]">天壇玉格撥發兵馬</span>
                              <span className="text-2xl md:text-5xl font-bold font-calligraphy">{result.soldiers}</span>
                            </div>
                            <p className="text-stone-400 text-[10px] md:text-xs font-bold tracking-[0.8em] opacity-60 uppercase">歸 隸 {result.department} 統 轄 錄 籍</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 md:p-12 border-2 border-stone-100 rounded-[2.5rem] bg-stone-50/50">
                        <h5 className="text-center text-stone-400 font-bold text-[10px] tracking-[0.6em] mb-10 uppercase">張 天 師 三 十 六 員 天 將 參 隨 (2025 彙編核校)</h5>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-y-5 gap-x-2">
                          {CELESTIAL_GENERALS.map((g, idx) => (
                            <div key={idx} className="text-center">
                              <span className="text-[10px] md:text-base font-serif text-stone-500 font-bold hover:text-red-900 transition-colors cursor-default">{g}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-l-[15px] border-red-900 animate-in slide-in-from-bottom-6 duration-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-8">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl md:text-4xl animate-bounce">⚡</span>
                        <h4 className="text-2xl md:text-3xl font-serif font-bold text-red-900">行法報號申報範式 (2025 院司校對版)</h4>
                      </div>
                      <p className="text-stone-400 text-xs font-bold tracking-widest italic ml-12">請於法事中依照下文朗讀以策役兵馬</p>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(getReportingText()); alert("報號文字已複製。"); }} className="flex items-center justify-center gap-3 bg-red-900 hover:bg-red-800 text-white px-8 py-3 rounded-full text-sm font-bold transition-all shadow-lg active:scale-95"><span>📋</span> 複製報號文字</button>
                  </div>
                  <div className={`p-8 md:p-12 rounded-[2rem] border-2 transition-all duration-700 relative group overflow-hidden ${ritualType === 'combat' ? 'bg-red-50/50 border-red-200' : 'bg-stone-50 border-stone-100'}`}>
                    <div className="absolute top-4 right-6 p-4 opacity-[0.03] text-9xl font-calligraphy pointer-events-none transition-all">{result.department === '雷霆都司' ? '雷' : '院'}</div>
                    <p className="text-xl md:text-4xl text-stone-800 font-serif leading-relaxed md:leading-[2.8] tracking-widest relative z-10 whitespace-normal text-justify">
                      「嗣漢天師府門下 <span className="text-red-900 font-bold border-b-2 border-red-900/20">{result.department}</span> 受籙弟子 <span className="text-red-950 font-black border-b-4 border-red-200 px-3">{discipleName || "[姓名]"}</span>，
                      現授<span className="text-red-950 font-bold">「{result.mainJingLu} {result.title}」</span>，
                      具位<span className="text-red-950 font-bold">「{result.juWei}」</span>，
                      職司<span className="text-red-950 font-bold">「{getPureOffice()}」</span>，
                      領<span className="text-red-950 font-bold">「{result.marshal} 及 心恩主將 {result.heartMarshal}」</span>麾下<span className="text-red-900 font-bold underline decoration-wavy decoration-red-200">「{result.soldiers}」</span>兵馬。
                      {ritualType === 'combat' ? (
                        <span className="text-red-900 font-black block mt-6">奉道旨令，斬妖除邪，催罡敕法，急急如律令！</span>
                      ) : (
                        <span className="block mt-6">茲以此香，啟奏上聖，恭行科事，祈恩賜福。</span>
                      )}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full min-h-[600px] md:min-h-[800px] flex flex-col items-center justify-center border-4 md:border-8 border-dashed border-stone-200 rounded-[3rem] bg-white/50 p-12 md:p-24 text-stone-300">
                <span className="text-7xl md:text-[12rem] mb-8 md:mb-12 opacity-10 animate-pulse">📜</span>
                <p className="text-3xl md:text-5xl font-calligraphy tracking-[0.8em] mb-6">錄 籍 待 命</p>
                <p className="text-stone-400 text-base md:text-xl italic text-center tracking-[0.2em]">請輸入弟子生辰，系統將依 2025 彙編分析歸屬「雷霆都司」或「九天風火院」。</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-7xl p-6 md:p-12 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-200">
            <div className="p-8 md:p-12 bg-stone-50 border-b flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                <span className="text-3xl md:text-4xl">🗃️</span>
                <h2 className="text-3xl md:text-4xl font-bold text-red-950 font-serif tracking-widest">天師府錄籍弟子清冊 (2025 乙巳年)</h2>
              </div>
              <div className="text-stone-400 font-bold text-xs tracking-widest uppercase">Current Count: {personnel.length}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead className="bg-stone-50 text-stone-400 uppercase font-bold text-[10px] tracking-widest border-b">
                  <tr>
                    <th className="px-8 py-6">弟子姓名</th>
                    <th className="px-8 py-6">院司歸屬</th>
                    <th className="px-8 py-6">生辰年命</th>
                    <th className="px-8 py-6">法銜與主將</th>
                    <th className="px-8 py-6 text-right">管理操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {personnel.length === 0 ? (
                    <tr><td colSpan={5} className="px-8 py-32 text-center text-stone-300"><p className="text-5xl mb-6 opacity-20">🏮</p><p className="font-serif italic text-xl tracking-widest">清冊目前尚無登記人員，請先進行錄籍查詢。</p></td></tr>
                  ) : (
                    personnel.map(p => (
                      <tr key={p.id} className="hover:bg-red-50/30 transition-all group">
                        <td className="px-8 py-8 font-bold text-red-950 text-2xl font-serif">{p.name}</td>
                        <td className="px-8 py-8">
                           <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest ${p.department === '雷霆都司' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'}`}>{p.department}</span>
                        </td>
                        <td className="px-8 py-8 text-xs text-stone-500 font-bold whitespace-nowrap">{p.lunarInfo}</td>
                        <td className="px-8 py-8">
                          <span className="font-serif font-bold text-stone-800 bg-stone-100 px-4 py-1.5 rounded-lg text-xs inline-block mb-1">{p.mainJingLu}</span>
                          <div className="text-[10px] text-stone-400 font-bold tracking-tighter uppercase">{p.marshal} / {p.soldiers}</div>
                        </td>
                        <td className="px-8 py-8 text-right whitespace-nowrap">
                          <button onClick={() => { setView('generate'); setResult(p); setDiscipleName(p.name); setOrdLevel(p.level); }} className="bg-red-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-red-800 shadow-lg transition-all active:scale-95 tracking-widest">檢視職牒</button>
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
      
      <footer className="mt-24 text-stone-400 text-[10px] md:text-xs text-center w-full max-w-5xl border-t border-stone-200 pt-10 opacity-60 px-8">
        <p className="tracking-[0.8em] font-bold mb-4 uppercase">LONGHU ARCHIVE RECORD OFFICE · EST. 2025</p>
        <p className="leading-relaxed">江西龍虎山正一派法務委員會 · 錄籍處 · 依據《2025年職銜彙編》規範製作<br/>版權所有，僅供嗣漢天師府門下弟子授籙錄籍管理使用。</p>
      </footer>
    </div>
  );
};

export default App;
