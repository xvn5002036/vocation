import { MARSHALS_DATA } from "../constants/marshals_data";
import { STEM_ELEMENT } from "../constants/basic";
import { ZODIAC_MAPPING } from "../constants/mapping";

/**
 * 元帥適配度計分
 *
 * @param {{
 *   stem: string,        // 年干（甲乙丙丁…）
 *   branch: string,      // 年支（子丑寅…）
 *   officialKey: string, // 官職（都功 / 左都領 / 五雷 / 盟威…）
 * }} params
 *
 * @returns {{
 *   main: object,        // 主壇元帥
 *   assistants: object[] // 輔壇元帥（最多 3 位）
 * }}
 */
export function scoreMarshals({ stem, branch, officialKey }) {
  const element = STEM_ELEMENT[stem];
  const zodiac = ZODIAC_MAPPING[branch];

  // 防呆
  if (!element || !zodiac) {
    return {
      main: null,
      assistants: [],
    };
  }

  const trait = zodiac.trait; // 文 / 武 / 判

  const scored = MARSHALS_DATA.map((marshal) => {
    let score = 0;

    /* 一、官職對應（最大權重） */
    if (officialKey.includes("都")) {
      if (marshal.domain.includes("監察") || marshal.domain.includes("判")) {
        score += 40;
      }
    }

    if (officialKey.includes("雷") || officialKey === "五雷") {
      if (marshal.domain.includes("雷") || marshal.domain.includes("戰陣")) {
        score += 40;
      }
    }

    if (officialKey.includes("盟")) {
      if (
        marshal.domain.includes("傳令") ||
        marshal.domain.includes("應感")
      ) {
        score += 35;
      }
    }

    /* 二、生肖文 / 武 / 判 */
    if (trait === "文") {
      if (
        marshal.domain.includes("監察") ||
        marshal.domain.includes("清淨") ||
        marshal.domain.includes("符令")
      ) {
        score += 20;
      }
    }

    if (trait === "武") {
      if (
        marshal.domain.includes("戰陣") ||
        marshal.domain.includes("誅邪") ||
        marshal.domain.includes("鎮煞")
      ) {
        score += 20;
      }
    }

    if (trait === "判") {
      if (
        marshal.domain.includes("判") ||
        marshal.domain.includes("因果") ||
        marshal.domain.includes("冥")
      ) {
        score += 20;
      }
    }

    /* 三、五行（年干） */
    if (element === "火" && marshal.domain.includes("火")) score += 15;
    if (element === "水" && marshal.domain.includes("水")) score += 15;
    if (element === "木" && marshal.domain.includes("生")) score += 10;
    if (element === "金" && marshal.domain.includes("刑")) score += 10;
    if (element === "土" && marshal.domain.includes("鎮")) score += 10;

    /* 四、通用加分（護法類） */
    if (marshal.domain.includes("護法")) score += 5;

    return {
      ...marshal,
      _score: score,
    };
  });

  // 依分數排序
  const sorted = scored.sort((a, b) => b._score - a._score);

  return {
    main: sorted[0] || null,
    assistants: sorted.slice(1, 4),
  };
}
