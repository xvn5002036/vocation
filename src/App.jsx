import { useMemo, useState } from "react";

import { STEMS, BRANCHES, STEM_CORRELATION } from "./constants/basic";
import { JIAZI_ZHI_MAPPING, ZODIAC_MAPPING } from "./constants/mapping";
import { RANK_SYSTEM } from "./constants/rank";
import { MARSHALS_DATA } from "./constants/marshals_data";

// 西曆 → 甲子（1984 = 甲子）
function getGanzhiFromSolarYear(year) {
  const baseYear = 1984;
  const offset = year - baseYear;
  const index = ((offset % 60) + 60) % 60;
  const stem = STEMS[index % 10];
  const branch = BRANCHES[index % 12];
  return { stem, branch, key: `${stem}${branch}`, index };
}

function getQiTitleFromOfficial(officialKey) {
  let qiTitle = "";
  Object.values(RANK_SYSTEM).forEach((office) => {
    office.ranks.forEach((r) => {
      if (r.key === officialKey) qiTitle = r.qiTitle;
    });
  });
  return qiTitle;
}

export default function App() {
  // 1) 輸入模式
  const [inputMode, setInputMode] = useState("solarYear"); // solarYear | jiazi

  // 2) 西曆輸入（最少先做「年」以對應 60 甲子治所）
  const [solarYear, setSolarYear] = useState(1987); // 預設丁卯

  // 3) 直接選 60 甲子（方便 Benchmark）
  const [selectedJiaziKey, setSelectedJiaziKey] = useState("丁卯");

  // 4) 八字其他欄位（先做 UI，不省略；後續你要接真正八字演算再串 utils）
  const [month, setMonth] = useState(4);
  const [day, setDay] = useState(10);
  const [hour, setHour] = useState(16); // 0-23
  const [gender, setGender] = useState("male"); // male | female

  // 5) 生肖：預設跟年支走，但允許覆寫（授籙分發常有需要）
  const [zodiacOverride, setZodiacOverride] = useState("auto"); // auto | 子..亥

  const ganzhi = useMemo(() => {
    if (inputMode === "jiazi") {
      const stem = selectedJiaziKey.slice(0, 1);
      const branch = selectedJiaziKey.slice(1, 2);
      return { stem, branch, key: selectedJiaziKey };
    }
    return getGanzhiFromSolarYear(solarYear);
  }, [inputMode, selectedJiaziKey, solarYear]);

  const mapping = useMemo(() => {
    return JIAZI_ZHI_MAPPING.find((m) => m.key === ganzhi.key) || {};
  }, [ganzhi.key]);

  const stemMeta = STEM_CORRELATION[ganzhi.stem] || {};
  const branchForZodiac = zodiacOverride === "auto" ? ganzhi.branch : zodiacOverride;
  const zodiacMeta = ZODIAC_MAPPING[branchForZodiac] || {};

  const qiTitle = useMemo(() => {
    return getQiTitleFromOfficial(mapping.official);
  }, [mapping.official]);

  // （先給 UI 用）元帥候選展示：目前先列前 6 位，後續你接 marshalScore.js 再做排序推薦
  const marshalPreview = useMemo(() => {
    return (MARSHALS_DATA || []).slice(0, 6);
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-4 font-serif text-gray-900">
      <header className="mb-4 text-center">
        <h1 className="text-xl font-bold">正一法壇職官分發系統</h1>
        <p className="text-sm text-gray-700 mt-1">
          以年干支對應治所／壇靖／炁職，並保留八字欄位供後續擴充
        </p>
      </header>

      {/* 輸入區：不省略 */}
      <section className="mb-6 rounded-lg border bg-white/60 p-4">
        <div className="mb-4">
          <label className="block mb-1">輸入模式</label>
          <select
            value={inputMode}
            onChange={(e) => setInputMode(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="solarYear">用西曆年推算年干支</option>
            <option value="jiazi">直接選 60 甲子（Benchmark / 校準用）</option>
          </select>
        </div>

        {inputMode === "solarYear" ? (
          <div className="mb-4">
            <label className="block mb-1">西曆出生年</label>
            <input
              type="number"
              value={solarYear}
              onChange={(e) => setSolarYear(Number(e.target.value))}
              className="w-full rounded border p-2"
              inputMode="numeric"
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block mb-1">直接選年干支（60 甲子）</label>
            <select
              value={selectedJiaziKey}
              onChange={(e) => setSelectedJiaziKey(e.target.value)}
              className="w-full rounded border p-2"
            >
              {JIAZI_ZHI_MAPPING.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.key}｜{m.name}｜{m.tan}｜{m.jing}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block mb-1">月（暫作欄位）</label>
            <input
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full rounded border p-2"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block mb-1">日（暫作欄位）</label>
            <input
              type="number"
              min={1}
              max={31}
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full rounded border p-2"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block mb-1">時（0–23，暫作欄位）</label>
            <input
              type="number"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="w-full rounded border p-2"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1">性別</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="male">乾道</option>
              <option value="female">坤道</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">生肖（可覆寫）</label>
            <select
              value={zodiacOverride}
              onChange={(e) => setZodiacOverride(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="auto">自動（依年支）</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}（{ZODIAC_MAPPING[b]?.animal}／{ZODIAC_MAPPING[b]?.trait}）
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 疏文：完全照你的格式 */}
      <section className="rounded-lg bg-orange-50 p-4 leading-8 border">
        <p>
          一奏立「
          <span className="font-bold text-orange-800">{mapping.tan}</span>
          」壇「
          <span className="font-bold text-orange-800">{mapping.jing}</span>
          」靖，一奏玄都省正一平炁宮炁 天師「
          <span className="font-bold text-orange-800">{mapping.name}</span>
          」治「
          <span className="font-bold text-orange-800">{qiTitle}</span>
          」炁，三然君赤天三五步罡元命應「
          <span className="font-bold text-orange-800">{mapping.title}</span>
          」先生「
          <span className="font-bold text-orange-800">{stemMeta.direction}</span>
          」嶽「
          <span className="font-bold text-orange-800">{stemMeta.color}</span>
          」帝「
          <span className="font-bold text-orange-800">{stemMeta.qi}</span>
          」炁真人
        </p>

        <div className="mt-4 text-sm text-gray-700 space-y-1">
          <p>
            年干支：
            <span className="ml-1 font-bold text-orange-800">{ganzhi.key}</span>
            <span className="ml-2">
              （{ganzhi.stem}干 / {ganzhi.branch}支）
            </span>
          </p>
          <p>
            生肖：
            <span className="ml-1 font-bold text-orange-800">
              {zodiacMeta.animal}（{zodiacMeta.trait}）
            </span>
          </p>
          <p>
            生辰欄位（暫存）：
            <span className="ml-1 font-bold text-orange-800">
              {month}月{day}日 {hour}時
            </span>
            <span className="ml-2">｜{gender === "male" ? "乾道" : "坤道"}</span>
          </p>
        </div>
      </section>

      {/* 元帥區（先展示；後續你要「推薦」再串 marshalScore.js） */}
      <section className="mt-6 rounded-lg border bg-white/60 p-4">
        <h2 className="font-bold mb-3">元帥資料庫（展示）</h2>
        <div className="space-y-3">
          {marshalPreview.map((m) => (
            <div key={m.id} className="rounded border bg-orange-50 p-3">
              <div className="font-bold text-orange-800">
                {m.name}／{m.title}
              </div>
              <div className="text-sm text-gray-700 mt-1">
                <span className="font-bold">存思：</span>{m.visualization}
              </div>
              <div className="text-sm text-gray-700 mt-1">
                <span className="font-bold">印契：</span>{m.mudra}
              </div>
              <div className="text-sm text-gray-700 mt-1">
                <span className="font-bold">咒語：</span>{m.mantra}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
