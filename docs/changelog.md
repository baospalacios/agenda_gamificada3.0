# Changelog — Agenda Gamificada 3.0

> Historial de versiones y sesiones.
> Append-only. Nunca editar entradas existentes.
> Formato sesiones: [fecha] — AI sesión N — resumen.

---

## Sesiones de trabajo

### 2026-06-04 — AI sesión 1 — Planificación completa

**Added**:
- Feature list v1.0 definida y aprobada por el arquitecto
- ARQUITECTO_1.md: identidad del proyecto, tech stack, session state actualizados
- docs/plan-desarrollo.md: 7 fases con hitos y subtareas ejecutables
- docs/arquitectura.md: structure map proyectado + contratos entre módulos
- docs/modulos.md: 10 módulos con contratos públicos TypeScript definidos
- docs/tareas.md: feature list completa como subtareas por fase
- docs/datos.md: schema SQL completo (8 tablas, RLS, JSONB subtasks)
- docs/decisiones.md: 10 decisiones de arquitectura registradas con motivos
- docs/guia-estilo.md: convenciones específicas (@usedBy, @critical, naming, tipos, CSS)
- docs/seguridad.md: auth, RLS, variables de entorno, superficie de ataque
- docs/dependencias.md: grafo de dependencias + tabla de funciones @critical
- docs/changelog.md: este archivo
- docs/deuda-tecnica.md: inicializado sin deuda

**Decisiones de sesión**:
- Stack: Next.js 14 + TypeScript + Supabase + Groq + Vercel
- Arquitectura multi-archivo frente a JSX monolítico (causa raíz de bugs anteriores)
- Convención @usedBy/@critical para prevenir cambios ciegos

**Pendiente de acción humana**:
- Crear repo GitHub
- Crear proyecto en Vercel y Supabase
- Ejecutar schema SQL de docs/datos.md en Supabase

### 2026-06-04 — AI sesión 2 — Fase 1 completada

**Added**:
- `components/agenda/constants.ts`: THEMES (4 paletas), makeCSS(), SHORT_DAYS, PRIORITY_COLORS, SWIPE_THRESHOLD, TOAST_DURATION
- `components/agenda/helpers.ts`: dateKey @critical, habitDueOnDate @critical, currentStreak, addDays, sameDay, dowMonday, keyToDate, lastNWeeks, timeToMinutes, minutesToLabel, capitalize
- `components/agenda/Icon.tsx`: ~30 iconos SVG inline (nav, gamificación, misc)
- `components/agenda/SwipeToRemove.tsx`: gesto touch-swipe para eliminar filas
- `components/agenda/AddRow.tsx`: botón "+ Añadir" reutilizable
- `components/agenda/Toast.tsx`: notificación celebración negro-top 2s
- `components/agenda/AgendaApp.tsx`: shell principal, nav lateral desktop + bottom nav mobile, gestión de tema y sección activa
- `app/login/page.tsx`: formulario real login/register con Supabase Auth
- `app/app/page.tsx`: auth guard + mount AgendaApp
- `app/layout.tsx`: metadata corregida, Google Fonts (Instrument Sans + Cormorant Garamond)
- `app/globals.css`: reset CSS limpio
- `.readmeAI`: estado completo del proyecto

**Verificado**: `tsc --noEmit` sin errores

**Pendiente de acción humana** (bloqueante para Fase 2):
1. DROP tablas antiguas en Supabase SQL Editor
2. Ejecutar schema nuevo de docs/datos.md
3. Crear proyecto Vercel conectado a agenda_gamificada3.0
4. Añadir env vars en Vercel (todos los entornos)
5. Crear .env.local local

### 2026-06-09 — AI sesión 3 — Setup completo

**Done**:
- Schema SQL ejecutado en Supabase (8 tablas + RLS + políticas)
- Proyecto Vercel creado y vinculado a agenda_gamificada3.0
- Variables de entorno configuradas en Vercel (Production + Preview + Development)
- .env.local creado localmente
- Correcciones de SQL: section/event_type en ASCII (sin ñ/í), tasks.created_at TIMESTAMPTZ
- STRUCTURE MAP y SYMBOL INDEX sincronizados con código real
- docs/tareas.md: Fase 0 y Fase 1 completadas al 100% (excepto TimePicker)

**Decisiones**:
- SUPABASE_ANON_KEY usa nuevo formato sb_publishable_... (Supabase lo renombró)
- section BD: 'manana'/'dia'/'noche' (ASCII); event_type: 'cumpleanos' (ASCII)
- tasks.created_at: TIMESTAMPTZ en vez de BIGINT (EXTRACT()::BIGINT rompía parser)

**Siguiente**: Fase 2 — Módulo Hábitos (M03)

---

## Versiones

*(se añadirán al tagear cada versión con git tag)*
