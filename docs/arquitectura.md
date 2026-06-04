# Arquitectura — Agenda Gamificada 3.0

> Documento vivo. Actualizar en cada sesión (LEY 1).
> Si código y este doc discrepan: el código manda (LEY 2).

---

## STRUCTURE MAP

> Estado: proyectado (pre-código). Actualizar cuando se creen, muevan o eliminen archivos.

```
agenda3.0/
├── ARQUITECTO_1.md                          ← Índice maestro + leyes + protocolos
├── docs/                                    ← Documentación del proyecto
├── .env.local                               ← Variables locales (NUNCA en git)
├── next.config.js                           ← Next.js + PWA config
├── tsconfig.json
├── package.json
│
├── app/                                     ← Next.js App Router
│   ├── layout.tsx                           ← Root layout: metadata PWA, viewport
│   ├── page.tsx                             ← Redirect a /login
│   ├── login/
│   │   └── page.tsx                         ← Renderiza LoginPage
│   ├── app/
│   │   └── page.tsx                         ← force-dynamic. Auth guard + AgendaApp
│   └── api/
│       └── chat/
│           └── route.ts                     ← POST /api/chat — proxy Groq. runtime='nodejs' OBLIGATORIO
│
├── components/
│   ├── AgendaApp.tsx                        ← Shell principal. Nav 6 tabs + sidebar desktop 172px
│   ├── LoginPage.tsx                        ← Formulario email/password Supabase Auth
│   └── agenda/
│       ├── constants.ts                     ← THEMES (4), makeCSS() @critical, SHORT_DAYS, MONTH_NAMES
│       ├── helpers.ts                       ← dateKey @critical, habitDueOnDate @critical, addDays, sameDay
│       ├── Icon.tsx                         ← SVG icons centralizados
│       ├── shared/
│       │   ├── SwipeToRemove.tsx            ← Swipe-left gesture. Threshold: 90px
│       │   ├── AddRow.tsx                   ← Row "+ Añadir X" reutilizable
│       │   └── TimePicker.tsx              ← Chips de tiempo estimado
│       ├── habitos/
│       │   ├── HabitSection.tsx             ← Lista hábitos de un momento del día
│       │   └── HabitForm.tsx               ← Modal crear/editar hábito + selector de frecuencia
│       ├── tareas/
│       │   ├── TaskList.tsx                 ← Banco de tareas con filtros combinables
│       │   ├── TaskForm.tsx                 ← Modal nueva tarea
│       │   └── EditTaskModal.tsx            ← Modal editar tarea existente
│       ├── hoy/
│       │   └── HoyTab.tsx                  ← Vista del día: hábitos + tareas programadas
│       ├── proyectos/
│       │   ├── ProjectList.tsx              ← Lista de proyectos con progreso
│       │   ├── ProjectForm.tsx             ← Modal crear/editar proyecto
│       │   └── SubtaskForm.tsx             ← Modal crear/editar subtarea
│       ├── calendario/
│       │   ├── CalendarPage.tsx             ← Vista mensual navegable
│       │   └── EventForm.tsx               ← Modal crear/editar evento
│       ├── stats/
│       │   ├── StatsPage.tsx               ← Contenedor stats con selector de período
│       │   └── Heatmap.tsx                 ← Heatmap de constancia mensual
│       ├── coach/
│       │   └── CoachPage.tsx               ← Chat IA Groq con chips de sugerencias
│       └── ajustes/
│           └── SettingsPage.tsx            ← Tema, fontSize, sign out
│
├── hooks/
│   ├── useHabits.ts                         ← CRUD hábitos + toggleCheck + updateStreakLog
│   ├── useTasks.ts                          ← CRUD tareas + inToday + scheduledDate
│   ├── useProjects.ts                       ← CRUD proyectos + subtareas JSONB
│   ├── useCalendar.ts                       ← CRUD eventos + cumpleaños + festivos
│   ├── useStats.ts                          ← Cálculo racha + heatmap + progreso por hábito
│   └── useCoach.ts                          ← Mensajes Groq + historial en Supabase
│
├── lib/
│   ├── types.ts                             ← TODOS los tipos TypeScript del proyecto
│   ├── supabase.ts                          ← Cliente singleton Supabase
│   └── groq.ts                              ← Cliente Groq configurado
│
└── public/
    ├── manifest.json
    ├── icon-192.png
    └── icon-512.png
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

### Funciones por módulo (se añaden al implementar)

| Símbolo | Archivo:línea | Descripción | @usedBy |
|---------|--------------|-------------|---------|
| *(pendiente Fase 1)* | — | — | — |

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
