// components/agenda/helpers.ts
// Utilidades de fecha y lógica de hábitos.
// @critical — usadas en múltiples módulos; no cambiar firma sin revisar dependencias.
// @usedBy HabitsModule, TodayModule, StatsModule, CalendarModule

import type { Habit, HabitFreq } from '@/lib/types';

// ─── Fechas ──────────────────────────────────────────────────────────────────

/**
 * Convierte un Date a clave canónica YYYY-MM-DD (zona local).
 * @critical — es la clave primaria de habit_logs y de Habit.checks.
 * @usedBy HabitsModule, TodayModule, StatsModule
 */
export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Suma `n` días a una fecha (no muta el original). */
export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/** Devuelve true si dos fechas representan el mismo día (zona local). */
export function sameDay(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b);
}

/**
 * Devuelve el día de la semana con lunes=0, domingo=6.
 * JS getDay() da domingo=0; este ajuste hace el sistema coherente con freq_days[].
 */
export function dowMonday(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/** Parsea una clave YYYY-MM-DD a Date (medianoche local). */
export function keyToDate(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Devuelve las últimas `n` semanas completas (lunes→domingo) hasta hoy. */
export function lastNWeeks(n: number): Date[] {
  const today = new Date();
  const dow = dowMonday(today);
  const monday = addDays(today, -dow - (n - 1) * 7);
  const days: Date[] = [];
  for (let i = 0; i < n * 7; i++) days.push(addDays(monday, i));
  return days;
}

// ─── Lógica de hábitos ───────────────────────────────────────────────────────

/**
 * Devuelve true si un hábito debe realizarse en `date` según su frecuencia.
 * @critical — determina qué hábitos aparecen en cada día (Today, Hábitos, Stats).
 * @usedBy HabitsModule, TodayModule, StatsModule
 *
 * Reglas por freq:
 *   daily          → siempre
 *   weekdays       → lunes–viernes (dow 0–4)
 *   weekly         → solo el día freq_weekday
 *   biweekly       → días 0 y 3 del ciclo de 7 (lun y jue por defecto)
 *   every_n        → cada freq_every días desde created_at
 *   specific_days  → los días indicados en freq_days[]
 */
export function habitDueOnDate(h: Habit, date: Date): boolean {
  const dow = dowMonday(date);

  switch (h.freq as HabitFreq) {
    case 'daily':
      return true;

    case 'weekdays':
      return dow <= 4;

    case 'weekly':
      return dow === h.freq_weekday;

    case 'biweekly': {
      // Cada 3–4 días: lunes(0) y jueves(3) por defecto si freq_days vacío
      const days = h.freq_days.length ? h.freq_days : [0, 3];
      return days.includes(dow);
    }

    case 'every_n': {
      const origin = new Date(h.created_at);
      const diffMs  = date.getTime() - origin.getTime();
      const diffDays = Math.floor(diffMs / 86_400_000);
      return diffDays >= 0 && diffDays % h.freq_every === 0;
    }

    case 'specific_days':
      return h.freq_days.includes(dow);

    default:
      return false;
  }
}

/**
 * Calcula la racha actual de un hábito hasta `today` (inclusive).
 * Una racha se rompe si en un día que toca el hábito no hay check.
 * @usedBy HabitsModule, StatsModule
 */
export function currentStreak(h: Habit, today: Date): number {
  let streak = 0;
  let cursor = new Date(today);

  for (let i = 0; i < 365; i++) {
    if (!habitDueOnDate(h, cursor)) {
      cursor = addDays(cursor, -1);
      continue;
    }
    if (h.checks[dateKey(cursor)]) {
      streak++;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}

// ─── Formato de texto ────────────────────────────────────────────────────────

/** "09:05" → minutos totales. "1h 30m" también soportado. */
export function timeToMinutes(str: string): number {
  const hm = str.match(/(\d+)h\s*(\d+)?m?/);
  if (hm) return Number(hm[1]) * 60 + Number(hm[2] ?? 0);
  const colon = str.match(/^(\d{1,2}):(\d{2})$/);
  if (colon) return Number(colon[1]) * 60 + Number(colon[2]);
  return 0;
}

/** Minutos → "1h 30m" o "45m". */
export function minutesToLabel(mins: number): string {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

/** Capitaliza la primera letra. */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
