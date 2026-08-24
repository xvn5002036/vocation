import { useCallback, useEffect, useMemo, useState } from 'react';
import { BRANCH_DATA_MAP, HOUR_AUTHORITY_MAP, LEVEL_DATA_MAP, STEM_MARSHAL_CONFIG } from '../constants.tsx';
import { EarthlyBranch, OrdinationLevel, OrdinationResult, PersonnelRecord, Vocation } from '../types.ts';
import { calculateOrdination, getYearStemBranch } from '../utils.ts';

export type View = 'generate' | 'list';
export type Notice = { message: string; kind: 'success' | 'error' } | null;

export function useOrdinationManager() {
  const [lunarYear, setLunarYear] = useState(114);
  const [lunarMonth, setLunarMonth] = useState(4);
  const [lunarDay, setLunarDay] = useState(10);
  const [hourBranch, setHourBranch] = useState<EarthlyBranch>('申');
  const [ordLevel, setOrdLevel] = useState<OrdinationLevel>('初授');
  const [vocation, setVocation] = useState<Vocation>('一般科儀');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [discipleName, setDiscipleName] = useState('');
  const [result, setResult] = useState<OrdinationResult | null>(null);
  const [personnel, setPersonnel] = useState<PersonnelRecord[]>([]);
  const [view, setView] = useState<View>('generate');
  const [reportingMode, setReportingMode] = useState<'general' | 'expel'>('general');
  const [notice, setNotice] = useState<Notice>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ordination_personnel');
      if (saved) setPersonnel(JSON.parse(saved));
    } catch {
      setNotice({ message: '清冊資料讀取失敗，請重新整理後再試', kind: 'error' });
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const yearGanzhi = useMemo(() => getYearStemBranch(lunarYear), [lunarYear]);
  const stemPair = useMemo(() => {
    if (['甲', '乙'].includes(yearGanzhi.stem)) return '甲乙';
    if (['丙', '丁'].includes(yearGanzhi.stem)) return '丙丁';
    if (['戊', '己'].includes(yearGanzhi.stem)) return '戊己';
    if (['庚', '辛'].includes(yearGanzhi.stem)) return '庚辛';
    return '壬癸';
  }, [yearGanzhi]);
  const marshalInfo = STEM_MARSHAL_CONFIG[stemPair];

  const generate = useCallback(() => {
    setResult(calculateOrdination(yearGanzhi.stem, yearGanzhi.branch, lunarMonth, lunarDay, hourBranch, gender, ordLevel, vocation));
    setNotice({ message: '職牒已生成', kind: 'success' });
  }, [yearGanzhi, lunarMonth, lunarDay, hourBranch, gender, ordLevel, vocation]);

  const persist = (records: PersonnelRecord[]) => {
    setPersonnel(records);
    localStorage.setItem('ordination_personnel', JSON.stringify(records));
  };

  const saveDisciple = () => {
    if (!result) return;
    if (!discipleName.trim()) {
      setNotice({ message: '請先填寫弟子姓名', kind: 'error' });
      return;
    }
    const record: PersonnelRecord = {
      ...result, id: `${Date.now()}`, name: discipleName.trim(),
      lunarInfo: `民國 ${lunarYear}年 (${yearGanzhi.stem}${yearGanzhi.branch}) ${lunarMonth}月${lunarDay}日 ${hourBranch}時`
    };
    persist([...personnel, record]);
    setNotice({ message: `${record.name} 已錄入清冊`, kind: 'success' });
  };

  const deletePersonnel = (record: PersonnelRecord) => {
    if (!window.confirm(`確定要將「${record.name}」從清冊中除名嗎？`)) return;
    persist(personnel.filter(item => item.id !== record.id));
    setNotice({ message: `${record.name} 已從清冊移除`, kind: 'success' });
  };

  const openRecord = (record: PersonnelRecord) => {
    const parsed = record.lunarInfo.match(/民國\s*(\d+)年.*?(\d+)月(\d+)日\s*([子丑寅卯辰巳午未申酉戌亥])時/);
    if (parsed) {
      setLunarYear(Number(parsed[1])); setLunarMonth(Number(parsed[2]));
      setLunarDay(Number(parsed[3])); setHourBranch(parsed[4] as EarthlyBranch);
    }
    setGender(record.genderTitle === '淑人' ? '女' : '男');
    setOrdLevel(record.level); setVocation(record.vocation); setDiscipleName(record.name);
    setResult(record); setView('generate');
  };

  const formatMarshalName = (name: string) => name.replace(/.*太保|.*靈官|.*執法|.*上將|.*收怪/g, '');

  const reportingText = useMemo(() => {
    if (!result) return '';
    const level = LEVEL_DATA_MAP[result.level];
    const year = BRANCH_DATA_MAP[yearGanzhi.branch];
    const hour = HOUR_AUTHORITY_MAP[hourBranch];
    const clean = (name: string) => name.replace(/^(上清正乙龍虎執法|地祇主令都巡太保|正乙解厄靈官文魁|地司太歲武光上將|風輪蕩魔收怪滅邪)/, '').replace('元帥', '');
    const marshals = `${clean(result.primaryMarshal)}、${clean(result.secondaryMarshal)}二大元帥`;
    const name = discipleName.trim() || '某某某';
    if (reportingMode === 'general') return `「天師門下，受職${result.genderTitle} ${name}。」\n「一奏受：${level.jingLu}。」\n「職隸：${result.department}，兼領：九天風火院事。」\n「職任：${result.hourVocation}，${level.action}：${year.siPrefix}司事。」\n「特授：${hour.name}。」\n\n「今據（信眾姓名、事由）……仰煩 ${marshals}，部領兵馬，護法延生，紀錄功德。准此便宜行事，符到奉行，急急如律令！」`;
    return `「天師門下，受職${result.genderTitle} ${name}！」\n「職隸：${result.department}，兼領：九天風火院事。」\n「職任：${result.hourVocation}。特授：${hour.name}！」\n\n「今據（邪祟情況、地點）……敕令 ${marshals}，部領風火考召兵馬！捉縛邪精，按律治罪，不許遲延！立候施行！准此便宜行事，疾速奉行，急急如律令！」`;
  }, [result, reportingMode, discipleName, yearGanzhi.branch, hourBranch]);

  const copyReportingText = async () => {
    try { await navigator.clipboard.writeText(reportingText); setNotice({ message: '報號已複製', kind: 'success' }); }
    catch { setNotice({ message: '無法複製，請手動選取文字', kind: 'error' }); }
  };

  const filteredPersonnel = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return personnel;
    return personnel.filter(item => [item.name, item.mainJingLu, item.title, item.hourVocation, item.primaryMarshal, item.secondaryMarshal].some(value => value.toLowerCase().includes(keyword)));
  }, [personnel, query]);

  return {
    lunarYear, setLunarYear, lunarMonth, setLunarMonth, lunarDay, setLunarDay,
    hourBranch, setHourBranch, ordLevel, setOrdLevel, vocation, setVocation,
    gender, setGender, discipleName, setDiscipleName, result, personnel,
    view, setView, reportingMode, setReportingMode, notice, query, setQuery,
    yearGanzhi, stemPair, marshalInfo, generate, saveDisciple, deletePersonnel,
    openRecord, formatMarshalName, reportingText, copyReportingText, filteredPersonnel
  };
}

export type OrdinationManager = ReturnType<typeof useOrdinationManager>;
