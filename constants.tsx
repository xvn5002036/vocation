
import { HeavenlyStem, EarthlyBranch, OrdinationLevel } from './types.ts';

export const STEMS: HeavenlyStem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES: EarthlyBranch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const HOUR_VOCATION_DATA: Record<EarthlyBranch, { vocation: string, maleTitle: string, femaleTitle: string }> = {
  '子': { vocation: '鳳閣司籍', maleTitle: '仙官', femaleTitle: '淑人' },
  '丑': { vocation: '彤華公案', maleTitle: '仙官', femaleTitle: '淑人' },
  '寅': { vocation: '紫微校錄', maleTitle: '仙官', femaleTitle: '淑人' },
  '卯': { vocation: '青城典籍', maleTitle: '仙官', femaleTitle: '淑人' },
  '辰': { vocation: '天官校籍', maleTitle: '仙官', femaleTitle: '淑人' },
  '巳': { vocation: '玉府執法', maleTitle: '仙官', femaleTitle: '淑人' },
  '午': { vocation: '玄樞奏議', maleTitle: '仙官', femaleTitle: '淑人' },
  '未': { vocation: '蓬萊定旨', maleTitle: '仙官', femaleTitle: '淑人' },
  '申': { vocation: '紫府掌善', maleTitle: '仙官', femaleTitle: '淑人' },
  '酉': { vocation: '太華司命', maleTitle: '仙官', femaleTitle: '淑人' },
  '戌': { vocation: '集靈司功', maleTitle: '仙官', femaleTitle: '淑人' },
  '亥': { vocation: '凝真紀錄', maleTitle: '仙官', femaleTitle: '淑人' },
};

export const LEVEL_DATA_MAP: Record<OrdinationLevel, { jingLu: string, juWei: string, action: string, deptDesc: string }> = {
  '初授': { jingLu: '太上三五都功經籙', juWei: '右判官', action: '知', deptDesc: '職隸雷霆都司，兼領九天風火院事' },
  '加授': { jingLu: '太上正一盟威經籙', juWei: '左判官', action: '判', deptDesc: '職隸雷霆都司，兼領九天風火院事' },
  '晉授': { jingLu: '上清五雷經籙', juWei: '簽書', action: '同簽書', deptDesc: '職隸雷霆都司，兼領九天風火院事' }
};

export const MARSHAL_NAMES = {
  WOOD: '地祇主令都巡太保溫元帥',
  FIRE: '正乙解厄靈官文魁馬元帥',
  GOLD: '上清正乙龍虎執法趙元帥',
  EARTH: '地司太歲武光上將殷元帥',
  WATER: '風輪蕩魔收怪滅邪周元帥'
};

/**
 * 聖號寶誥持誦文本 - 嚴格遵守龍虎山正一天師派傳承文本
 */
export const MARSHAL_BAOGAO_MAP: Record<string, string> = {
  [MARSHAL_NAMES.WOOD]: "志心皈命禮。東嶽都統。地祇至尊。三十六員之首。五百名兵之魁。化身為青帝之靈。現形為大聖之威。忠義勇往。救民於水火。威靈顯赫。斬鬼於壇場。大悲大願。大聖大慈。地祇主令。都巡太保。溫元帥。",
  [MARSHAL_NAMES.FIRE]: "志心皈命禮。斗口魁神。旋璣聖將。三頭六臂。九目火丹。執掌雷霆。司察人間。化身馬靈官。救苦於世間。正乙解厄。文魁馬將。威權廣大。聖力無邊。大悲大願。大聖大慈。五顯華光大帝。靈官馬元帥。",
  [MARSHAL_NAMES.GOLD]: "志心皈命禮。龍虎山中。玄壇法主。掌金輪而役雷電。現黑面以制妖魔。位列督司。驅邪考召。救民疾苦。保境安民。金輪執掌。虎步生風。大聖大慈。大悲大願。上清正乙。玄壇趙真君。趙元帥。",
  [MARSHAL_NAMES.EARTH]: "志心皈命禮。地司太歲。至德至靈。商朝后裔。神威冠古。手執金鐘。力拔山嶽。化身為武光上將。掌權於地府之中。賞善罰惡。降福消災。大悲大願。大聖大慈。地司太歲。武光上將。殷元帥。",
  [MARSHAL_NAMES.WATER]: "志心皈命禮。風輪蕩魔。聖力如神。玄武部下。收怪滅邪。九天位列。風火齊攻。顯赫威靈。法力無窮。驅除精怪。保境安民。大聖大慈。大悲大願。風輪蕩魔。收怪滅邪。周元帥。"
};

export const STEM_MARSHAL_CONFIG: Record<string, { primary: string, secondary: string, element: string, primaryType: string, secondaryType: string }> = {
  '甲乙': { primary: MARSHAL_NAMES.WOOD, secondary: MARSHAL_NAMES.FIRE, element: '木', primaryType: '同氣主令', secondaryType: '木生火' },
  '丙丁': { primary: MARSHAL_NAMES.FIRE, secondary: MARSHAL_NAMES.EARTH, element: '火', primaryType: '同氣主令', secondaryType: '火生土' },
  '戊己': { primary: MARSHAL_NAMES.EARTH, secondary: MARSHAL_NAMES.GOLD, element: '土', primaryType: '同氣主令', secondaryType: '土生金' },
  '庚辛': { primary: MARSHAL_NAMES.GOLD, secondary: MARSHAL_NAMES.WATER, element: '金', primaryType: '同氣主令', secondaryType: '金生水' },
  '壬癸': { primary: MARSHAL_NAMES.WATER, secondary: MARSHAL_NAMES.WOOD, element: '水', primaryType: '同氣主令', secondaryType: '水生木' }
};

export const HOUR_AUTHORITY_MAP: Record<EarthlyBranch, { name: string, desc: string }> = {
  '子': { name: '三界糾察便宜行事', desc: '監察、檢舉、考核神凡善惡。' },
  '丑': { name: '三界勘合便宜行事', desc: '文書核對、勘驗關防。' },
  '寅': { name: '三界行移便宜行事', desc: '公文傳遞、各部溝通。' },
  '卯': { name: '三界點檢便宜行事', desc: '清點兵馬、點校錢糧。' },
  '辰': { name: '三界推問便宜行事', desc: '審訊、考鬼、審問邪祟。' },
  '巳': { name: '三界通傳便宜行事', desc: '奏傳、通報信息。' },
  '午': { name: '三界執法便宜行事', desc: '行刑、執行法旨。' },
  '未': { name: '三界理問便宜行事', desc: '理清冤結、調解因果。' },
  '申': { name: '三界便宜行事', desc: '准予先斬後奏、臨機應變。' },
  '酉': { name: '三界收管便宜行事', desc: '收攝魂魄、拘禁妖邪。' },
  '戌': { name: '三界點視便宜行事', desc: '夜巡、巡視界內安寧。' },
  '亥': { name: '三界密察便宜行事', desc: '隱密偵察、暗中監視。' }
};

export const HEART_MARSHAL_MAP: Record<EarthlyBranch, string> = {
  '子': '辛元帥', '丑': '鄧元帥', '寅': '趙元帥', '卯': '張元帥',
  '辰': '魯元帥', '巳': '馬元帥', '午': '王元帥', '未': '殷元帥',
  '申': '溫元帥', '酉': '康元帥', '戌': '關元帥', '亥': '方元帥'
};

export const getBaseTitleByMonth = (month: number, day: number): string => {
  const dateVal = month * 100 + day; 
  if (dateVal >= 101 && dateVal <= 312) return '玄靜';
  if (dateVal >= 313 && dateVal <= 330) return '容神';
  if (dateVal >= 401 && dateVal <= 612) return '暢玄';
  if (dateVal >= 613 && dateVal <= 630) return '容成';
  if (dateVal >= 701 && dateVal <= 912) return '宣道';
  if (dateVal >= 913 && dateVal <= 930) return '阮道';
  if (dateVal >= 1001 && dateVal <= 1212) return '遠遊';
  return '耽道';
};

export const BRANCH_DATA_MAP: Record<EarthlyBranch, { fu: string, gong: string, siPrefix: string }> = {
  '子': { fu: '泰玄府', gong: '招真仙官', siPrefix: '天曹紀錄' },
  '丑': { fu: '都天府', gong: '宜男仙官', siPrefix: '天曹考察' },
  '寅': { fu: '執法府', gong: '祈嗣仙官', siPrefix: '天曹功曹' },
  '卯': { fu: '勾陳府', gong: '集善仙官', siPrefix: '天曹主案' },
  '辰': { fu: '鳳閣府', gong: '集善仙官', siPrefix: '天曹賞善' },
  '巳': { fu: '彤華府', gong: '延慶仙官', siPrefix: '天曹罰惡' },
  '午': { fu: '威德府', gong: '長樂仙官', siPrefix: '天曹執法' },
  '未': { fu: '宣威府', gong: '慈愛仙官', siPrefix: '天曹監督' },
  '申': { fu: '揚威府', gong: '移仗仙官', siPrefix: '天曹司籍' },
  '酉': { fu: '耀武府', gong: '招賢仙官', siPrefix: '天曹考校' },
  '戌': { fu: '振武府', gong: '廣德仙官', siPrefix: '天曹檢核' },
  '亥': { fu: '廣德府', gong: '招順仙官', siPrefix: '天曹注籍' }
};

export const getClericalOfficeDescription = (yearBranch: EarthlyBranch, hourBranch: EarthlyBranch, level: OrdinationLevel): string => {
  const yearData = BRANCH_DATA_MAP[yearBranch];
  const hourData = HOUR_AUTHORITY_MAP[hourBranch];
  const levelData = LEVEL_DATA_MAP[level];
  const hourVocation = HOUR_VOCATION_DATA[hourBranch].vocation;
  
  return `一奏受「${levelData.jingLu}」
一執「${yearData.fu}」掌「${yearData.gong}」
一兼領「${levelData.action}${yearData.siPrefix}司」及「${levelData.action}${hourVocation}」、「${levelData.action}${hourData.name}」`;
};

export const getJingTanZhi = (stem: HeavenlyStem, branch: EarthlyBranch) => {
  const map: Record<string, { tan: string, jing: string, zhi: string }> = {
    '乙巳': { tan: '靈應通真壇', jing: '致真通玄靖', zhi: '蒙秦治左領功炁' }, 
    '甲子': { tan: '應妙合英壇', jing: '通玄致真靖', zhi: '陽平治左平炁' },
    '乙丑': { tan: '靈應通真壇', jing: '致真通玄靖', zhi: '蒙秦治左領功炁' },
    '丙寅': { tan: '靈真應妙壇', jing: '通玄致真靖', zhi: '陽平治左平炁' },
    '丁卯': { tan: '三界集神壇', jing: '洞真自然靖', zhi: '葛璝治左都領炁' },
    '戊辰': { tan: '三界混元壇', jing: '天一保真靖', zhi: '湳沅治左部長炁' },
    '己巳': { tan: '三界集真壇', jing: '登心復真靖', zhi: '平蓋治右領功炁' },
    '庚午': { tan: '玄一守真壇', jing: '保性弘真靖', zhi: '雲台治右都監炁' },
    '辛未': { tan: '玄妙通真壇', jing: '登真明性靖', zhi: '玉局治左察炁' },
    '壬申': { tan: '通玄合真壇', jing: '混合明真靖', zhi: '公慕治右都炁' },
    '癸酉': { tan: '玄妙應真壇', jing: '後城合真靖', zhi: '後城治右都炁' }
  };
  const key = `${stem}${branch}`;
  return map[key] || { tan: '玄靈應妙壇', jing: '通玄致真靖', zhi: '陽平治左平炁' };
};

export const SOLDIERS_MAP: Record<EarthlyBranch, string> = {
  '子': '一萬三千零五十名', '丑': '七萬一千名', '寅': '一萬一千名', '卯': '三百八十名',
  '辰': '一千四百七十名', '巳': '七百名', '午': '一千名', '未': '十萬名',
  '申': '一萬名', '酉': '三萬名', '戌': '八千名', '亥': '五百名'
};

export const TREASURY_MAP: Record<HeavenlyStem, { treasury: string, official: string }> = {
  '甲': { treasury: '功德庫', official: '陳玉' }, '乙': { treasury: '照證庫', official: '高明' },
  '丙': { treasury: '平等庫', official: '周全' }, '丁': { treasury: '善惡庫', official: '王正' },
  '戊': { treasury: '拷掠庫', official: '石達' }, '己': { treasury: '掠剩庫', official: '錢真' },
  '庚': { treasury: '祿福庫', official: '崔正' }, '辛': { treasury: '錄善庫', official: '吉兆' },
  '壬': { treasury: '報應庫', official: '甘上' }, '癸': { treasury: '超昇庫', official: '劉元' }
};

export const FIVE_ELEMENTS_MAP: Record<string, { organ: string, deity: string }> = {
  '甲乙': { organ: '肝屬木', deity: '東方青帝九炁真人' },
  '丙丁': { organ: '心屬火', deity: '南方赤帝三炁真人' },
  '戊己': { organ: '脾屬土', deity: '中央黃帝一炁真人' },
  '庚辛': { organ: '肺屬金', deity: '西方白帝七炁真人' },
  '壬癸': { organ: '腎屬水', deity: '北方黑帝五炁真人' }
};
