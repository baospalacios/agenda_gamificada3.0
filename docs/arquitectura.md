# Arquitectura — Agenda Gamificada 3.0

> Documento vivo. Actualizar en cada sesión (LEY 1).
> Si código y este doc discrepan: el código manda (LEY 2).

---

## STRUCTURE MAP

> Estado: proyectado (pre-código). Actualizar cuando se creen, muevan o eliminen archivos.

```
agenda3.0codigo/                             ← raíz del proyecto Next.js
├── ARQUITECTO_1.md                          ← LA LEY: leyes + protocolos + estado de sesión
├── .readmeAI                                ← Estado resumido para IA nueva al inicio
├── docs/                                    ← 12 archivos de documentación
├── .env.local                               ← Variables locales (NUNCA en git)
├── .env.local.example                       ← Plantilla pública de variables de entorno
├── next.config.mjs                          ← Next.js + PWA (withPWA, disable en dev)
├── tsconfig.json                            ← strict: true, alias @/* → ./*
├── package.json
│
├── app/                                     ← Next.js App Router
│   ├── globals.css                          ← Reset CSS limpio (sin variables de tema — esas van en makeCSS)
│   ├── layout.tsx           ✅ HECHO        ← Metadata, Google Fonts (Instrument Sans + Cormorant Garamond)
│   ├── page.tsx             ✅ HECHO        ← Redirect a /login
│   ├── login/
│   │   └── page.tsx         ✅ HECHO        ← Formulario login/register con Supabase Auth
│   ├── app/
│   │   └── page.tsx         ✅ HECHO        ← force-dynamic. getSession() → redirect /login o AgendaApp
│   └── api/
│       └── chat/
│           └── route.ts     ⏳ PENDIENTE    ← POST /api/chat — proxy Groq. runtime='nodejs' OBLIGATORIO
│
├── components/agenda/                       ← TODOS los componentes viven aquí (no en components/ raíz)
│   ├── constants.ts         ✅ HECHO        ← THEMES (4 paletas), makeCSS() @critical, SHORT/FULL_DAYS, SECTION_LABELS, PRIORITY_COLORS
│   ├── helpers.ts           ✅ HECHO        ← dateKey @critical, habitDueOnDate @critical, currentStreak, addDays, sameDay, dowMonday, keyToDate, lastNWeeks, minutesToLabel
│   ├── Icon.tsx             ✅ HECHO        ← ~30 SVG icons inline (nav, gamificación, misc)
│   ├── AgendaApp.tsx        ✅ HECHO        ← Shell: bottom nav mobile + sidebar desktop 172px, gestión tema/sección
│   ├── SwipeToRemove.tsx    ✅ HECHO        ← Swipe-left touch gesture. Threshold: 90px (SWIPE_THRESHOLD)
│   ├── AddRow.tsx           ✅ HECHO        ← Botón "+ Añadir X" reutilizable
│   ├── Toast.tsx            ✅ HECHO        ← Notificación celebración: negro, top, 2s (TOAST_DURATION)
│   ├── TimePicker.tsx       ⏳ PENDIENTE    ← Chips de tiempo estimado (15, 30, 45, 60, 90, 120 min)
│   ├── habitos/             ⏳ PENDIENTE    ← Fase 2
│   ├── tareas/              ⏳ PENDIENTE    ← Fase 3
│   ├── hoy/                 ⏳ PENDIENTE    ← Fase 3
│   ├── proyectos/           ⏳ PENDIENTE    ← Fase 4
│   ├── calendario/          ⏳ PENDIENTE    ← Fase 4
│   ├── stats/               ⏳ PENDIENTE    ← Fase 5
│   ├── coach/               ⏳ PENDIENTE    ← Fase 5
│   └── ajustes/             ⏳ PENDIENTE    ← Fase 6
│
├── hooks/                   ⏳ PENDIENTE    ← Fases 2-6
│
├── lib/
│   ├── types.ts             ✅ HECHO        ← TODOS los tipos: Habit, Task, Project, CalendarEvent, ChatMessage, etc.
│   ├── supabase.ts          ✅ HECHO        ← Cliente singleton, persistSession: true
│   └── groq.ts              ✅ HECHO        ← Cliente Groq, solo servidor, GROQ_MODEL = 'llama-3.3-70b-versatile'
│
└── public/                  ⏳ PENDIENTE    ← manifest.json, icon-192.png, icon-512.png (Fase 6 PWA)
```

---

## SYMBOL INDEX

> Se rellena a medida que se crean funciones (LEY 1).
> Formato: Símbolo | Archivo:línea | Descripción | @usedBy

### Funciones @critical — consultar docs/dependencias.md antes de tocar

| Función | Archivo | @usedBy | Por qué es crítica |
|---------|---------|---------|-------------------|
| `habitDueOnDate` | helpers.ts | HoyTab, HabitSection, StatsPage, CoachPage | Lógica central de frecuencias — cambiarla rompe 4 módulos |
| `makeCSS` | constants.ts | TODOS los componentes | CSS global — cambiarla afecta toda la UI |
| `dateKey` | helpers.ts | useHabits, useStats, HoyTab, CalendarPage, CoachPage | Formato de clave YYYY-MM-DD — cambiarla rompe todos los lookups |
| `buildPrompt` | api/chat/route.ts | POST /api/chat | Contexto del Coach — cambiarla rompe las respuestas |

### Funciones por módulo

| Símbolo | Archivo | Descripción | @usedBy |
|---------|---------|-------------|---------|
| `makeCSS` | components/agenda/constants.ts | Genera objeto style{} con CSS vars para el div raíz | AgendaApp |
| `THEMES` | components/agenda/constants.ts | 4 paletas de color (light/navy/dark/serio) | makeCSS, AgendaApp |
| `SECTION_LABELS` | components/agenda/constants.ts | Mapa ASCII→display: 'manana'→'Mañana', etc. | HabitsModule (Fase 2) |
| `EVENT_TYPE_LABELS` | components/agenda/constants.ts | Mapa 'cumpleanos'→'Cumpleaños', etc. | CalendarModule |
| `SHORT_DAYS` | components/agenda/constants.ts | ['Lu','Ma','Mi','Ju','Vi','Sá','Do'] | Calendario, Heatmap |
| `PRIORITY_COLORS` | components/agenda/constants.ts | color CSS por prioridad alta/media/baja | TasksModule |
| `dateKey` | components/agenda/helpers.ts | Date → 'YYYY-MM-DD' (zona local). Clave canónica de habit_logs | HabitsModule, TodayModule, StatsModule |
| `addDays` | components/agenda/helpers.ts | Suma N días a un Date sin mutar el original | helpers internos, CalendarModule |
| `sameDay` | components/agenda/helpers.ts | Compara dos fechas por día (usa dateKey) | TodayModule |
| `dowMonday` | components/agenda/helpers.ts | Date → día semana con lunes=0 (JS da domingo=0) | habitDueOnDate |
| `keyToDate` | components/agenda/helpers.ts | 'YYYY-MM-DD' → Date (medianoche local) | StatsModule, Heatmap |
| `lastNWeeks` | components/agenda/helpers.ts | Array de Dates de las últimas N semanas completas | Heatmap |
| `habitDueOnDate` | components/agenda/helpers.ts | ¿Toca hacer el hábito en esta fecha? Soporta 6 frecuencias | HabitsModule, TodayModule, StatsModule |
| `currentStreak` | components/agenda/helpers.ts | Racha actual de un hábito hacia atrás desde hoy | HabitsModule, StatsModule |
| `timeToMinutes` | components/agenda/helpers.ts | '1h 30m' o '09:05' → minutos totales | TimePicker, TaskForm |
| `minutesToLabel` | components/agenda/helpers.ts | 90 → '1h 30m'. 45 → '45m' | TaskList, TodayModule |
| `capitalize` | components/agenda/helpers.ts | Primera letra mayúscula | varios |
| `Icon` | components/agenda/Icon.tsx | SVG icon inline por nombre. Props: name, size, color | todos los módulos |
| `AgendaApp` | components/agenda/AgendaApp.tsx | Shell: nav + sección activa + tema + toast. Monta módulos | app/app/page.tsx |
| `SwipeToRemove` | components/agenda/SwipeToRemove.tsx | Wrapper touch swipe-left para eliminar. Umbral: 90px | HabitsModule, TasksModule, TodayModule |
| `AddRow` | components/agenda/AddRow.tsx | Botón '+ Añadir X' con icono plus | HabitsModule, TasksModule, ProjectsModule |
| `Toast` | components/agenda/Toast.tsx | Notificación celebración: negro fijo top, desaparece en 2s | AgendaApp (único punto de montaje) |

---

## CONTRATOS ENTRE MÓDULOS

> Qué expone cada módulo. Solo hooks y funciones públicas de shared.
> Ver docs/dependencias.md para el grafo completo.

| Módulo | Expone | Lo consume |
|--------|--------|-----------|
| M01 core | `makeCSS()`, `THEMES`, `dateKey()`, `habitDueOnDate()`, `addDays()`, `sameDay()`, shared components | Todos los módulos |
| M02 auth | `supabase` (cliente singleton), sesión activa | Todos los hooks |
| M03 habitos | `useHabits()` → habits, toggleCheck, addHabit, editHabit, deleteHabit | M05, M08, M09 |
| M04 tareas | `useTasks()` → tasks, addTask, editTask, deleteTask, setInToday | M05, M07, M09 |
| M05 hoy | Ninguno — componente hoja, consume M03 + M04 via props | — |
| M06 proyectos | `useProjects()` → projects, addProject, editProject, deleteProject, subtask CRUD | M05, M09 |
| M07 calendario | `useCalendar()` → events, festivos, addEvent, editEvent, deleteEvent | M09 |
| M08 stats | `useStats()` → heatmap, currentStreak, bestStreak, activeDays, habitProgress | — (solo lectura) |
| M09 coach | `useCoach()` → messages, sendMessage, clearHistory | — |
| M10 ajustes | Ninguno — recibe theme, fontSize, onSignOut via props de AgendaApp | AgendaApp |
