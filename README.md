# VYNA — MVP (Vite + React + Supabase)

## 1) Instalar
```bash
npm i
```

## 2) Configurar Supabase (sin process.env)
Edita `public/config.js` con tu `SUPABASE_URL` y `SUPABASE_ANON_KEY` (anon es público).

## 3) Ejecutar en local
```bash
npm run dev
```

## 4) Publicar en Vercel
- Sube este repo a GitHub.
- En Vercel: New Project → Import from GitHub → Framework Vite (auto).
- Build: `npm run build` · Output: `dist/` (auto).
- En Supabase > Auth > URL config: agrega el dominio de Vercel a las Redirect URLs y CORS.

## 5) Notas
- RLS debe estar activa en `profiles`, `clients`, `progress`.
- No uses la service role en el cliente.
- Para SPA fallback, `vercel.json` redirige todo a `/`.
