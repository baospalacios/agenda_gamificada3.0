# Dependencias entre Módulos — Agenda Gamificada 3.0

> Mapa de qué módulo depende de qué y qué funciones son @critical.
> Consultar SIEMPRE antes de modificar una función @critical.
> Actualizar cuando se añadan nuevas dependencias durante el desarrollo.

---

## Protocolo de uso

```
Antes de modificar la función X:
  1. Buscar X en la tabla "Funciones @critical" de abajo
  2. Si aparece: leer TODOS los módulos de @usedBy
  3. Revisar cómo usa cada módulo esa función
  4. Hacer el cambio
  5. Actualizar @usedBy en el JSDoc de la función
  6. Actualizar este documento si cambió el grafo
```

---

## Funciones @critical

> Cambiar estas funciones sin revisar @usedBy rompe múltiples módulos.

| Función | Archivo | @usedBy | Qué se rompe si se cambia |
|---------|---------|---------|--------------------------|
| `habitDueOnDate` | helpers.ts | HoyTab, HabitSection, StatsPage, CoachPage | Hoy no muestra los hábitos correctos + Stats mal calculadas + Coach con contexto incorrecto |
| `makeCSS` | constants.ts | TODOS los componentes | Toda la UI se rompe o pierde estilos |
| `dateKey` | helpers.ts | useHabits, useStats, HoyTab, CalendarPage, CoachPage | Todos los lookups de fecha fallan (checks, heatmap, calendario) |
| `buildPrompt` | api/chat/route.ts | POST /api/chat | El Coach pierde contexto del usuario — respuestas genéricas |
| `updateStreakLog` | useHabits.ts | toggleCheck | Heatmap y racha se dessincronizan de los checks |

---

## Grafo de dependencias por módulo

```
lib/types.ts      ←── TODOS los módulos y hooks
lib/supabase.ts   ←── M02, hooks: useHabits, useTasks, useProjects, useCalendar, useStats, useCoach
lib/groq.ts       ←── M09 (useCoach, api/chat/route.ts)

M01 core (helpers.ts, constants.ts, shared/)
  ←── M03 habitos (habitDueOnDate, dateKey, SwipeToRemove)
  ←── M04 tareas (dateKey, AddRow, TimePicker)
  ←── M05 hoy (habitDueOnDate, dateKey, SwipeToRemove, AddRow)
  ←── M06 proyectos (dateKey, TimePicker)
  ←── M07 calendario (dateKey, sameDay)
  ←── M08 stats (habitDueOnDate, dateKey)
  ←── M09 coach (dateKey)
  ←── M10 ajustes (THEMES, makeCSS)
  ←── AgendaApp (makeCSS, todos los shared)

M03 habitos (useHabits)
  ←── M05 hoy (habits, toggleCheck via props desde AgendaApp)
  ←── M08 stats (habits via props)
  ←── M09 coach (habits data en buildPrompt)

M04 tareas (useTasks)
  ←── M05 hoy (tasks, setInToday, addTask via props)
  ←── M07 calendario (tasks.due_date — solo lectura)
  ←── M09 coach (tasks data en buildPrompt)

M06 proyectos (useProjects)
  ←── M05 hoy (subtasks con in_today via props)
  ←── M09 coach (projects data en buildPrompt)

M07 calendario (useCalendar)
  ←── M09 coach (events data en buildPrompt)
```

---

## Dependencias detalladas por módulo

### M05 hoy — depende de:
| Qué necesita | De quién | Cómo llega |
|-------------|---------|------------|
| `habitDueOnDate`, `dateKey`, `SwipeToRemove` | M01 | import directo |
| `habits`, `toggleCheck` | M03 | props desde AgendaApp |
| `tasks`, `setInToday`, `addTask` | M04 | props desde AgendaApp |

### M08 stats — depende de:
| Qué necesita | De quién | Cómo llega |
|-------------|---------|------------|
| `habitDueOnDate`, `dateKey` | M01 | import directo |
| `habits` | M03 | props |
| habit_logs, streak_logs | Supabase | query directa en useStats (solo lectura) |

### M09 coach — depende de:
| Qué necesita | De quién | Cómo llega |
|-------------|---------|------------|
| habits + checks | M03 | props a buildPrompt |
| tasks | M04 | props a buildPrompt |
| projects + subtasks | M06 | props a buildPrompt |
| events + festivos | M07 | props a buildPrompt |
| chat_messages | Supabase | useCoach |
| Groq API | lib/groq.ts | import en route.ts |

---

## Regla de evolución de este documento

Cada vez que se añade una nueva función compartida entre módulos:
1. Añadirla a la tabla de funciones @critical si aplica
2. Añadir su @usedBy en el JSDoc de la función
3. Actualizar el grafo de dependencias aquí
4. Registrar en docs/changelog.md
