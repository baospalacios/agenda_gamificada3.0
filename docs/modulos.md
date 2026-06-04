# Módulos — Agenda Gamificada 3.0

> Cada módulo tiene una responsabilidad única (LEY 3).
> Un subagente no toca archivos fuera de su módulo.
> Si necesita algo de otro módulo: usar solo su contrato público.
> Actualizar estado al completar cada módulo.

---

## Estado global

| ID | Módulo | Responsabilidad | Estado |
|----|--------|----------------|--------|
| M01 | core | Shell, nav, temas, shared components | `pendiente` |
| M02 | auth | Login, Supabase Auth | `pendiente` |
| M03 | habitos | Hábitos CRUD, frecuencias, checks por fecha | `pendiente` |
| M04 | tareas | Tareas CRUD, filtros, scheduling | `pendiente` |
| M05 | hoy | Vista del día, progreso, navegación de fechas | `pendiente` |
| M06 | proyectos | Proyectos y subtareas JSONB | `pendiente` |
| M07 | calendario | Calendario, eventos, festivos | `pendiente` |
| M08 | stats | Heatmap, racha, progreso por hábito | `pendiente` |
| M09 | coach | Chat Groq, memoria en Supabase | `pendiente` |
| M10 | ajustes | Temas, font size, sign out | `pendiente` |

---

## M01 — core

**Responsabilidad**: Shell de la app, navegación entre tabs, sistema de temas y CSS, componentes shared.

**Archivos**:
- `components/AgendaApp.tsx` — shell principal, nav 6 tabs, sidebar desktop 172px
- `components/agenda/constants.ts` — THEMES, makeCSS()
- `components/agenda/helpers.ts` — funciones de fecha y lógica de frecuencias
- `components/agenda/Icon.tsx` — íconos SVG
- `components/agenda/shared/SwipeToRemove.tsx`
- `components/agenda/shared/AddRow.tsx`
- `components/agenda/shared/TimePicker.tsx`

**Contrato público**:
- `makeCSS(theme: ThemeKey): string` — genera CSS completo desde el tema activo (@critical)
- `THEMES` — objeto con los 4 temas (light, navy, dark, serio)
- `dateKey(date: Date): string` — formatea fecha como YYYY-MM-DD (@critical)
- `habitDueOnDate(habit: Habit, date: Date): boolean` — lógica de frecuencias (@critical)
- `addDays(date: Date, n: number): Date`
- `sameDay(a: Date, b: Date): boolean`
- `SHORT_DAYS: string[]` — ['L','M','X','J','V','S','D'] semana lunes-primero
- `SwipeToRemove`, `AddRow`, `TimePicker`, `Icon` — componentes shared

**No hace**:
- No gestiona datos (Supabase)
- No llama a ningún hook de datos

**Dependencias**:
- `lib/types.ts`: Habit, ThemeKey

**Estado**: `pendiente`

---

## M02 — auth

**Responsabilidad**: Login con email/password, guard de autenticación, gestión de sesión Supabase.

**Archivos**:
- `lib/supabase.ts` — cliente singleton
- `components/LoginPage.tsx`
- `app/login/page.tsx`
- `app/app/page.tsx` — force-dynamic + auth guard

**Contrato público**:
- `supabase` (cliente singleton) — exportado desde lib/supabase.ts, usado por todos los hooks
- `LoginPage` — componente de formulario

**No hace**:
- No tiene UI de registro (usuarios creados manualmente en Supabase Dashboard)
- No gestiona roles ni permisos adicionales

**Dependencias**:
- `@supabase/supabase-js`
- Env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

**Estado**: `pendiente`

---

## M03 — habitos

**Responsabilidad**: CRUD completo de hábitos, lógica de frecuencias, checks por fecha, organización por momento del día (mañana/día/noche).

**Archivos**:
- `hooks/useHabits.ts`
- `components/agenda/habitos/HabitSection.tsx`
- `components/agenda/habitos/HabitForm.tsx`

**Contrato público**:
```typescript
useHabits(): {
  habits: Habit[]
  toggleCheck(habitId: string, date: string): Promise<void>
  addHabit(data: HabitInput): Promise<void>
  editHabit(id: string, data: Partial<HabitInput>): Promise<void>
  deleteHabit(id: string): Promise<void>
  loading: boolean
}
```

**No hace**:
- No calcula la racha (eso es M08 stats)
- No filtra por fecha directamente — usa habitDueOnDate de M01

**Dependencias**:
- M01: habitDueOnDate, dateKey
- M02: supabase
- lib/types.ts: Habit, HabitInput

**Tablas Supabase**: habits, habit_logs, streak_logs

**Estado**: `pendiente`

---

## M04 — tareas

**Responsabilidad**: CRUD tareas, banco con filtros combinables, scheduledDate (aparece automáticamente), inToday.

**Archivos**:
- `hooks/useTasks.ts`
- `components/agenda/tareas/TaskList.tsx`
- `components/agenda/tareas/TaskForm.tsx`
- `components/agenda/tareas/EditTaskModal.tsx`

**Contrato público**:
```typescript
useTasks(): {
  tasks: Task[]
  addTask(data: TaskInput): Promise<void>
  editTask(id: string, data: Partial<TaskInput>): Promise<void>
  deleteTask(id: string): Promise<void>
  setInToday(id: string, date: string | null): Promise<void>
  loading: boolean
}
```

**No hace**:
- No muestra la vista del día (eso es M05)
- No calcula stats de tareas

**Dependencias**:
- M02: supabase
- lib/types.ts: Task, TaskInput

**Tablas Supabase**: tasks

**Estado**: `pendiente`

---

## M05 — hoy

**Responsabilidad**: Vista del día actual y navegable. Muestra hábitos del día + tareas programadas. Barra de progreso. Crear tarea desde Hoy.

**Archivos**:
- `components/agenda/hoy/HoyTab.tsx`

**Contrato público**:
- Ninguno — componente hoja, no exporta funciones

**Recibe por props desde AgendaApp**:
- habits, toggleCheck de M03
- tasks, setInToday, addTask de M04

**No hace**:
- No gestiona datos directamente — solo lee y llama mutaciones de M03 y M04

**Dependencias**:
- M01: habitDueOnDate, dateKey, SwipeToRemove, AddRow
- M03: habits, toggleCheck (via props)
- M04: tasks, setInToday, addTask (via props)

**Estado**: `pendiente`

---

## M06 — proyectos

**Responsabilidad**: Proyectos con categorías, subtareas embebidas como JSONB, progreso automático, subtareas añadibles a Hoy.

**Archivos**:
- `hooks/useProjects.ts`
- `components/agenda/proyectos/ProjectList.tsx`
- `components/agenda/proyectos/ProjectForm.tsx`
- `components/agenda/proyectos/SubtaskForm.tsx`

**Contrato público**:
```typescript
useProjects(): {
  projects: Project[]
  addProject(data: ProjectInput): Promise<void>
  editProject(id: string, data: Partial<ProjectInput>): Promise<void>
  deleteProject(id: string): Promise<void>
  addSubtask(projectId: string, data: SubtaskInput): Promise<void>
  editSubtask(projectId: string, subtaskId: string, data: Partial<SubtaskInput>): Promise<void>
  deleteSubtask(projectId: string, subtaskId: string): Promise<void>
  toggleSubtask(projectId: string, subtaskId: string): Promise<void>
  loading: boolean
}
```

**Nota de diseño crítica**: subtareas almacenadas como JSONB en `projects.subtasks`. NO existe tabla subtasks separada. No confundir ni mezclar modelos.

**Dependencias**:
- M02: supabase
- lib/types.ts: Project, ProjectInput, Subtask, SubtaskInput

**Tablas Supabase**: projects (subtasks como JSONB)

**Estado**: `pendiente`

---

## M07 — calendario

**Responsabilidad**: Vista mensual navegable, eventos puntuales, cumpleaños recurrentes, festivos en azul tenue, fechas límite de tareas visibles.

**Archivos**:
- `hooks/useCalendar.ts`
- `components/agenda/calendario/CalendarPage.tsx`
- `components/agenda/calendario/EventForm.tsx`

**Contrato público**:
```typescript
useCalendar(): {
  events: CalendarEvent[]
  festivos: string[]        // array de strings YYYY-MM-DD
  addEvent(data: EventInput): Promise<void>
  editEvent(id: string, data: Partial<EventInput>): Promise<void>
  deleteEvent(id: string): Promise<void>
  loading: boolean
}
```

**Dependencias**:
- M02: supabase
- M04: tasks (solo lectura — para mostrar due_date en calendario)
- lib/types.ts: CalendarEvent, EventInput

**Tablas Supabase**: events, festivos

**Estado**: `pendiente`

---

## M08 — stats

**Responsabilidad**: Cálculo y visualización de heatmap, racha actual y mejor racha, progreso por hábito, días activos/plenos. Solo lectura — no muta datos.

**Archivos**:
- `hooks/useStats.ts`
- `components/agenda/stats/StatsPage.tsx`
- `components/agenda/stats/Heatmap.tsx`

**Contrato público**:
```typescript
useStats(habits: Habit[], tasks: Task[]): {
  heatmap: HeatmapDay[]
  currentStreak: number
  bestStreak: number
  activeDays: number
  fullDays: number
  habitProgress: HabitProgress[]
}
```

**No hace**:
- No escribe en Supabase — solo lectura y cálculo
- No gestiona streak_logs directamente — eso lo hace useHabits al toggleCheck

**Dependencias**:
- M03: habits (via props)
- M01: habitDueOnDate, dateKey
- M02: supabase (habit_logs, streak_logs — solo lectura)
- lib/types.ts: Habit, HeatmapDay, HabitProgress

**Tablas Supabase**: habit_logs (solo lectura), streak_logs (solo lectura)

**Estado**: `pendiente`

---

## M09 — coach

**Responsabilidad**: Chat conversacional con Groq/Llama. Lee todos los datos del usuario para contexto. Guarda historial en Supabase (memoria entre sesiones). Chips de sugerencias.

**Archivos**:
- `hooks/useCoach.ts`
- `components/agenda/coach/CoachPage.tsx`
- `app/api/chat/route.ts` — proxy server-side con buildPrompt()

**Contrato público**:
```typescript
useCoach(): {
  messages: ChatMessage[]
  sendMessage(text: string): Promise<void>
  clearHistory(): Promise<void>
  loading: boolean
}
```

**Configuración de Groq**:
- Modelo: llama-3.3-70b-versatile
- System prompt: español de tuteo, respuestas 2-3 frases, sin emojis, sin listas
- Contexto inyectado: hábitos + checks + tareas + proyectos (JSON completo en cada llamada)
- runtime: 'nodejs' OBLIGATORIO en route.ts (no Edge)

**No hace**:
- No toma decisiones ni modifica datos del usuario
- No hace inferencias sobre datos que no están en la BD

**Dependencias**:
- M02: supabase (para chat_messages)
- M03, M04, M06, M07: datos de contexto (via props a buildPrompt)
- lib/groq.ts
- lib/types.ts: ChatMessage
- Env: GROQ_API_KEY (server-side, sin NEXT_PUBLIC_)

**Tablas Supabase**: chat_messages

**Estado**: `pendiente`

---

## M10 — ajustes

**Responsabilidad**: Selector de tema visual, tamaño de fuente, botón de sign out. Sin lógica de datos.

**Archivos**:
- `components/agenda/ajustes/SettingsPage.tsx`

**Contrato público**:
- Ninguno — recibe todo via props desde AgendaApp

**Recibe por props**:
- `theme: ThemeKey`, `setTheme: (t: ThemeKey) => void`
- `fontSize: number`, `setFontSize: (n: number) => void`
- `onSignOut: () => void`

**No hace**:
- No gestiona datos de Supabase
- Configuración persiste en localStorage (no en BD)

**Dependencias**:
- M01: THEMES, ThemeKey

**Estado**: `pendiente`
