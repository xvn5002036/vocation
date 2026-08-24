import { BRANCH_MARSHAL, ELEMENT_MARSHAL, FIVE_SYSTEM_MAP, GENERATING_ELEMENT, HOUR_ALTAR_MAP, ORIGIN_PERSON_MAP, SOLDIERS_MAP, STEM_ELEMENT, TREASURY_MAP } from './constants.tsx';
import { EarthlyBranch, HeavenlyStem, JadeRegistryResult } from './types.ts';

export const pillarStem=(pillar:string)=>pillar[0] as HeavenlyStem;
export const pillarBranch=(pillar:string)=>pillar[1] as EarthlyBranch;

export const getDaoMaster=(month:number,day:number)=>{
  const value=month*100+day;
  if(value<=312)return '玄靜先生'; if(value<=330)return '容神先生'; if(value<=612)return '暢玄先生';
  if(value<=630)return '容成先生'; if(value<=912)return '宣道先生'; if(value<=930)return '耽道先生';
  if(value<=1212)return '遠遊先生'; return '耽道先生';
};
export const getCeremonySeason=(month:number)=>month<=3?'春月祭灶':month<=6?'夏月祭灶':month<=9?'秋月祭灶':'冬月祭灶';

export const calculateJadeRegistry=(input:{yearPillar:string;monthPillar:string;dayPillar:string;hourPillar:string;lunarMonth:number;lunarDay:number}):JadeRegistryResult=>{
  const yearStem=pillarStem(input.yearPillar); const dayStem=pillarStem(input.dayPillar); const dayBranch=pillarBranch(input.dayPillar);
  const element=STEM_ELEMENT[dayStem];
  return {...input,hourAltar:HOUR_ALTAR_MAP[input.hourPillar],originPerson:ORIGIN_PERSON_MAP[dayBranch],treasury:TREASURY_MAP[yearStem],heartMarshal:ELEMENT_MARSHAL[element],graceMarshal:ELEMENT_MARSHAL[GENERATING_ELEMENT[element]],branchMarshal:BRANCH_MARSHAL[dayBranch],soldiers:SOLDIERS_MAP[dayBranch],daoMaster:getDaoMaster(input.lunarMonth,input.lunarDay),ceremonySeason:getCeremonySeason(input.lunarMonth),fiveSystem:FIVE_SYSTEM_MAP[element]};
};
