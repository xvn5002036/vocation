import { useCallback,useEffect,useMemo,useState } from 'react';
import { EarthlyBranch,JadeRegistryResult,PersonnelRecord } from '../types.ts';
import { calculateJadeRegistry,getLunarMonthDays,getLunarYearInfo } from '../utils.ts';

export type View='generate'|'list';
export type Notice={message:string;kind:'success'|'error'}|null;
const STORAGE_KEY='shenxiao_bazi_registry_v3';

export function useOrdinationManager(){
  const [rocYear,setRocYear]=useState(76);
  const [lunarMonth,setLunarMonth]=useState(4);
  const [lunarDay,setLunarDay]=useState(10);
  const [isLeapMonth,setIsLeapMonth]=useState(false);
  const [hourBranch,setHourBranch]=useState<EarthlyBranch>('申');
  const [discipleName,setDiscipleName]=useState('');
  const [result,setResult]=useState<JadeRegistryResult|null>(null);
  const [personnel,setPersonnel]=useState<PersonnelRecord[]>([]);
  const [view,setView]=useState<View>('generate');
  const [notice,setNotice]=useState<Notice>(null);
  const [query,setQuery]=useState('');
  const lunarYearInfo=useMemo(()=>getLunarYearInfo(rocYear),[rocYear]);
  const monthDays=useMemo(()=>getLunarMonthDays(rocYear,lunarMonth,isLeapMonth),[rocYear,lunarMonth,isLeapMonth]);

  useEffect(()=>{if(lunarYearInfo.leapMonth!==lunarMonth&&isLeapMonth)setIsLeapMonth(false);},[lunarYearInfo.leapMonth,lunarMonth,isLeapMonth]);
  useEffect(()=>{if(lunarDay>monthDays)setLunarDay(monthDays);},[lunarDay,monthDays]);
  useEffect(()=>{try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)setPersonnel(JSON.parse(saved));}catch{setNotice({message:'清冊資料讀取失敗',kind:'error'});}},[]);
  useEffect(()=>{if(!notice)return;const timer=window.setTimeout(()=>setNotice(null),2600);return()=>window.clearTimeout(timer);},[notice]);

  const generate=useCallback(()=>{try{setResult(calculateJadeRegistry({rocYear,lunarMonth,lunarDay,isLeapMonth,hourBranch}));setNotice({message:'農曆生日已換算完整四柱',kind:'success'});}catch{setResult(null);setNotice({message:'日期無法換算，請檢查農曆年月日',kind:'error'});}},[rocYear,lunarMonth,lunarDay,isLeapMonth,hourBranch]);
  const persist=(records:PersonnelRecord[])=>{setPersonnel(records);localStorage.setItem(STORAGE_KEY,JSON.stringify(records));};
  const saveDisciple=()=>{if(!result)return;if(!discipleName.trim()){setNotice({message:'請先填寫姓名',kind:'error'});return;}const record:PersonnelRecord={...result,id:`${Date.now()}`,name:discipleName.trim(),lunarInfo:`民國 ${result.rocYear} 年農曆${result.isLeapMonth?'閏':''}${result.lunarMonth} 月 ${result.lunarDay} 日・${result.hourBranch}時`};persist([...personnel,record]);setNotice({message:`${record.name} 已錄入清冊`,kind:'success'});};
  const deletePersonnel=(record:PersonnelRecord)=>{if(!window.confirm(`確定移除「${record.name}」嗎？`))return;persist(personnel.filter(item=>item.id!==record.id));setNotice({message:`${record.name} 已移除`,kind:'success'});};
  const openRecord=(record:PersonnelRecord)=>{setRocYear(record.rocYear);setLunarMonth(record.lunarMonth);setLunarDay(record.lunarDay);setIsLeapMonth(record.isLeapMonth);setHourBranch(record.hourBranch);setDiscipleName(record.name);setResult(record);setView('generate');};
  const filteredPersonnel=useMemo(()=>{const k=query.trim().toLowerCase();if(!k)return personnel;return personnel.filter(x=>[x.name,x.lunarInfo,x.yearAltar.altar,x.yearAltar.jing,x.originPerson.star,x.treasury.treasury,x.heartMarshal,x.daoMaster].some(v=>v.toLowerCase().includes(k)));},[personnel,query]);
  return{rocYear,setRocYear,lunarMonth,setLunarMonth,lunarDay,setLunarDay,isLeapMonth,setIsLeapMonth,hourBranch,setHourBranch,lunarYearInfo,monthDays,discipleName,setDiscipleName,result,personnel,view,setView,notice,query,setQuery,generate,saveDisciple,deletePersonnel,openRecord,filteredPersonnel};
}
export type OrdinationManager=ReturnType<typeof useOrdinationManager>;
