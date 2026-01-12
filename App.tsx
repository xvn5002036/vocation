
import React, { useState, useCallback, useEffect } from 'react';
import { HeavenlyStem, EarthlyBranch, PersonnelRecord, OrdinationLevel, Vocation } from './types.ts';
import { BRANCHES, LEVEL_DATA_MAP, BRANCH_DATA_MAP, HOUR_VOCATION_DATA, HOUR_AUTHORITY_MAP, STEM_MARSHAL_CONFIG } from './constants.tsx';
import { calculateOrdination, getYearStemBranch } from './utils.ts';

const App: React.FC = () => {
  const [lunarYear, setLunarYear] = useState<number>(114); 
  const [lunarMonth, setLunarMonth] = useState<number>(4);
  const [lunarDay, setLunarDay] = useState<number>(10);
  const [hourBranch, setHourBranch] = useState<EarthlyBranch>('申');
  const [ordLevel, setOrdLevel] = useState<OrdinationLevel>('初授');
  const [vocation, setVocation] = useState<Vocation>('一般科儀');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [discipleName, setDiscipleName] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);
  const [personnel, setPersonnel] = useState<PersonnelRecord[]>([]);
  const [view, setView] = useState<'generate' | 'list'>('generate');
  const [reportingMode, setReportingMode] = useState<'general' | 'expel'>('general');
  const [copyStatus, setCopyStatus] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('ordination_personnel');
    if (saved) setPersonnel(JSON.parse(saved));
  }, []);

  const handleSearch = useCallback(() => {
    const { stem, branch } = getYearStemBranch(lunarYear);
    const data = calculateOrdination(stem, branch, lunarMonth, lunarDay, hourBranch, gender, ordLevel, vocation);
    setResult(data);
  }, [lunarYear, lunarMonth, lunarDay, hourBranch, gender, ordLevel, vocation]);

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

  const getFullTitle = () => {
    if (!result) return "";
    return `${result.title} ${result.hourVocation} ${result.genderTitle}`;
  };

  const getCleanReportingData = () => {
    if (!result) return null;
    const { branch } = getYearStemBranch(lunarYear);
    const levelData = LEVEL_DATA_MAP[ordLevel];
    const yearData = BRANCH_DATA_MAP[branch];
    const hourData = HOUR_AUTHORITY_MAP[hourBranch];

    const caoSi = `${yearData.siPrefix}司事`;
    const cleanMarshal = (name: string) => {
      return name.replace(/^(上清正乙龍虎執法|地祇主令都巡太保|正乙解厄靈官文魁|地司太歲武光上將|風輪蕩魔收怪滅邪)/, '').replace('元帥', '');
    };
    const marshals = `${cleanMarshal(result.primaryMarshal)}、${cleanMarshal(result.secondaryMarshal)} 二大元帥`;

    return {
      jingLu: levelData.jingLu,
      dept: result.department,
      vocation: result.hourVocation,
      action: levelData.action,
      caoSi: caoSi,
      specialAuth: hourData.name,
      marshals: marshals
    };
  };

  const getReportingText = (mode: 'general' | 'expel') => {
    const data = getCleanReportingData();
    if (!data) return "";
    const name = discipleName.trim() || "某某某";
    const genderTerm = result.genderTitle;

    if (mode === 'general') {
      return `「天師門下，受職${genderTerm} ${name}。」
「一奏受：${data.jingLu}。」
「職隸：${data.dept}，兼領：九天風火院事。」
「職任：${data.vocation}，${data.action}：${data.caoSi}。」
「特授：${data.specialAuth}。」

「今據（信眾姓名、事由）…… 仰煩 ${data.marshals}，部領兵馬，護法延生，紀錄功德。准此便宜行事，符到奉行，急急如律令！」`;
    } else {
      return `「天師門下，受職${genderTerm} ${name}！」
「職隸：${data.dept}。兼領：九天風火院事。」
「職任：${data.vocation}。特授：${data.specialAuth}！」

「今據（邪祟情況、地點）…… 敕令 ${data.marshals}，部領風火考召兵馬！捉縛邪精，按律治罪，不許遲延！立候施行！准此便宜行事，疾速奉行，急急如律令！」`;
    }
  };

  const copyToClipboard = () => {
    const text = getReportingText(reportingMode);
    navigator.clipboard.writeText(text);
    setCopyStatus(true);
    setTimeout(() => {
      setCopyStatus(false);
    }, 3000); 
  };

  const getStemPair = () => {
    const { stem } = getYearStemBranch(lunarYear);
    if (['甲', '乙'].includes(stem)) return '甲乙';
    if (['丙', '丁'].includes(stem)) return '丙丁';
    if (['戊', '己'].includes(stem)) return '戊己';
    if (['庚', '辛'].includes(stem)) return '庚辛';
    if (['壬', '癸'].includes(stem)) return '壬癸';
    return '';
  };

  const stemPair = getStemPair();
  const marshalInfo = STEM_MARSHAL_CONFIG[stemPair];

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#fdfaf2] pb-12 text-stone-900">
      <nav className="w-full bg-[#7a0000] text-white py-4 px-6 md:px-12 flex justify-between items-center shadow-xl z-20 sticky top-0">
        <div className="flex flex-col">
          <span className="text-sm md:text-base font-bold tracking-widest text-[#fdfaf2] opacity-90">龍虎山正一</span>
          <h1 className="text-base md:text-xl font-calligraphy tracking-widest text-[#fdfaf2] -mt-1">授籙管理系統</h1>
          <span className="text-[8px] opacity-50 tracking-tighter uppercase font-sans text-amber-200">LONGHU MANSION MANAGEMENT</span>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setView('generate')} className={`px-3 py-2 rounded-lg font-bold transition-all text-[10px] md:text-xs ${view === 'generate' ? 'bg-[#fdfaf2] text-[#7a0000] shadow-md' : 'hover:bg-red-800'}`}>錄籍查詢</button>
          <button onClick={() => setView('list')} className={`px-3 py-2 rounded-lg font-bold transition-all text-[10px] md:text-xs ${view === 'list' ? 'bg-[#fdfaf2] text-[#7a0000] shadow-md' : 'hover:bg-red-800'}`}>清冊管理 ({personnel.length})</button>
        </div>
      </nav>

      {/* 複製成功提示 (Toast) - 3秒倒數，文字細小精緻 */}
      {copyStatus && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] animate-in fade-in zoom-in duration-300">
          <div className="bg-amber-500 text-stone-950 px-8 py-4 rounded-[1.5rem] shadow-[0_15px_40px_rgba(245,158,11,0.25)] border-2 border-amber-200 font-bold flex flex-col items-center gap-2">
            <span className="text-2xl">🏮</span>
            <span className="text-lg tracking-widest font-serif">已錄入剪貼簿，准此奉行</span>
            <span className="text-[9px] opacity-60 font-sans tracking-tight font-normal">三秒後自動關閉</span>
          </div>
        </div>
      )}

      {view === 'generate' ? (
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-t-8 border-[#7a0000] sticky top-24">
              <h2 className="text-xl md:text-2xl font-bold text-red-950 mb-6 border-b-2 border-red-50 pb-4 font-serif flex items-center">
                <span className="mr-3 text-2xl">🖋️</span>弟子生辰錄入
              </h2>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={()=>setGender('男')} className={`py-3 rounded-xl font-bold transition-all text-sm ${gender==='男'?'bg-red-950 text-white shadow-md':'bg-stone-100 text-stone-400 border border-stone-200'}`}>乾造 (男)</button>
                  <button onClick={()=>setGender('女')} className={`py-3 rounded-xl font-bold transition-all text-sm ${gender==='女'?'bg-red-950 text-white shadow-md':'bg-stone-100 text-stone-400 border border-stone-200'}`}>坤造 (女)</button>
                </div>
                <div>
                  <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest uppercase">受籙級別</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['初授', '加授', '晉授'] as OrdinationLevel[]).map(lvl => (
                      <button key={lvl} onClick={() => setOrdLevel(lvl)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${ordLevel === lvl ? 'bg-red-900 text-white border-red-900 shadow-sm' : 'bg-stone-50 text-stone-400 border-stone-200'}`}>{lvl}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest uppercase">弟子姓名</label>
                  <input placeholder="請輸入弟子姓名" value={discipleName} onChange={e => setDiscipleName(e.target.value)} className="w-full border-2 border-stone-200 rounded-xl py-3 px-4 focus:border-red-800 outline-none text-lg bg-white text-stone-900 transition-all font-bold" />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-stone-500 font-bold mb-1.5 block tracking-widest uppercase">農曆年份</label>
                    <select value={lunarYear} onChange={e => setLunarYear(parseInt(e.target.value))} className="w-full border-2 border-stone-200 rounded-xl py-3 px-4 bg-white text-lg font-bold text-red-950 outline-none focus:border-red-800 transition-all appearance-auto">
                      {Array.from({ length: 120 }, (_, i) => i + 1).map(y => (
                        <option key={y} value={y}>民國 {y} 年 ({getYearStemBranch(y).stem}{getYearStemBranch(y).branch}年)</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><label className="text-[10px] text-stone-500 font-bold mb-1 block">月份</label>
                      <select value={lunarMonth} onChange={e => setLunarMonth(parseInt(e.target.value))} className="w-full border-2 border-stone-200 rounded-xl py-3 text-center font-bold text-red-950 bg-white"><option value={1}>正</option>{[2,3,4,5,6,7,8,9,10,11,12].map(m=><option key={m} value={m}>{m}</option>)}</select>
                    </div>
                    <div><label className="text-[10px] text-stone-500 font-bold mb-1 block">日期</label>
                      <select value={lunarDay} onChange={e => setLunarDay(parseInt(e.target.value))} className="w-full border-2 border-stone-200 rounded-xl py-3 text-center font-bold text-red-950 bg-white">{Array.from({length:30},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}</select>
                    </div>
                    <div><label className="text-[10px] text-stone-500 font-bold mb-1 block">時辰</label>
                      <select value={hourBranch} onChange={e => setHourBranch(e.target.value as EarthlyBranch)} className="w-full border-2 border-stone-200 rounded-xl py-3 text-center font-bold text-red-950 bg-white">{BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}</select>
                    </div>
                  </div>
                </div>
                <div className="pt-2 space-y-3">
                  <button onClick={handleSearch} className="w-full bg-[#7a0000] text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-red-800 active:scale-95 transition-all text-lg tracking-widest">生成職牒</button>
                  {result && (
                    <button onClick={saveDisciple} className="w-full border-2 border-red-900 text-red-900 py-3 rounded-2xl font-bold hover:bg-red-50 transition-all text-sm">錄入清冊</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {result ? (
              <>
                <div className="tao-scroll p-6 md:p-12 border-[12px] md:border-[20px] border-double border-[#5c2e14] rounded-sm shadow-2xl bg-[#fffef7] relative animate-in fade-in zoom-in-95 duration-700 overflow-hidden">
                  <div className="absolute top-4 left-4 border-2 border-red-900/10 w-[calc(100%-32px)] h-[calc(100%-32px)] pointer-events-none rounded-lg"></div>
                  
                  <div className={`absolute top-0 right-12 w-16 md:w-24 text-center py-6 text-white font-bold text-xs md:text-sm shadow-xl z-20 bg-[#4a0000]`}>
                    <div className="writing-mode-vertical tracking-[0.8em] py-2 mx-auto font-serif">雷霆都司</div>
                  </div>

                  <div className="relative z-10 font-serif">
                    <div className="text-center mb-10 md:mb-16">
                      <h3 className="text-5xl md:text-8xl font-calligraphy text-[#4a0000] tracking-widest text-shadow-sm">授 籙 職 牒</h3>
                      <p className="text-stone-400 text-xs mt-4 tracking-[0.3em] font-sans">TIANTAN YUGE CEREMONY SYSTEM</p>
                    </div>
                    
                    <div className="space-y-8 md:space-y-12 text-stone-900">
                      <div className="border-b-4 border-double border-red-900/10 pb-10 flex flex-col items-center gap-6">
                        <div className="flex flex-col items-center">
                          <span className="bg-[#7a0000] text-white px-10 py-2 text-xs font-bold shadow-lg rounded-full mb-6 tracking-[0.4em]">法 銜 職 級</span>
                          <span className="text-2xl md:text-4xl font-bold text-red-950 tracking-[0.1em]">{result.mainJingLu}</span>
                          <span className="text-4xl md:text-7xl font-bold text-red-900 tracking-[0.15em] mt-3">{getFullTitle()}</span>
                        </div>
                        {discipleName && (
                          <div className="text-center mt-4">
                            <p className="text-stone-400 text-[10px] font-bold mb-2 tracking-widest uppercase opacity-60">正一盟威位下 <span className="text-red-900">{result.juWei}</span></p>
                            <span className="text-3xl md:text-6xl font-calligraphy text-red-900 border-b-2 border-red-100 px-16 inline-block">{discipleName}</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-[#fcf8ed] p-8 md:p-12 border-l-[10px] md:border-l-[20px] border-red-900 rounded-r-3xl shadow-inner relative overflow-hidden">
                        <p className="text-xl md:text-3xl font-bold text-red-950 leading-[2.2] md:leading-[2.6] whitespace-pre-line font-serif">{result.office}</p>
                      </div>

                      <div className="p-10 md:p-16 bg-gradient-to-br from-red-50 to-white border-4 border-double border-red-900/20 rounded-[3rem] shadow-xl relative overflow-hidden">
                        <div className="flex flex-col items-center justify-center relative z-10 py-2">
                          <h4 className="text-red-900 font-bold mb-10 flex items-center justify-center text-xs md:text-sm tracking-[0.8em] uppercase opacity-50">⚔️ 策 役 兵 馬 ⚔️</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-10 text-center">
                            <div className="p-6 bg-white/60 rounded-[2rem] border-2 border-amber-600/30 shadow-md">
                              <p className="text-stone-400 text-[10px] font-bold mb-4 tracking-widest uppercase">首席主帥 ({marshalInfo.primaryType})</p>
                              <p className="text-xl md:text-2xl font-bold text-red-950 font-serif leading-relaxed underline decoration-amber-600 decoration-4">{result.primaryMarshal}</p>
                            </div>
                            <div className="p-6 bg-white/30 rounded-[2rem] border border-stone-200">
                              <p className="text-stone-400 text-[10px] font-bold mb-4 tracking-widest uppercase">輔助副帥 ({marshalInfo.secondaryType})</p>
                              <p className="text-lg md:text-xl font-bold text-stone-700 font-serif leading-relaxed">{result.secondaryMarshal}</p>
                            </div>
                          </div>
                          <div className="bg-red-900 text-white px-12 py-5 rounded-full shadow-2xl mb-10 flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-default">
                            <span className="text-xs opacity-60 font-serif tracking-[0.2em]">天壇玉格撥發兵馬</span>
                            <span className="text-2xl md:text-5xl font-bold font-calligraphy">{result.soldiers}</span>
                          </div>

                          {/* 寶誥區塊 */}
                          <div className="w-full pt-6 border-t border-stone-200">
                            <h5 className="text-center text-[#7a0000] font-bold text-xs md:text-sm tracking-[0.5em] mb-8">🏮 聖 號 寶 誥 (志心皈命禮) 🏮</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div className="flex flex-col items-center">
                                <span className="bg-amber-600 text-white px-4 py-1 rounded-full text-[10px] font-bold mb-4">主帥寶誥</span>
                                <div className="writing-mode-vertical-rl text-stone-800 text-lg md:text-xl font-serif leading-loose tracking-[0.3em] h-[400px] mx-auto text-justify">
                                  {result.primaryBaoGao}
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="bg-stone-500 text-white px-4 py-1 rounded-full text-[10px] font-bold mb-4">副帥寶誥</span>
                                <div className="writing-mode-vertical-rl text-stone-600 text-lg md:text-xl font-serif leading-loose tracking-[0.3em] h-[400px] mx-auto text-justify">
                                  {result.secondaryBaoGao}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-t-[10px] border-amber-600 animate-in slide-in-from-bottom-6 duration-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <div className="flex flex-col gap-6 mb-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl text-amber-500">📜</span>
                        <h4 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-widest">行法報號全銜 <span className="text-xs text-amber-600/60 ml-2 font-sans tracking-normal uppercase">《天壇玉格》精確校核</span></h4>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex bg-stone-800 p-1 rounded-2xl">
                          <button onClick={() => setReportingMode('general')} className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${reportingMode === 'general' ? 'bg-white text-stone-900 shadow-xl' : 'text-stone-400 hover:text-stone-200'}`}>🟠 版本一：祈福</button>
                          <button onClick={() => setReportingMode('expel')} className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${reportingMode === 'expel' ? 'bg-red-600 text-white shadow-xl' : 'text-stone-400 hover:text-stone-200'}`}>🔴 版本二：驅邪</button>
                        </div>
                        <button 
                          onClick={copyToClipboard} 
                          className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                          📋 奉旨複製
                        </button>
                      </div>
                    </div>
                    {marshalInfo && (
                      <div className="flex flex-wrap gap-3">
                        <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                          {stemPair}年{marshalInfo.element}命：主帥({marshalInfo.primaryType})、副帥({marshalInfo.secondaryType})
                        </span>
                        <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                          法卷真傳：直轄為主、相生為副
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8 md:p-12 rounded-[2rem] border-2 border-stone-800 bg-[#222] shadow-inner relative z-10">
                    <p className="text-xl md:text-3xl text-stone-200 font-serif leading-relaxed md:leading-[2.8] tracking-widest whitespace-pre-line text-justify italic">
                      {getReportingText(reportingMode)}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center border-4 border-dashed border-stone-200 rounded-[3rem] bg-white/50 p-12 text-stone-300">
                <span className="text-7xl md:text-[12rem] mb-8 opacity-10">📜</span>
                <p className="text-3xl md:text-5xl font-calligraphy tracking-[0.8em] mb-6">錄 籍 待 命</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-7xl p-6 md:p-12">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-200">
            <div className="p-8 bg-stone-50 border-b flex justify-between items-center">
              <h2 className="text-3xl font-bold text-red-950 font-serif tracking-widest">天師府錄籍弟子清冊</h2>
              <span className="bg-red-900 text-white px-4 py-1.5 rounded-full text-xs font-bold">總計 {personnel.length} 名</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-50 text-stone-400 uppercase font-bold text-[10px] tracking-widest border-b">
                  <tr>
                    <th className="px-8 py-6">弟子姓名</th>
                    <th className="px-8 py-6">法銜與職務</th>
                    <th className="px-8 py-6">正式稱謂</th>
                    <th className="px-8 py-6">主帥位次 (同氣/相生)</th>
                    <th className="px-8 py-6 text-right">管理</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {personnel.length === 0 ? (
                    <tr><td colSpan={5} className="px-8 py-32 text-center text-stone-300">清冊目前尚無錄籍人員。</td></tr>
                  ) : (
                    personnel.map(p => (
                      <tr key={p.id} className="hover:bg-red-50/30 transition-all group">
                        <td className="px-8 py-8 font-bold text-red-950 text-2xl font-serif group-hover:translate-x-2 transition-transform">{p.name}</td>
                        <td className="px-8 py-8">
                           <div className="text-xs font-bold text-red-900 mb-1">{p.mainJingLu}</div>
                           <div className="text-sm font-bold text-stone-800">{p.title} {p.hourVocation}</div>
                        </td>
                        <td className="px-8 py-8">
                           <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${p.genderTitle === '淑人' ? 'bg-pink-100 text-pink-900' : 'bg-blue-100 text-blue-900'}`}>{p.genderTitle}</span>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex flex-col gap-1">
                            <span className="font-serif font-bold text-red-800 text-xs">主：{p.primaryMarshal}</span>
                            <span className="font-serif font-bold text-stone-500 text-[10px]">副：{p.secondaryMarshal}</span>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <button onClick={() => { setView('generate'); setResult(p); setDiscipleName(p.name); setOrdLevel(p.level); }} className="bg-red-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-red-800 shadow-md">檢視職牒</button>
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
    </div>
  );
};

export default App;
