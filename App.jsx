
import React, { useEffect, useMemo, useState } from "react";

const Btn = ({ children, onClick, kind = "primary", disabled, style }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: "10px 14px",
      borderRadius: 12,
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      fontWeight: 600,
      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      transition: "transform .12s ease, box-shadow .12s ease",
      background:
        kind === "secondary" ? "#334155" :
        kind === "danger" ? "#ef4444" :
        kind === "info" ? "#0ea5e9" :
        "linear-gradient(90deg,#22c55e,#16a34a)",
      color: "#fff",
      ...style
    }}
    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    {children}
  </button>
);

const Card = ({ children, style }) => (
  <div style={{
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: 18,
    backdropFilter: "blur(6px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    ...style
  }}>
    {children}
  </div>
);

const Row = ({ left, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>{left}{right}</div>
);

const H = ({ children, size = 24, center }) => (
  <div style={{
    fontSize: size,
    fontWeight: 800,
    margin: "6px 0 10px",
    textAlign: center ? "center" : "left"
  }}>{children}</div>
);

const Text = ({ children, dim, center, style }) => (
  <div style={{ color: dim ? "#d1d5db" : "#fff", textAlign: center ? "center" : "left", ...style }}>{children}</div>
);

const ProgressBar = ({ value, max = 100, height = 10 }) => (
  <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 999, height, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: "#22c55e" }} />
  </div>
);

const gradientBg = {
  minHeight: "100vh",
  padding: 20,
  background: "linear-gradient(180deg,#0b1d4d,#0f245f 35%,#0f5132)",
  color: "#fff",
  fontFamily: "Poppins, Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
};

const DEMO_CLIENTS = [
  { id: "c1", name: "Carlos Gómez", weight: 78.5, calories: 2300, motivation: 9 },
  { id: "c2", name: "Lucía Pérez", weight: 67.5, calories: 1800, motivation: 8 },
];
const DEMO_PROGRESS = {
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

function getRuntimeConfig() {
  const w = typeof window !== "undefined" ? window : {};
  const url = w.__VYNA_CONFIG__?.SUPABASE_URL || (typeof localStorage !== "undefined" ? localStorage.getItem("SUPABASE_URL") : null);
  const key = w.__VYNA_CONFIG__?.SUPABASE_ANON_KEY || (typeof localStorage !== "undefined" ? localStorage.getItem("SUPABASE_ANON_KEY") : null);
  return { url, key, configured: Boolean(url && key) };
}

async function loadSupabase(url, key) {
  try {
    const mod = await import("@supabase/supabase-js");
    return mod.createClient(url, key);
  } catch {
    return null; // si no existe la librería, seguimos en DEMO
  }
}

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [supabase, setSupabase] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [clients, setClients] = useState(DEMO_CLIENTS);
  const [progress, setProgress] = useState(DEMO_PROGRESS);
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const boot = async () => {
      const cfg = getRuntimeConfig();
      if (!cfg.configured) { setScreen("welcome"); return; }
      const client = await loadSupabase(cfg.url, cfg.key);
      if (!client) { setScreen("dashboard"); return; } // sin librería: demo
      setSupabase(client);
      const { data } = await client.auth.getSession();
      const s = data?.session || null;
      setSession(s);
      if (!s) { setScreen("login"); return; }
      await loadRoleAndClients(client, s.user?.id);
      setScreen("dashboard");
    };
    boot();
  }, []);

  async function loadRoleAndClients(client, userId) {
    try {
      const { data: profile, error } = await client.from("profiles").select("role").eq("id", userId).single();
      if (error) throw error;
      setRole(profile?.role || null);
      if (profile?.role === "nutritionist") {
        const { data: cls, error: e2 } = await client.from("clients").select("id, name, weight, calories, motivation").eq("nutritionist_id", userId);
        if (e2) throw e2;
        setClients(cls || []);
      } else {
        setClients([]);
        setMsg("Acceso restringido: se requiere rol 'nutritionist'.");
      }
    } catch (e) {
      setMsg("No se pudo cargar el rol/clientes: " + (e.message || String(e)));
      setClients([]);
    }
  }

  async function loadProgressFor(clientId) {
    if (!supabase) return; // demo ya tiene datos
    const { data, error } = await supabase
      .from("progress")
      .select("date, weight, calories, motivation")
      .eq("client_id", clientId)
      .order("date");
    if (error) { setMsg("Error al cargar progreso: " + error.message); return; }
    setProgress((prev) => ({ ...prev, [clientId]: data || [] }));
  }

  async function login() {
    try {
      setMsg("");
      const cfg = getRuntimeConfig();
      if (!cfg.configured) throw new Error("Configura SUPABASE_URL y SUPABASE_ANON_KEY primero.");
      const client = await loadSupabase(cfg.url, cfg.key);
      if (!client) throw new Error("Librería '@supabase/supabase-js' no disponible en este entorno.");
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSupabase(client);
      setSession(data?.session || null);
      await loadRoleAndClients(client, data?.user?.id);
      setScreen("dashboard");
      setMsg("Sesión iniciada ✅");
    } catch (e) {
      setMsg("No se pudo iniciar sesión: " + (e.message || String(e)));
    }
  }

  const Banner = () => {
    const cfg = getRuntimeConfig();
    const colorBox = cfg.configured && supabase ? "#22c55e22" : cfg.configured ? "#60a5fa22" : "#f59e0b22";
    const colorBorder = cfg.configured && supabase ? "#22c55e80" : cfg.configured ? "#60a5fa80" : "#f59e0b80";
    const colorText = cfg.configured && supabase ? "#bbf7d0" : cfg.configured ? "#bfdbfe" : "#fde68a";
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "stretch", marginBottom: 12 }}>
        <div style={{ flex: 1, borderRadius: 14, padding: "10px 12px", border: `1px solid ${colorBorder}`, background: colorBox, color: colorText, fontSize: 13 }}>
          {cfg.configured ? (supabase ? <b>Config OK · Supabase listo</b> : <b>Config OK · Librería no disponible (DEMO)</b>) : <b>Modo demo (sin config)</b>}
          {" "}— {cfg.configured ? (supabase ? "Conexión preparada. Inicia sesión." : "Instala '@supabase/supabase-js' en tu proyecto real.") : "Se usan datos ficticios."}
        </div>
        <Btn kind="secondary" onClick={() => setScreen("settings")}>⚙️ Ajustes</Btn>
      </div>
    );
  };

  // ---- Pantallas ----

  if (screen === "welcome") {
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <H size={44} center>VYNA</H>
            <Text center dim>Tu progreso, hecho visible.</Text>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginTop: 24 }}>
            <Card>
              <H size={18}>Explorar Demo</H>
              <Text dim>Recorre el panel con datos ficticios.</Text>
              <div style={{ marginTop: 12 }}><Btn onClick={() => setScreen("dashboard")}>Entrar</Btn></div>
            </Card>
            <Card>
              <H size={18}>Entrar como Nutricionista</H>
              <Text dim>Configura Supabase y accede con tu usuario.</Text>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <Btn onClick={() => setScreen("settings")}>Configurar</Btn>
                <Btn kind="secondary" onClick={() => setScreen("login")}>Iniciar sesión</Btn>
              </div>
            </Card>
            <Card>
              <H size={18}>Vista Usuario</H>
              <Text dim>Pantallas de Body / Food / Coach (demo).</Text>
              <div style={{ marginTop: 12 }}><Btn kind="info" onClick={() => setScreen("dashboard")}>Abrir</Btn></div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "settings") {
    const cfg = getRuntimeConfig();
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <H size={32} center>⚙️ Ajustes</H>
          <Text center dim>Guarda tus claves de Supabase (sin process.env).</Text>
          <Card>
            <div style={{ display: "grid", gap: 12 }}>
              <label style={{ fontSize: 13, color: "#d1d5db" }}>SUPABASE_URL</label>
              <input defaultValue={cfg.url || ""} placeholder="https://TU-PROYECTO.supabase.co" onChange={(e) => (window.__TMP_URL__ = e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #334155" }} />
              <label style={{ fontSize: 13, color: "#d1d5db" }}>SUPABASE_ANON_KEY</label>
              <input defaultValue={cfg.key || ""} placeholder="SUPABASE_ANON_KEY" onChange={(e) => (window.__TMP_KEY__ = e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #334155" }} />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn onClick={() => { const n1 = window.__TMP_URL__ || cfg.url; const n2 = window.__TMP_KEY__ || cfg.key; if (n1) localStorage.setItem("SUPABASE_URL", n1); if (n2) localStorage.setItem("SUPABASE_ANON_KEY", n2); alert("Claves guardadas. Vuelve a la portada o inicia sesión."); }}>
                  Guardar claves
                </Btn>
                <Btn kind="secondary" onClick={() => setScreen("welcome")}>Volver</Btn>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (screen === "login") {
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <H size={32} center>Iniciar sesión</H>
          <Text center dim>Usa un usuario de Supabase Auth con rol <code>nutritionist</code> en <code>profiles</code>.</Text>
          <Card>
            <div style={{ display: "grid", gap: 12 }}>
              <input className="vyna-input" placeholder="email" onChange={(e) => setEmail(e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #334155", background: "transparent", color: "#fff" }} />
              <input className="vyna-input" placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #334155", background: "transparent", color: "#fff" }} />
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={login}>Entrar</Btn>
                <Btn kind="secondary" onClick={() => setScreen("welcome")}>Volver</Btn>
              </div>
              {!!msg && <Text style={{ color: "#bbf7d0" }}>{msg}</Text>}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // DASHBOARD
  if (screen === "dashboard") {
    const list = clients;
    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Banner />
          <Row left={<H size={36}>Panel Seguro de Nutricionista</H>} right={<Text dim>{session ? `Usuario activo` : "Sin sesión"}</Text>} />
          <Text dim>Clientes protegidos por RLS (si hay sesión) o demo (si no).</Text>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginTop: 16 }}>
            {list.map((c) => (
              <Card key={c.id}>
                <H size={20}>{c.name}</H>
                <Text dim>Peso actual: {c.weight ?? "—"} kg</Text>
                <Text dim>Calorías promedio: {c.calories ?? "—"} kcal</Text>
                <Text dim>Motivación: {c.motivation ?? "—"}/10</Text>
                <div style={{ height: 10, margin: "10px 0" }}>
                  <ProgressBar value={(c.motivation ?? 0) * 10} />
                </div>
                <Btn onClick={async () => { setSelected(c); await loadProgressFor(c.id); setScreen("analytics"); }} style={{ width: "100%" }}>
                  Ver Analítica
                </Btn>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ANALYTICS
  if (screen === "analytics" && selected) {
    const data = progress[selected.id] || [];
    const weightStart = data[0]?.weight ?? 0;
    const weightNow = data[data.length - 1]?.weight ?? 0;
    const delta = weightNow && weightStart ? (weightNow - weightStart).toFixed(1) : "0.0";

    return (
      <div style={gradientBg}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Row left={<H size={28}>Analítica de {selected.name}</H>} right={<Btn kind="secondary" onClick={() => setScreen("dashboard")}>Volver</Btn>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            <Card>
              <H size={18}>📉 Peso (kg)</H>
              <Text dim>Inicio: {weightStart || "—"} kg — Ahora: {weightNow || "—"} kg — Δ {delta} kg</Text>
              <div style={{ marginTop: 10 }}><ProgressBar value={Math.max(0, 100 - ((weightNow || 0) % 100))} /></div>
            </Card>
            <Card>
              <H size={18}>🔥 Calorías (último registro)</H>
              <Text dim>{data[data.length - 1]?.calories ?? "—"} kcal</Text>
              <div style={{ marginTop: 10 }}><ProgressBar value={(data[data.length - 1]?.calories ?? 0) / 30} /></div>
            </Card>
            <Card>
              <H size={18}>💬 Motivación</H>
              <Text dim>{data[data.length - 1]?.motivation ?? "—"}/10</Text>
              <div style={{ marginTop: 10 }}><ProgressBar value={(data[data.length - 1]?.motivation ?? 0) * 10} /></div>
            </Card>
          </div>

          <Card style={{ marginTop: 16 }}>
            <H size={18}>📅 Registros</H>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8 }}>
              {(data.length === 0) ? <Text dim>No hay registros.</Text> : data.map((r) => (
                <div key={r.date} style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 1fr", gap: 10, padding: "6px 0", borderBottom: "1px dashed rgba(255,255,255,0.15)" }}>
                  <div>{r.date}</div>
                  <div>Peso: {r.weight}</div>
                  <div>Calorías: {r.calories}</div>
                  <div>Motivación: {r.motivation}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
