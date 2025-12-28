// 官署體系與職級定義（顯示用 / 分派依據）
export const RANK_SYSTEM = {
  都功: {
    order: 1,
    office: "都功院",
    ranks: [
      {
        key: "都功",
        male: "都功法師",
        female: "都功法師",
        qiTitle: "都功炁",
        weight: 100,
      },
      {
        key: "左都領",
        male: "左都領法師",
        female: "左都領法師",
        qiTitle: "左都領炁",
        weight: 90,
      },
      {
        key: "右都領",
        male: "右都領法師",
        female: "右都領法師",
        qiTitle: "右都領炁",
        weight: 90,
      },
      {
        key: "都監",
        male: "都監法師",
        female: "都監法師",
        qiTitle: "都監炁",
        weight: 80,
      },
    ],
  },

  盟威: {
    order: 2,
    office: "盟威院",
    ranks: [
      {
        key: "盟威",
        male: "盟威法師",
        female: "盟威法師",
        qiTitle: "盟威炁",
        weight: 70,
      },
      {
        key: "判官",
        male: "盟威判官",
        female: "盟威判官",
        qiTitle: "判官炁",
        weight: 65,
      },
      {
        key: "掌籍",
        male: "盟威掌籍",
        female: "盟威掌籍",
        qiTitle: "掌籍炁",
        weight: 60,
      },
    ],
  },

  五雷: {
    order: 3,
    office: "五雷院",
    ranks: [
      {
        key: "五雷",
        male: "五雷法師",
        female: "五雷法師",
        qiTitle: "五雷炁",
        weight: 75,
      },
      {
        key: "雷令",
        male: "雷令法師",
        female: "雷令法師",
        qiTitle: "雷令炁",
        weight: 68,
      },
      {
        key: "雷使",
        male: "雷使",
        female: "雷使",
        qiTitle: "雷使炁",
        weight: 60,
      },
    ],
  },
};

// UI 顯示用：官署排序
export const RANK_OFFICE_ORDER = ["都功", "盟威", "五雷"];

// UI 顯示用：性別標準化
export const GENDER_LABEL = {
  male: "乾道",
  female: "坤道",
};
