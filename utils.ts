
import { HeavenlyStem, EarthlyBranch, OrdinationResult, OrdinationLevel, Vocation } from './types.ts';
import { 
  getBaseTitleByMonth, 
  getBaseTitleByMonth as getMonthTitle,
  getJingTanZhi,
  SOLDIERS_MAP,
  HEART_MARSHAL_MAP,
  TREASURY_MAP,
  FIVE_ELEMENTS_MAP,
  getClericalOfficeDescription,
  HOUR_AUTHORITY_MAP,
  LEVEL_DATA_MAP,
  HOUR_VOCATION_DATA,
  STEM_MARSHAL_CONFIG,
  MARSHAL_BAOGAO_MAP
} from './constants.tsx';

export const calculateOrdination = (
  yearStem: HeavenlyStem,
  yearBranch: EarthlyBranch,
  month: number,
  day: number,
  hourBranch: EarthlyBranch,
  gender: '男' | '女',
  level: OrdinationLevel = '初授',
  vocation: Vocation = '一般科儀'
): OrdinationResult => {
  const mapping = getJingTanZhi(yearStem, yearBranch);
  const baseTitle = getBaseTitleByMonth(month, day);
  const office = getClericalOfficeDescription(yearBranch, hourBranch, level); 
  const heartMarshal = HEART_MARSHAL_MAP[yearBranch];
  const soldiers = SOLDIERS_MAP[yearBranch];
  const treasuryData = TREASURY_MAP[yearStem];
  const hourAuth = HOUR_AUTHORITY_MAP[hourBranch];
  const levelData = LEVEL_DATA_MAP[level];

  const hVocData = HOUR_VOCATION_DATA[hourBranch];
  const genderTitle = gender === '男' ? hVocData.maleTitle : hVocData.femaleTitle;

  let stemPair = '';
  if (['甲', '乙'].includes(yearStem)) stemPair = '甲乙';
  else if (['丙', '丁'].includes(yearStem)) stemPair = '丙丁';
  else if (['戊', '己'].includes(yearStem)) stemPair = '戊己';
  else if (['庚', '辛'].includes(yearStem)) stemPair = '庚辛';
  else if (['壬', '癸'].includes(yearStem)) stemPair = '壬癸';
  
  const marshalConfig = STEM_MARSHAL_CONFIG[stemPair];
  const primaryMarshal = marshalConfig.primary;
  const secondaryMarshal = marshalConfig.secondary;

  // 抓取對應寶誥
  const primaryBaoGao = MARSHAL_BAOGAO_MAP[primaryMarshal] || "志心皈命禮。神威顯赫，護法延生。大悲大願，大聖大慈。";
  const secondaryBaoGao = MARSHAL_BAOGAO_MAP[secondaryMarshal] || "志心皈命禮。神威顯赫，護法延生。大悲大願，大聖大慈。";
  
  const elementData = FIVE_ELEMENTS_MAP[stemPair] || { organ: '五臟', deity: '三炁真人' };

  return {
    level: level,
    department: '雷霆都司', 
    vocation: vocation,
    mainJingLu: levelData.jingLu,
    title: baseTitle,
    hourVocation: hVocData.vocation,
    genderTitle: genderTitle,
    office: office,
    tan: mapping.tan,
    jing: mapping.jing,
    governance: mapping.zhi + '係天師門下',
    deity: elementData.deity,
    primaryMarshal: primaryMarshal,
    secondaryMarshal: secondaryMarshal,
    primaryBaoGao: primaryBaoGao,
    secondaryBaoGao: secondaryBaoGao,
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
