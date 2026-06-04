// lib/types.ts
// Todos los tipos TypeScript del proyecto. Centralizado aquí — nunca definir tipos en componentes.

// ─── Temas ──────────────────────────────────────────────────────────────────

export type ThemeKey = 'light' | 'navy' | 'dark' | 'serio';

// ─── Hábitos ────────────────────────────────────────────────────────────────

export type HabitFreq =
  | 'daily'
  | 'weekdays'
  | 'weekly'
  | 'biweekly'
  | 'every_n'
  | 'specific_days';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  section: 'manana' | 'dia' | 'noche';  // ASCII en BD; UI muestra "Mañana"/"Día"/"Noche"
  is_key: boolean;
  freq: HabitFreq;
  freq_days: number[];      // lunes=0 … domingo=6
  freq_every: number;       // para every_n
  freq_weekday: number;     // para weekly
  created_at: string;
  // Virtual: no existe en BD, se computa desde habit_logs
  checks: Record<string, boolean>;  // { 'YYYY-MM-DD': true }
}

export type HabitInput = Omit<Habit, 'id' | 'user_id' | 'created_at' | 'checks'>;

// ─── Tareas ─────────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  user_id: string;
  name: string;
  done: boolean;
  priority: 'alta' | 'media' | 'baja';
  time_minutes: number | null;
  due_date: string | null;        // YYYY-MM-DD
  scheduled_date: string | null;  // YYYY-MM-DD
  in_today: boolean;
  created_at: number;
}

export type TaskInput = Omit<Task, 'id' | 'user_id' | 'created_at'>;

// ─── Proyectos y subtareas ───────────────────────────────────────────────────

export interface Subtask {
  id: string;
  name: string;
  done: boolean;
  priority: 'alta' | 'media' | 'baja';
  time_minutes: number | null;
  due_date: string | null;
  scheduled_date: string | null;
  in_today: boolean;
  created_at: number;
}

export type SubtaskInput = Omit<Subtask, 'id' | 'created_at'>;

export interface Project {
  id: string;
  user_id: string;
  name: string;
  category: 'personal' | 'aprendizaje' | 'salud';
  subtasks: Subtask[];
}

export type ProjectInput = Omit<Project, 'id' | 'user_id'>;

// ─── Calendario ─────────────────────────────────────────────────────────────

export type EventType = 'examen' | 'reunion' | 'cumpleanos' | 'other';  // ASCII en BD; UI muestra "Cumpleaños"

export interface CalendarEvent {
  id: string;
  user_id: string;
  name: string;
  event_date: string | null;     // YYYY-MM-DD, null si recurring
  event_type: EventType;
  recurring: boolean;
  recurring_month: number | null; // 0-11
  recurring_day: number | null;   // 1-31
}

export type EventInput = Omit<CalendarEvent, 'id' | 'user_id'>;

// ─── Coach IA ────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export type HeatmapStatus = 'full' | 'partial' | 'empty' | 'future';

export interface HeatmapDay {
  date: string;          // YYYY-MM-DD
  status: HeatmapStatus;
}

export interface HabitProgress {
  habitId: string;
  habitName: string;
  completedDays: number;
  totalDays: number;     // días que tocaba en el período
}
