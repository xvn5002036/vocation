import { useCallback, useEffect, useMemo, useState } from 'react';
import { JadeRegistryResult, PersonnelRecord } from '../types.ts';
import { calculateJadeRegistry, getYearStemBranch } from '../utils.ts';

export type View = 'generate' | 'list';
export type Notice = { message: string; kind: 'success' | 'error' } | null;
const STORAGE_KEY = 'shenxiao_jade_registry_v1';

export function useOrdinationManager() {
  const [lunarYear, setLunarYear] = useState(115);
  const [discipleName, setDiscipleName] = useState('');
  const [result, setResult] = useState<JadeRegistryResult | null>(null);
  const [personnel, setPersonnel] = useState<PersonnelRecord[]>([]);
  const [view, setView] = useState<View>('generate');
  const [notice, setNotice] = useState<Notice>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) setPersonnel(JSON.parse(saved)); }
    catch { setNotice({ message: '清冊資料讀取失敗，請重新整理後再試', kind: 'error' }); }
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const yearGanzhi = useMemo(() => getYearStemBranch(lunarYear), [lunarYear]);
  const generate = useCallback(() => {
    if (!Number.isInteger(lunarYear) || lunarYear < 1 || lunarYear > 300) {
      setNotice({ message: '請輸入 1 至 300 的民國年份', kind: 'error' }); return;
    }
    setResult(calculateJadeRegistry(lunarYear));
    setNotice({ message: '本命玉格已依原典生成', kind: 'success' });
  }, [lunarYear]);
  const persist = (records: PersonnelRecord[]) => { setPersonnel(records); localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); };
  const saveDisciple = () => {
    if (!result) return;
    if (!discipleName.trim()) { setNotice({ message: '請先填寫姓名', kind: 'error' }); return; }
    const record: PersonnelRecord = { ...result, id: `${Date.now()}`, name: discipleName.trim(), lunarInfo: `民國 ${result.rocYear} 年・西元 ${result.gregorianYear} 年・${result.ganzhi}` };
    persist([...personnel, record]);
    setNotice({ message: `${record.name} 已錄入清冊`, kind: 'success' });
  };
  const deletePersonnel = (record: PersonnelRecord) => {
    if (!window.confirm(`確定要將「${record.name}」從清冊中移除嗎？`)) return;
    persist(personnel.filter(item => item.id !== record.id));
    setNotice({ message: `${record.name} 已從清冊移除`, kind: 'success' });
  };
  const openRecord = (record: PersonnelRecord) => { setLunarYear(record.rocYear); setDiscipleName(record.name); setResult(record); setView('generate'); };
  const filteredPersonnel = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return personnel;
    return personnel.filter(item => [item.name,item.ganzhi,item.yuan,item.stemJing,item.branchJing,item.ganzhiJing,item.heartMarshal].some(value => value.toLowerCase().includes(keyword)));
  }, [personnel, query]);

  return { lunarYear,setLunarYear,discipleName,setDiscipleName,result,personnel,view,setView,notice,query,setQuery,yearGanzhi,generate,saveDisciple,deletePersonnel,openRecord,filteredPersonnel };
}
export type OrdinationManager = ReturnType<typeof useOrdinationManager>;
