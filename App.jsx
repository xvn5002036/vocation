import React, { useState, useEffect } from 'react';
import { 
  Scroll, BookOpen, Menu, X, History, Trash2, 
  ChevronRight, Printer, Search, Info, ChevronDown, ChevronUp,
  Clock, Calendar, Shield, Activity, HelpCircle, MapPin, Star, UserCheck,
  Award, Landmark, FileText, Scale, Zap, HeartPulse, Swords, Ghost, ListOrdered, ShieldCheck
} from 'lucide-react';

// ==========================================
// 第一區塊：核心數據庫與法統邏輯 (全量定義)
// ==========================================

const YANG_HOURS = ["子時", "寅時", "辰時", "午時", "申時", "戌時"];

const MONTH_SPIRITS = ["登明", "河魁", "從魁", "傳送", "小吉", "勝光", "太乙", "天罡", "太沖", "功曹", "大吉", "神后"];

const HOUR_MESSENGERS = {
    "子時": "子時值日林使者", "丑時": "丑時值日曲使者", "寅時": "寅時值日喬使者", "卯時": "卯時值日蘇使者",
    "辰時": "辰時值日張使者", "巳時": "巳時值日祝使者", "午時": "午時值日郭使者", "未時": "未時值日武使者",
    "申時": "申時值日詹使者", "酉時": "酉時值日魯使者", "戌時": "戌時值日趙使者", "亥時": "亥時值日康使者"
};

const DAY_DUTIES = [
    "督理雲騎事務", "監察五方雷部", "統理陰陽律法", "巡察境內考較", "協理星府文書", 
    "掌理符籙真氣", "宣化玄門正法", "鎮守法界樞機", "錄籍生靈功過", "保命長生護佑"
];

const JIAZI_60 = ["甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉", "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未", "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳", "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯", "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑", "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"];

const HELUO_MAPPING = {
    "甲": { emperor: "青帝", qi: "九", planet: "蒼天", mountain: "東嶽", master: "妙玄" },
    "乙": { emperor: "青帝", qi: "九", planet: "蒼天", mountain: "東嶽", master: "妙玄" },
    "丙": { emperor: "赤帝", qi: "三", planet: "赤天", mountain: "南嶽", master: "暢玄" },
    "丁": { emperor: "赤帝", qi: "三", planet: "赤天", mountain: "南嶽", master: "暢玄" }, 
    "戊": { emperor: "黃帝", qi: "一", planet: "昊天", mountain: "中嶽", master: "靈玄" },
    "己": { emperor: "黃帝", qi: "一", planet: "昊天", mountain: "中嶽", master: "靈玄" },
    "庚": { emperor: "白帝", qi: "七", planet: "浩天", mountain: "西嶽", master: "真玄" },
    "辛": { emperor: "白帝", qi: "七", planet: "浩天", mountain: "西嶽", master: "真玄" },
    "壬": { emperor: "黑帝", qi: "五", planet: "玄天", mountain: "北嶽", master: "洞玄" },
    "癸": { emperor: "黑帝", qi: "五", planet: "玄天", mountain: "北嶽", master: "洞玄" }
};

const STAR_MAPPING = { "子": "貪狼", "丑": "巨門", "寅": "祿存", "卯": "文曲", "辰": "廉貞", "巳": "武曲", "午": "破軍", "未": "武曲", "申": "廉貞", "酉": "文曲", "戌": "祿存", "亥": "巨門" };

const MARSHAL_CANON = [
  { rank: 1, name: "王靈官", prefix: "都天糾察", rolePrefix: "都天糾察", palace: "都天府", office: "知天曹紀錄司", duty: "通天糾察事", zhi: "陽平治", altar: "玉堂贊化壇", jing: "降真集靈靖" },
  { rank: 2, name: "馬元帥", prefix: "斗口靈官", rolePrefix: "紫府掌", palace: "善仙宮", office: "知天曹紀錄司", duty: "三界便宜事", zhi: "葛璝治", altar: "三界集神壇", jing: "洞真自然靖" }, 
  { rank: 3, name: "趙元帥", prefix: "玄壇真君", rolePrefix: "知理刑", palace: "玄壇府", office: "知理刑紫府司", duty: "金輪執法事", zhi: "鶴鳴治", altar: "玄一守道壇", jing: "凝神志道靖" },
  { rank: 4, name: "溫元帥", prefix: "地祇主將", rolePrefix: "督察掌", palace: "玉京閣", office: "知天曹紀錄司", duty: "幽冥督察事", zhi: "女几治", altar: "紫微承慶壇", jing: "太上玄妙靖" }, 
  { rank: 5, name: "關元帥", prefix: "義勇武安", rolePrefix: "知軍目", palace: "崇寧殿", office: "知軍目武察司", duty: "義勇巡查事", zhi: "上清治", altar: "武德演法壇", jing: "威靈感應靖" },
  { rank: 6, name: "殷元帥", prefix: "至德太歲", rolePrefix: "至德掌", palace: "太歲府", office: "知太歲府紀錄司", duty: "至德考較事", zhi: "蓋竹治", altar: "太極宣化壇", jing: "延生保命靖" }, 
  { rank: 7, name: "岳元帥", prefix: "精忠武穆", rolePrefix: "知忠義", palace: "精忠宮", office: "知忠義糾察司", duty: "兵戈鎮壓事", zhi: "雲台治", altar: "忠義護國壇", jing: "靖難平亂靖" },
  { rank: 8, name: "康元帥", prefix: "仁聖元帥", rolePrefix: "仁聖掌", palace: "仁聖府", office: "知天曹紀錄司", duty: "生靈保命事", zhi: "浕口治", altar: "慈悲度世壇", jing: "保生益壽靖" },
  { rank: 9, name: "辛元帥", prefix: "雷霆判官", rolePrefix: "知雷霆", palace: "雷霆府", office: "知雷霆天曹司", duty: "電火威權事", zhi: "后城治", altar: "雷音演教壇", jing: "神霄輔化靖" },
  { rank: 10, name: "鄧元帥", prefix: "律令大神", rolePrefix: "知律令", palace: "律令司", office: "知律令五雷司", duty: "五雷執行事", zhi: "公慕治", altar: "五雷執法壇", jing: "震威攝邪靖" },
  { rank: 11, name: "張元帥", prefix: "南斗星君", rolePrefix: "知南斗", palace: "南斗宮", office: "知南斗注生司", duty: "延生註錄事", zhi: "平岡治", altar: "長生注壽壇", jing: "玄樞密運靖" },
  { rank: 12, name: "陶元帥", prefix: "北斗星君", rolePrefix: "知北斗", palace: "北斗閣", office: "知北斗禳災司", duty: "消災解厄事", zhi: "主簿治", altar: "北斗禳災壇", jing: "星輝護體靖" },
  { rank: 13, name: "龐元帥", prefix: "混元使者", rolePrefix: "知混元", palace: "混元觀", office: "知混元一氣司", duty: "陰陽判斷事", zhi: "玉堂治", altar: "混元一氣壇", jing: "太初歸真靖" },
  { rank: 14, name: "劉元帥", prefix: "紫微大將", rolePrefix: "知星府", palace: "紫微宮", office: "知星漢昭輝司", duty: "星辰運作事", zhi: "北邙治", altar: "星漢昭輝壇", jing: "紫府神光靖" },
  { rank: 15, name: "苟元帥", prefix: "天樞使者", rolePrefix: "知天樞", palace: "天樞院", office: "知天樞密運司", duty: "樞機密運事", zhi: "縑山治", altar: "天樞密旨壇", jing: "玄機內運靖" },
  { rank: 16, name: "畢元帥", prefix: "神霄判官", rolePrefix: "知神霄", palace: "神霄殿", office: "知火符傳遞司", duty: "火符傳遞事", zhi: "渠亭治", altar: "神霄火雲壇", jing: "流金火鈴靖" },
  { rank: 17, name: "李元帥", prefix: "鎮元大將", rolePrefix: "知地祇", palace: "鎮元觀", office: "知地靈安鎮司", duty: "地脈安鎮事", zhi: "稠稉治", altar: "地靈穩靖壇", jing: "安土地祇靖" },
  { rank: 18, name: "高元帥", prefix: "宣化真君", rolePrefix: "知教門", palace: "宣化府", office: "知正法演音司", duty: "教門弘法事", zhi: "真多治", altar: "正法演音壇", jing: "弘道宣化靖" },
  { rank: 19, name: "周元帥", prefix: "保仙元帥", rolePrefix: "巡察掌", palace: "保仙閣", office: "知巡遊糾察司", duty: "境內巡察事", zhi: "昌利治", altar: "太平護民壇", jing: "巡遊糾察靖" },
  { rank: 20, name: "謝元帥", prefix: "廣澤宮將", rolePrefix: "廣澤掌", palace: "廣澤宮", office: "知水雲降澤司", duty: "江河潤澤事", zhi: "棣上治", altar: "水雲降澤壇", jing: "洪恩廣佈靖" },
  { rank: 21, name: "任元帥", prefix: "無極元帥", rolePrefix: "兩儀掌", palace: "無極院", office: "知兩儀交泰司", duty: "乾坤調和事", zhi: "湧泉治", altar: "兩儀交泰壇", jing: "無為自然靖" },
  { rank: 22, name: "寧元帥", prefix: "慈航元帥", rolePrefix: "慈航掌", palace: "慈航殿", office: "知慈航渡厄司", duty: "濟度沉淪事", zhi: "本竹治", altar: "慈航渡厄壇", jing: "救苦尋聲靖" },
  { rank: 23, name: "藍元帥", prefix: "長生真君", rolePrefix: "百草掌", palace: "長生觀", office: "知百草靈丹司", duty: "藥道開展事", zhi: "白鹿治", altar: "百草靈丹壇", jing: "長生保命靖" },
  { rank: 24, name: "朱元帥", prefix: "忠義元帥", rolePrefix: "倫常掌", palace: "忠義宮", office: "知倫常演禮司", duty: "綱常維護事", zhi: "岡坻治", altar: "倫常演禮壇", jing: "守信不二靖" },
  { rank: 25, name: "鄭元帥", prefix: "威靈元帥", rolePrefix: "威靈掌", palace: "威靈府", office: "知威靈顯應司", duty: "妖邪掃除事", zhi: "蒙秦治", altar: "威靈顯應壇", jing: "伏魔除暴靖" },
  { rank: 26, name: "金元帥", prefix: "開元真君", rolePrefix: "精金掌", palace: "開元殿", office: "知精金淬煉司", duty: "金石鑄造事", zhi: "陽平治", altar: "精金淬煉壇", jing: "法器莊嚴靖" },
  { rank: 27, name: "黃元帥", prefix: "坤元元帥", rolePrefix: "后土掌", palace: "坤元府", office: "知后土坤載司", duty: "厚德載物事", zhi: "鹿堂治", altar: "收土坤載壇", jing: "承天效法靖" },
  { rank: 28, name: "曾元帥", prefix: "三元使者", rolePrefix: "三官掌", palace: "三元觀", office: "知三官考較司", duty: "考校功過事", zhi: "鶴鳴治", altar: "三官考較壇", jing: "賜福赦罪靖" },
  { rank: 29, name: "孟元帥", prefix: "武聖元帥", rolePrefix: "神武掌", palace: "武聖殿", office: "知神武衛道司", duty: "甲兵操練事", zhi: "女几治", altar: "神武衛道壇", jing: "威鎮海岱靖" },
  { rank: 30, name: "鐵元帥", prefix: "剛義元帥", rolePrefix: "剛正掌", palace: "剛義府", office: "知金光護法司", duty: "五金司掌事", zhi: "上清治", altar: "剛正不阿壇", jing: "金光護法靖" },
  { rank: 31, name: "田元帥", prefix: "九天風火", rolePrefix: "風火掌", palace: "風火院", office: "知九天風火司", duty: "五雷風火事", zhi: "公慕治", altar: "九天風火壇", jing: "風火開道靖" }, 
  { rank: 32, name: "玉元帥", prefix: "玉虛大將", rolePrefix: "玉虛掌", palace: "玉虛宮", office: "知玉虛朝聖司", duty: "玄通感應事", zhi: "雲台治", altar: "玉虛朝聖壇", jing: "感應道交靖" },
  { rank: 33, name: "石元帥", prefix: "石靈元帥", rolePrefix: "盤石掌", palace: "石靈殿", office: "知五嶽朝天司", duty: "山嶽鎮守事", zhi: "浕口治", altar: "五嶽朝天壇", jing: "盤石安穩靖" },
  { rank: 34, name: "常元帥", prefix: "常存真君", rolePrefix: "永恆掌", palace: "常存閣", office: "知永恆法脈司", duty: "恆久法界事", zhi: "后城治", altar: "永恆法脈壇", jing: "不生不滅靖" },
  { rank: 35, name: "何元帥", prefix: "三教元帥", rolePrefix: "三教掌", palace: "三教院", office: "知三教並圓司", duty: "儒道釋和事", zhi: "公慕治", altar: "三教並圓壇", jing: "大同世界靖" },
  { rank: 36, name: "姚元帥", prefix: "廣德真君", rolePrefix: "大德掌", palace: "廣德宮", office: "知大德廣生司", duty: "施予福報事", zhi: "平岡治", altar: "大德廣生壇", jing: "福緣廣佈靖" },
  { rank: 37, name: "伍元帥", prefix: "威猛元帥", rolePrefix: "剛勇掌", palace: "威猛殿", office: "知剛勇降魔司", duty: "伏虎降龍事", zhi: "主簿治", altar: "剛勇降魔壇", jing: "威武不屈靖" },
  { rank: 38, name: "卜元帥", prefix: "職術使者", rolePrefix: "河洛掌", palace: "玄機閣", office: "知先天術數司", duty: "易理推衍事", zhi: "玉堂治", altar: "先天術數壇", jing: "河洛神機靖" },
  { rank: 39, name: "雷元帥", prefix: "雷鳴元帥", rolePrefix: "雷祖掌", palace: "雷鳴府", office: "知九天雷祖司", duty: "九天震動事", zhi: "北邙治", altar: "九天雷祖壇", jing: "響雷破幽靖" },
  { rank: 40, name: "白元帥", prefix: "太白真君", rolePrefix: "太白掌", palace: "太白觀", office: "知白金肅靜司", duty: "西方肅殺事", zhi: "縑山治", altar: "白金肅靜壇", jing: "利劍斬妖靖" },
  { rank: 41, name: "沈元帥", prefix: "隱元元帥", rolePrefix: "奇門掌", palace: "隱元殿", office: "知奇門遁甲司", duty: "遁法施行事", zhi: "渠亭治", altar: "奇門遁甲壇", jing: "隱顯莫測靖" },
  { rank: 42, name: "郭元帥", prefix: "通明上相", rolePrefix: "通明掌", palace: "通明宮", office: "知守衛仙都司", duty: "天門手衛事", zhi: "稠稉治", altar: "通明上相壇", jing: "守衛仙都靖" },
  { rank: 43, name: "王高元帥", prefix: "萬福真君", rolePrefix: "萬福掌", palace: "萬福府", office: "知群仙考較司", duty: "群仙考較事", zhi: "真多治", altar: "萬壽無疆壇", jing: "福祿壽星靖" }
];

const getMarshalIdx = (off) => {
    const g = Math.floor(off / 4);
    if (off >= 48) return (18 + (g - 12)) % 43; 
    if (g >= 3 && off < 48) return (1 + g + 1) % 43; 
    return (1 + g) % 43; 
};

// ==========================================
// 第二區塊：全量翻譯對照表 (辭典核心)
// ==========================================

const ROLE_PREFIX_GLOSSARY = {
  "都天糾察": "天界最高執行官。負責巡視三界、糾正不正之氣與一切邪祟。",
  "紫府掌": "靈魂檔案總管。紫府為仙界公文往來與名籍存放之中心。",
  "知理刑": "法界裁判官。負責依天條審理冤情、判定是非與施予法界法律處分。",
  "督察掌": "駐壇總監察員。代表天廷監督法師行法是否合乎天條與科儀規範。",
  "知軍目": "神兵調遣官。負責管理並核對法師麾下所撥發之神兵馬匹與防務事項。",
  "至德掌": "道德與時運監控官。與六十甲子同步，考核法師之內在功德修持。",
  "知忠義": "忠誠度考評官。專司維護法師對道統之純粹性，防止私慾干擾法力。",
  "仁聖掌": "慈悲救護官。主理賑災、救度靈魂與撥發生命修復能量之公職。",
  "知雷霆": "雷部行政主管。掌握雷電能量之動員許可，為行使雷法的必要權限。",
  "知律令": "法令監督員。確保每一道行政命令符合法界法律程序，是秩序的守護者。",
  "知南斗 / 知北斗": "生死與命運管理局。南斗主生、北斗主死，負責添油、禳災與改運。",
  "知混元": "先天一氣調度官。混元為萬物根基，此職代表能調用最純粹的原始能量。",
  "知神霄": "高階雷法專員。代表法師具備進入神霄宮修習最高層級雷霆法理的資格。",
  "知星府": "星辰能量協調官。負責抵禦外來負面星煞對法師或信眾的干擾。",
  "知天樞": "宇宙運行樞紐員。控制北斗天樞核心，是調撥環境大氣運的關鍵職位。",
  "知地祇": "土地守護總監。負責調停地靈、龍脈、土地神與人類之間的和諧。",
  "知教門": "正法傳播官。負責管理經本、教育法師後學並維持法脈傳承之穩定。",
  "巡察掌": "法界巡邏警察。負責維護法師所在地之陰陽平衡與日常安防。",
  "廣澤掌": "水源與雨量計畫主管。負責調節區域內的水分能量，多用於祈雨或解災。",
  "兩儀掌": "陰陽平衡調節官。專門負責修復被扭曲的時空磁場或失衡的對立能量。",
  "慈航掌": "靈魂救濟員。專司拯救墜入迷途、恐懼或愛欲中無法脫身的靈魂。",
  "百草掌": "神農藥理主任。負責管理草木精氣與法醫藥理，是修復生靈體魄的主管。",
  "威靈掌": "驅邪前鋒官。具備強大的靈魂威壓，能直接退散惡質能量。",
  "倫常掌": "倫理秩序監督員。負責導正受損的家庭與社會關係能量，維護基本法度。",
  "精金掌": "法器淬煉官。負責監督法器鍛造過程，賦予其特定的靈性密度。",
  "后土掌": "大地承載力官。負責維持基地的承載能量，穩固建築與地理基層。",
  "三官掌": "三元功過考評員。負責核算天、地、水三界對眾生的善惡紀錄。",
  "神武掌": "神武防衛總監。負責強化法壇的防禦工事與神兵的作戰意志。",
  "剛正掌": "鐵面執法官。代表法師行使絕對公正的法權，不為私情所動搖。",
  "風火掌": "自然災害控制官。負責調度風雷火電等能量進行大面積的淨化任務。",
  "玉虛掌": "高階行政顧問。具備直接向高層上奏祕密公文與調度祕法資源的特權。",
  "盤石掌": "穩定性維護員。負責鎮守地脈中不穩定的區塊，防止能量流失。",
  "永恆掌": "靈脈傳承維護官。確保法師修行根基不受時間侵蝕，維持永恆靈性。",
  "三教掌": "文化融合協調官。負責處理與儒、佛及其他宗教界域的跨界合作。",
  "大德掌": "功德撥發主管。負責將累積的善德轉化為實質的法力回饋或福報。",
  "剛勇掌": "先鋒軍團指揮。具備強大衝勁，負責攻堅最為頑固的負面堡壘。",
  "河洛掌": "術數與變革官。負責依據河圖洛書之理推演變化，破解複雜禁制。",
  "雷祖掌": "雷霆總教官。負責培訓雷部神將，確保雷霆法能之純淨度。",
  "太白掌": "清淨肅殺官。具備如太白金星般的過濾能量，能過濾雜質、提升純度。",
  "奇門掌": "時空與遁法官。負責管理奇門遁甲之運作，隱藏行蹤或突襲邪祟。",
  "通明掌": "明鑑與感知官。負責提升法師的通靈覺察能力，洞悉虛實。",
  "萬福掌": "最終福德撥發官。負責在法事圓滿時，向信眾與法師撥發全方位的祝福。"
};

const PALACE_GLOSSARY = {
  "都天府": "天廷最高行政公署。所有三界申報與最高法令皆由此處發佈。",
  "善仙宮": "仙界人才選拔中心。存放具備善功、即將受封之靈魂名冊的場所。",
  "玄壇府": "正一法壇總部。負責武力守衛與財務審核的核心行政單位。",
  "玉京閣": "天廷圖書館。存放所有高級法術、符籙秘籍與宇宙公式之地。",
  "崇寧殿": "忠義能量之源。法師領受武裝力量、信用與勇氣加持的神聖殿堂。",
  "太歲府": "時間與甲子管理中心。負責年份更迭、流年吉凶核定的機關。",
  "精忠宮": "軍事保衛總部。負責平定動亂、軍事鎮壓與維持地方平靖之所。",
  "雷霆府": "雷部核心公署。所有雷法攻擊、霹靂能量皆由此簽發輸出。",
  "律令司": "法規執行部門。確保所有行政命令與法術操作符合法律程序。",
  "南斗宮": "生命管理中心。主理註生、添油、延命與福份上升的專門機構。",
  "北斗閣": "災難消除部門。專司抹除死籍、禳除凶星與化解人間苦厄。",
  "混元觀 / 無極院": "先天真氣源頭。法師修持內丹、連接原始宇宙能量的場所。",
  "天樞院": "宇宙運行控制室。掌管定位、星能分配與宇宙關鍵樞紐。",
  "紫微宮": "星宿統治中心。星辰運作與天體秩序之核心管理宮殿。",
  "神霄殿": "雷部最高境界。唯有獲得高階授權者方能進入的純淨雷能場。",
  "鎮元觀": "土地與龍脈守護站。處理所有關於大地地靈與陰陽交界事務。",
  "宣化府": "道教教育總部。管理經本印刷、道教教育與法脈傳承之行政中心。",
  "保仙閣 / 廣澤宮": "地方守護與水源計畫中心。負責降水計畫與區域性生態能量調節。",
  "慈航殿": "慈悲療癒中心。對受傷或受驚靈魂進行修復與加持的溫馨場域。",
  "長生觀": "修復與壽元維護處。專門負責管理長生不老藥理與靈氣修復法門。",
  "開元殿 / 開元觀": "一切法脈之開端。象徵新計畫的啟動與原始創造力的源頭。",
  "坤元府": "大地能量儲存所。與厚德載物相關的地理行政機關。",
  "三元觀": "三官大帝辦事處。負責審核三界功過紀錄的基層行政單位。",
  "武聖殿 / 剛義府": "戰鬥技能訓練所。提升神兵戰鬥力與法師意志品質的公署。",
  "風火院": "自然能量噴發室。負責管理暴風與天火等毀滅性或淨化性能量。",
  "玉虛宮": "高層神明議事廳。處理重大法界決策與跨維度事務的地方。",
  "石靈殿": "物質穩固中心。負責鎮守地殼穩定、山川能量與物質結構平衡。",
  "常存閣": "永恆能量保險庫。存放不因時間流逝而消逝的核心真氣與記憶。",
  "三教院": "跨領域文化中心。協調道、釋、儒三方能量互動與共融的事務所。",
  "廣德宮": "福報轉化中心。將善念轉化為實體德行回饋的加工單位。",
  "威猛殿": "戰力展示廳。存放神將戰甲、武器並負責展示法界威嚴的宮殿。",
  "玄機閣": "術數解析中心。解密宇宙密碼、推演因果軌跡的高科技法務所。",
  "雷鳴府": "聲波能量研究站。負責利用雷聲震懾邪惡、喚醒生靈自覺的機構。",
  "太白觀": "過濾與淨化站。負責精煉能量純度、去除混雜邪氣的專業部門。",
  "隱元殿 / 奇門殿": "機密行動總部。處理隱匿、潛入與高難度祕密任務的行政區。",
  "通明宮": "光明與覺悟中心。象徵徹底的透明、智慧與洞察一切真相的殿堂。",
  "萬福府": "最終祝福分配處。負責在法事結束後分發全方位好運與和平能量。"
};

const MARSHAL_CATEGORIES = [
  { id: 1, name: "糾察司法體系 (1-8位)", desc: "核心：威猛、公正。負責法師的人身安全、法壇監察與債務審理。", Marshals: MARSHAL_CANON.slice(0, 8) },
  { id: 2, name: "雷霆與星宿體系 (9-17位)", desc: "核心：效率、命運。負責行使雷法打擊邪祟，以及調整個人生死壽元。", Marshals: MARSHAL_CANON.slice(8, 17) },
  { id: 3, name: "教化與療癒體系 (18-24位)", desc: "核心：慈悲、傳承。負責弘揚道法、引領弟子以及進行醫藥與靈魂救助。", Marshals: MARSHAL_CANON.slice(17, 24) },
  { id: 4, name: "神威與守護體系 (25-34位)", desc: "核心：剛直、穩定。負責地理龍脈安鎮、法器煉製與核心法權守護。", Marshals: MARSHAL_CANON.slice(24, 34) },
  { id: 5, name: "全能與萬福體系 (35-43位)", desc: "核心：變革、福德。負責解析玄機、術數應用以及最終的萬福加持。", Marshals: MARSHAL_CANON.slice(34, 43) }
];

const DICTIONARY_DATA = [
  {
    category: "行政編制 (rolePrefix 官銜全譯)",
    icon: "Award",
    items: Object.entries(ROLE_PREFIX_GLOSSARY).map(([term, meaning]) => ({ term, meaning }))
  },
  {
    category: "公署地址 (palace 宮署全解)",
    icon: "Landmark",
    items: Object.entries(PALACE_GLOSSARY).map(([term, meaning]) => ({ term, meaning }))
  },
  {
    category: "法語術語 (行政與地理)",
    icon: "MapPin",
    items: [
      { term: "二十四治 (如：陽平治)", meaning: "源於張道陵天師建立的行政區劃。每一位法師的名籍都會歸屬於特定的治所，類似於法界的戶籍所在地。" },
      { term: "壇 / 靖 (如：三界集神壇)", meaning: "法師個人的專屬法力場域。『壇』代表公務身份，『靖』是法師修行的私室，也是上奏疏文時必須署名的識別碼。" },
      { term: "[左/右] 都領炁", meaning: "根據出生時辰的陰陽決定法師在法壇儀式中的站位方位。左為陽、右為陰，關乎行法時能量的匯聚點。" }
    ]
  },
  {
    category: "守護力量 (月將與使者)",
    icon: "UserCheck",
    items: [
      { term: "元神月將", meaning: "根據受職月份分配的十二位月將元神。祂們負責在特定的時令下對法師的元神進行能量加持。" },
      { term: "值日功曹使者", meaning: "法師行法時最親密的「公文傳遞員」。負責將法師燒化的表文以最快速度傳遞至天廷機關。" }
    ]
  }
];

// ==========================================
// 第三區塊：組件 UI
// ==========================================

export default function App() {
  const [tab, setTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogicInfo, setShowLogicInfo] = useState(false); 
  const [form, setForm] = useState({ name: '', gender: '男生', calendar: 'solar', year: '1987', month: '4', day: '10', hour: '申時' });
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState('');

  // 渲染 Icon 的輔助函數
  const renderIcon = (iconName) => {
    switch(iconName) {
      case "Award": return <Award className="text-amber-500" size={20}/>;
      case "Landmark": return <Landmark className="text-amber-500" size={20}/>;
      case "MapPin": return <MapPin className="text-amber-500" size={20}/>;
      case "UserCheck": return <UserCheck className="text-amber-500" size={20}/>;
      case "Swords": return <Swords className="text-amber-500" size={20}/>;
      default: return <Info className="text-amber-500" size={20}/>;
    }
  };

  const handleAction = () => {
    if (!form.name.trim()) return;
    setIsSpinning(true);
    setTimeout(() => {
      const yr = parseInt(form.year) || 1984;
      const mon = parseInt(form.month) || 1;
      const dayNum = parseInt(form.day) || 1;
      const calendarOffset = form.calendar === 'solar' ? 2 : 0;
      
      let off = (yr - 1984) % 60;
      if (off < 0) off += 60;
      const jiazi = JIAZI_60[off];
      const m = MARSHAL_CANON[getMarshalIdx(off)];
      const duling = YANG_HOURS.includes(form.hour) ? "左" : "右";
      const hl = HELUO_MAPPING[jiazi[0]];
      
      const monSpirit = MONTH_SPIRITS[(mon - 1 + calendarOffset) % 12];
      const dayDuty = DAY_DUTIES[(dayNum - 1 + calendarOffset) % DAY_DUTIES.length];
      const hourMsg = HOUR_MESSENGERS[form.hour];

      const output = {
          id: Date.now(), ...form, jiazi, marshal: m.name, prefix: m.prefix, rk: m.rank,
          al: m.altar, jn: m.jing, zh: m.zhi, dt: m.duty, pl: m.palace, office: m.office, rolePrefix: m.rolePrefix,
          st: STAR_MAPPING[jiazi[1]], hl, dl: duling, monSpirit, dayDuty, hourMsg,
          fullRole: form.gender === '男生' ? `${m.rolePrefix}${m.palace}仙官之職` : `封受${m.palace}淑人之位`
      };
      setResult(output);
      setTab('result');
      setIsSpinning(false);
    }, 600);
  };

  const handleSavePDF = () => {
    const element = document.getElementById('ordination-certificate');
    if (!element) return;
    window.scrollTo(0, 0);
    const opt = {
        margin: [5, 5], 
        filename: `萬法宗壇_職牒_${result.name}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#050505', 
          scrollY: 0, 
          width: 800,
          windowWidth: 800 
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#010101] text-[#e5d5b0] font-serif overflow-x-hidden selection:bg-amber-900/40">
      <style>{`
        .dynamic-gold { color: #FFD700 !important; font-weight: 900 !important; font-size: inherit !important; display: inline; }
        .text-content-row { font-size: 22px !important; line-height: 1.6; font-weight: 700; color: #fefefa; }
        .text-label { font-size: 14px !important; font-weight: 900; color: #d97706; opacity: 0.7; font-family: sans-serif; font-style: italic; text-transform: uppercase; letter-spacing: 0.2em; }
        .reporting-box { background: linear-gradient(to bottom, #0a0a0a, #050505); border: 1px solid #8a2318; border-left-width: 6px; box-shadow: inset 0 0 20px rgba(138, 35, 24, 0.2); }
        .ordination-paper { background: #050505; position: relative; overflow: hidden; width: 100%; }
        .glossary-card { background: rgba(15, 15, 15, 0.9); border: 1px solid rgba(212, 175, 55, 0.15); backdrop-blur-lg; }
      `}</style>

      <header className="sticky top-0 z-50 bg-black/90 border-b border-amber-900/30 px-6 py-4 flex justify-between items-center shadow-xl no-print backdrop-blur-md">
          <button onClick={() => setMenuOpen(true)} className="p-2 text-amber-50 active:scale-75 transition-all"><Menu size={24}/></button>
          <h1 className="tracking-widest text-amber-100 italic font-black text-base uppercase">正一職官法典系統</h1>
          <button onClick={() => setTab('explanation')} className={`p-2 transition-all ${tab === 'explanation' ? 'text-white scale-110' : 'text-amber-500'}`}><HelpCircle size={24}/></button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setMenuOpen(false)}></div>
            <div className="relative w-64 bg-[#0a0a0a] border-r border-amber-900/40 h-full p-8 flex flex-col shadow-2xl font-sans animate-in slide-in-from-left duration-300 text-left">
                <h2 className="text-amber-500 italic mb-10 border-b border-amber-900/20 pb-4 font-black text-lg tracking-widest flex items-center gap-2"><Shield size={20}/> 系統目錄</h2>
                <nav className="space-y-4 flex-1">
                    <button onClick={() => {setTab('home'); setMenuOpen(false);}} className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${tab === 'home' ? 'bg-amber-950/40 border-amber-500 text-amber-100' : 'border-zinc-900 text-zinc-400'}`}><Scroll size={20}/> <span className="font-bold">錄籍登記</span></button>
                    <button onClick={() => {setTab('catalog'); setMenuOpen(false);}} className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${tab === 'catalog' ? 'bg-amber-950/40 border-amber-500 text-amber-100' : 'border-zinc-900 text-zinc-400'}`}><BookOpen size={20}/> <span className="font-bold">映射全錄</span></button>
                    <button onClick={() => {setTab('explanation'); setMenuOpen(false);}} className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${tab === 'explanation' ? 'bg-amber-950/40 border-amber-500 text-amber-100' : 'border-zinc-900 text-zinc-400'}`}><HelpCircle size={20}/> <span className="font-bold">法語詞典</span></button>
                </nav>
            </div>
        </div>
      )}

      <main className="max-w-md mx-auto px-4 py-6 flex-1 w-full pb-24">
        {tab === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-500 text-center">
            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-zinc-900 shadow-2xl relative overflow-hidden text-zinc-300 text-left">
                <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-4 font-black text-xs text-center">
                    <span className="tracking-widest text-amber-100 uppercase italic flex items-center gap-2 font-black"><Activity size={14}/> 錄 籍 申 奏</span>
                    <div className="flex bg-black p-0.5 rounded-lg border border-zinc-800">
                        {['solar', 'lunar'].map(m => (
                            <button key={m} onClick={() => setForm({...form, calendar: m})} className={`px-4 py-1.5 rounded-md transition-all text-[10px] font-black ${form.calendar === m ? 'bg-amber-900 text-white shadow-lg' : 'text-zinc-700'}`}>{m === 'solar' ? '國曆輸入' : '農曆輸入'}</button>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="space-y-1">
                        <label className="font-black text-zinc-600 uppercase tracking-widest ml-1 italic text-[11px]">受職弟子姓名</label>
                        <input className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-5 font-bold text-amber-50 outline-none focus:border-amber-600 shadow-inner text-lg" placeholder="姓名" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 font-black text-sm text-center">
                        {['男生', '女生'].map(g => (
                            <button key={g} onClick={() => setForm({...form, gender: g})} className={`py-4 rounded-xl border transition-all ${form.gender === g ? 'bg-amber-950/40 border-amber-600 text-amber-100 shadow-xl' : 'bg-black border-zinc-900 text-zinc-700'}`}>{g === '男生' ? '乾造 (男)' : '坤造 (女)'}</button>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center font-black">
                        <div className="bg-black p-3 rounded-xl border border-zinc-800"><label className="block text-zinc-700 mb-1 text-[10px] uppercase italic font-sans">元辰(年)</label><input type="number" className="w-full bg-transparent text-amber-500 text-center outline-none font-bold text-xl" value={form.year} onChange={e => setForm({...form, year: e.target.value})} /></div>
                        <div className="bg-black p-3 rounded-xl border border-zinc-800"><label className="block text-zinc-700 mb-1 text-[10px] uppercase italic font-sans">{form.calendar === 'solar' ? '國曆月' : '農曆月'}</label><select className="w-full bg-transparent font-bold text-amber-100 appearance-none outline-none text-center text-xl" value={form.month} onChange={e => setForm({...form, month: e.target.value})}>{Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m} className="bg-black">{m}月</option>)}</select></div>
                        <div className="bg-black p-3 rounded-xl border border-zinc-800"><label className="block text-zinc-700 mb-1 text-[10px] uppercase italic font-sans">{form.calendar === 'solar' ? '國曆日' : '農曆日'}</label><select className="w-full bg-transparent font-bold text-amber-100 appearance-none outline-none text-center text-xl" value={form.day} onChange={e => setForm({...form, day: e.target.value})}>{Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d} className="bg-black">{d}日</option>)}</select></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 font-black text-[11px]">
                        {Object.keys(HOUR_MESSENGERS).map(s => (
                            <button key={s} onClick={() => setForm({...form, hour: s})} className={`py-3 rounded-xl border transition-all ${form.hour === s ? 'bg-amber-600 text-black border-amber-400 scale-105 shadow-lg' : 'bg-black/40 border-zinc-900 text-zinc-700'}`}>{s}</button>
                        ))}
                    </div>
                </div>
                <button onClick={handleAction} disabled={!form.name || isSpinning} className={`w-full mt-10 py-5 rounded-2xl tracking-[0.4em] font-black text-base transition-all shadow-2xl ${(!form.name || isSpinning) ? 'bg-zinc-900 text-zinc-800' : 'bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-black active:scale-95'}`}>
                    {isSpinning ? "正 在 核 定..." : "定 格 分 發 職 官"}
                </button>
            </div>
          </div>
        )}

        {tab === 'explanation' && (
          <div className="space-y-10 animate-in slide-in-from-right duration-500 font-sans pb-40 px-2 text-left">
            <div className="flex items-center gap-3 border-l-4 border-amber-600 pl-4 mb-8">
              <h2 className="text-xl font-black text-amber-100 tracking-widest italic uppercase">法語全量翻譯詞典</h2>
            </div>
            {DICTIONARY_DATA.map((group, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-amber-600 font-black text-sm tracking-[0.2em] uppercase opacity-80 pl-2 flex items-center gap-2">
                  {renderIcon(group.icon)} {group.category}
                </h3>
                <div className="space-y-3">
                  {group.items.map((item, i) => (
                    <div key={i} className="glossary-card p-5 rounded-2xl shadow-xl border-l-2 border-l-amber-600/40">
                      <h4 className="text-lg font-black text-amber-200 mb-1">{item.term}</h4>
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="space-y-4">
              <h3 className="text-amber-600 font-black text-sm tracking-[0.2em] uppercase opacity-80 pl-2 flex items-center gap-2">
                <Swords size={20} className="text-amber-500" /> 四十三位元帥法職分類
              </h3>
              {MARSHAL_CATEGORIES.map((cat) => (
                <div key={cat.id} className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800 shadow-inner mb-4">
                  <h4 className="text-amber-100 font-black mb-1">{cat.name}</h4>
                  <p className="text-zinc-500 text-[10px] mb-4 italic">{cat.desc}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.Marshals.map(m => (
                      <div key={m.rank} className="bg-black/50 p-2 rounded-lg text-[10px] flex items-center gap-2">
                        <span className="text-amber-600 font-bold">#{m.rank}</span>
                        <span className="text-zinc-300 font-black">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'result' && result && (
          <div className="animate-in zoom-in-95 duration-700 pb-20 font-serif text-center text-zinc-300">
              <div className="mb-10 no-print space-y-4 text-left px-1">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-label block italic text-left tracking-widest font-black">行法奏職口訣 (依古籍簡化)</span>
                    <button onClick={() => setTab('explanation')} className="text-xs text-amber-600 underline font-sans font-black flex items-center gap-1"><HelpCircle size={14}/>翻譯解碼</button>
                  </div>
                  <div className="reporting-box rounded-2xl p-6 text-content-row shadow-2xl">
                      <div className="leading-relaxed">
                          太上三五都功職 <span className="dynamic-gold font-bold">{result.rolePrefix}{result.pl}</span>，知 <span className="dynamic-gold font-bold">{result.office}</span> 兼 <span className="dynamic-gold font-bold">{result.dt}</span>。隸 <span className="dynamic-gold font-bold">{result.prefix}{result.marshal}</span> 麾下，弟子 <span className="dynamic-gold font-bold">{result.name}</span> 稽首。
                      </div>
                  </div>
              </div>

              <div id="ordination-certificate" className="ordination-paper rounded-2xl p-0.5 shadow-2xl font-serif">
                  <div className="bg-[#050505] p-8 relative rounded-2xl border border-amber-900/10">
                      <div className="text-center mb-10 border-b border-amber-900/20 pb-8">
                          <div className="inline-block px-10 py-1.5 border border-amber-600/30 mb-8 font-sans"><span className="text-amber-50 tracking-[1.5em] uppercase italic text-xs font-black font-sans">萬法宗壇</span></div>
                          <h2 className="font-black text-amber-100 tracking-[0.3em] drop-shadow-2xl text-3xl italic uppercase">職官分發告牒</h2>
                      </div>
                      <div className="space-y-12 leading-relaxed px-2 font-black text-left">
                          <div className="space-y-10">
                              <div className="flex flex-col space-y-2">
                                  <span className="text-label font-sans italic opacity-60">一 奏 受</span>
                                  <div className="pl-4 border-l-2 border-amber-900/40 py-1 text-content-row">
                                      <span className="block text-white opacity-80 font-bold text-sm mb-1 italic uppercase font-sans">太上三五都功經籙</span>
                                      <span className="block dynamic-gold">{result.fullRole}</span>
                                  </div>
                              </div>
                              <div className="flex flex-col space-y-2">
                                  <span className="text-label font-sans italic opacity-60">一 補 充</span>
                                  <div className="pl-4 border-l-2 border-amber-900/40 py-1 text-content-row">
                                      <span className="block dynamic-gold font-bold">{result.office}</span>
                                      <div className="text-sm italic text-zinc-500 mt-1 font-sans">監理職權：</div>
                                      <span className="block text-zinc-300">兼 <span className="dynamic-gold font-bold">{result.dt}</span></span>
                                      <span className="block text-zinc-400">並受 <span className="dynamic-gold font-bold">{result.dayDuty}</span></span>
                                  </div>
                              </div>
                              <div className="flex flex-col space-y-2">
                                  <span className="text-label font-sans italic opacity-60">一 奏 立</span>
                                  <div className="pl-4 border-l-2 border-amber-900/40 py-1 text-content-row">
                                      <span><span className="dynamic-gold font-bold">{result.al}</span> <span className="dynamic-gold font-bold">{result.jn}</span></span>
                                  </div>
                              </div>
                              <div className="flex flex-col space-y-2">
                                  <span className="text-label font-sans italic opacity-60 uppercase tracking-widest font-sans">一 泰玄都省正一平炁宮</span>
                                  <div className="pl-4 border-l-2 border-amber-900/40 py-1 text-content-row">
                                      <span>係 天師 <span className="dynamic-gold font-bold">{result.zh}</span> <span className="dynamic-gold font-bold">{result.dl}</span>都領炁</span>
                                      <div className="text-sm text-zinc-500 mt-1 italic font-sans uppercase font-sans">隨身功曹：<span className="dynamic-gold font-bold">{result.hourMsg}</span></div>
                                  </div>
                              </div>
                              <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-zinc-900 shadow-inner">
                                  <div className="flex flex-col space-y-5 text-left">
                                      <div className="pl-4 border-l-2 border-amber-900/20 py-1 text-content-row text-zinc-300">
                                          <span className="italic"><span className="dynamic-gold font-bold">{result.hl.mountain}{result.hl.emperor}{result.hl.qi}</span> 炁真人</span>
                                      </div>
                                      <div className="pl-4 border-l-2 border-amber-900/20 py-1 text-content-row text-zinc-300">
                                          <span className="italic"><span className="dynamic-gold font-bold">{result.hl.qi}</span> 炁君 <span className="dynamic-gold font-bold">{result.hl.planet}</span> 三五步罡</span>
                                          <span className="block italic mt-1 font-bold font-sans">元命應 <span className="dynamic-gold font-bold">{result.hl.master}</span> 先生</span>
                                          <div className="text-sm text-zinc-500 mt-1 italic font-sans uppercase font-sans">元神：<span className="dynamic-gold font-bold">{result.monSpirit}</span>月將加持</div>
                                      </div>
                                      <div className="pl-4 border-l-2 border-amber-900/20 py-1 text-content-row text-zinc-400">
                                          <span className="italic">配屬本命北斗 <span className="dynamic-gold font-bold">{result.st}</span> 星君</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex flex-col space-y-4 pt-10 border-t border-zinc-900/50 text-left font-serif">
                                  <span className="text-label font-sans italic tracking-widest opacity-60 uppercase font-sans">一 奏 撥</span>
                                  <div className="flex flex-col pl-4 py-2 border-l-2 border-amber-900/40 text-content-row">
                                      <span className="text-zinc-300 font-bold uppercase"><span className="dynamic-gold font-bold">{result.prefix}{result.marshal}</span> 麾下</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="mt-16 flex flex-col space-y-4 no-print font-sans font-black px-4 text-center">
                  <button onClick={handleSavePDF} className="w-full bg-gradient-to-b from-amber-500 to-amber-700 text-black py-4 rounded-xl active:scale-95 shadow-2xl transition-all font-bold tracking-widest text-base uppercase font-sans">儲 存 完 整 PDF 牒 文</button>
                  <button onClick={() => setTab('home')} className="w-full bg-zinc-900/50 text-zinc-600 py-3.5 rounded-xl active:scale-95 tracking-widest italic border border-zinc-900 transition-all font-bold text-xs uppercase font-sans">重新核定登記</button>
              </div>
          </div>
        )}

        {tab === 'catalog' && (
          <div className="animate-in slide-in-from-right duration-500 pb-40 space-y-6 font-sans text-left px-2">
              <h2 className="italic border-l-4 border-amber-600 pl-4 tracking-widest text-amber-100 font-black flex items-center gap-2 text-xl uppercase"><BookOpen size={20}/> 法統全錄映射 (1984-2043)</h2>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                <input className="w-full bg-black border border-zinc-900 rounded-xl py-4 pl-12 pr-4 font-bold text-amber-50 shadow-2xl outline-none focus:border-amber-600 transition-all shadow-inner font-sans" placeholder="搜尋年份、甲子或元帥..." value={catalogQuery} onChange={e => setCatalogQuery(e.target.value)} />
              </div>
              <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-900 p-4 shadow-2xl font-black text-center">
                  <div className="grid grid-cols-2 gap-3 h-[70vh] overflow-y-auto custom-scrollbar px-1 text-xs text-zinc-300">
                      {JIAZI_60.map((name, index) => {
                          const cycleYear = 1984 + index;
                          const m = MARSHAL_CANON[getMarshalIdx(index)];
                          if (catalogQuery && !name.includes(catalogQuery) && !cycleYear.toString().includes(catalogQuery) && !m.name.includes(catalogQuery)) return null;
                          const isGroup = index % 4 === 0;
                          return (
                              <div key={name} className={`bg-zinc-950/40 p-5 rounded-3xl border border-zinc-900/60 flex flex-col items-center justify-center space-y-2 transition-all ${isGroup ? 'border-l-2 border-l-amber-600/40' : ''}`}>
                                  <div className="flex justify-between w-full px-1 items-center opacity-60"><span className="text-zinc-800 font-sans font-black">#{m.rank}</span><span className="text-zinc-500 font-bold">{cycleYear}</span></div>
                                  <span className="text-zinc-400 font-black text-sm">{name}</span>
                                  <span className="block font-black text-amber-600 italic tracking-tighter uppercase font-serif text-lg">{m.name}</span>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-3xl border-t border-amber-900/20 p-4 pb-8 z-50 max-w-md mx-auto rounded-t-[2.5rem] shadow-2xl no-print font-sans font-black text-[11px]">
          <div className="flex justify-around items-center px-4">
              <button onClick={() => setTab('home')} className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-2xl transition-all relative ${tab === 'home' || tab === 'result' ? 'text-amber-400 scale-110' : 'text-zinc-700 opacity-60'}`}>
                  <Scroll size={20}/>
                  <span className="uppercase tracking-widest font-bold">登記</span>
              </button>
              <button onClick={() => setTab('catalog')} className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-2xl transition-all relative ${tab === 'catalog' ? 'text-amber-400 scale-110' : 'text-zinc-700 opacity-60'}`}>
                  <BookOpen size={20}/>
                  <span className="uppercase tracking-widest font-bold">映射</span>
              </button>
              <button onClick={() => setTab('explanation')} className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-2xl transition-all relative ${tab === 'explanation' ? 'text-amber-400 scale-110' : 'text-zinc-700 opacity-60'}`}>
                  <HelpCircle size={20}/>
                  <span className="uppercase tracking-widest font-bold">詞典</span>
              </button>
          </div>
      </nav>
    </div>
  );
}
