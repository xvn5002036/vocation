
import { HeavenlyStem, EarthlyBranch, OrdinationLevel, Department } from './types.ts';

export const STEMS: HeavenlyStem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES: EarthlyBranch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 2025 彙編與天壇玉格：院司分配嚴謹邏輯
 * 1. 晉授 (五雷) -> 必歸【雷霆都司】
 * 2. 初授 (都功) -> 必歸【九天風火院】
 * 3. 加授 (盟威) -> 陽命(子寅辰午申戌)歸【雷霆都司】，陰命(丑卯巳未酉亥)歸【九天風火院】
 */
export const getDepartment = (level: OrdinationLevel, branch: EarthlyBranch): Department => {
  if (level === '晉授') return '雷霆都司';
  if (level === '初授') return '九天風火院';
  
  const yangBranches: EarthlyBranch[] = ['子', '寅', '辰', '午', '申', '戌'];
  return yangBranches.includes(branch) ? '雷霆都司' : '九天風火院';
};

export const LEVEL_DATA_MAP: Record<OrdinationLevel, { jingLu: string, juWei: string, action: string }> = {
  '初授': { jingLu: '太上三五都功經籙', juWei: '右判官', action: '知' },
  '加授': { jingLu: '太上正一盟威經籙', juWei: '左判官', action: '判' },
  '晉授': { jingLu: '上清五雷經籙', juWei: '簽書', action: '同簽書' }
};

/**
 * 張天師三十六員天將 (2025 彙編核校版)
 */
export const CELESTIAL_GENERALS = [
  '張節', '趙公明', '辛漢臣', '荀劉吉', '畢京遠',
  '吳明遠', '殷郊', '王善', '關羽', '鄧伯溫',
  '方貢', '嶽遠信', '李音天', '陳元遠', '呂魁',
  '周清遠', '林太華', '范雷細', '崔志旭', '劉德',
  '江飛捷', '賀天祥', '康堯', '耿通', '梅天梅',
  '馬勝', '龐煜', '鐵天天', '寶將', '宋彥', '宋迪', '田守元',
  '莫太尉', '寧元帥', '任元帥', '陶元帥'
];

export const HOUR_AUTHORITY_MAP: Record<EarthlyBranch, { name: string, desc: string }> = {
  '子': { name: '三界糾察事', desc: '主司監察、檢舉、考核神凡善惡。' },
  '丑': { name: '三界勘合事', desc: '主司文書核對、勘驗關防、確保法旨無誤。' },
  '寅': { name: '三界行移事', desc: '主司公文傳遞、各部溝通。' },
  '卯': { name: '三界點檢事', desc: '主司清點兵馬、點校錢糧、檢查壇場編制。' },
  '辰': { name: '三界推問事', desc: '主司審訊、考鬼、審問邪祟因由。' },
  '巳': { name: '三界通傳事', desc: '主司奏傳、通報信息。' },
  '午': { name: '三界執法事', desc: '主司行刑、執行法旨、現場督戰。' },
  '未': { name: '三界理問事', desc: '主司理清冤結、調解因果、處理冥界訴訟。' },
  '申': { name: '三界便宜事', desc: '准予先斬後奏、臨機應變、先行處置。' },
  '酉': { name: '三界收管事', desc: '主司收攝魂魄、拘禁妖邪、管理天牢。' },
  '戌': { name: '三界點視事', desc: '主司夜巡、巡視界內安寧、察看隱藏邪祟。' },
  '亥': { name: '三界密察事', desc: '主司隱密偵察、暗中監視。' }
};

export const HEART_MARSHAL_MAP: Record<EarthlyBranch, string> = {
  '子': '辛元帥', '丑': '鄧元帥', '寅': '趙元帥', '卯': '張元帥',
  '辰': '魯元帥', '巳': '馬元帥', '午': '王元帥', '未': '殷元帥',
  '申': '溫元帥', '酉': '康元帥', '戌': '關元帥', '亥': '方元帥'
};

export const getTitleByMonth = (month: number, day: number, gender: '男' | '女'): string => {
  let baseTitle = '';
  const dateVal = month * 100 + day; 
  if (dateVal >= 101 && dateVal <= 312) baseTitle = '玄靜';
  else if (dateVal >= 313 && dateVal <= 330) baseTitle = '容神';
  else if (dateVal >= 401 && dateVal <= 612) baseTitle = '暢玄';
  else if (dateVal >= 613 && dateVal <= 630) baseTitle = '容成';
  else if (dateVal >= 701 && dateVal <= 912) baseTitle = '宣道';
  else if (dateVal >= 913 && dateVal <= 930) baseTitle = '阮道';
  else if (dateVal >= 1001 && dateVal <= 1212) baseTitle = '遠遊';
  else baseTitle = '耽道';
  return gender === '男' ? `${baseTitle}先生` : `${baseTitle}元君`;
};

export const BRANCH_DATA_MAP: Record<EarthlyBranch, { fu: string, gong: string, siPrefix: string }> = {
  '子': { fu: '泰玄府', gong: '招真仙宮', siPrefix: '天曹紀錄' },
  '丑': { fu: '都天府', gong: '宜男仙宮', siPrefix: '天曹考察' },
  '寅': { fu: '執法府', gong: '祈嗣仙宮', siPrefix: '天曹功曹' },
  '卯': { fu: '勾陳府', gong: '集善仙宮', siPrefix: '天曹主案' },
  '辰': { fu: '鳳閣府', gong: '集善仙宮', siPrefix: '天曹賞善' },
  '巳': { fu: '彤華府', gong: '延慶仙宮', siPrefix: '天曹罰惡' },
  '午': { fu: '威德府', gong: '長樂仙宮', siPrefix: '天曹執法' },
  '未': { fu: '宣威府', gong: '慈愛仙宮', siPrefix: '天曹監督' },
  '申': { fu: '揚威府', gong: '移仗仙宮', siPrefix: '天曹司籍' },
  '酉': { fu: '耀武府', gong: '招賢仙宮', siPrefix: '天曹考校' },
  '戌': { fu: '振武府', gong: '廣德仙宮', siPrefix: '天曹檢核' },
  '亥': { fu: '廣德府', gong: '招順仙宮', siPrefix: '天曹注籍' }
};

export const getClericalOfficeDescription = (yearBranch: EarthlyBranch, hourBranch: EarthlyBranch, level: OrdinationLevel): string => {
  const yearData = BRANCH_DATA_MAP[yearBranch];
  const hourData = HOUR_AUTHORITY_MAP[hourBranch];
  const levelData = LEVEL_DATA_MAP[level];
  if (!yearData) return `一奏受「${levelData.jingLu}」`;
  
  return `一奏受「${levelData.jingLu}」
一執「${yearData.fu}」、掌「${yearData.gong}」
一兼領「${levelData.action}${yearData.siPrefix}司」及「${levelData.action}${hourData.name}」`;
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

/**
 * 依據《天壇玉格》配賦兵馬
 */
export const SOLDIERS_MAP: Record<EarthlyBranch, string> = {
  '子': '一萬三千零五十名', '丑': '七萬一千名', '寅': '一萬一千名', '卯': '三百八十名',
  '辰': '一千四百七十名', '巳': '七百名', '午': '一千名', '未': '十萬名',
  '申': '一萬名', '酉': '三萬名', '戌': '八千名', '亥': '五百名'
};

/**
 * 2025 彙編：主將全銜 (精確核對版)
 * 嚴格匹配雷霆都司(溫、趙、周)與九天風火院(馬、殷)之主理權責
 */
export const MARSHAL_MAP: Record<string, string> = {
  '甲': '地祇主令都巡太保溫元帥', 
  '乙': '地祇主令都巡太保溫元帥',
  '丙': '正一解厄靈官文魁馬元帥', 
  '丁': '正一解厄靈官文魁馬元帥',
  '戊': '地司太歲武光上將殷元帥', 
  '己': '地司太歲武光上將殷元帥',
  '庚': '上清正一龍虎執法趙元帥', 
  '辛': '上清正一龍虎執法趙元帥',
  '壬': '風輪蕩魔收怪滅邪周元帥', 
  '癸': '風輪蕩魔收怪滅邪周元帥'
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
