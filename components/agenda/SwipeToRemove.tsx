// components/agenda/SwipeToRemove.tsx
// Envuelve cualquier fila y añade gesto de swipe-left para eliminar.
// @usedBy HabitsModule, TasksModule, TodayModule

'use client';

import React, { useRef, useState } from 'react';
import { SWIPE_THRESHOLD } from './constants';
import Icon from './Icon';

interface SwipeToRemoveProps {
  onDelete: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function SwipeToRemove({ onDelete, children, disabled }: SwipeToRemoveProps) {
  const startX   = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [swiped, setSwiped] = useState(false);

  function handleTouchStart(e: React.TouchEvent) {
    if (disabled) return;
    startX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (startX.current === null || disabled) return;
    const dx = startX.current - e.touches[0].clientX;
    if (dx > 0) setOffset(Math.min(dx, SWIPE_THRESHOLD + 20));
  }

  function handleTouchEnd() {
    if (offset >= SWIPE_THRESHOLD) {
      setSwiped(true);
      setTimeout(onDelete, 200);
    } else {
      setOffset(0);
    }
    startX.current = null;
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
      {/* fondo rojo con icono de basura */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'var(--danger)',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        paddingRight: 20,
        borderRadius: 8,
        opacity: offset > 0 ? 1 : 0,
        transition: 'opacity 0.15s',
      }}>
        <Icon name="trash" size={20} color="#fff" />
      </div>

      {/* contenido desplazable */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(-${swiped ? SWIPE_THRESHOLD : offset}px)`,
          transition: offset === 0 || swiped ? 'transform 0.2s ease' : 'none',
          opacity: swiped ? 0 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
