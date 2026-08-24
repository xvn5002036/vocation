import { BRANCHES, GANZHI_JING_MAP, HEART_MARSHAL_MAP, STEMS, STEM_JING_MAP, YUAN_BRANCH_JING_MAP } from './constants.tsx';
import { HeavenlyStem, EarthlyBranch, JadeRegistryResult, YuanPeriod } from './types.ts';

const positiveModulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;

export const getYearStemBranch = (rocYear: number): { stem: HeavenlyStem; branch: EarthlyBranch } => {
  const gregorianYear = rocYear + 1911;
  return {
    stem: STEMS[positiveModulo(gregorianYear - 4, 10)],
    branch: BRANCHES[positiveModulo(gregorianYear - 4, 12)]
  };
};

export const getYuanPeriod = (gregorianYear: number): { yuan: YuanPeriod; yuanIndex: number } => {
  const cycle = Math.floor((gregorianYear - 1384) / 60);
  const yuanIndex = positiveModulo(cycle, 3);
  return { yuan: (['上元', '中元', '下元'] as YuanPeriod[])[yuanIndex], yuanIndex };
};

export const calculateJadeRegistry = (rocYear: number): JadeRegistryResult => {
  const gregorianYear = rocYear + 1911;
  const { stem, branch } = getYearStemBranch(rocYear);
  const { yuan, yuanIndex } = getYuanPeriod(gregorianYear);
  const ganzhi = `${stem}${branch}`;
  return {
    rocYear, gregorianYear, stem, branch, ganzhi, yuan, yuanIndex,
    stemJing: STEM_JING_MAP[stem],
    branchJing: YUAN_BRANCH_JING_MAP[yuan][branch],
    ganzhiJing: GANZHI_JING_MAP[ganzhi],
    heartMarshal: HEART_MARSHAL_MAP[branch]
  };
};
