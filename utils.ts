
import { HeavenlyStem, EarthlyBranch, OrdinationResult, OrdinationLevel } from './types.ts';
import { 
  getTitleByMonth, 
  getJingTanZhi,
  SOLDIERS_MAP,
  MARSHAL_MAP,
  HEART_MARSHAL_MAP,
  TREASURY_MAP,
  FIVE_ELEMENTS_MAP,
  getClericalOfficeDescription,
  HOUR_AUTHORITY_MAP,
  LEVEL_DATA_MAP,
  getDepartment
} from './constants.tsx';

export const calculateOrdination = (
  yearStem: HeavenlyStem,
  yearBranch: EarthlyBranch,
  month: number,
  day: number,
  hourBranch: EarthlyBranch,
  gender: '男' | '女',
  level: OrdinationLevel = '初授'
): OrdinationResult => {
  const mapping = getJingTanZhi(yearStem, yearBranch);
  const title = getTitleByMonth(month, day, gender);
  const office = getClericalOfficeDescription(yearBranch, hourBranch, level); 
  const marshal = MARSHAL_MAP[yearStem];
  const heartMarshal = HEART_MARSHAL_MAP[yearBranch];
  const soldiers = SOLDIERS_MAP[yearBranch];
  const treasuryData = TREASURY_MAP[yearStem];
  const hourAuth = HOUR_AUTHORITY_MAP[hourBranch];
  const levelData = LEVEL_DATA_MAP[level];
  const department = getDepartment(level, yearBranch);
  
  let stemPair = '';
  if (['甲', '乙'].includes(yearStem)) stemPair = '甲乙';
  else if (['丙', '丁'].includes(yearStem)) stemPair = '丙丁';
  else if (['戊', '己'].includes(yearStem)) stemPair = '戊己';
  else if (['庚', '辛'].includes(yearStem)) stemPair = '庚辛';
  else if (['壬', '癸'].includes(yearStem)) stemPair = '壬癸';
  
  const elementData = FIVE_ELEMENTS_MAP[stemPair] || { organ: '五臟', deity: '三炁真人' };

  return {
    level: level,
    department: department,
    mainJingLu: levelData.jingLu,
    title: title,
    office: office,
    tan: mapping.tan,
    jing: mapping.jing,
    governance: mapping.zhi + '係天師門下',
    deity: elementData.deity,
    marshal: marshal,
    heartMarshal: heartMarshal,
    soldiers: soldiers,
    treasury: treasuryData.treasury,
    official: treasuryData.official,
    quanName: hourAuth.name,
    quanDesc: hourAuth.desc,
    juWei: levelData.juWei
  };
};

export const getYearStemBranch = (lunarYear: number): { stem: HeavenlyStem, branch: EarthlyBranch } => {
  const stems: HeavenlyStem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches: EarthlyBranch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const offset = lunarYear - 1;
  const stemIndex = (8 + offset) % 10;
  const branchIndex = (0 + offset) % 12;
  return { stem: stems[stemIndex], branch: branches[branchIndex] };
};
