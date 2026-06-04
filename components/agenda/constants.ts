// components/agenda/constants.ts
// Tokens de diseño (colores, tipografía) y función makeCSS.
// @critical — todos los componentes dependen de este módulo.
// @usedBy AgendaApp, HabitsModule, TasksModule, TodayModule, ProjectsModule,
//         CalendarModule, StatsModule, CoachModule, SettingsModule

import type { ThemeKey } from '@/lib/types';

// ─── Tipos internos ──────────────────────────────────────────────────────────

export interface ThemeTokens {
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  text: string;
  sub: string;
  accent: string;
  accentLight: string;
  danger: string;
  success: string;
  warning: string;
  font: string;
}

// ─── Paletas de color ────────────────────────────────────────────────────────

export const THEMES: Record<ThemeKey, ThemeTokens> = {
  light: {
    bg:          '#F2F2F0',
    surface:     '#FFFFFF',
    surface2:    '#F7F7F5',
    border:      '#E0DFDB',
    text:        '#1A1A18',
    sub:         '#7A7A74',
    accent:      '#4B6BFB',
    accentLight: '#EEF1FE',
    danger:      '#E53935',
    success:     '#22C55E',
    warning:     '#F59E0B',
    font:        "'Instrument Sans', sans-serif",
  },
  navy: {
    bg:          '#0E1628',
    surface:     '#1A2540',
    surface2:    '#141E35',
    border:      '#2A3A5C',
    text:        '#E8EAF0',
    sub:         '#8A93B0',
    accent:      '#7C9EF8',
    accentLight: '#1A2A4A',
    danger:      '#F87171',
    success:     '#4ADE80',
    warning:     '#FCD34D',
    font:        "'Instrument Sans', sans-serif",
  },
  dark: {
    bg:          '#111111',
    surface:     '#1E1E1E',
    surface2:    '#181818',
    border:      '#2E2E2E',
    text:        '#E8E8E8',
    sub:         '#8A8A8A',
    accent:      '#818CF8',
    accentLight: '#1E2040',
    danger:      '#F87171',
    success:     '#4ADE80',
    warning:     '#FCD34D',
    font:        "'Instrument Sans', sans-serif",
  },
  serio: {
    bg:          '#FAF8F4',
    surface:     '#FFFFFF',
    surface2:    '#F5F3EE',
    border:      '#D6D0C4',
    text:        '#1C1A14',
    sub:         '#6B6558',
    accent:      '#8B6914',
    accentLight: '#F5EDD6',
    danger:      '#C0392B',
    success:     '#27AE60',
    warning:     '#D4891A',
    font:        "'Cormorant Garamond', 'Georgia', serif",
  },
};

// ─── makeCSS ─────────────────────────────────────────────────────────────────
// Devuelve un objeto style{} con variables CSS para aplicar en el div raíz.
// Uso: <div style={makeCSS(theme)} ...>
// @critical — cambiarlo afecta el aspecto visual de TODA la app.
// @usedBy AgendaApp

export function makeCSS(themeKey: ThemeKey): React.CSSProperties & Record<string, string> {
  const t = THEMES[themeKey];
  return {
    '--bg':           t.bg,
    '--surface':      t.surface,
    '--surface2':     t.surface2,
    '--border':       t.border,
    '--text':         t.text,
    '--sub':          t.sub,
    '--accent':       t.accent,
    '--accent-light': t.accentLight,
    '--danger':       t.danger,
    '--success':      t.success,
    '--warning':      t.warning,
    '--font':         t.font,
    fontFamily:       t.font,
    background:       t.bg,
    color:            t.text,
  } as React.CSSProperties & Record<string, string>;
}

// ─── Constantes de UI ────────────────────────────────────────────────────────

export const SHORT_DAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'] as const;
export const FULL_DAYS  = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;

export const SECTIONS = ['mañana', 'día', 'noche'] as const;

export const PRIORITY_LABELS: Record<string, string> = {
  alta:  'Alta',
  media: 'Media',
  baja:  'Baja',
};

export const PRIORITY_COLORS: Record<string, string> = {
  alta:  'var(--danger)',
  media: 'var(--warning)',
  baja:  'var(--sub)',
};

export const EVENT_TYPE_LABELS: Record<string, string> = {
  examen:     'Examen',
  reunion:    'Reunión',
  cumpleaños: 'Cumpleaños',
  other:      'Otro',
};

// Umbral de swipe para eliminar (px)
export const SWIPE_THRESHOLD = 90;

// Duración del toast de celebración (ms)
export const TOAST_DURATION = 2000;

// Ancho máximo del viewport móvil (px)
export const MOBILE_MAX_WIDTH = 390;

// Número de semanas visibles en el heatmap
export const HEATMAP_WEEKS = 18;
