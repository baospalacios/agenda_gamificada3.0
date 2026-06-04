# Seguridad — Agenda Gamificada 3.0

---

## Autenticación

| Campo | Valor |
|-------|-------|
| Método | Supabase email/password |
| Registro | Sin UI pública — usuarios creados manualmente en Supabase Dashboard |
| Sesión | `persistSession: true`, `autoRefreshToken: true` |
| Auth guard | `app/app/page.tsx` — `getSession()` + `onAuthStateChange` |
| Redirige a | `/login` al detectar sesión cerrada o expirada |

---

## Autorización (RLS)

Todas las tablas tienen RLS habilitada con política:

```sql
FOR ALL USING (auth.uid() = user_id)
```

**Excepción**: tabla `festivos` — sin RLS (datos públicos, sin user_id).

El cliente Supabase usa la anon key (pública) pero **la BD aplica RLS siempre** — el cliente no puede bypassearla.

---

## Variables de entorno

| Variable | Requerida | Dónde | Propósito |
|----------|----------|-------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | Vercel → **All environments** | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí | Vercel → **All environments** | Anon key de Supabase |
| `GROQ_API_KEY` | Solo Coach | Vercel → **All environments** | Clave API de Groq (server-side) |

### ⚠️ Regla crítica — aprendida del Proyecto 1 (bug #16)

Configurar **TODAS** las variables en **All** (Production + Preview), no solo en Preview.
El bug del proyecto anterior fue exactamente este: la key solo estaba en Preview y production fallaba.

### Cómo configurar en Vercel

1. Dashboard → tu proyecto → Settings → Environment Variables
2. Añadir cada variable
3. En "Environment": seleccionar **All** (no solo Preview ni solo Production)
4. Guardar
5. Redeploy para que los cambios tomen efecto

### En local (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
GROQ_API_KEY=gsk_xxx...
```

`.env.local` está en `.gitignore` — **nunca commitear**.

---

## Superficie de ataque

| Superficie | Riesgo | Estado | Plan |
|-----------|--------|--------|------|
| `POST /api/chat` | Sin auth — cualquiera puede consumir quota de Groq | ⚠️ Abierto | Añadir auth en v1.1.0 (backlog) |
| NEXT_PUBLIC_ en bundle | Anon key visible en cliente | ✅ Aceptado | RLS protege los datos — es diseño de Supabase |
| GROQ_API_KEY | Server-only — no expuesta al cliente | ✅ Correcto | Sin NEXT_PUBLIC_ prefix |

---

## Reglas absolutas

- Nunca credenciales en el código fuente
- Nunca en historial de git (verificar con `git log -p | grep -i 'key\|secret\|password'`)
- `GROQ_API_KEY` es server-side only — nunca `NEXT_PUBLIC_GROQ_API_KEY`
- `export const runtime = 'nodejs'` en `app/api/chat/route.ts` — OBLIGATORIO (sin esto la route falla en producción)
