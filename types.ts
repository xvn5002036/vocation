export type HeavenlyStem = '甲'|'乙'|'丙'|'丁'|'戊'|'己'|'庚'|'辛'|'壬'|'癸';
export type EarthlyBranch = '子'|'丑'|'寅'|'卯'|'辰'|'巳'|'午'|'未'|'申'|'酉'|'戌'|'亥';
export interface AltarEntry { altar: string; jing: string; governance: string; }
export interface OriginPerson { star: string; palace: string; surname: string; }
export interface TreasuryEntry { treasury: string; office: string; official: string; }
export interface FiveSystemEntry { direction: string; deity: string; phrases: [string,string,string]; }
export interface JadeRegistryResult {
  yearPillar: string; monthPillar: string; dayPillar: string; hourPillar: string;
  lunarMonth: number; lunarDay: number;
  hourAltar: AltarEntry;
  originPerson: OriginPerson;
  treasury: TreasuryEntry;
  heartMarshal: string; graceMarshal: string; branchMarshal: string;
  soldiers: string; daoMaster: string; ceremonySeason: string;
  fiveSystem: FiveSystemEntry;
}
export interface PersonnelRecord extends JadeRegistryResult { id: string; name: string; lunarInfo: string; }
