// src/constants/basic.js

// --- 補齊缺失的干支定義 ---
export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// --- 五行屬性對應 ---
export const STEM_ELEMENT = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
export const BRANCH_ELEMENT = { '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };

// --- 天干五行與數理對應 (用於奏職疏文) ---
export const STEM_CORRELATION = {
  '甲': { direction: '東', color: '青', qi: '九' },
  '乙': { direction: '東', color: '青', qi: '九' },
  '丙': { direction: '南', color: '赤', qi: '三' },
  '丁': { direction: '南', color: '赤', qi: '三' },
  '戊': { direction: '中', color: '黃', qi: '五' },
  '己': { direction: '中', color: '黃', qi: '五' },
  '庚': { direction: '西', color: '白', qi: '七' },
  '辛': { direction: '西', color: '白', qi: '七' },
  '壬': { direction: '北', color: '黑', qi: '一' },
  '癸': { direction: '北', color: '黑', qi: '一' }
};

// --- UI 顏色映射 ---
export const ELEMENT_COLORS = {
  '木': 'bg-emerald-900',
  '火': 'bg-red-700',
  '土': 'bg-amber-800',
  '金': 'bg-yellow-700',
  '水': 'bg-slate-900'
};
