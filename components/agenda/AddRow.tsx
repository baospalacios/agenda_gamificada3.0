// components/agenda/AddRow.tsx
// Fila de "+ Añadir" reutilizable. Al hacer clic abre el modal del módulo padre.
// @usedBy HabitsModule, TasksModule, ProjectsModule, CalendarModule

'use client';

import React from 'react';
import Icon from './Icon';

interface AddRowProps {
  label: string;
  onClick: () => void;
}

export default function AddRow({ label, onClick }: AddRowProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', padding: '10px 4px',
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--sub)', fontSize: 14,
        borderRadius: 6,
      }}
    >
      <Icon name="plus" size={16} color="var(--sub)" />
      {label}
    </button>
  );
}
