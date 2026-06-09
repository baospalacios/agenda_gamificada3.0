# Tareas — Agenda Gamificada 3.0

> Estado de cada subtarea. Marcar [x] al completar, [~] cuando está en progreso.
> Actualizar en tiempo real (LEY 1). No marcar completada sin verificar el código.

---

## FASE 0 — Planificación

- [x] Feature list v1.0 definida y aprobada
- [x] Stack tecnológico decidido
- [x] 10 módulos definidos con contratos (docs/modulos.md)
- [x] Schema SQL completo diseñado (docs/datos.md)
- [x] Plan de desarrollo por fases (docs/plan-desarrollo.md)
- [x] Docs de arquitectura completos
- [x] Repositorio GitHub creado — https://github.com/baospalacios/agenda_gamificada3.0
- [x] Proyecto Vercel creado y vinculado al repo
- [x] Proyecto Supabase creado — elhbtqlyhbifxbumxwpl.supabase.co
- [x] Schema Supabase ejecutado (8 tablas + RLS + políticas)

---

## FASE 1 — Infraestructura base

### Setup del proyecto
- [x] `npm create next-app@latest` con TypeScript
- [x] Instalar `@supabase/supabase-js`
- [x] Instalar `groq-sdk`
- [x] Instalar `@ducanh2912/next-pwa`
- [x] Configurar `next.config.mjs` (withPWA, disable en dev)
- [x] Verificar `tsconfig.json` con strict: true y alias @/*
- [x] Variables de entorno en Vercel (Production + Preview + Development)
- [x] Crear `.env.local` con las 3 variables

### Tipos (lib/types.ts)
- [x] Tipo `ThemeKey`
- [x] Tipo `HabitFreq`
- [x] Tipo `Habit` con todos los campos (checks virtual)
- [x] Tipo `HabitInput`
- [x] Tipo `Task`
- [x] Tipo `TaskInput`
- [x] Tipo `Subtask`
- [x] Tipo `SubtaskInput`
- [x] Tipo `Project` con subtasks: Subtask[]
- [x] Tipo `ProjectInput`
- [x] Tipo `CalendarEvent` con recurring fields
- [x] Tipo `EventInput`
- [x] Tipo `ChatMessage`
- [x] Tipo `HeatmapDay`
- [x] Tipo `HabitProgress`

### Lib
- [x] `lib/supabase.ts` — cliente singleton con persistSession: true
- [x] `lib/groq.ts` — cliente Groq con GROQ_MODEL constante

### Core (M01)
- [x] `constants.ts` — THEMES, makeCSS(), SHORT_DAYS, SECTION_LABELS, PRIORITY_COLORS, etc.
- [x] `helpers.ts` — dateKey @critical, habitDueOnDate @critical, currentStreak, addDays, minutesToLabel
- [x] `Icon.tsx` — ~30 iconos SVG inline
- [x] `SwipeToRemove.tsx` — threshold 90px, táctil
- [x] `AddRow.tsx` — fila "+ Añadir X"
- [ ] `TimePicker.tsx` — chips: 15, 30, 45, 60, 90, 120 min
- [x] `ErrorBoundary.tsx` — captura errores de render, muestra detalle en dev
- [x] `ErrorMessage.tsx` — errores inline de datos (Supabase/Groq), props: error, onRetry, compact
- [x] `AgendaApp.tsx` — shell con bottom nav mobile + sidebar desktop 172px
- [x] `Toast.tsx` — celebración negro-top 2s

### Auth (M02)
- [x] `app/login/page.tsx` — formulario login/register con Supabase Auth, modo toggle
- [x] `app/app/page.tsx` — force-dynamic, getSession → redirect o AgendaApp
- [x] `app/layout.tsx` — metadata, Google Fonts
- [x] `app/page.tsx` — redirect a /login

---

## FASE 2 — Hábitos (M03)

- [x] `useHabits.ts` — carga habits+logs, toggleCheck optimistic, addHabit, editHabit, deleteHabit, upsertStreakLog
- [x] `HabitsModule.tsx` — nav fecha, 3 secciones, gestión modal
- [x] `HabitSection.tsx` — lista por sección, habitDueOnDate, checkbox, swipe-delete, edit
- [x] `HabitModal.tsx` — bottom sheet crear/editar, frecuencias dinámicas

---

## FASE 3 — Tareas + Hoy (M04 + M05)

### Tareas (M04)
- [ ] `useTasks.ts`
  - [ ] Carga inicial de todas las tareas del usuario
  - [ ] addTask con todos los campos
  - [ ] editTask
  - [ ] deleteTask
  - [ ] setInToday(id, date): actualiza in_today=true y scheduled_date=date
  - [ ] removeFromToday(id): in_today=false, scheduled_date=null
- [ ] `TaskList.tsx`
  - [ ] Lista completa de tareas
  - [ ] Filtros combinables: prioridad, tiempo, urgentes (vence hoy/mañana), completadas
  - [ ] Tareas completadas colapsables
  - [ ] Botón "+ Hoy" en cada tarea
- [ ] `TaskForm.tsx` — modal: nombre, prioridad, tiempo, fecha límite, fecha programada
- [ ] `EditTaskModal.tsx` — mismos campos, pre-rellenados

### Hoy (M05)
- [ ] `HoyTab.tsx`
  - [ ] Estado: fecha activa (por defecto hoy)
  - [ ] Navegar entre fechas con flechas ← →
  - [ ] Sección hábitos: HabitSection para cada momento que tenga hábitos ese día
  - [ ] Sección tareas: tasks donde in_today=true O scheduled_date=fecha_activa
  - [ ] Barra de progreso: (hábitos_clave_done + tareas_done) / total
  - [ ] SwipeToRemove para quitar tarea de Hoy
  - [ ] Botón "Nueva tarea" crea tarea con scheduled_date=fecha_activa

---

## FASE 4 — Proyectos + Calendario (M06 + M07)

### Proyectos (M06)
- [ ] `useProjects.ts`
  - [ ] Carga inicial de todos los proyectos
  - [ ] addProject, editProject, deleteProject
  - [ ] addSubtask(projectId, data): upsert projects con subtasks JSONB actualizado
  - [ ] editSubtask, deleteSubtask, toggleSubtask
  - [ ] Progreso: subtareas completadas / total (calculado en cliente)
- [ ] `ProjectList.tsx` — lista con barra de progreso y categoría
- [ ] `ProjectForm.tsx` — modal: nombre, categoría
- [ ] `SubtaskForm.tsx` — modal: nombre, prioridad, tiempo, fecha límite, "+ Hoy"

### Calendario (M07)
- [ ] `useCalendar.ts`
  - [ ] Carga eventos + festivos al arrancar
  - [ ] addEvent: si recurring=true → guarda recurring_month y recurring_day
  - [ ] editEvent, deleteEvent
- [ ] `CalendarPage.tsx`
  - [ ] Vista mensual navegable con flechas ← →
  - [ ] Festivos: fondo azul tenue en el día
  - [ ] Eventos: punto de color según tipo
  - [ ] Cumpleaños recurrentes: calculados desde recurring_month/day
  - [ ] Fechas límite de tareas: punto gris en el día
  - [ ] Click en día abre detalle con lista de eventos
- [ ] `EventForm.tsx` — modal: nombre, tipo, fecha, toggle recurrente

---

## FASE 5 — Stats + Coach (M08 + M09)

### Stats (M08)
- [ ] `useStats.ts`
  - [ ] Carga habit_logs y streak_logs del período seleccionado
  - [ ] Calcula racha actual (días consecutivos con status full/partial desde hoy hacia atrás)
  - [ ] Calcula mejor racha histórica
  - [ ] Genera array heatmap: un HeatmapDay por día del mes
  - [ ] Calcula progreso por hábito: días completados vs días que tocaba en el período
- [ ] `StatsPage.tsx`
  - [ ] Selector de período: semana / mes / total
  - [ ] Cards: racha actual, mejor racha, días activos, días plenos
  - [ ] Heatmap del mes
  - [ ] Lista de progreso por hábito
- [ ] `Heatmap.tsx` — grid de días coloreados: full=verde, partial=amarillo, empty=gris

### Coach (M09)
- [ ] `app/api/chat/route.ts`
  - [ ] `export const runtime = 'nodejs'` — OBLIGATORIO
  - [ ] buildPrompt(): JSON con todos los datos del usuario
  - [ ] POST a Groq con system prompt en español
  - [ ] Respuestas: 2-3 frases, sin emojis, sin listas, tuteo
- [ ] `useCoach.ts`
  - [ ] Carga historial de chat_messages al arrancar (últimos 50)
  - [ ] sendMessage: guarda user msg en Supabase → llama /api/chat → guarda assistant msg
  - [ ] clearHistory: borra chat_messages del usuario
- [ ] `CoachPage.tsx`
  - [ ] Área de chat con scroll automático al nuevo mensaje
  - [ ] Input de texto + botón enviar
  - [ ] Chips de sugerencias rápidas (5 opciones contextuales)
  - [ ] Estado de carga mientras espera respuesta

---

## FASE 6 — Ajustes + PWA (M10)

- [ ] `SettingsPage.tsx`
  - [ ] Selector visual de tema (4 opciones con preview de color)
  - [ ] Slider de tamaño de fuente
  - [ ] Botón "Cerrar sesión" con confirmación
  - [ ] Tema y fontSize se guardan en localStorage
- [ ] `public/manifest.json` — name, icons, theme_color, background_color, display: standalone
- [ ] Generar icon-192.png e icon-512.png
- [ ] `next.config.js` — withPWA configurado, disabled en development

---

## FASE 7 — Deploy

- [ ] Crear repo GitHub y push inicial
- [ ] Conectar Vercel al repo GitHub
- [ ] Añadir variables de entorno en Vercel (Production + Preview — ver docs/seguridad.md)
- [ ] Deploy exitoso en producción
- [ ] Verificar login funciona en prod
- [ ] Verificar hábitos, tareas, coach en prod
- [ ] Prueba en móvil: PWA instalable desde Chrome
- [ ] Prueba en escritorio: sidebar visible, layout correcto

---

## Backlog (fuera de v1.0)

- [ ] Drag & drop para reordenar hábitos y tareas
- [ ] Notificaciones push reales
- [ ] Botón atrás del móvil (historial de navegación)
- [ ] Auth multi-usuario con registro público
- [ ] Modo offline / sincronización diferida
