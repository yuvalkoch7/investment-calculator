import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function App() {
  const [mode, setMode] = useState("initial");
  const [lang, setLang] = useState("he");

  const isHebrew = lang === "he";

  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [target, setTarget] = useState(1000000);

  const [data, setData] = useState([]);
  const [finalValue, setFinalValue] = useState(null);

  const t = {
    he: {
      title: "💰 מחשבון השקעות",
      initial: "💵 סכום התחלתי",
      monthly: "📅 הפקדה חודשית",
      rate: "📈 ריבית",
      years: "⏳ שנים",
      target: "🎯 יעד",
      start: "▶️ החל",
      share: "📤 שתף קישור",
    },
    en: {
      title: "💰 Investment Calculator",
      initial: "💵 Initial Amount",
      monthly: "📅 Monthly Deposit",
      rate: "📈 Interest",
      years: "⏳ Years",
      target: "🎯 Target",
      start: "▶️ Calculate",
      share: "📤 Share Link",
    },
  };

  const txt = t[lang];

  const runSimulation = () => {
    let tempData = [];
    let total = initial;

    for (let i = 0; i <= years; i++) {
      let yearly = total;
      for (let m = 0; m < 12; m++) {
        yearly = yearly * (1 + rate / 100 / 12) + monthly;
      }
      total = yearly;
      tempData.push({ year: i, value: Math.round(total) });
    }

    setData(tempData);
    setFinalValue(tempData[tempData.length - 1]);
  };

  const generateShareLink = () => {
    const base = window.location.origin;
    const params = new URLSearchParams({
      initial,
      monthly,
      rate,
      years,
      target,
    });
    return `${base}?${params.toString()}`;
  };

  const shareResult = async () => {
    const link = generateShareLink();
    try {
      if (navigator.share) {
        await navigator.share({ title: txt.title, url: link });
      } else throw new Error();
    } catch {
      await navigator.clipboard.writeText(link);
      alert(isHebrew ? "הקישור הועתק! 🔗" : "Link copied! 🔗");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("initial")) {
      setInitial(+params.get("initial"));
      setMonthly(+params.get("monthly"));
      setRate(+params.get("rate"));
      setYears(+params.get("years"));
      setTarget(+params.get("target"));
      setTimeout(runSimulation, 200);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
        padding: 20,
        direction: isHebrew ? "rtl" : "ltr",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <button onClick={() => setLang("he")}>עברית</button>
          <button onClick={() => setLang("en")}>EN</button>
        </div>

        <h1 style={{ textAlign: "center", color: "white", marginBottom: 20 }}>
          {txt.title}
        </h1>

        <div style={glassCard}>
          <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
            <button style={tabBtn} onClick={() => setMode("initial")}>
              Start
            </button>
            <button style={tabBtn} onClick={() => setMode("target")}>
              Target
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "target" && (
              <>
                <label>{txt.target}</label>
                <input
                  style={inputStyle}
                  value={target}
                  onChange={(e) => setTarget(+e.target.value)}
                />
              </>
            )}

            <label>{txt.initial}</label>
            <input
              style={inputStyle}
              value={initial}
              onChange={(e) => setInitial(+e.target.value)}
            />

            <label>{txt.monthly}</label>
            <input
              style={inputStyle}
              value={monthly}
              onChange={(e) => setMonthly(+e.target.value)}
            />

            <label>{txt.rate}</label>
            <input
              style={inputStyle}
              value={rate}
              onChange={(e) => setRate(+e.target.value)}
            />

            <label>{txt.years}</label>
            <input
              style={inputStyle}
              value={years}
              onChange={(e) => setYears(+e.target.value)}
            />

            <button onClick={runSimulation} style={mainButton}>
              {txt.start}
            </button>
          </div>
        </div>

        {finalValue && (
          <div style={glassCard}>
            <h2>₪{finalValue.value.toLocaleString()}</h2>
            <button onClick={shareResult} style={secondaryButton}>
              {txt.share}
            </button>
          </div>
        )}

        {data.length > 0 && (
          <div style={glassCard}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <XAxis dataKey="year" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                <Line dataKey="value" stroke="#00f2fe" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

const glassCard = {
  backdropFilter: "blur(12px)",
  background: "rgba(255,255,255,0.1)",
  borderRadius: 20,
  padding: 20,
  marginBottom: 20,
  color: "white",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

const inputStyle = {
  padding: 10,
  borderRadius: 10,
  border: "none",
  outline: "none",
};

const mainButton = {
  padding: 12,
  borderRadius: 12,
  background: "linear-gradient(135deg,#00c6ff,#0072ff)",
  color: "white",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
};

const secondaryButton = {
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  background: "#16a085",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const tabBtn = {
  flex: 1,
  padding: 10,
  borderRadius: 10,
  background: "rgba(255,255,255,0.2)",
  color: "white",
  border: "none",
  cursor: "pointer",
};
