# Configurar Supabase y Vercel desde la interfaz (dashboard)

Guía paso a paso usando solo la web de [Supabase](https://supabase.com/dashboard) y [Vercel](https://vercel.com/dashboard). Tu código del portal está en la carpeta **`web/`** del repo.

**Repositorio GitHub:** [github.com/C0deness/matic-solutions](https://github.com/C0deness/matic-solutions) (importar este repo en Vercel).

---

## Variables `VITE_SUPABASE_*` (frontend)

Solo hacen falta **dos** para que el panel use **Supabase Auth** y guarde el chat en BD. Deben existir **antes** de `npm run build` (local o en Vercel).

| Variable | Dónde la sacas en Supabase | Ejemplo de valor |
|----------|----------------------------|------------------|
| `VITE_SUPABASE_URL` | **Settings → API → Project URL** | `https://TU-REF.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | **Settings → API →** pestaña *Legacy* → clave **`anon`** · `public` · Copy | JWT largo que empieza por `eyJ...` |

**Reglas:**

- El prefijo **`VITE_`** es obligatorio: si no, Vite **no** las mete en el bundle y la app cree que no hay Supabase.
- **Sin espacios** antes/después del `=` en `.env.local`.
- En **Vercel**, crea las mismas dos variables en **Production** (y Preview si quieres) y luego **Redeploy**; si las añades después del primer deploy, el JS viejo seguirá sin ellas hasta volver a compilar.
- Este proyecto usa la clave **anon (legacy)** con `@supabase/supabase-js`, no la clave tipo `sb_publishable_...` en el cliente.

**Local:** en `web/.env.local` (no se sube a Git):

```env
VITE_SUPABASE_URL=https://nohduseuogajjbmrnwul.supabase.co
VITE_SUPABASE_ANON_KEY=<pega aquí la anon key del dashboard>
```

(Sustituí la URL si tu proyecto Supabase es otro.)

---

## Parte A — Supabase

### A1. Crear el proyecto

1. Entrá en **https://supabase.com/dashboard** e iniciá sesión.
2. **New project** (o **Create new project**).
3. Elegí **Organization**, nombre del proyecto (ej. `matic-portal`), **Database password** (guardala en un gestor de contraseñas).
4. **Region**: la más cercana a tus clientes (ej. `West EU` si estás en España).
5. **Create new project** y esperá a que termine el aprovisionamiento (1–2 minutos).

### A2. Crear tablas (SQL)

1. En el menú izquierdo: **SQL Editor**.
2. **New query**.
3. Abrí en tu ordenador el archivo del repo:

   `supabase/migrations/20260405140000_portal_client_cases.sql`

4. Copiá **todo** el contenido y pegalo en el editor.
5. Pulsá **Run** (o `Ctrl/Cmd + Enter`).
6. Debería aparecer “Success”. Si falla por un trigger duplicado de otro intento, leé el mensaje de error (a veces hace falta borrar el trigger a mano en **Database → Triggers** y volver a ejecutar).

### A3. Obtener URL y claves API

1. **Project Settings** (engranaje abajo a la izquierda) → **API**.
2. Anotá:
   - **Project URL** → será tu `VITE_SUPABASE_URL` (ej. `https://abcdefgh.supabase.co`).
   - **Project API keys**:
     - **`anon` `public`** → `VITE_SUPABASE_ANON_KEY` (segura para el navegador con RLS).
     - **`service_role` `secret`** → **solo para Vercel** (nunca en el frontend). La usarás como `SUPABASE_SERVICE_ROLE_KEY`.

### A4. Autenticación por email

1. Menú **Authentication** → **Providers**.
2. **Email** debe estar **Enabled**.
3. Para **probar rápido en local**:
   - **Authentication** → **Providers** → **Email** → desactivá **Confirm email** (o en versiones nuevas, en **Authentication** → **Sign In / Providers** / **Email templates** según la UI).
   - En muchos proyectos está en **Authentication** → **Providers** → **Email** → opción tipo **“Confirm email”** / **Enable email confirmations** → desmarcar para desarrollo.
4. Para **producción**: volvé a activar la confirmación por correo.
5. **Authentication** → **URL Configuration**:
   - **Site URL**: la URL pública de tu app en Vercel (ej. `https://tu-app.vercel.app`).
   - **Redirect URLs**: añadí `http://localhost:5173/**` (Vite local) y `https://tu-dominio.vercel.app/**` para que los enlaces de magic link / confirmación no fallen.

### A5. Comprobar que hay datos (después de usar el portal)

1. **Table Editor** → tablas **`client_cases`** y **`client_case_messages`**.
2. Tras registrarte en `/portal/registro` y enviar un mensaje en el chat, deberían aparecer filas.

---

## Parte B — Variables en tu Mac (desarrollo local)

1. En la carpeta **`web/`**, copiá el ejemplo:

   `cp .env.example .env.local`

2. Editá **`.env.local`** y dejá (con tus valores reales):

```env
VITE_SUPABASE_URL=https://TU-REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. En la terminal:

```bash
cd web && npm install && npm run dev
```

4. Abrí **http://localhost:5173/portal/registro**, creá cuenta, entrá al panel y probá el chat.

---

## Parte C — Vercel

### C1. Subir el código a Git

Vercel despliega desde **GitHub / GitLab / Bitbucket**. Asegurate de que el repo con la carpeta **`web/`** está subido.

### C2. Nuevo proyecto en Vercel

1. **https://vercel.com/dashboard** → **Add New…** → **Project**.
2. **Import** el repositorio.
3. En **Configure Project**:
   - **Framework Preset**: **Vite** (o “Other” si no detecta; igual funciona con `vercel.json`).
   - **Root Directory**: pulsá **Edit** y poned **`web`** (importante: el `package.json` del portal está ahí).
   - **Build Command**: `npm run build` (por defecto).
   - **Output Directory**: `dist` (ya definido en `web/vercel.json`).

### C3. Variables de entorno en Vercel (servidor + build del frontend)

En la misma pantalla de importación, **Environment Variables**, añadí **antes del primer deploy**:

| Name | Value | Entornos |
|------|--------|----------|
| `VITE_SUPABASE_URL` | Igual que en Supabase (Project URL) | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Clave **anon public** | Production, Preview, Development |
| `SUPABASE_URL` | La misma URL del proyecto (para la API del webhook) | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave **service_role** (secreta) | Production, Preview, Development |
| `WEBHOOK_SECRET` | Una cadena larga aleatoria (inventala o generála) | Production, Preview, Development |

**Nota:** Las variables que empiezan por `VITE_` se incrustan en el **bundle del navegador** en el momento del build: son públicas para el cliente (la anon key está pensada para eso gracias a RLS). La **`service_role`** no debe tener prefijo `VITE_` y **solo** la usa la función serverless `/api/webhook-case`.

Si ya desplegaste sin variables: **Project → Settings → Environment Variables** → añadí las mismas → **Redeploy** el último deployment.

### C4. Desplegar

1. **Deploy**.
2. Cuando termine, abrí la **URL** que te da Vercel (ej. `https://matic-xxx.vercel.app`).
3. Actualizá en Supabase (**Authentication → URL Configuration**) el **Site URL** y **Redirect URLs** con esa URL de Vercel.

### C5. Probar el webhook (opcional)

Desde la terminal (sustituí valores):

```bash
curl -sS -X POST "https://TU-APP.vercel.app/api/webhook-case" \
  -H "Authorization: Bearer TU_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"UUID-USUARIO-SUPABASE-AUTH","message":"Prueba webhook"}'
```

El **`user_id`** es el UUID del usuario en **Supabase → Authentication → Users** (columna **UID**).

---

## Resumen rápido

| Dónde | Qué configurar |
|--------|----------------|
| **Supabase** | Proyecto nuevo → SQL migration → API keys → Email provider → URL Configuration |
| **`.env.local` en `web/`** | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |
| **Vercel** | Root **`web`** → variables (incl. `VITE_*`, `SUPABASE_*`, `WEBHOOK_SECRET`) → Deploy → actualizar URLs en Supabase |

---

## Webhook: formato esperado

- Cabecera: `Authorization: Bearer <WEBHOOK_SECRET>`
- Cuerpo JSON:

```json
{
  "user_id": "<uuid de auth.users>",
  "message": "Texto de la petición",
  "external_ref": "opcional",
  "scenario_key": "opcional"
}
```

---

## Sin Supabase (modo demo)

Si no definís `VITE_SUPABASE_*` en local ni en Vercel, la app usa **sesión local de prueba** y el chat **no** guarda en base de datos (insignia **Sin Supabase (local)** en el panel).

---

## Comprobar que auth y despliegue son “reales”

### Vercel

1. **Project → Settings → Environment Variables**: deben existir en el entorno de **Production** (y Preview si queréis):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Para el webhook: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `WEBHOOK_SECRET`
2. Tras añadir o cambiar variables **`VITE_*`**, haced **Redeploy** (el valor se incrusta en el JS en el **build**).
3. En el panel del proyecto, el último deployment debe estar **Ready**.

### En el panel (navegador)

1. Entrad en `/portal/login` en vuestra URL de Vercel.
2. Si el build incluye Supabase, veréis la insignia **Cuenta Supabase** (no “Sin Supabase (local)”).
3. Registro/login deben usar correo/contraseña reales; en **Supabase → Authentication → Users** debe aparecer el usuario.
4. Una petición en **Nueva implementación** debe crear filas en `client_cases` / `client_case_messages` (Table Editor).

### Qué sigue siendo datos de ejemplo (no es bug)

Resumen, implementaciones, gráficos y comparativa leen **`mockData.ts`** en el front: son **placeholders** hasta que conectéis una API o tablas propias. Eso no afecta a que **auth y chat** sean reales con Supabase.
