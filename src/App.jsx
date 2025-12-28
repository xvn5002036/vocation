import { useMemo, useState } from "react";

import { STEMS, BRANCHES, STEM_CORRELATION } from "./constants/basic";
import { JIAZI_ZHI_MAPPING, ZODIAC_MAPPING } from "./constants/mapping";
import { RANK_SYSTEM } from "./constants/rank";
import { MARSHALS_DATA } from "./constants/marshals_data";
import { assignRankByZodiac } from "./utils/rankAssign";
import { scoreMarshals } from "./utils/marshalScore";


// 西曆 → 甲子（1984 = 甲子）
function getGanzhiFromSolarYear(year) {
  const baseYear = 1984;
  const offset = year - baseYear;
  const index = ((offset % 60) + 60) % 60;
  const stem = STEMS[index % 10];
  const branch = BRANCHES[index % 12];
  return { stem, branch, key: `${stem}${branch}`, index };
}

// 🔒 法統校準：mapping.js 指定官職優先
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
  // 輸入模式
  const [inputMode, setInputMode] = useState("solarYear");

  // 年份 / 甲子
  const [solarYear, setSolarYear] = useState(1987); // 丁卯
  const [selectedJiaziKey, setSelectedJiaziKey] = useState("丁卯");

  // 生辰欄位（預留）
  const [month, setMonth] = useState(4);
  const [day, setDay] = useState(10);
  const [hour, setHour] = useState(16);
  const [gender, setGender] = useState("male");

  // 生肖（可覆寫）
  const [zodiacOverride, setZodiacOverride] = useState("auto");

  // 干支計算
  const ganzhi = useMemo(() => {
    if (inputMode === "jiazi") {
      return {
        stem: selectedJiaziKey[0],
        branch: selectedJiaziKey[1],
        key: selectedJiaziKey,
      };
    }
    return getGanzhiFromSolarYear(solarYear);
  }, [inputMode, selectedJiaziKey, solarYear]);

  // 甲子 → 治壇靖
  const mapping = useMemo(() => {
    return JIAZI_ZHI_MAPPING.find((m) => m.key === ganzhi.key) || {};
  }, [ganzhi.key]);

  const stemMeta = STEM_CORRELATION[ganzhi.stem] || {};

  const branchForZodiac =
    zodiacOverride === "auto" ? ganzhi.branch : zodiacOverride;

  const zodiacMeta = ZODIAC_MAPPING[branchForZodiac] || {};

  // ⭐ 正式職務分發（生肖 + 性別）
  const assignedRank = useMemo(() => {
    return assignRankByZodiac(branchForZodiac, gender);
  }, [branchForZodiac, gender]);

  // ⭐ 官職決策優先序：
  // 1. mapping.js（法統指定，如 丁卯 / 乙亥）
  // 2. rankAssign（生肖文武判）
  const finalOfficialKey = mapping.official || assignedRank.officialKey;

// ⭐ 元帥推薦（正式）
const marshalResult = useMemo(() => {
  return scoreMarshals({
    stem: ganzhi.stem,
    branch: branchForZodiac,
    officialKey: finalOfficialKey,
  });
}, [ganzhi.stem, branchForZodiac, finalOfficialKey]);

const mainMarshal = marshalResult.main;
const assistantMarshals = marshalResult.assistants || [];
  
  const finalQiTitle = mapping.official
    ? getQiTitleFromOfficial(mapping.official)
    : assignedRank.qiTitle;

  // 元帥展示（預覽）
  const marshalPreview = useMemo(() => {
    return MARSHALS_DATA.slice(0, 6);
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-4 font-serif text-gray-900">
      <header className="mb-4 text-center">
        <h1 className="text-xl font-bold">正一法壇職官分發系統</h1>
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

      {/* 疏文區 */}
      <section className="rounded-lg bg-orange-50 p-4 leading-8 border">
        <p>
          一奏立「
          <span className="font-bold text-orange-800">{mapping.tan}</span>
          」壇「
          <span className="font-bold text-orange-800">{mapping.jing}</span>
          」靖，一奏玄都省正一平炁宮炁 天師「
          <span className="font-bold text-orange-800">{mapping.name}</span>
          」治「
          <span className="font-bold text-orange-800">{finalQiTitle}</span>
          」炁，三然君赤天三五步罡元命應「
          <span className="font-bold text-orange-800">{mapping.title}</span>
          」先生「
          <span className="font-bold text-orange-800">
            {stemMeta.direction}
          </span>
          」嶽「
          <span className="font-bold text-orange-800">{stemMeta.color}</span>
          」帝「
          <span className="font-bold text-orange-800">{stemMeta.qi}</span>
          」炁真人
        </p>

        <div className="mt-4 text-sm text-gray-700 space-y-1">
          <p>
            年干支：
            <span className="ml-1 font-bold text-orange-800">
              {ganzhi.key}
            </span>
          </p>
          <p>
            生肖：
            <span className="ml-1 font-bold text-orange-800">
              {zodiacMeta.animal}（{zodiacMeta.trait}）
            </span>
          </p>
          <p>
            官職來源：
            <span className="ml-1 font-bold text-orange-800">
              {mapping.official ? "法統指定" : "生肖分發"}
            </span>
          </p>
        </div>
      </section>

      {/* 元帥預覽 */}
      <section className="mt-6 rounded-lg border bg-white/60 p-4">
        <h2 className="font-bold mb-3">元帥資料庫（預覽）</h2>
        <div className="space-y-3">
          {marshalPreview.map((m) => (
            <div key={m.id} className="rounded border bg-orange-50 p-3">
              <div className="font-bold text-orange-800">
                {m.name}／{m.title}
              </div>
              <div className="text-sm mt-1">{m.visualization}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
