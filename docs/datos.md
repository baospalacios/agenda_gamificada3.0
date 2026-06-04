# Datos — Agenda Gamificada 3.0

> Schema de Supabase. Ejecutar completo en SQL Editor del dashboard antes de Fase 1.
> Si se modifica este schema durante el desarrollo: registrar en docs/decisiones.md.

---

## Schema SQL completo

```sql
-- ===================================================
-- HABILITAR UUID
-- ===================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================
-- HABITS — definición de hábitos del usuario
-- ===================================================
CREATE TABLE habits (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name         TEXT NOT NULL,
  section      TEXT NOT NULL DEFAULT 'dia'
                 CHECK (section IN ('manana', 'dia', 'noche')),  -- ASCII: ñ/í rompen parser SQL
  is_key       BOOLEAN DEFAULT false,
  freq         TEXT NOT NULL DEFAULT 'daily'
                 CHECK (freq IN ('daily', 'weekdays', 'weekly', 'biweekly', 'every_n', 'specific_days')),
  freq_days    JSONB DEFAULT '[]',    -- specific_days: [0,1,2,...] lunes=0, domingo=6
  freq_every   INT DEFAULT 1,         -- every_n: cada N días
  freq_weekday INT DEFAULT 0,         -- weekly: día de la semana (lunes=0)
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "habits_own" ON habits
  FOR ALL USING (auth.uid() = user_id);

-- ===================================================
-- HABIT_LOGS — un registro por check por fecha
-- ===================================================
CREATE TABLE habit_logs (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id  UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date  DATE NOT NULL,
  UNIQUE(habit_id, log_date)
);

ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "habit_logs_own" ON habit_logs
  FOR ALL USING (auth.uid() = user_id);

-- ===================================================
-- STREAK_LOGS — estado diario para el heatmap y racha
-- ===================================================
CREATE TABLE streak_logs (
  user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date  DATE NOT NULL,
  status    TEXT NOT NULL CHECK (status IN ('full', 'partial', 'empty')),
  PRIMARY KEY (user_id, log_date)
);

ALTER TABLE streak_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "streak_logs_own" ON streak_logs
  FOR ALL USING (auth.uid() = user_id);

-- ===================================================
-- TASKS — tareas con scheduling
-- ===================================================
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name            TEXT NOT NULL,
  done            BOOLEAN DEFAULT false,
  priority        TEXT DEFAULT 'media'
                    CHECK (priority IN ('alta', 'media', 'baja')),
  time_minutes    INT,
  due_date        DATE,
  scheduled_date  DATE,
  in_today        BOOLEAN DEFAULT false,
  created_at      BIGINT DEFAULT EXTRACT(EPOCH FROM now())::BIGINT * 1000
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_own" ON tasks
  FOR ALL USING (auth.uid() = user_id);

-- ===================================================
-- PROJECTS — proyectos con subtareas embebidas en JSONB
-- ===================================================
CREATE TABLE projects (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name      TEXT NOT NULL,
  category  TEXT DEFAULT 'personal'
              CHECK (category IN ('personal', 'aprendizaje', 'salud')),
  subtasks  JSONB DEFAULT '[]'
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_own" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- ===================================================
-- EVENTS — eventos puntuales y cumpleaños recurrentes
-- ===================================================
CREATE TABLE events (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name             TEXT NOT NULL,
  event_date       DATE,                      -- NULL si recurring=true
  event_type       TEXT DEFAULT 'other'
                     CHECK (event_type IN ('examen', 'reunion', 'cumpleanos', 'other')),  -- ASCII
  recurring        BOOLEAN DEFAULT false,
  recurring_month  INT,                       -- 0-11 (enero=0), solo si recurring=true
  recurring_day    INT                        -- 1-31, solo si recurring=true
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_own" ON events
  FOR ALL USING (auth.uid() = user_id);

-- ===================================================
-- FESTIVOS — compartidos, sin user_id, sin RLS
-- ===================================================
CREATE TABLE festivos (
  date DATE PRIMARY KEY
);

-- ===================================================
-- CHAT_MESSAGES — historial del Coach (memoria entre sesiones)
-- ===================================================
CREATE TABLE chat_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role       TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_messages_own" ON chat_messages
  FOR ALL USING (auth.uid() = user_id);
```

---

## Resumen de tablas

| Tabla | Propósito | RLS | Nota importante |
|-------|-----------|-----|----------------|
| habits | Definición de hábitos | ✅ | freq_days: JSONB array de días (lunes=0) |
| habit_logs | Un registro por check por fecha | ✅ | UNIQUE(habit_id, log_date) |
| streak_logs | Estado diario: full/partial/empty | ✅ | PK compuesta (user_id, log_date) |
| tasks | Tareas con scheduling | ✅ | in_today + scheduled_date |
| projects | Proyectos con subtareas | ✅ | subtasks: JSONB array — NO usar tabla separada |
| events | Eventos + cumpleaños recurrentes | ✅ | recurring=true → recurring_month/day |
| festivos | Festivos compartidos | ❌ | Sin user_id — datos públicos |
| chat_messages | Historial del Coach IA | ✅ | Nuevo en v1.0 — memoria entre sesiones |

---

## Estructura JSONB de subtask

Cada elemento del array `projects.subtasks`:

```json
{
  "id": "uuid-string-generado-en-cliente",
  "name": "string",
  "done": false,
  "priority": "alta | media | baja",
  "time_minutes": null,
  "due_date": "YYYY-MM-DD | null",
  "scheduled_date": "YYYY-MM-DD | null",
  "in_today": false,
  "created_at": 1717200000000
}
```

**Regla**: el `id` de subtarea se genera en el cliente con `crypto.randomUUID()` antes de escribir en Supabase.

---

## Realtime (opcional — habilitar si se usa en multi-dispositivo)

```sql
-- Habilitar realtime en tablas de lectura frecuente
ALTER PUBLICATION supabase_realtime ADD TABLE habits;
ALTER PUBLICATION supabase_realtime ADD TABLE habit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
```

---

## Variables de entorno requeridas

Ver docs/seguridad.md para lista completa y cómo configurar en Vercel.
