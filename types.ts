export type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
export type YuanPeriod = '上元' | '中元' | '下元';

export interface JadeRegistryResult {
  rocYear: number;
  gregorianYear: number;
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  ganzhi: string;
  yuan: YuanPeriod;
  yuanIndex: number;
  stemJing: string;
  branchJing: string;
  ganzhiJing: string;
  heartMarshal: string;
}

export interface PersonnelRecord extends JadeRegistryResult {
  id: string;
  name: string;
  lunarInfo: string;
}
