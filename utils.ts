import { Lunar, LunarYear } from 'lunar-javascript';
import { BRANCH_ELEMENT, BRANCH_MARSHAL, ELEMENT_MARSHAL, FIVE_SYSTEM_MAP, FULL_MARSHAL_MAP, GENERATING_ELEMENT, HOUR_VOCATION_MAP, MOUNTAIN_MAP, ORIGIN_PERSON_MAP, QI_TITLE_MAP, SOLDIERS_MAP, STEM_ELEMENT, TREASURY_MAP, YEAR_ALTAR_MAP } from './constants.tsx';
import { EarthlyBranch, FiveElement, HeavenlyStem, JadeRegistryResult } from './types.ts';

export const pillarStem=(pillar:string)=>pillar[0] as HeavenlyStem;
export const pillarBranch=(pillar:string)=>pillar[1] as EarthlyBranch;

const FIVE_ELEMENTS:FiveElement[]=['木','火','土','金','水'];
export const getFiveElementProfile=(pillars:{yearPillar:string;monthPillar:string;dayPillar:string;hourPillar:string})=>{
  const fiveElementCounts:Record<FiveElement,number>={木:0,火:0,土:0,金:0,水:0};
  [pillars.yearPillar,pillars.monthPillar,pillars.dayPillar,pillars.hourPillar].forEach(pillar=>{
    fiveElementCounts[STEM_ELEMENT[pillarStem(pillar)]]+=1;
    fiveElementCounts[BRANCH_ELEMENT[pillarBranch(pillar)]]+=1;
  });
  const highest=Math.max(...FIVE_ELEMENTS.map(element=>fiveElementCounts[element]));
  const leaders=FIVE_ELEMENTS.filter(element=>fiveElementCounts[element]===highest);
  const dayMasterElement=STEM_ELEMENT[pillarStem(pillars.dayPillar)];
  const dominantElement=leaders.length===1?leaders[0]:dayMasterElement;
  return {fiveElementCounts,dominantElement};
};

export const getDaoMaster=(month:number,day:number)=>{
  const value=month*100+day;
  if(value<=312)return '玄靜先生'; if(value<=330)return '容神先生'; if(value<=612)return '暢玄先生';
  if(value<=630)return '容成先生'; if(value<=912)return '宣道先生'; if(value<=930)return '耽道先生';
  if(value<=1212)return '遠遊先生'; return '耽道先生';
};
export const getCeremonySeason=(month:number)=>month<=3?'春月祭灶':month<=6?'夏月祭灶':month<=9?'秋月祭灶':'冬月祭灶';

const HOUR_VALUE:Record<EarthlyBranch,number>={子:0,丑:2,寅:4,卯:6,辰:8,巳:10,午:12,未:14,申:16,酉:18,戌:20,亥:22};

export const getLunarYearInfo=(rocYear:number)=>{
  const gregorianYear=rocYear+1911;
  const year=LunarYear.fromYear(gregorianYear);
  return {gregorianYear,leapMonth:year.getLeapMonth() as number,months:year.getMonthsInYear().map((month:any)=>({month:month.getMonth() as number,days:month.getDayCount() as number}))};
};

export const getLunarMonthDays=(rocYear:number,lunarMonth:number,isLeapMonth:boolean)=>{
  const info=getLunarYearInfo(rocYear);
  return info.months.find((item:{month:number;days:number})=>item.month===(isLeapMonth?-lunarMonth:lunarMonth))?.days??30;
};

export const convertLunarBirth=(input:{rocYear:number;lunarMonth:number;lunarDay:number;isLeapMonth:boolean;hourBranch:EarthlyBranch})=>{
  const year=input.rocYear+1911;
  const month=input.isLeapMonth?-input.lunarMonth:input.lunarMonth;
  const lunar=Lunar.fromYmdHms(year,month,input.lunarDay,HOUR_VALUE[input.hourBranch],0,0);
  const eightChar=lunar.getEightChar();
  return {yearPillar:eightChar.getYear() as string,monthPillar:eightChar.getMonth() as string,dayPillar:eightChar.getDay() as string,hourPillar:eightChar.getTime() as string,solarDate:lunar.getSolar().toYmd() as string};
};

export const calculateJadeRegistry=(input:{rocYear:number;lunarMonth:number;lunarDay:number;isLeapMonth:boolean;hourBranch:EarthlyBranch}):JadeRegistryResult=>{
  const pillars=convertLunarBirth(input);
  const yearStem=pillarStem(pillars.yearPillar); const yearBranch=pillarBranch(pillars.yearPillar); const dayBranch=pillarBranch(pillars.dayPillar);
  const yearElement=STEM_ELEMENT[yearStem]; const {fiveElementCounts,dominantElement}=getFiveElementProfile(pillars);
  const yearAltar=YEAR_ALTAR_MAP[pillars.yearPillar]; const daoMaster=getDaoMaster(input.lunarMonth,input.lunarDay); const fiveSystem=FIVE_SYSTEM_MAP[dominantElement];
  const hourVocation=HOUR_VOCATION_MAP[input.hourBranch]; const hourAuthority='三界便宜事'; const qiTitle=QI_TITLE_MAP[dominantElement]; const mountain=MOUNTAIN_MAP[dominantElement]; const fullMarshal=FULL_MARSHAL_MAP[yearElement];
  const ordinationLines=[`一奏受太上三五都功經籙${hourVocation}`,`一補充知天曹紀錄司兼${hourAuthority}`,`一奏立${yearAltar.altar}${yearAltar.jing}`,`一泰玄都省正一平炁宮係天師${yearAltar.governance}`,`${qiTitle}元命應${daoMaster}`,`${mountain}${fiveSystem.deity}`,`一奏撥${fullMarshal}麾下`];
  return {...input,...pillars,yearAltar,hourVocation,hourAuthority,qiTitle,mountain,fullMarshal,ordinationLines,originPerson:ORIGIN_PERSON_MAP[yearBranch],treasury:TREASURY_MAP[yearStem],heartMarshal:ELEMENT_MARSHAL[yearElement],graceMarshal:ELEMENT_MARSHAL[GENERATING_ELEMENT[yearElement]],branchMarshal:BRANCH_MARSHAL[dayBranch],soldiers:SOLDIERS_MAP[dayBranch],daoMaster,ceremonySeason:getCeremonySeason(input.lunarMonth),fiveSystem,dominantElement,fiveElementCounts};
};
