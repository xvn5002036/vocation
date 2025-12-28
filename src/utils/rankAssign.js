import { ZODIAC_MAPPING } from "../constants/mapping";
import { RANK_SYSTEM } from "../constants/rank";

/**
 * 根據生肖特質（文 / 武 / 判）與性別，分派官署與官職
 *
 * @param {string} branch - 地支（子..亥）
 * @param {"male"|"female"} gender - 性別
 * @returns {{
 *   officeKey: string,
 *   officialKey: string,
 *   qiTitle: string
 * }}
 */
export function assignRankByZodiac(branch, gender) {
  const zodiac = ZODIAC_MAPPING[branch];

  // 防錯：若資料缺失，回傳最低階安全值
  if (!zodiac) {
    return fallbackRank();
  }

  const { trait } = zodiac;

  // 一、先依「文 / 武 / 判」決定官署
  let officeKey = "盟威"; // 預設中階

  if (trait === "文") {
    officeKey = "盟威";
  } else if (trait === "武") {
    officeKey = "五雷";
  } else if (trait === "判") {
    officeKey = "都功";
  }

  const office = RANK_SYSTEM[officeKey];
  if (!office) {
    return fallbackRank();
  }

  // 二、在該官署內，依性別選擇第一順位職位
  // （後續你可加權：年干、月令、元帥適配度）
  const primaryRank = office.ranks[0];

  if (!primaryRank) {
    return fallbackRank();
  }

  return {
    officeKey,
    officialKey: primaryRank.key,
    qiTitle: primaryRank.qiTitle,
  };
}

/**
 * 安全回退官職（永不讓系統炸掉）
 */
function fallbackRank() {
  return {
    officeKey: "盟威",
    officialKey: "盟威",
    qiTitle: "盟威炁",
  };
}
