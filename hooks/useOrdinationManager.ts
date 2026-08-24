import { useCallback,useEffect,useMemo,useState } from 'react';
import { JadeRegistryResult,PersonnelRecord } from '../types.ts';
import { calculateJadeRegistry } from '../utils.ts';
export type View='generate'|'list'; export type Notice={message:string;kind:'success'|'error'}|null;
const STORAGE_KEY='shenxiao_bazi_registry_v2';
export function useOrdinationManager(){
  const [yearPillar,setYearPillar]=useState('乙巳'); const [monthPillar,setMonthPillar]=useState('壬午'); const [dayPillar,setDayPillar]=useState('甲子'); const [hourPillar,setHourPillar]=useState('丙寅');
  const [lunarMonth,setLunarMonth]=useState(1); const [lunarDay,setLunarDay]=useState(1); const [discipleName,setDiscipleName]=useState('');
  const [result,setResult]=useState<JadeRegistryResult|null>(null); const [personnel,setPersonnel]=useState<PersonnelRecord[]>([]); const [view,setView]=useState<View>('generate'); const [notice,setNotice]=useState<Notice>(null); const [query,setQuery]=useState('');
  useEffect(()=>{try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)setPersonnel(JSON.parse(saved));}catch{setNotice({message:'清冊資料讀取失敗',kind:'error'});}},[]);
  useEffect(()=>{if(!notice)return;const timer=window.setTimeout(()=>setNotice(null),2600);return()=>window.clearTimeout(timer);},[notice]);
  const generate=useCallback(()=>{setResult(calculateJadeRegistry({yearPillar,monthPillar,dayPillar,hourPillar,lunarMonth,lunarDay}));setNotice({message:'已依完整四柱查考',kind:'success'});},[yearPillar,monthPillar,dayPillar,hourPillar,lunarMonth,lunarDay]);
  const persist=(records:PersonnelRecord[])=>{setPersonnel(records);localStorage.setItem(STORAGE_KEY,JSON.stringify(records));};
  const saveDisciple=()=>{if(!result)return;if(!discipleName.trim()){setNotice({message:'請先填寫姓名',kind:'error'});return;}const record:PersonnelRecord={...result,id:`${Date.now()}`,name:discipleName.trim(),lunarInfo:`${result.yearPillar}年・${result.monthPillar}月・${result.dayPillar}日・${result.hourPillar}時`};persist([...personnel,record]);setNotice({message:`${record.name} 已錄入清冊`,kind:'success'});};
  const deletePersonnel=(record:PersonnelRecord)=>{if(!window.confirm(`確定移除「${record.name}」嗎？`))return;persist(personnel.filter(item=>item.id!==record.id));setNotice({message:`${record.name} 已移除`,kind:'success'});};
  const openRecord=(record:PersonnelRecord)=>{setYearPillar(record.yearPillar);setMonthPillar(record.monthPillar);setDayPillar(record.dayPillar);setHourPillar(record.hourPillar);setLunarMonth(record.lunarMonth);setLunarDay(record.lunarDay);setDiscipleName(record.name);setResult(record);setView('generate');};
  const filteredPersonnel=useMemo(()=>{const k=query.trim().toLowerCase();if(!k)return personnel;return personnel.filter(x=>[x.name,x.lunarInfo,x.hourAltar.altar,x.hourAltar.jing,x.originPerson.star,x.treasury.treasury,x.heartMarshal,x.daoMaster].some(v=>v.toLowerCase().includes(k)));},[personnel,query]);
  return{yearPillar,setYearPillar,monthPillar,setMonthPillar,dayPillar,setDayPillar,hourPillar,setHourPillar,lunarMonth,setLunarMonth,lunarDay,setLunarDay,discipleName,setDiscipleName,result,personnel,view,setView,notice,query,setQuery,generate,saveDisciple,deletePersonnel,openRecord,filteredPersonnel};
}
export type OrdinationManager=ReturnType<typeof useOrdinationManager>;
