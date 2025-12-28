import { useMemo, useState } from "react";

import { STEMS, BRANCHES, STEM_CORRELATION } from "./constants/basic";
import { JIAZI_ZHI_MAPPING, ZODIAC_MAPPING } from "./constants/mapping";
import { RANK_SYSTEM } from "./constants/rank";
import { MARSHALS_DATA } from "./constants/marshals_data";

import { assignRankByZodiac } from "./utils/rankAssign";
import { scoreMarshals } from "./utils/marshalScore";
import { printPetition } from "./utils/print";

/* =========================
   干支計算（1984 為甲子）
========================= */
function getGanzhiFromSolarYear(year) {
  const baseYear = 1984;
  const offset = year - baseYear;
  const index = ((offset % 60) + 60) % 60;
  const stem = STEMS[index % 10];
  const branch = BRANCHES[index % 12];
  return { stem, branch, key: `${stem}${branch}` };
}

/* =========================
   官職 → 炁名（法統）
========================= */
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
  /* ========= 輸入狀態 ========= */
  const [inputMode, setInputMode] = useState("solarYear"); // solarYear | jiazi
  const [solarYear, setSolarYear] = useState(1987); // 丁卯
  const [selectedJiaziKey, setSelectedJiaziKey] = useState("丁卯");

  const [month, setMonth] = useState(4);
  const [day, setDay] = useState(10);
  const [hour, setHour] = useState(16);

  const [gender, setGender] = useState("male");
  const [zodiacOverride, setZodiacOverride] = useState("auto");

  /* ========= 干支 ========= */
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

  /* ========= 法統對應 ========= */
  const mapping = useMemo(() => {
    return JIAZI_ZHI_MAPPING.find((m) => m.key === ganzhi.key) || {};
  }, [ganzhi.key]);

  const stemMeta = STEM_CORRELATION[ganzhi.stem] || {};

  const branchForZodiac =
    zodiacOverride === "auto" ? ganzhi.branch : zodiacOverride;

  const zodiacMeta = ZODIAC_MAPPING[branchForZodiac] || {};

  /* ========= 官職分發 ========= */
  const assignedRank = useMemo(() => {
    return assignRankByZodiac(branchForZodiac, gender);
  }, [branchForZodiac, gender]);

  // 法統優先（丁卯 / 乙亥）
  const finalOfficialKey = mapping.official || assignedRank.officialKey;

  const finalQiTitle = mapping.official
    ? getQiTitleFromOfficial(mapping.official)
    : assignedRank.qiTitle;

  /* ========= 元帥推薦 ========= */
  const marshalResult = useMemo(() => {
    return scoreMarshals({
      stem: ganzhi.stem,
      branch: branchForZodiac,
      officialKey: finalOfficialKey,
    });
  }, [ganzhi.stem, branchForZodiac, finalOfficialKey]);

  const mainMarshal = marshalResult.main;
  const assistantMarshals = marshalResult.assistants || [];

  /* ========= UI ========= */
  return (
    <div className="min-h-screen bg-orange-50 p-4 font-serif text-gray-900">
      <h1 className="text-xl font-bold text-center mb-4">
        正一法壇職官分發系統
      </h1>

      {/* ===== 輸入區 ===== */}
      <div className="space-y-4 mb-6">
        <select
          className="w-full rounded border p-2"
          value={inputMode}
          onChange={(e) => setInputMode(e.target.value)}
        >
          <option value="solarYear">西曆年推算</option>
          <option value="jiazi">直接選 60 甲子</option>
        </select>

        {inputMode === "solarYear" ? (
          <input
            type="number"
            className="w-full rounded border p-2"
            value={solarYear}
            onChange={(e) => setSolarYear(Number(e.target.value))}
          />
        ) : (
          <select
            className="w-full rounded border p-2"
            value={selectedJiaziKey}
            onChange={(e) => setSelectedJiaziKey(e.target.value)}
          >
            {JIAZI_ZHI_MAPPING.map((m) => (
              <option key={m.key} value={m.key}>
                {m.key}｜{m.name}
              </option>
            ))}
          </select>
        )}

        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            className="rounded border p-2"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
          <input
            type="number"
            className="rounded border p-2"
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
          />
          <input
            type="number"
            className="rounded border p-2"
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
          />
        </div>

        <select
          className="w-full rounded border p-2"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="male">乾道</option>
          <option value="female">坤道</option>
        </select>

        <select
          className="w-full rounded border p-2"
          value={zodiacOverride}
          onChange={(e) => setZodiacOverride(e.target.value)}
        >
          <option value="auto">生肖自動</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}（{ZODIAC_MAPPING[b]?.animal}）
            </option>
          ))}
        </select>
      </div>

      {/* ===== 疏文 ===== */}
      <div className="rounded border bg-orange-50 p-4 leading-8">
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
      </div>

      {/* ===== 元帥 ===== */}
      <div className="mt-6 space-y-4">
        {mainMarshal && (
          <div className="rounded border bg-orange-50 p-4">
            <div className="font-bold text-orange-800">
              主壇元帥：{mainMarshal.name}
            </div>
            <div className="text-sm">{mainMarshal.visualization}</div>
          </div>
        )}

        {assistantMarshals.map((m) => (
          <div key={m.id} className="rounded border bg-orange-50 p-3">
            <div className="font-bold text-orange-800">
              輔壇：{m.name}
            </div>
            <div className="text-sm">{m.visualization}</div>
          </div>
        ))}
      </div>

      {/* ===== 列印 ===== */}
      <button
        onClick={printPetition}
        className="mt-6 w-full rounded bg-orange-200 py-3 font-bold text-orange-900"
      >
        列印疏文
      </button>
    </div>
  );
}
