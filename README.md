# Matic Solutions

Monorepo: portal web (Vite + React), migraciones Supabase, documentación de agencia y reglas Cursor.

- **GitHub:** [github.com/C0deness/matic-solutions](https://github.com/C0deness/matic-solutions)
- **App (carpeta de despliegue):** `web/`
- **Despliegue:** ver [web/DEPLOY_SUPABASE_VERCEL.md](web/DEPLOY_SUPABASE_VERCEL.md)

### Conectar Vercel (interfaz)

1. [vercel.com/new](https://vercel.com/new) → **Import** este repositorio.
2. **Root Directory** → `web` (no la raíz del monorepo).
3. Variables de entorno (Production + Preview): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `WEBHOOK_SECRET`.
4. **Deploy**.

`agency-agents/` no está en el repo (clon externo). Las reglas Cursor están en `.cursor/rules/`.
