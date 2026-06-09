// components/agenda/habitos/HabitsModule.tsx
// Autor: Acher Baos
// Versión 1.0 — 2026-06-09 — módulo completo de hábitos
//
// Punto de entrada del tab Hábitos. Gestiona: fecha activa, estado del modal,
// qué hábito se edita. Usa useHabits para los datos.
// @usedBy AgendaApp

'use client';

import React, { useState } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { dateKey, addDays } from '@/components/agenda/helpers';
import { FULL_DAYS } from '@/components/agenda/constants';
import HabitSection from './HabitSection';
import HabitModal   from './HabitModal';
import ErrorMessage  from '@/components/agenda/ErrorMessage';
import Icon          from '@/components/agenda/Icon';
import type { Habit, HabitInput } from '@/lib/types';

type ModalState = { open: false } | { open: true; habit?: Habit };

export default function HabitsModule() {
  const { habits, loading, error, toggleCheck, addHabit, editHabit, deleteHabit } = useHabits();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modal, setModal] = useState<ModalState>({ open: false });

  const dateStr   = dateKey(selectedDate);
  const isToday   = dateStr === dateKey(new Date());
  const dayLabel  = isToday ? 'Hoy' : `${FULL_DAYS[( selectedDate.getDay() + 6 ) % 7]} ${selectedDate.getDate()}`;

  function openAdd()           { setModal({ open: true }); }
  function openEdit(h: Habit)  { setModal({ open: true, habit: h }); }
  function closeModal()        { setModal({ open: false }); }

  async function handleSave(data: HabitInput) {
    if (modal.open && modal.habit) {
      await editHabit(modal.habit.id, data);
    } else {
      await addHabit(data);
    }
  }

  if (loading) {
    return <p style={{ padding: 24, color: 'var(--sub)', fontSize: 14 }}>Cargando hábitos…</p>;
  }

  return (
    <div style={{ padding: '0 16px 24px' }}>

      {/* Cabecera con navegación de fecha */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 8px' }}>
        <button onClick={() => setSelectedDate(d => addDays(d, -1))} style={navBtn}>
          <Icon name="arrow-left" size={18} color="var(--sub)" />
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{dayLabel}</p>
          <p style={{ fontSize: 12, color: 'var(--sub)' }}>{dateStr}</p>
        </div>

        <button onClick={() => setSelectedDate(d => addDays(d, 1))} style={navBtn}>
          <Icon name="arrow-right" size={18} color="var(--sub)" />
        </button>
      </div>

      {error && <ErrorMessage error={error} compact />}

      {/* Tres secciones */}
      {(['manana', 'dia', 'noche'] as const).map(section => (
        <HabitSection
          key={section}
          section={section}
          habits={habits}
          date={selectedDate}
          dateStr={dateStr}
          onToggle={id => void toggleCheck(id, dateStr)}
          onEdit={openEdit}
          onDelete={id => void deleteHabit(id)}
          onAdd={openAdd}
        />
      ))}

      {/* Modal crear/editar */}
      {modal.open && (
        <HabitModal
          habit={modal.habit}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

const navBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  padding: 8, borderRadius: 8,
};
