// components/agenda/habitos/HabitSection.tsx
// Autor: Acher Baos
// Versión 1.0 — 2026-06-09 — lista de hábitos de un momento del día
//
// Muestra los hábitos de una sección (manana/dia/noche) que tocan en la fecha activa.
// Cada fila: checkbox + nombre + icono clave. SwipeToRemove para eliminar.
// @usedBy HabitsModule

'use client';

import React from 'react';
import type { Habit } from '@/lib/types';
import { habitDueOnDate } from '@/components/agenda/helpers';
import { SECTION_LABELS } from '@/components/agenda/constants';
import SwipeToRemove from '@/components/agenda/SwipeToRemove';
import AddRow from '@/components/agenda/AddRow';
import Icon from '@/components/agenda/Icon';

interface Props {
  section: 'manana' | 'dia' | 'noche';
  habits: Habit[];
  date: Date;
  dateStr: string;             // YYYY-MM-DD — clave para checks
  onToggle: (id: string) => void;
  onEdit:   (habit: Habit) => void;
  onDelete: (id: string) => void;
  onAdd:    () => void;
}

export default function HabitSection({ section, habits, date, dateStr, onToggle, onEdit, onDelete, onAdd }: Props) {
  const visible = habits.filter(h => h.section === section && habitDueOnDate(h, date));

  return (
    <div style={{ marginBottom: 8 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--sub)', textTransform: 'uppercase',
        letterSpacing: 1, padding: '12px 0 4px' }}>
        {SECTION_LABELS[section]}
      </p>

      {visible.map(habit => (
        <SwipeToRemove key={habit.id} onDelete={() => onDelete(habit.id)}>
          <HabitRow
            habit={habit}
            checked={!!habit.checks[dateStr]}
            onToggle={() => onToggle(habit.id)}
            onEdit={() => onEdit(habit)}
          />
        </SwipeToRemove>
      ))}

      {visible.length === 0 && (
        <p style={{ color: 'var(--sub)', fontSize: 13, padding: '6px 0', opacity: 0.6 }}>
          Sin hábitos para este momento
        </p>
      )}

      <AddRow label={`Añadir en ${SECTION_LABELS[section].toLowerCase()}`} onClick={onAdd} />
    </div>
  );
}

// ─── Fila individual ─────────────────────────────────────────────────────────

function HabitRow({ habit, checked, onToggle, onEdit }: {
  habit: Habit;
  checked: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 4px',
      borderBottom: '1px solid var(--border)',
    }}>
      <button onClick={onToggle} style={{
        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
        border: `2px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
        background: checked ? 'var(--accent)' : 'transparent',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked && <Icon name="check" size={14} color="#fff" />}
      </button>

      <span style={{
        flex: 1, fontSize: 15, color: 'var(--text)',
        textDecoration: checked ? 'line-through' : 'none',
        opacity: checked ? 0.5 : 1,
      }}>
        {habit.is_key && <span style={{ marginRight: 4 }}>⭐</span>}
        {habit.name}
      </span>

      <button onClick={onEdit} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--sub)', padding: 4,
      }}>
        <Icon name="edit" size={16} color="var(--sub)" />
      </button>
    </div>
  );
}
