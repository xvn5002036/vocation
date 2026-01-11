
export type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

export interface OrdinationResult {
  title: string;
  office: string;
  tan: string;
  jing: string;
  governance: string;
  deity: string;
  marshal: string;      // 本命主將 (天干)
  heartMarshal: string; // 心恩主將 (地支)
  soldiers: string;
  treasury: string;
  official: string;
  quanName: string;      // 時辰對應的職權名稱
  quanDesc: string;      // 時辰對應的職能特性
}

export interface PersonnelRecord extends OrdinationResult {
  id: string;
  name: string;
  lunarInfo: string;
}
