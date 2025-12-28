/**
 * 將疏文資料整理成可列印文字（純文字 / HTML 皆可用）
 *
 * @param {{
 *  tan: string,
 *  jing: string,
 *  name: string,
 *  qiTitle: string,
 *  title: string,
 *  direction: string,
 *  color: string,
 *  qi: string,
 *  ganzhiKey: string,
 *  zodiacText: string
 * }} params
 */
export function buildPetitionText(params) {
  const {
    tan,
    jing,
    name,
    qiTitle,
    title,
    direction,
    color,
    qi,
    ganzhiKey,
    zodiacText,
  } = params;

  return `
一奏立「${tan}」壇「${jing}」靖，
一奏玄都省正一平炁宮炁 天師「${name}」治「${qiTitle}」炁，
三然君赤天三五步罡元命應「${title}」先生
「${direction}」嶽「${color}」帝「${qi}」炁真人。

——
年干支：${ganzhiKey}
生肖：${zodiacText}
`.trim();
}

/**
 * 直接呼叫瀏覽器列印
 */
export function printPetition() {
  window.print();
}
