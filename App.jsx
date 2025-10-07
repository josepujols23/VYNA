import React, { useEffect, useMemo, useState } from \"react\";

const GlobalStyles = React.memo(function GlobalStyles() {
  return (
    <style>{\`
      .vyna-btn{padding:10px 14px;border:none;border-radius:12px;cursor:pointer;font-weight:600;color:#fff;box-shadow:0 6px 16px rgba(0,0,0,.2);transition:transform .12s ease, box-shadow .12s ease, opacity .12s ease}
      .vyna-btn:active{transform:scale(.98)}
      .vyna-btn:disabled{opacity:.6;cursor:not-allowed}
      .vyna-btn--primary{background:linear-gradient(90deg,#22c55e,#16a34a)}
      .vyna-btn--secondary{background:#334155}
      .vyna-btn--danger{background:#ef4444}
      .vyna-btn--info{background:#0ea5e9}

      .vyna-card{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:18px;backdrop-filter:blur(6px);box-shadow:0 8px 24px rgba(0,0,0,0.25)}
      .vyna-row{display:flex;justify-content:space-between;gap:12px}
      .vyna-h{font-weight:800;margin:6px 0 10px}
      .vyna-h--center{text-align:center}
      .vyna-text{color:#fff}
      .vyna-text--dim{color:#d1d5db}
      .vyna-text--center{text-align:center}

      .vyna-input{padding:10px;border-radius:10px;border:1px solid #334155;background:transparent;color:#fff}

      .vyna-progress{background:rgba(255,255,255,0.18);border-radius:999px;overflow:hidden}
      .vyna-progress__bar{background:#22c55e;height:100%}

      .vyna-grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
    \`}</style>
  );
});

const Btn = React.memo(function Btn({ children, onClick, kind = \"primary\", className = \"\", style, disabled }) {
  const kindClass =
    kind === \"secondary\"
      ? \"vyna-btn--secondary\"
      : kind === \"danger\"
      ? \"vyna-btn--danger\"
      : kind === \"info\"
      ? \"vyna-btn--info\"
      : \"vyna-btn--primary\";
  return (
    <button className={\`vyna-btn \${kindClass} \${className}\`} onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
});

const Card = React.memo(function Card({ children, className = \"\", style }) {
  return (
    <div className={\`vyna-card \${className}\`} style={style}>
      {children}
    </div>
  );
});

const Row = React.memo(function Row({ left, right, className = \"\", style }) {
  return (
    <div className={\`vyna-row \${className}\`} style={style}>
      {left}{right}
    </div>
  );
});

const H = function H({ children, size = 24, center }) {
  return (
    <div className={\`vyna-h \${center ? 'vyna-h--center' : ''}\`} style={{ fontSize: size }}>
      {children}
    </div>
  );
};

const Text = React.memo(function Text({ children, dim, center, style }) {
  return (
    <div className={\`vyna-text \${dim ? 'vyna-text--dim' : ''} \${center ? 'vyna-text--center' : ''}\`} style={style}>
      {children}
    </div>
  );
});

const ProgressBar = React.memo(function ProgressBar({ value, max = 100, height = 10 }) {
  const width = \`\${Math.min(100, (value / max) * 100)}%\`;
  return (
    <div className=\"vyna-progress\" style={{ height }}>
      <div className=\"vyna-progress__bar\" style={{ width }} />
    </div>
  );
});

const gradientBg = {
  minHeight: \"100vh\",
  padding: 20,
  background: \"linear-gradient(180deg,#0b1d4d,#0f245f 35%,#0f5132)\",
  color: \"#fff\",
  fontFamily: \"Poppins, Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial\",
};

function getRuntimeConfig() {
  let url = null, key = null;
  if (typeof window !== \"undefined\" && window.__VYNA_CONFIG__) {
    url = window.__VYNA_CONFIG__.SUPABASE_URL || null;
    key = window.__VYNA_CONFIG__.SUPABASE_ANON_KEY || null;
  }
  if (!url || !key) {
    if (typeof window !== \"undefined\") {
      url = url || localStorage.getItem(\"SUPABASE_URL\");
      key = key || localStorage.getItem(\"SUPABASE_ANON_KEY\");
    }
  }
  return { url, key, configured: Boolean(url && key) };
}

(async function configTests() {
  const c = getRuntimeConfig();
  console.assert(c && typeof c.configured === \"boolean\", \"getRuntimeConfig debe devolver {configured: boolean}\");
})();

let __supabaseClientCache = new Map();
let __supabaseUMDLoading = null;

async function loadSupabase(url, key) {
  const cacheKey = \`\${url}__\${key}\`;
  if (__supabaseClientCache.has(cacheKey)) return __supabaseClientCache.get(cacheKey);
  try {
    const mod = await import(\"@supabase/supabase-js\");
    const client = mod.createClient(url, key);
    __supabaseClientCache.set(cacheKey, client);
    return client;
  } catch (e) {
    try {
      if (typeof window !== \"undefined\" && !window.supabase) {
        if (!__supabaseUMDLoading) {
          __supabaseUMDLoading = new Promise((resolve, reject) => {
            const s = document.createElement(\"script\");
            s.src = \"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js\";
            s.async = true;
            s.onload = resolve;
            s.onerror = () => reject(new Error(\"No se pudo cargar la librería desde CDN.\"));
            document.head.appendChild(s);
          });
        }
        await __supabaseUMDLoading;
      }
      if (typeof window !== \"undefined\" && window.supabase && window.supabase.createClient) {
        const client = window.supabase.createClient(url, key);
        __supabaseClientCache.set(cacheKey, client);
        return client;
      }
      throw new Error(\"Librería '@supabase/supabase-js' no disponible (paquete ni CDN). Instálala en tu proyecto.\");
    } catch (cdnErr) {
      throw cdnErr;
    }
  }
}

function kgToLb(kg) { return kg === \"\" || kg === null || isNaN(Number(kg)) ? \"\" : (Number(kg) * 2.2046226218).toFixed(1); }
function lbToKg(lb) { return lb === \"\" || lb === null || isNaN(Number(lb)) ? \"\" : (Number(lb) / 2.2046226218).toFixed(1); }

function startOfMonth(d) { const x = new Date(d.getFullYear(), d.getMonth(), 1); x.setHours(0,0,0,0); return x; }
function endOfMonth(d) { const x = new Date(d.getFullYear(), d.getMonth()+1, 0); x.setHours(23,59,59,999); return x; }
function formatDateYMD(d) { const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const da=String(d.getDate()).padStart(2,'0'); return \`\${y}-\${m}-\${da}\`; }

function NavTabs({ canCalendar, go }) {
  return (
    <div style={{ display: \"flex\", gap: 8, marginBottom: 12 }}>
      <Btn kind=\"secondary\" onClick={() => go(\"dashboard\")}>🏠 Inicio</Btn>
      <Btn kind=\"secondary\" onClick={() => go(\"analytics\")} disabled={!canCalendar}>📊 Analítica</Btn>
      <Btn kind=\"secondary\" onClick={() => go(\"calendar\")} disabled={!canCalendar}>📅 Calendario</Btn>
      <Btn kind=\"secondary\" onClick={() => go(\"profile\")}>👤 Perfil</Btn>
    </div>
  );
}

export default function VYNAAppSupabaseOnly() {
  const [screen, setScreen] = useState(\"welcome\");
  const [supabase, setSupabase] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [clients, setClients] = useState([]);
  const [progressByClient, setProgressByClient] = useState({});
  const [latestByClient, setLatestByClient] = useState({});
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState(\"\");
  const [checking, setChecking] = useState(false);
  const [checkMsg, setCheckMsg] = useState(\"\");
  const [password, setPassword] = useState(\"\");
  const [msg, setMsg] = useState(\"\");
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const [demoMode, setDemoMode] = useState(false);

  const [profile, setProfile] = useState(() => {
    if (typeof window === \"undefined\") return { goal: \"\", weightKg: \"\", weightLb: \"\", heightIn: \"\", age: \"\", gender: \"\", dailyGoalKcal: \"\\" };
    try {
      const raw = localStorage.getItem(\"VYNA_PROFILE\");
      return raw ? JSON.parse(raw) : { goal: \"\", weightKg: \"\", weightLb: \"\", heightIn: \"\", age: \"\", gender: \"\", dailyGoalKcal: \"\\" };
    } catch { return { goal: \"\", weightKg: \"\", weightLb: \"\", heightIn: \"\", age: \"\", gender: \"\", dailyGoalKcal: \"\\" }; }
  });

  useEffect(() => {
    const boot = async () => {
      const cfg = getRuntimeConfig();
      if (!cfg.configured) { setScreen(\"welcome\"); return; }
      try {
        const client = await loadSupabase(cfg.url, cfg.key);
        setSupabase(client);
        const { data } = await client.auth.getSession();
        const s = data?.session || null;
        setSession(s);
        if (!s) { setScreen(\"setup\"); return; }
        await ensureRoleAndLoad(s.user?.id, client);
        setScreen(\"dashboard\");
      } catch (e) {
        setMsg(e.message || String(e));
        setScreen(\"setup\");
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
      { id: \"c1\", name: \"Carlos Gómez\", weight: 78.5, calories: 2300, motivation: 9 },
      { id: \"c2\", name: \"Lucía Pérez\", weight: 67.5, calories: 1800, motivation: 8 },
    ];
    const demoProgress = {
      c1: [
        { date: \"2025-09-25\", weight: 80, calories: 2500, motivation: 8 },
        { date: \"2025-09-30\", weight: 79, calories: 2400, motivation: 8.5 },
        { date: \"2025-10-05\", weight: 78.5, calories: 2300, motivation: 9 },
      ],
      c2: [
        { date: \"2025-09-25\", weight: 68, calories: 1900, motivation: 7 },
        { date: \"2025-09-30\", weight: 67.9, calories: 1850, motivation: 7.5 },
        { date: \"2025-10-05\", weight: 67.5, calories: 1800, motivation: 8 },
      ],
    };
    setDemoMode(true);
    setSession({ user: { id: \"demo-nutri\", email: \"demo@vyna.app\" } });
    setClients(demoClients);
    setProgressByClient(demoProgress);
    setLatestByClient(computeLatestMap(demoProgress));
    setSelected(null);
    setScreen(\"dashboard\");
  }

  function exitDemo() {
    setDemoMode(false);
    setSession(null);
    setClients([]);
    setProgressByClient({});
    setLatestByClient({});
    setSelected(null);
    setScreen(\"welcome\");
  }

  async function ensureRoleAndLoad(userId, client) {
    const { data: profileRow, error } = await client.from(\"profiles\").select(\"role\").eq(\"id\", userId).single();
    if (error) throw error;
    setRole(profileRow?.role || null);
    if (profileRow?.role !== \"nutritionist\") throw new Error(\"Acceso restringido: se requiere rol 'nutritionist'.\");
    const { data: cls, error: e2 } = await client
      .from(\"clients\").select(\"id, name, weight, calories, motivation\")
      .eq(\"nutritionist_id\", userId);
    if (e2) throw e2;
    setClients(cls || []);
    try {
      if (cls && cls.length) {
        const ids = cls.map((c) => c.id);
        const { data: latest, error: e3 } = await client
          .from(\"client_last_progress\")
          .select(\"client_id,last_date,last_weight,last_calories,last_motivation\")
          .in(\"client_id\", ids);
        if (!e3 && latest) {
          const map = Object.fromEntries(latest.map((r) => [r.client_id, r]));
          setLatestByClient(map);
        } else {
          setLatestByClient({});
        }
      } else {
        setLatestByClient({});
      }
    } catch { setLatestByClient({}); }
  }

  async function login(email, password) {
    try {
      setMsg(\"\");
      const cfg = getRuntimeConfig();
      if (!cfg.configured) throw new Error(\"Configura SUPABASE_URL y SUPABASE_ANON_KEY primero.\");
      const client = await loadSupabase(cfg.url, cfg.key);
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSupabase(client);
      setSession(data?.session || null);
      await ensureRoleAndLoad(data?.user?.id, client);
      setScreen(\"dashboard\");
      setMsg(\"Sesión iniciada ✅\");
    } catch (e) {
      setMsg(\"No se pudo iniciar sesión: \" + (e.message || String(e)));
    }
  }

  async function logout() {
    if (demoMode) { exitDemo(); return; }
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null); setRole(null); setClients([]); setSelected(null); setProgressByClient({});
    setScreen(\"login\");
  }

  async function loadProgress(clientId) {
    if (demoMode) return;
    const { data, error } = await supabase
      .from(\"progress\")
      .select(\"date, weight, calories, motivation\")
      .eq(\"client_id\", clientId)
      .order(\"date\");
    if (error) { setMsg(\"Error al cargar progreso: \" + error.message); return; }
    setProgressByClient((prev) => ({ ...prev, [clientId]: data || [] }));
  }

  function saveProfile(next) {
    setProfile(next);
    if (typeof window !== \"undefined\") {
      localStorage.setItem(\"VYNA_PROFILE\", JSON.stringify(next));
    }
  }

  function computeStreak(records) {
    if (!records || !records.length) return 0;
    const dates = new Set(records.map(r => r.date));
    const anchor = new Date(\`\${records[records.length - 1].date}T00:00:00\`);
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(anchor);
      d.setDate(d.getDate() - i);
      if (dates.has(formatDateYMD(d))) streak++; else break;
    }
    return streak;
  }

  function MonthGrid({ monthStart, daysMap, goal }) {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const lastDay = endOfMonth(monthStart).getDate();
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= lastDay; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return (
      <div style={{ display: \"grid\", gridTemplateColumns: \"repeat(7,1fr)\", gap: 8 }}>
        {[\"D\",\"L\",\"M\",\"X\",\"J\",\"V\",\"S\"].map((w) => (
          <div key={w} style={{ opacity: 0.7, fontSize: 12, textAlign: \"center\" }}>{w}</div>
        ))}
        {cells.map((d, i) => {
          const calories = d ? daysMap[d] || 0 : 0;
          const hit = goal && calories ? calories >= goal : false;
          return (
            <div key={i} style={{
              minHeight: 72,
              borderRadius: 14,
              background: d ? (hit ? \"#14532d\" : \"rgba(255,255,255,0.06)\") : \"transparent\",
              border: d ? (hit ? \"1px solid #22c55e88\" : \"1px solid rgba(255,255,255,0.12)\") : \"none\",
              padding: 8,
            }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{d ?? \"\"}</div>
              {d && (
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  {calories ? \`\${calories} kcal\` : "—"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  let content = null;

  if (screen === \"welcome\") {
    content = (
      <>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <H size={44} center>VYNA</H>
          <Text center dim>Tu progreso, hecho visible.</Text>
        </div>
        <div className=\"vyna-grid-3\" style={{ marginTop: 24 }}>
          <Card>
            <H size={18}>Explorar Demo</H>
            <Text dim>Recorre el panel de nutricionista con datos ficticios.</Text>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Btn onClick={enterDemo}>Entrar demo</Btn>
            </div>
          </Card>
          <Card>
            <H size={18}>Entrar como Nutricionista</H>
            <Text dim>Configura Supabase y accede con tu usuario.</Text>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Btn onClick={() => setScreen('setup')}>Configurar</Btn>
              <Btn kind=\"secondary\" onClick={() => setScreen('login')}>Iniciar sesión</Btn>
            </div>
          </Card>
          <Card>
            <H size={18}>Vista Usuario</H>
            <Text dim>Explora las pantallas del usuario (Body, Food, Coach).</Text>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Btn kind=\"info\" onClick={() => setScreen('home')}>Abrir Home</Btn>
            </div>
          </Card>
        </div>
      </>
    );
  }

  if (screen === \"setup\") {
    const cfg = getRuntimeConfig();
    content = (
      <>
        <H size={32} center>⚙️ Configuración requerida</H>
        <Text center dim>Define tus claves de Supabase para continuar (sin process.env).</Text>
        <div style={{ maxWidth: 780, margin: \"16px auto\" }}>
          <Card>
            <H size={18}>Claves de Supabase</H>
            <div style={{ display: \"grid\", gap: 12, marginBottom: 12 }}>
              <label style={{ fontSize: 13 }} className=\"vyna-text vyna-text--dim\">SUPABASE_URL</label>
              <input className=\"vyna-input\"
                defaultValue={cfg.url || \"\"}
                placeholder=\"https://TU-PROYECTO.supabase.co\"
                onChange={(e) => (window.__TMP_URL__ = e.target.value)}
              />
              <label style={{ fontSize: 13 }} className=\"vyna-text vyna-text--dim\">SUPABASE_ANON_KEY</label>
              <input className=\"vyna-input\"
                defaultValue={cfg.key || \"\"}
                placeholder=\"SUPABASE_ANON_KEY\"
                onChange={(e) => (window.__TMP_KEY__ = e.target.value)}
              />
              <div style={{ display: \"flex\", gap: 10, flexWrap: \"wrap\" }}>
                <Btn
                  onClick={() => {
                    const url = window.__TMP_URL__ || cfg.url;
                    const key = window.__TMP_KEY__ || cfg.key;
                    if (url) localStorage.setItem(\"SUPABASE_URL\", url);
                    if (key) localStorage.setItem(\"SUPABASE_ANON_KEY\", key);
                    location.reload();
                  }}
                >
                  Guardar claves y recargar
                </Btn>
                <Btn
                  kind=\"secondary\"
                  onClick={async () => {
                    setCheckMsg(\"\");
                    const url = window.__TMP_URL__ || cfg.url;
                    const key = window.__TMP_KEY__ || cfg.key;
                    if (!url || !key) { setCheckMsg(\"Primero completa SUPABASE_URL y SUPABASE_ANON_KEY\"); return; }
                    try {
                      setChecking(true);
                      const client = await loadSupabase(url, key);
                      const { data } = await client.auth.getSession();
                      setCheckMsg(data?.session ? \"Conexión OK y sesión detectada.\" : \"Conexión OK (sin sesión). Continúa con Iniciar sesión.\");
                    } catch (e) {
                      setCheckMsg(\"Fallo de conexión: \" + (e.message || String(e)));
                    } finally { setChecking(false); }
                  }}
                >
                  Probar conexión
                </Btn>
                <Btn
                  onClick={async () => {
                    setCheckMsg(\"\");
                    const url = window.__TMP_URL__ || cfg.url;
                    const key = window.__TMP_KEY__ || cfg.key;
                    if (!url || !key) { setCheckMsg(\"Faltan claves para continuar a Iniciar sesión\"); return; }
                    try {
                      const client = await loadSupabase(url, key);
                      setSupabase(client);
                      setScreen(\"login\");
                    } catch (e) {
                      setCheckMsg(\"No se pudo preparar la pantalla de inicio de sesión: \" + (e.message || String(e)));
                    }
                  }}
                >
                  Ir a Iniciar sesión ahora
                </Btn>
              </div>
              {checking && <Text dim>Probando conexión…</Text>}
              {!!checkMsg && (
                <Card style={{ marginTop: 8 }}>
                  <Text style={{ color: checkMsg.startsWith('Conexión OK') ? '#bbf7d0' : '#fecaca' }}>{checkMsg}</Text>
                </Card>
              )}
            </div>
          </Card>
          {!!msg && (
            <Card style={{ marginTop: 12 }}>
              <Text style={{ color: \"#fde68a\" }}>{msg}</Text>
            </Card>
          )}
          <Card style={{ marginTop: 12 }}>
            <H size={16}>Asistente de configuración (paso a paso)</H>
            <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
              <li>Pega <code>SUPABASE_URL</code> y <code>SUPABASE_ANON_KEY</code> arriba. Pulsa <b>Probar conexión</b>.</li>
              <li>Si sale <b>Conexión OK</b>, pulsa <b>Guardar claves y recargar</b>.</li>
              <li>Ve a <b>Iniciar sesión</b> con tu usuario de Supabase Auth (que tenga <code>role = 'nutritionist'</code> en la tabla <code>profiles</code>).</li>
              <li>En el <b>Dashboard</b> verás solo tus clientes (aislados por RLS). Entra a <b>Ver Analítica</b> para ver su progreso.</li>
            </ol>
          </Card>
        </div>
      </>
    );
  }

  if (screen === \"login\") {
    content = (
      <>
        <H size={32} center>Iniciar sesión</H>
        <Text center dim>Usa un usuario existente en Supabase Auth con rol 'nutritionist' en la tabla profiles.</Text>
        <div style={{ maxWidth: 600, margin: \"16px auto\" }}>
          <Card>
            <div style={{ display: \"grid\", gap: 12 }}>
              <input className=\"vyna-input\" placeholder=\"email\" onChange={(e) => setEmail(e.target.value)} />
              <input className=\"vyna-input\" placeholder=\"password\" type=\"password\" onChange={(e) => setPassword(e.target.value)} />
              <div style={{ display: \"flex\", gap: 10 }}>
                <Btn onClick={() => login(email, password)}>Entrar</Btn>
                <Btn kind=\"secondary\" onClick={() => setScreen('welcome')}>Volver</Btn>
              </div>
              {!!msg && <Text style={{ color: \"#bbf7d0\" }}>{msg}</Text>}
            </div>
          </Card>
        </div>
      </>
    );
  }

  if (screen === \"dashboard\") {
    content = (
      <>
        <Row left={<H size={36}>Panel Seguro de Nutricionista {demoMode ? '— DEMO' : ''}</H>} right={<div style={{ display: 'flex', gap: 8 }}><Text dim>{session?.user?.email}</Text><Btn kind=\"secondary\" onClick={logout}>{demoMode ? 'Salir demo' : 'Cerrar sesión'}</Btn></div>} />
        <NavTabs canCalendar={!!selected} go={(s) => setScreen(s)} />
        <Text dim>Mostrando solo clientes asignados a tu cuenta {demoMode ? '(demo)' : '(RLS)'}.</Text>
        {clients.length === 0 && (
          <Card style={{ marginTop: 12 }}>
            <Text dim>No se encontraron clientes. Inserta datos en la tabla <code>clients</code> con tu <code>nutritionist_id</code>.</Text>
          </Card>
        )}
        <div style={{ display: \"grid\", gridTemplateColumns: \"repeat(auto-fit,minmax(260px,1fr))\", gap: 16, marginTop: 16 }}>
          {clients.map((c) => {
            const last = latestByClient[c.id];
            return (
              <Card key={c.id}>
                <H size={20}>{c.name}</H>
                <Text dim>Peso actual: {c.weight ?? '—'} kg</Text>
                <Text dim>Calorías promedio: {c.calories ?? '—'} kcal</Text>
                <Text dim>Motivación: {c.motivation ?? '—'}/10</Text>
                {last && (
                  <Text dim>Último: {last.last_date ?? '—'} · {last.last_weight ?? '—'} kg · {last.last_calories ?? '—'} kcal · {last.last_motivation ?? '—'}/10</Text>
                )}
                <div style={{ height: 10, margin: \"10px 0\" }}>
                  <ProgressBar value={(c.motivation ?? 0) * 10} />
                </div>
                <div style={{ display: \"flex\", gap: 8 }}>
                  <Btn onClick={() => { setSelected(c); setScreen('analytics'); if (!progressByClient[c.id]) loadProgress(c.id); }} style={{ width: \"100%\" }}>Ver Analítica</Btn>
                  <Btn kind=\"secondary\" onClick={() => { setSelected(c); setScreen('calendar'); if (!progressByClient[c.id]) loadProgress(c.id); }}>Calendario</Btn>
                </div>
              </Card>
            );
          })}
        </div>
      </>
    );
  }

  if (screen === \"analytics\") {
    const sel = selected; const data = sel ? (progressByClient[sel.id] || []) : [];
    const weightStart = data[0]?.weight ?? 0;
    const weightNow = data[data.length - 1]?.weight ?? 0;
    const delta = weightNow && weightStart ? (weightNow - weightStart).toFixed(1) : \"0.0\";
    const streak = computeStreak(data);

    content = (
      <>
        <Row left={<H size={28}>Analítica de {sel?.name ?? '—'}</H>} right={<Btn kind=\"secondary\" onClick={() => setScreen(\"dashboard\")}>Volver</Btn>} />
        <NavTabs canCalendar={!!sel} go={(s) => setScreen(s)} />
        <div style={{ display: \"grid\", gridTemplateColumns: \"repeat(auto-fit,minmax(280px,1fr))\", gap: 16 }}>
          <Card>
            <H size={18}>📉 Peso (kg)</H>
            <Text dim>Inicio: {weightStart || '—'} kg — Ahora: {weightNow || '—'} kg — Δ {delta} kg</Text>
            <div style={{ marginTop: 10 }}>
              <ProgressBar value={Math.max(0, 100 - ((weightNow || 0) % 100))} />
            </div>
          </Card>
          <Card>
            <H size={18}>🔥 Calorías (último registro)</H>
            <Text dim>{data[data.length - 1]?.calories ?? \"—\"} kcal</Text>
            <div style={{ marginTop: 10 }}>
              <ProgressBar value={((data[data.length - 1]?.calories ?? 0) / 30)} />
            </div>
          </Card>
          <Card>
            <H size={18}>💬 Motivación</H>
            <Text dim>{data[data.length - 1]?.motivation ?? \"—\"}/10</Text>
            <div style={{ marginTop: 10 }}>
              <ProgressBar value={((data[data.length - 1]?.motivation ?? 0) * 10)} />
            </div>
          </Card>
          <Card>
            <H size={18}>🔥 Racha</H>
            <Text dim>{streak} días seguidos registrando</Text>
          </Card>
        </div>

        <Card style={{ marginTop: 16 }}>
          <H size={18}>📅 Registros</H>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8 }}>
            {data.length === 0 && <Text dim>No hay registros todavía para este cliente.</Text>}
            {data.map((r, idx) => (
              <div key={r.date || idx} style={{ display: \"grid\", gridTemplateColumns: \"120px 1fr 1fr 1fr\", gap: 10, padding: \"6px 0\", borderBottom: \"1px dashed rgba(255,255,255,0.15)\" }}>
                <div>{r.date ?? '—'}</div>
                <div>Peso: {r.weight ?? '—'} kg</div>
                <div>Calorías: {r.calories ?? '—'}</div>
                <div>Motivación: {r.motivation ?? '—'}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  if (screen === \"calendar\") {
    const sel = selected; const data = sel ? (progressByClient[sel.id] || []) : [];
    const monthStart = calendarMonth;
    const monthEnd = endOfMonth(monthStart);
    const dailyMap = useMemo(() => {
      const m = {};
      for (const r of data) {
        const d = new Date(\`\${r.date}T00:00:00\`);
        if (d >= monthStart && d <= monthEnd) {
          const day = d.getDate();
          m[day] = (m[day] || 0) + (r.calories || 0);
        }
      }
      return m;
    }, [data, monthStart.getTime()]);

    const monthTotal = Object.values(dailyMap).reduce((a, b) => a + b, 0);
    const goal = Number(profile.dailyGoalKcal) || 0;

    content = (
      <>
        <Row left={<H size={28}>Calendario — {sel?.name ?? '—'}</H>} right={<Btn kind=\"secondary\" onClick={() => setScreen(\"dashboard\")}>Volver</Btn>} />
        <NavTabs canCalendar={!!sel} go={(s) => setScreen(s)} />

        <Card>
          <Row
            left={<>
              <Btn kind=\"secondary\" onClick={() => setCalendarMonth(startOfMonth(new Date(monthStart.getFullYear(), monthStart.getMonth()-1, 1)))}>◀︎</Btn>
              <Text style={{ margin: \"0 8px\" }}>{monthStart.toLocaleString('es', { month: 'long', year: 'numeric' })}</Text>
              <Btn kind=\"secondary\" onClick={() => setCalendarMonth(startOfMonth(new Date(monthStart.getFullYear(), monthStart.getMonth()+1, 1)))}>▶︎</Btn>
            </>}
            right={<Text dim>Total mes: {monthTotal} kcal {goal ? \`· Meta diaria: \${goal} kcal\` : ''}</Text>}
          />
          <div style={{ marginTop: 12 }}>
            <MonthGrid monthStart={monthStart} daysMap={dailyMap} goal={goal} />
          </div>
        </Card>
      </>
    );
  }

  if (screen === \"profile\") {
    content = (
      <>
        <Row left={<H size={32}>Cuéntanos de ti</H>} right={<Btn kind=\"secondary\" onClick={() => setScreen(\"welcome\")}>Volver</Btn>} />
        <Card>
          <div style={{ display: \"grid\", gap: 12 }}>
            <label>Objetivo</label>
            <select value={profile.goal} onChange={(e) => saveProfile({ ...profile, goal: e.target.value })} className=\"vyna-input\">
              <option value=\"\">Selecciona…</option>
              <option value=\"gain\">Ganar músculo</option>
              <option value=\"lose\">Perder grasa</option>
              <option value=\"maintain\">Mantener forma</option>
            </select>

            <label>Peso (kg)</label>
            <input
              className=\"vyna-input\"
              value={profile.weightKg}
              onChange={(e) => {
                const kg = e.target.value;
                const lb = kgToLb(kg);
                saveProfile({ ...profile, weightKg: kg, weightLb: lb === \"\" ? \"\": String(lb) });
              }}
              placeholder=\"Ej. 78.5\"
            />

            <label>Peso (lb)</label>
            <input
              className=\"vyna-input\"
              value={profile.weightLb}
              onChange={(e) => {
                const lb = e.target.value;
                const kg = lbToKg(lb);
                saveProfile({ ...profile, weightLb: lb, weightKg: kg === \"\" ? \"\": String(kg) });
              }}
              placeholder=\"Ej. 173.1\"
            />

            <label>Altura (pulgadas)</label>
            <input
              className=\"vyna-input\"
              value={profile.heightIn}
              onChange={(e) => saveProfile({ ...profile, heightIn: e.target.value })}
              placeholder=\"Ej. 70\"
            />

            <label>Edad</label>
            <input
              className=\"vyna-input\"
              value={profile.age}
              onChange={(e) => saveProfile({ ...profile, age: e.target.value })}
              placeholder=\"Ej. 28\"
            />

            <label>Género</label>
            <select value={profile.gender} onChange={(e) => saveProfile({ ...profile, gender: e.target.value })} className=\"vyna-input\">
              <option value=\"\">Selecciona…</option>
              <option value=\"female\">Femenino</option>
              <option value=\"male\">Masculino</option>
              <option value=\"other\">Otro / Prefiero no decir</option>
            </select>

            <label>Meta calórica diaria (kcal)</label>
            <input
              className=\"vyna-input\"
              value={profile.dailyGoalKcal}
              onChange={(e) => saveProfile({ ...profile, dailyGoalKcal: e.target.value })}
              placeholder=\"Ej. 2300\"
            />

            <Btn onClick={() => saveProfile({ ...profile })}>Guardar</Btn>
            <Text dim>Tu información se guarda en este dispositivo.</Text>
          </div>
        </Card>
      </>
    );
  }

  if (screen === \"home\") {
    content = (
      <>
        <Row left={<H size={32}>Bienvenido/a</H>} right={<Btn kind=\"secondary\" onClick={() => setScreen('welcome')}>Volver</Btn>} />
        <Text dim>Hola, sigue construyendo tu mejor versión.</Text>
        <div className=\"vyna-grid-3\" style={{ marginTop: 16 }}>
          <Card>
            <H size={20}>📸 Escanear cuerpo</H>
            <Text dim>Sube una foto frontal o de perfil y visualiza tu progreso.</Text>
            <div style={{ marginTop: 12 }}><Btn onClick={() => setScreen('body')}>Abrir</Btn></div>
          </Card>
          <Card>
            <H size={20}>🥗 Escanear comida</H>
            <Text dim>Identifica alimentos y estima calorías y macros.</Text>
            <div style={{ marginTop: 12 }}><Btn onClick={() => setScreen('food')}>Abrir</Btn></div>
          </Card>
          <Card>
            <H size={20}>💬 Coach VYNA</H>
            <Text dim>Mensajes motivacionales y porcentaje de progreso.</Text>
            <div style={{ marginTop: 12 }}><Btn onClick={() => setScreen('coach')}>Abrir</Btn></div>
          </Card>
        </div>
      </>
    );
  }

  if (screen === \"body\") {
    content = (
      <>
        <Row left={<H size={28}>Escaneo Corporal</H>} right={<Btn kind=\"secondary\" onClick={() => setScreen('home')}>Volver</Btn>} />
        <div className=\"vyna-grid-3\" style={{ marginTop: 12 }}>
          <Card>
            <H size={18}>Subir foto</H>
            <input className=\"vyna-input\" placeholder=\"Selecciona una imagen (demo)\" disabled />
            <div style={{ marginTop: 8 }}><Btn disabled>Analizar (demo)</Btn></div>
          </Card>
          <Card>
            <H size={18}>Resultado (demo)</H>
            <Text dim>Hombros +12% de definición · Espalda +8% · Glúteos +6%.</Text>
          </Card>
          <Card>
            <H size={18}>Línea de tiempo</H>
            <Text dim>Tus imágenes aparecerán aquí en orden cronológico.</Text>
          </Card>
        </div>
      </>
    );
  }

  if (screen === \"food\") {
    content = (
      <>
        <Row left={<H size={28}>Escaneo de Comida</H>} right={<Btn kind=\"secondary\" onClick={() => setScreen('home')}>Volver</Btn>} />
        <div className=\"vyna-grid-3\" style={{ marginTop: 12 }}>
          <Card>
            <H size={18}>Subir foto</H>
            <input className=\"vyna-input\" placeholder=\"Selecciona una imagen (demo)\" disabled />
            <div style={{ marginTop: 8 }}><Btn disabled>Identificar (demo)</Btn></div>
          </Card>
          <Card>
            <H size={18}>Estimación (demo)</H>
            <Text dim>Pollo 150g, Arroz 120g, Ensalada 80g · 540 kcal · P: 42g C: 60g G: 14g.</Text>
          </Card>
          <Card>
            <H size={18}>Recomendación</H>
            <Text dim>Falta proteína para tu meta de hoy. Añade 20–30g.</Text>
          </Card>
        </div>
      </>
    );
  }

  if (screen === \"coach\") {
    content = (
      <>
        <Row left={<H size={28}>Coach VYNA</H>} right={<Btn kind=\"secondary\" onClick={() => setScreen('home')}>Volver</Btn>} />
        <div className=\"vyna-grid-3\" style={{ marginTop: 12 }}>
          <Card>
            <H size={18}>Hoy</H>
            <Text dim>“Tu yo del futuro ya está agradecido por lo que comiste hoy.”</Text>
          </Card>
          <Card>
            <H size={18}>Progreso</H>
            <Text dim>Estás un 9% más cerca de tu meta este mes.</Text>
            <div style={{ marginTop: 8 }}><ProgressBar value={9} /></div>
          </Card>
          <Card>
            <H size={18}>Racha</H>
            <Text dim>5 días seguidos cumpliendo meta diaria.</Text>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div style={gradientBg}>
      <GlobalStyles />
      {content}
    </div>
  );
}
