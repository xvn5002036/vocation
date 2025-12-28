// 天干
export const STEMS = [
  "甲", "乙", "丙", "丁", "戊",
  "己", "庚", "辛", "壬", "癸",
];

// 地支
export const BRANCHES = [
  "子", "丑", "寅", "卯", "辰", "巳",
  "午", "未", "申", "酉", "戌", "亥",
];

// 天干對應五行
export const STEM_ELEMENT = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

// 天干法統對應（方位 / 五色帝 / 炁數）
export const STEM_CORRELATION = {
  甲: {
    direction: "東嶽",
    color: "青",
    emperor: "青帝",
    qi: "九炁",
  },
  乙: {
    direction: "東嶽",
    color: "青",
    emperor: "青帝",
    qi: "九炁",
  },
  丙: {
    direction: "南嶽",
    color: "赤",
    emperor: "赤帝",
    qi: "三炁",
  },
  丁: {
    direction: "南嶽",
    color: "赤",
    emperor: "赤帝",
    qi: "三炁",
  },
  戊: {
    direction: "中嶽",
    color: "黃",
    emperor: "黃帝",
    qi: "五炁",
  },
  己: {
    direction: "中嶽",
    color: "黃",
    emperor: "黃帝",
    qi: "五炁",
  },
  庚: {
    direction: "西嶽",
    color: "白",
    emperor: "白帝",
    qi: "七炁",
  },
  辛: {
    direction: "西嶽",
    color: "白",
    emperor: "白帝",
    qi: "七炁",
  },
  壬: {
    direction: "北嶽",
    color: "黑",
    emperor: "黑帝",
    qi: "一炁",
  },
  癸: {
    direction: "北嶽",
    color: "黑",
    emperor: "黑帝",
    qi: "一炁",
  },
};
