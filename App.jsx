import React, { useEffect, useMemo, useState } from "react";

const GlobalStyles = React.memo(function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Inter:wght@400;600;700&display=swap');

      :root {
        --bg1: #0a1a3b;
        --bg2: #1e3a8a;
        --bg3: #1e1b4b;
        --muted: #9ca3af;
        --ok: #10b981;
        --ok-bg: #10b98122;
        --ok-br: #10b98180;
        --warn: #f59e0b;
        --warn-bg: #f59e0b22;
        --warn-br: #f59e0b80;
        --info: #3b82f6;
        --info-bg: #3b82f622;
        --info-br: #3b82f680;
        --accent: #a855f7;
      }
      * { box-sizing: border-box; }
      html, body, #root { height: 100%; }
      body {
        margin: 0;
        background: linear-gradient(180deg, var(--bg1), var(--bg2) 50%, var(--bg3));
        color: #f3f4f6;
        font-family: 'Inter', system-ui, -apple-system, Arial;
      }
      .container { min-height: 100vh; padding: 24px; }
      .btn {
        padding: 10px 16px;
        border: none;
        border-radius: 14px;
        cursor: pointer;
        font-weight: 600;
        color: #fff;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
      }
      .btn:active { transform: scale(0.98); }
      .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .btn--primary { background: linear-gradient(90deg, #10b981, #a855f7); }
      .btn--secondary { background: #1e3a8a; }
      .btn--danger { background: #ef4444; }
      .btn--info { background: #3b82f6; }
      .btn--highlight {
        background: linear-gradient(90deg, #10b981, #a855f7);
        transform: translateY(0);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .btn--highlight:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(34, 197, 94, 0.4);
      }
      .card {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 20px;
        backdrop-filter: blur(8px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      }
      .card--highlight {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(96, 165, 250, 0.2));
        border: 1px solid rgba(255, 255, 255, 0.2);
        transform: translateY(0);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .card--highlight:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }
      .h {
        font-weight: 700;
        margin: 8px 0 12px;
        font-family: 'Orbitron', sans-serif;
      }
      .h--center { text-align: center; }
      .text--dim { color: var(--muted); }
      .text--center { text-align: center; }
      .input {
        padding: 12px;
        border-radius: 12px;
        border: 1px solid #334155;
        background: transparent;
        color: #f3f4f6;
        font-size: 14px;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 13px;
      }
      .badge--ok { background: var(--ok-bg); border: 1px solid var(--ok-br); color: #a7f3d0; }
      .badge--warn { background: var(--warn-bg); border: 1px solid var(--warn-br); color: #fed7aa; }
      .badge--info { background: var(--info-bg); border: 1px solid var(--info-br); color: #bfdbfe; }
      .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
      .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
      .table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .table thead th {
        font-weight: 600;
        text-align: left;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.25);
        padding: 10px;
      }
      .table tbody td {
        padding: 10px;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
      }
      .progress {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 999px;
        overflow: hidden;
      }
      .progress__bar {
        background: linear-gradient(90deg, #10b981, #a855f7);
        height: 100%;
      }
      .nav {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 16px;
        justify-content: center;
      }
      .nav .btn {
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 14px;
        transition: all 0.2s ease;
      }
      .nav .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      }
      .logo-vyna {
        display: inline-block;
        background: linear-gradient(45deg, #10b981, #3b82f6, #a855f7, #10b981);
        background-size: 200% 200%;
        animation: gradientShift 8s ease infinite;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.5));
        font-family: 'Orbitron', sans-serif;
        transform: translateY(0);
        animation: logoFadeIn 1.2s ease-out;
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes logoFadeIn {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .day-cell:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
    `}</style>
  );
});

const Btn = React.memo(function Btn({ children, onClick, kind = "primary", className = "", style, disabled, title }) {
  const k = kind === "secondary" ? "btn--secondary" : kind === "danger" ? "btn--danger" : kind === "info" ? "btn--info" : "btn--primary";
  return (
    <button className={`btn ${k} ${className}`} onClick={onClick} disabled={disabled} style={style} title={title}>
      {children}
    </button>
  );
});

const Card = React.memo(function Card({ children, className = "", style }) {
  return <div className={`card ${className}`} style={style}>{children}</div>;
});

const Row = React.memo(function Row({ left, right, className = "", style }) {
  return <div className={`row ${className}`} style={style}>{left}{right}</div>;
});

const H = function H({ children, size = 24, center }) {
  return <div className={`h ${center ? 'h--center' : ''}`} style={{ fontSize: size }}>{children}</div>;
};

const Text = React.memo(function Text({ children, dim, center, style }) {
  return <div className={`${dim ? 'text--dim' : ''} ${center ? 'text--center' : ''}`} style={style}>{children}</div>;
});

const ProgressBar = React.memo(function ProgressBar({ value, max = 100, height = 12 }) {
  const w = `${Math.min(100, (value / max) * 100)}%`;
  return <div className="progress" style={{ height }}><div className="progress__bar" style={{ width: w }} /></div>;
});

function getRuntimeConfig() {
  let url = null, key = null;
  if (typeof window !== "undefined" && window.__VYNA_CONFIG__) {
    url = window.__VYNA_CONFIG__.SUPABASE_URL || null;
    key = window.__VYNA_CONFIG__.SUPABASE_ANON_KEY || null;
  }
  if (!url || !key) {
    if (typeof window !== "undefined") {
      url = url || localStorage.getItem("SUPABASE_URL");
      key = key || localStorage.getItem("SUPABASE_ANON_KEY");
    }
  }
  const requireCfg = typeof window !== "undefined" ? localStorage.getItem("VYNA_REQUIRE_CONFIG") === "true" : false;
  return { url, key, configured: Boolean(url && key), requireCfg };
}

let __supabaseClientCache = new Map();
let __supabaseUMDLoading = null;
async function loadSupabase(url, key) {
  const cacheKey = `${url}__${key}`;
  if (__supabaseClientCache.has(cacheKey)) return __supabaseClientCache.get(cacheKey);
  try {
    const mod = await import("@supabase/supabase-js");
    const client = mod.createClient(url, key);
    __supabaseClientCache.set(cacheKey, client);
    return client;
  } catch (e) {
    try {
      if (typeof window !== "undefined" && !window.supabase) {
        if (!__supabaseUMDLoading) {
          __supabaseUMDLoading = new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";
            s.async = true;
            s.onload = resolve;
            s.onerror = () => reject(new Error("No se pudo cargar la librería desde CDN."));
            document.head.appendChild(s);
          });
        }
        await __supabaseUMDLoading;
      }
      if (typeof window !== "undefined" && window.supabase && window.supabase.createClient) {
        const client = window.supabase.createClient(url, key);
        __supabaseClientCache.set(cacheKey, client);
        return client;
      }
      throw new Error("Librería '@supabase/supabase-js' no disponible (paquete ni CDN). Instálala en tu proyecto.");
    } catch (cdnErr) {
      throw cdnErr;
    }
  }
}

function kgToLb(kg) { return kg === "" || kg === null || isNaN(Number(kg)) ? "" : (Number(kg) * 2.2046226218).toFixed(1); }
function lbToKg(lb) { return lb === "" || lb === null || isNaN(Number(lb)) ? "" : (Number(lb) / 2.2046226218).toFixed(1); }

function startOfMonth(d) { const x = new Date(d.getFullYear(), d.getMonth(), 1); x.setHours(0, 0, 0, 0); return x; }
function endOfMonth(d) { const x = new Date(d.getFullYear(), d.getMonth() + 1, 0); x.setHours(23, 59, 59, 999); return x; }
function formatDateYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

const FOOD_DB = {
  "Pechuga de pollo": { kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  "Arroz cocido": { kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  "Huevo": { kcal: 155, protein: 13, carbs: 1.1, fat: 11 },
  "Aguacate": { kcal: 160, protein: 2, carbs: 9, fat: 15 },
  "Banana": { kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  "Salmón": { kcal: 208, protein: 20, carbs: 0, fat: 13 },
  "Batata cocida": { kcal: 90, protein: 2, carbs: 21, fat: 0.1 },
  "Brócoli": { kcal: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  "Aceite de oliva": { kcal: 884, protein: 0, carbs: 0, fat: 100 },
  "Avena cocida": { kcal: 71, protein: 2.5, carbs: 12, fat: 1.5 },
  "Quinoa cocida": { kcal: 120, protein: 4.4, carbs: 21.3, fat: 1.9 },
  "Yogur griego": { kcal: 59, protein: 10, carbs: 3.6, fat: 0.4 },
};

function analyzeMeal(items) {
  const total = items.reduce((acc, it) => {
    const mult = (Number(it.grams) || 0) / 100;
    acc.kcal += (it.kcal || 0) * mult;
    acc.protein += (it.protein || 0) * mult;
    acc.carbs += (it.carbs || 0) * mult;
    acc.fat += (it.fat || 0) * mult;
    return acc;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
  const ratioP = total.protein * 4;
  const ratioC = total.carbs * 4;
  const ratioF = total.fat * 9;
  let tag = "Balanceado";
  if (total.kcal > 0) {
    const pPct = ratioP / (ratioP + ratioC + ratioF || 1);
    const cPct = ratioC / (ratioP + ratioC + ratioF || 1);
    if (pPct < 0.2) tag = "Falta proteína";
    else if (cPct > 0.55) tag = "Muchos carbohidratos";
    else if (ratioF / (ratioP + ratioC + ratioF || 1) > 0.4) tag = "Grasas altas";
  }
  return { ...total, kcal: Math.round(total.kcal), tag };
}

function getMealsMap() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("VYNA_MEALS");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveMealsMap(obj) {
  if (typeof window !== "undefined") localStorage.setItem("VYNA_MEALS", JSON.stringify(obj));
}

function saveMealFor(dateYMD, meal) {
  const map = getMealsMap();
  map[dateYMD] = [...(map[dateYMD] || []), meal];
  saveMealsMap(map);
}

function replaceMealFor(dateYMD, index, meal) {
  const map = getMealsMap();
  const list = map[dateYMD] || [];
  list[index] = meal;
  map[dateYMD] = list;
  saveMealsMap(map);
}

function deleteMealFor(dateYMD, index) {
  const map = getMealsMap();
  const list = map[dateYMD] || [];
  list.splice(index, 1);
  map[dateYMD] = list;
  saveMealsMap(map);
}

function totalKcalForDate(dateYMD) {
  const list = getMealsMap()[dateYMD] || [];
  return list.reduce((a, m) => a + (m.totals?.kcal || 0), 0);
}

function NavTabs({ canCalendar, go, onFood }) {
  return (
    <div className="nav">
      <Btn kind="secondary" onClick={() => go("dashboard")} title="Inicio">🏠</Btn>
      <Btn kind="secondary" onClick={() => go("analytics")} disabled={!canCalendar} title="Analítica">📊</Btn>
      <Btn kind="secondary" onClick={() => go("calendar")} disabled={!canCalendar} title="Calendario">📅</Btn>
      <Btn kind="secondary" onClick={() => go("profile")} title="Perfil">👤</Btn>
      <Btn kind="info" onClick={onFood} title="Tracker de comida">🥗</Btn>
    </div>
  );
}

export default function VYNAApp() {
  const [screen, setScreen] = useState("welcome");
  const [supabase, setSupabase] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [clients, setClients] = useState([]);
  const [progressByClient, setProgressByClient] = useState({});
  const [latestByClient, setLatestByClient] = useState({});
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkMsg, setCheckMsg] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const [demoMode, setDemoMode] = useState(false);

  const [profile, setProfile] = useState(() => {
    if (typeof window === "undefined") return { goal: "", weightKg: "", weightLb: "", heightIn: "", age: "", gender: "", dailyGoalKcal: "" };
    try {
      const raw = localStorage.getItem("VYNA_PROFILE");
      return raw ? JSON.parse(raw) : { goal: "", weightKg: "", weightLb: "", heightIn: "", age: "", gender: "", dailyGoalKcal: "" };
    } catch {
      return { goal: "", weightKg: "", weightLb: "", heightIn: "", age: "", gender: "", dailyGoalKcal: "" };
    }
  });

  const today = formatDateYMD(new Date());
  const todayKcal = totalKcalForDate(today);
  const cfg = getRuntimeConfig();

  useEffect(() => {
    const boot = async () => {
      if (!cfg.configured) {
        setScreen("welcome");
        return;
      }
      try {
        const client = await loadSupabase(cfg.url, cfg.key);
        setSupabase(client);
        const { data } = await client.auth.getSession();
        const s = data?.session || null;
        setSession(s);
        if (!s) {
          setScreen("setup");
          return;
        }
        await ensureRoleAndLoad(s.user?.id, client);
        setScreen("dashboard");
      } catch (e) {
        setMsg(e.message || String(e));
        setScreen("setup");
      }
    };
    boot();
  }, []);

  function computeLatestMap(prog) {
    const map = {};
    for (const [cid, rows] of Object.entries(prog)) {
      if (!rows.length) continue;
      const last = rows[rows.length - 1];
      map[cid] = { client_id: cid, last_date: last.date, last_weight: last.weight, last_calories: last.calories, last_motivation: last.motivation };
    }
    return map;
  }

  function enterDemo() {
    const demoClients = [
      { id: "c1", name: "Carlos Gómez", weight: 78.5, calories: 2300, motivation: 9 },
      { id: "c2", name: "Lucía Pérez", weight: 67.5, calories: 1800, motivation: 8 },
    ];
    const demoProgress = {
      c1: [
        { date: "2025-09-25", weight: 80, calories: 2500, motivation: 8 },
        { date: "2025-09-30", weight: 79, calories: 2400, motivation: 8.5 },
        { date: "2025-10-05", weight: 78.5, calories: 2300, motivation: 9 },
      ],
      c2: [
        { date: "2025-09-25", weight: 68, calories: 1900, motivation: 7 },
        { date: "2025-09-30", weight: 67.9, calories: 1850, motivation: 7.5 },
        { date: "2025-10-05", weight: 67.5, calories: 1800, motivation: 8 },
      ],
    };
    setDemoMode(true);
    setSession({ user: { id: "demo-nutri", email: "demo@vyna.app" } });
    setClients(demoClients);
    setProgressByClient(demoProgress);
    setLatestByClient(computeLatestMap(demoProgress));
    setSelected(null);
    setScreen("dashboard");
  }

  function exitDemo() {
    setDemoMode(false);
    setSession(null);
    setClients([]);
    setProgressByClient({});
    setLatestByClient({});
    setSelected(null);
    setScreen("welcome");
  }

  async function ensureRoleAndLoad(userId, client) {
    const { data: profileRow, error } = await client.from("profiles").select("role").eq("id", userId).single();
    if (error) throw error;
    setRole(profileRow?.role || null);
    if (profileRow?.role !== "nutritionist") throw new Error("Acceso restringido: se requiere rol 'nutritionist'.");
    const { data: cls, error: e2 } = await client.from("clients").select("id, name, weight, calories, motivation").eq("nutritionist_id", userId);
    if (e2) throw e2;
    setClients(cls || []);
    try {
      if (cls && cls.length) {
        const ids = cls.map((c) => c.id);
        const { data: latest, error: e3 } = await client
          .from("client_last_progress")
          .select("client_id,last_date,last_weight,last_calories,last_motivation")
          .in("client_id", ids);
        if (!e3 && latest) setLatestByClient(Object.fromEntries(latest.map((r) => [r.client_id, r])));
        else setLatestByClient({});
      } else setLatestByClient({});
    } catch {
      setLatestByClient({});
    }
  }

  async function login(email, password) {
    try {
      setMsg("");
      if (!cfg.configured) throw new Error("Configura SUPABASE_URL y SUPABASE_ANON_KEY primero.");
      const client = await loadSupabase(cfg.url, cfg.key);
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSupabase(client);
      setSession(data?.session || null);
      await ensureRoleAndLoad(data?.user?.id, client);
      setScreen("dashboard");
      setMsg("Sesión iniciada ✅");
    } catch (e) {
      setMsg("No se pudo iniciar sesión: " + (e.message || String(e)));
    }
  }

  async function logout() {
    if (demoMode) {
      exitDemo();
      return;
    }
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setRole(null);
    setClients([]);
    setSelected(null);
    setProgressByClient({});
    setScreen("login");
  }

  async function loadProgress(clientId) {
    if (demoMode) return;
    const { data, error } = await supabase
      .from("progress")
      .select("date, weight, calories, motivation")
      .eq("client_id", clientId)
      .order("date");
    if (error) {
      setMsg("Error al cargar progreso: " + error.message);
      return;
    }
    setProgressByClient((prev) => ({ ...prev, [clientId]: data || [] }));
  }

  function saveProfile(next) {
    setProfile(next);
    if (typeof window !== "undefined") localStorage.setItem("VYNA_PROFILE", JSON.stringify(next));
  }

  function computeStreak(records) {
    if (!records || !records.length) return 0;
    const dates = new Set(records.map((r) => r.date));
    const anchor = new Date(`${records[records.length - 1].date}T00:00:00`);
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(anchor);
      d.setDate(d.getDate() - i);
      if (dates.has(formatDateYMD(d))) streak++;
      else break;
    }
    return streak;
  }

  function MonthGrid({ monthStart, daysMap, goal, onDayClick }) {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const lastDay = endOfMonth(monthStart).getDate();
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= lastDay; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 10, padding: 12 }}>
        {["D", "L", "M", "X", "J", "V", "S"].map((w) => (
          <div key={w} style={{ opacity: 0.8, fontSize: 14, textAlign: "center", fontWeight: 600 }}>{w}</div>
        ))}
        {cells.map((d, i) => {
          const calories = d ? daysMap[d] || 0 : 0;
          const hit = goal && calories ? calories >= goal : false;
          return (
            <div
              key={i}
              onClick={() => d && onDayClick(formatDateYMD(new Date(year, month, d)))}
              style={{
                minHeight: 80,
                borderRadius: 16,
                background: d ? (hit ? "rgba(34, 197, 94, 0.3)" : "rgba(255, 255, 255, 0.08)") : "transparent",
                border: d ? (hit ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.2)") : "none",
                padding: 10,
                cursor: d ? "pointer" : "default",
                transition: "transform 0.2s ease",
              }}
              className={d ? "day-cell" : ""}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>{d ?? ""}</div>
              {d && (
                <div style={{ fontSize: 12, marginTop: 6, color: hit ? "#a7f3d0" : "#d1d5db" }}>
                  {calories ? `${calories} kcal` : "—"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function Banner() {
    const colorBox = cfg.configured && supabase ? "var(--ok-bg)" : cfg.configured ? "var(--info-bg)" : "var(--warn-bg)";
    const colorBorder = cfg.configured && supabase ? "var(--ok-br)" : cfg.configured ? "var(--info-br)" : "var(--warn-br)";
    const colorText = cfg.configured && supabase ? "#a7f3d0" : cfg.configured ? "#bfdbfe" : "#fed7aa";
    return (
      <div className="row" style={{ gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, borderRadius: 14, padding: "12px 14px", border: `1px solid ${colorBorder}`, background: colorBox, color: colorText, fontSize: 13 }}>
          {cfg.configured ? (supabase ? <b>Config OK · Supabase listo</b> : <b>Config OK · Librería no disponible (DEMO)</b>) : <b>Modo demo (sin config)</b>} — {cfg.configured ? (supabase ? "Conexión preparada. Inicia sesión." : "Instala '@supabase/supabase-js' en tu repo real.") : "Se usan datos ficticios."}
        </div>
        <Btn kind="secondary" onClick={() => setScreen("settings")}>
          ⚙️ Ajustes
        </Btn>
      </div>
    );
  }

  let content = null;

  if (screen === "welcome") {
    content = (
      <>
        <div className="text--center" style={{ marginTop: 40, position: 'relative' }}>
          <div className="logo-vyna">
            <H size={64} center>VYNA</H>
          </div>
          <Text center className="text--dim" style={{ marginTop: 12, fontSize: 16 }}>
            Tu progreso, hecho visible.
          </Text>
          <div style={{ marginTop: 16 }}>
            {todayKcal > 0 ? (
              <span className="badge badge--ok">Hoy: {todayKcal} kcal registradas</span>
            ) : (
              <span className="badge badge--warn">Hoy aún no registraste comidas</span>
            )}
          </div>
        </div>
        <div className="grid-3" style={{ marginTop: 32 }}>
          <Card className="card--highlight">
            <H size={22}>Explora VYNA en Acción</H>
            <Text className="text--dim" style={{ marginTop: 8 }}>
              Prueba el panel de nutricionista con datos de ejemplo.
            </Text>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Btn className="btn--highlight" onClick={enterDemo}>
                🚀 Entrar al Modo Demo
              </Btn>
            </div>
          </Card>
          <Card>
            <H size={18}>Entrar como Nutricionista</H>
            <Text className="text--dim">Configura Supabase y accede con tu usuario.</Text>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Btn onClick={() => setScreen('setup')}>Configurar</Btn>
              <Btn kind="secondary" onClick={() => setScreen('login')}>Iniciar sesión</Btn>
            </div>
          </Card>
          <Card>
            <H size={18}>Comienza tu día</H>
            <Text className="text--dim">Registra tu primera comida y mira tu barra.</Text>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Btn kind="info" onClick={() => setScreen('food')}>Añadir comida ahora</Btn>
              <Btn kind="secondary" onClick={() => setScreen('profile')}>Fijar meta diaria</Btn>
            </div>
          </Card>
        </div>
      </>
    );
  }

  if (screen === "setup") {
    content = (
      <>
        <H size={32} center>⚙️ Configuración requerida</H>
        <Text center className="text--dim">Define tus claves de Supabase para continuar (sin process.env).</Text>
        <div style={{ maxWidth: 780, margin: "16px auto" }}>
          <Card>
            <H size={18}>Claves de Supabase</H>
            <div style={{ display: "grid", gap: 12, marginBottom: 12 }}>
              <label style={{ fontSize: 13 }} className="text--dim">SUPABASE_URL</label>
              <input className="input" defaultValue={cfg.url || ""} placeholder="https://TU-PROYECTO.supabase.co" onChange={(e) => (window.__TMP_URL__ = e.target.value)} />
              <label style={{ fontSize: 13 }} className="text--dim">SUPABASE_ANON_KEY</label>
              <input className="input" defaultValue={cfg.key || ""} placeholder="SUPABASE_ANON_KEY" onChange={(e) => (window.__TMP_KEY__ = e.target.value)} />
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }} className="text--dim">
                <input type="checkbox" defaultChecked={cfg.requireCfg} onChange={(e) => { localStorage.setItem("VYNA_REQUIRE_CONFIG", String(e.target.checked)); }} /> Requerir configuración (bloquear modo demo)
              </label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn onClick={() => { const url = window.__TMP_URL__ || cfg.url; const key = window.__TMP_KEY__ || cfg.key; if (url) localStorage.setItem("SUPABASE_URL", url); if (key) localStorage.setItem("SUPABASE_ANON_KEY", key); location.reload(); }}>Guardar y recargar</Btn>
                <Btn kind="secondary" onClick={() => setScreen("welcome")}>Volver</Btn>
              </div>
            </div>
          </Card>
          {!!msg && (<Card style={{ marginTop: 12 }}><Text style={{ color: "#fed7aa" }}>{msg}</Text></Card>)}
        </div>
      </>
    );
  }

  if (screen === "login") {
    content = (
      <>
        <H size={32} center>Iniciar sesión</H>
        <Text center className="text--dim">Usa un usuario Auth con rol 'nutritionist' en profiles.</Text>
        <div style={{ maxWidth: 600, margin: "16px auto" }}>
          <Card>
            <div style={{ display: "grid", gap: 12 }}>
              <input className="input" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <input className="input" placeholder="Contraseña" type="password" onChange={(e) => setPassword(e.target.value)} />
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={() => login(email, password)}>Entrar</Btn>
                <Btn kind="secondary" onClick={() => setScreen('welcome')}>Volver</Btn>
              </div>
              {!!msg && <Text style={{ color: "#a7f3d0" }}>{msg}</Text>}
            </div>
          </Card>
        </div>
      </>
    );
  }

  if (screen === "dashboard") {
    content = (
      <>
        <Banner />
        <Row left={<H size={36}>Panel Seguro de Nutricionista {demoMode ? '— DEMO' : ''}</H>} right={<div style={{ display: 'flex', gap: 8 }}><Text className="text--dim">{session?.user?.email}</Text><Btn kind="secondary" onClick={logout}>{demoMode ? 'Salir demo' : 'Cerrar sesión'}</Btn></div>} />
        <NavTabs canCalendar={!!selected} go={(s) => setScreen(s)} onFood={() => setScreen('food')} />
        <Text className="text--dim">Mostrando solo clientes asignados a tu cuenta {demoMode ? '(demo)' : '(RLS)'}.</Text>
        {clients.length === 0 && (<Card style={{ marginTop: 12 }}><Text className="text--dim">No se encontraron clientes. Inserta datos en la tabla <code>clients</code> con tu <code>nutritionist_id</code>.</Text></Card>)}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginTop: 16 }}>
          {clients.map((c) => {
            const last = latestByClient[c.id];
            return (
              <Card key={c.id}>
                <H size={20}>{c.name}</H>
                <Text className="text--dim">Peso actual: {c.weight ?? '—'} kg</Text>
                <Text className="text--dim">Calorías promedio: {c.calories ?? '—'} kcal</Text>
                <Text className="text--dim">Motivación: {c.motivation ?? '—'}/10</Text>
                {last && (
                  <Text className="text--dim">Último: {last.last_date ?? '—'} · {last.last_weight ?? '—'} kg · {last.last_calories ?? '—'} kcal · {last.last_motivation ?? '—'}/10</Text>
                )}
                <div style={{ height: 12, margin: "12px 0" }}><ProgressBar value={(c.motivation ?? 0) * 10} /></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn onClick={() => { setSelected(c); setScreen('analytics'); if (!progressByClient[c.id]) loadProgress(c.id); }} style={{ width: "100%" }}>Ver Analítica</Btn>
                  <Btn kind="secondary" onClick={() => { setSelected(c); setScreen('calendar'); if (!progressByClient[c.id]) loadProgress(c.id); }}>Calendario</Btn>
                </div>
              </Card>
            );
          })}
        </div>
        <Card style={{ marginTop: 16 }}>
          <Row left={<H size={18}>Resumen de hoy</H>} right={<Btn kind="info" onClick={() => setScreen('food')}>Añadir comida</Btn>} />
          <div className Crear una tabla de comparación de métricas de salud para el panel de control de VYNA, mostrando peso, calorías y motivación para cada cliente. La tabla debe ser clara, con colores que resalten los valores clave y un diseño moderno. Además, incluye un botón para ver los detalles de cada cliente.
