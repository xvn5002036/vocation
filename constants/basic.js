// 天干
export const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

// 地支
export const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 五行對應
export const STEM_ELEMENT = {
  "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
  "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水"
};

// 天干核心關聯 (方位、帝號、炁數、顏色)
export const STEM_CORRELATION = {
  "甲": { direction: "東", mountain: "東嶽", emperor: "青帝", chi_num: 9, color: "青" },
  "乙": { direction: "東", mountain: "東嶽", emperor: "青帝", chi_num: 9, color: "青" },
  "丙": { direction: "南", mountain: "南嶽", emperor: "赤帝", chi_num: 3, color: "赤" },
  "丁": { direction: "南", mountain: "南嶽", emperor: "赤帝", chi_num: 3, color: "赤" },
  "戊": { direction: "中", mountain: "中嶽", emperor: "黃帝", chi_num: 1, color: "黃" },
  "己": { direction: "中", mountain: "中嶽", emperor: "黃帝", chi_num: 1, color: "黃" },
  "庚": { direction: "西", mountain: "西嶽", emperor: "白帝", chi_num: 7, color: "白" },
  "辛": { direction: "西", mountain: "西嶽", emperor: "白帝", chi_num: 7, color: "白" },
  "壬": { direction: "北", mountain: "北嶽", emperor: "黑帝", chi_num: 5, color: "黑" },
  "癸": { direction: "北", mountain: "北嶽", emperor: "黑帝", chi_num: 5, color: "黑" }
};
