// src/constants/basic.js

// 補上遺漏的 STEMS 和 BRANCHES 導出
export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行對應
export const STEM_ELEMENT = { 
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', 
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' 
};

export const BRANCH_ELEMENT = { 
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', 
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' 
};

// 五方數理與顏色對應
export const STEM_CORRELATION = {
  '甲': { direction: '東', color: '青', qi: '九', num: '九' },
  '乙': { direction: '東', color: '青', qi: '九', num: '九' },
  '丙': { direction: '南', color: '赤', qi: '三', num: '三' },
  '丁': { direction: '南', color: '赤', qi: '三', num: '三' },
  '戊': { direction: '中', color: '黃', qi: '五', num: '五' },
  '己': { direction: '中', color: '黃', qi: '五', num: '五' },
  '庚': { direction: '西', color: '白', qi: '七', num: '七' },
  '辛': { direction: '西', color: '白', qi: '七', num: '七' },
  '壬': { direction: '北', color: '黑', qi: '一', num: '一' },
  '癸': { direction: '北', color: '黑', qi: '一', num: '一' }
};

// 額外導出一個統一的五行顏色表供 UI 使用 (對應 App.jsx 中的 ELEMENT_COLORS)
export const ELEMENT_COLORS = {
  '木': 'text-green-500',
  '火': 'text-red-500',
  '土': 'text-amber-600',
  '金': 'text-yellow-500',
  '水': 'text-blue-500'
};
