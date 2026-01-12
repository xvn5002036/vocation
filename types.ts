
export type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
export type OrdinationLevel = '初授' | '加授' | '晉授';
export type Department = '雷霆都司' | '九天風火院';
export type Vocation = '一般科儀' | '驅邪考召'; // 職能導向

export interface OrdinationResult {
  level: OrdinationLevel;
  department: Department;
  vocation: Vocation;
  mainJingLu: string;    
  title: string;         
  office: string;        
  tan: string;
  jing: string;
  governance: string;
  deity: string;
  primaryMarshal: string; // 主帥
  secondaryMarshal: string; // 副帥 / 兼位
  heartMarshal: string; 
  soldiers: string;
  treasury: string;
  official: string;
  quanName: string;      
  quanDesc: string;      
  juWei: string;         
}

export interface PersonnelRecord extends OrdinationResult {
  id: string;
  name: string;
  lunarInfo: string;
}
