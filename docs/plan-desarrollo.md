# Plan de Desarrollo — Agenda Gamificada 3.0

> Hoja de ruta lineal por fases. Cada fase tiene un hito verificable.
> Una fase no empieza hasta que la anterior está completada.
> Actualizar [x] en tiempo real (LEY 1).

---

## Estado actual
**Fase 0 — Planificación** ← COMPLETADA. Lista para Fase 1.

---

## FASE 0 — Planificación
Hito: docs completos, stack decidido, repo listo para código.

- [x] Feature list v1.0 definida y aprobada
- [x] Stack tecnológico decidido
- [x] 10 módulos definidos con contratos (docs/modulos.md)
- [x] Schema SQL completo (docs/datos.md)
- [x] Plan de desarrollo por fases (este archivo)
- [ ] Repositorio GitHub creado
- [ ] Proyecto Vercel creado y vinculado al repo
- [ ] Proyecto Supabase creado y schema ejecutado

---

## FASE 1 — Infraestructura base (M01 + M02)
Hito: app arranca, login funciona, Supabase responde, navegación vacía visible.
Desbloqueada: Fase 0 completada.

### Setup inicial
- [ ] `npm create next-app@latest` con TypeScript
- [ ] Instalar: `@supabase/supabase-js`, `@ducanh2912/next-pwa`, `groq-sdk`
- [ ] Configurar `next.config.js` (withPWA, variables de entorno)
- [ ] Configurar `tsconfig.json` (strict: true)
- [ ] `.env.local` con las 3 variables (ver docs/seguridad.md)

### Tipos y lib (antes de cualquier implementación)
- [ ] `lib/types.ts` — Habit, HabitInput, Task, TaskInput, Project, Subtask, SubtaskInput, CalendarEvent, EventInput, ChatMessage, ThemeKey, HeatmapDay, HabitProgress
- [ ] `lib/supabase.ts` — cliente singleton
- [ ] `lib/groq.ts` — cliente Groq con config base

### Core (M01)
- [ ] `components/agenda/constants.ts` — THEMES (4), makeCSS(), SHORT_DAYS, MONTH_NAMES
- [ ] `components/agenda/helpers.ts` — dateKey (@critical), addDays, sameDay, habitDueOnDate (@critical)
- [ ] `components/agenda/Icon.tsx` — íconos SVG: home, list, calendar, chart, coach, settings
- [ ] `components/agenda/shared/SwipeToRemove.tsx`
- [ ] `components/agenda/shared/AddRow.tsx`
- [ ] `components/agenda/shared/TimePicker.tsx`
- [ ] `components/AgendaApp.tsx` — shell con 6 tabs vacíos + sidebar desktop 172px

### Auth (M02)
- [ ] `lib/supabase.ts` completado
- [ ] `components/LoginPage.tsx` — formulario email/password
- [ ] `app/login/page.tsx`
- [ ] `app/app/page.tsx` — force-dynamic + auth guard + monta AgendaApp
- [ ] `app/layout.tsx` — metadata PWA + viewport
- [ ] `app/page.tsx` — redirect a /login

---

## FASE 2 — Hábitos (M03)
Hito: crear, editar, eliminar hábito; marcar check en cualquier fecha; frecuencias funcionan.
Desbloqueada: Fase 1 completada.

- [ ] `hooks/useHabits.ts` — carga inicial, toggleCheck, addHabit, editHabit, deleteHabit, updateStreakLog
- [ ] `components/agenda/habitos/HabitSection.tsx` — lista hábitos filtrados por momento + habitDueOnDate
- [ ] `components/agenda/habitos/HabitForm.tsx` — modal crear/editar con selector de frecuencia

---

## FASE 3 — Tareas + Hoy (M04 + M05)
Hito: banco de tareas con filtros; pestaña Hoy muestra hábitos + tareas del día.
Desbloqueada: Fase 2 completada.

### Tareas (M04)
- [ ] `hooks/useTasks.ts` — CRUD + setInToday + scheduledDate
- [ ] `components/agenda/tareas/TaskList.tsx` — lista con filtros combinables
- [ ] `components/agenda/tareas/TaskForm.tsx` — modal nueva tarea
- [ ] `components/agenda/tareas/EditTaskModal.tsx` — modal editar

### Hoy (M05)
- [ ] `components/agenda/hoy/HoyTab.tsx`
  - [ ] Muestra hábitos del día (via habitDueOnDate)
  - [ ] Muestra tareas con inToday=true o scheduledDate=hoy
  - [ ] Navegación de fechas con flechas ← →
  - [ ] Barra de progreso del día
  - [ ] SwipeToRemove para quitar de Hoy
  - [ ] Botón "Nueva tarea" crea con scheduledDate=fecha_activa

---

## FASE 4 — Proyectos + Calendario (M06 + M07)
Hito: proyectos con subtareas; calendario navegable con eventos y festivos.
Desbloqueada: Fase 3 completada.

### Proyectos (M06)
- [ ] `hooks/useProjects.ts`
- [ ] `components/agenda/proyectos/ProjectList.tsx`
- [ ] `components/agenda/proyectos/ProjectForm.tsx`
- [ ] `components/agenda/proyectos/SubtaskForm.tsx`
- [ ] Progreso calculado automáticamente: subtareas completadas / total

### Calendario (M07)
- [ ] `hooks/useCalendar.ts`
- [ ] `components/agenda/calendario/CalendarPage.tsx` — vista mensual + festivos + fechas límite
- [ ] `components/agenda/calendario/EventForm.tsx`

---

## FASE 5 — Stats + Coach (M08 + M09)
Hito: heatmap visible; coach responde con contexto completo; historial persiste.
Desbloqueada: Fase 4 completada.

### Stats (M08)
- [ ] `hooks/useStats.ts` — racha actual, mejor racha, días activos, heatmap, progreso por hábito
- [ ] `components/agenda/stats/StatsPage.tsx`
- [ ] `components/agenda/stats/Heatmap.tsx`

### Coach (M09)
- [ ] `app/api/chat/route.ts` — proxy Groq, runtime='nodejs', buildPrompt() con JSON completo de BD
- [ ] `hooks/useCoach.ts` — enviar mensaje + guardar en chat_messages + cargar historial al arrancar
- [ ] `components/agenda/coach/CoachPage.tsx` — chat UI + chips de sugerencias rápidas

---

## FASE 6 — Ajustes + PWA (M10)
Hito: 4 temas aplicados; tamaño de fuente ajustable; app instalable como PWA.
Desbloqueada: Fase 5 completada.

- [ ] `components/agenda/ajustes/SettingsPage.tsx` — tema, fontSize, sign out
- [ ] `public/manifest.json`
- [ ] Iconos 192px y 512px
- [ ] `next-pwa` configurado en `next.config.js`

---

## FASE 7 — Deploy y verificación
Hito: app en producción, funciona en móvil y escritorio.
Desbloqueada: Fase 6 + Megadiagnóstico completo.

- [ ] Variables de entorno en Vercel (Production + Preview)
- [ ] Deploy exitoso en producción
- [ ] Pruebas en Chrome móvil Android
- [ ] Pruebas en Safari iOS (instalable como PWA)
- [ ] Pruebas en Chrome escritorio

---

## Versiones planificadas

| Versión | Contenido | Estado |
|---------|-----------|--------|
| v0.1.0 | Fases 0-1 — infraestructura | pendiente |
| v0.5.0 | Fases 2-3 — hábitos + tareas | pendiente |
| v0.8.0 | Fases 4-5 — proyectos + stats + coach | pendiente |
| v1.0.0 | Fases 6-7 — pulido + deploy | pendiente |

---

## Backlog (fuera de v1.0)

- Drag & drop para reordenar hábitos y tareas
- Auth multi-usuario / registro público
- Notificaciones push
- Botón atrás del móvil (historial navigation)
