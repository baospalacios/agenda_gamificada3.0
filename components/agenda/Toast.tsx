// components/agenda/Toast.tsx
// Toast de celebración (racha, logro). Negro, parte superior, 2 segundos.
// @usedBy AgendaApp (único punto de montaje — el estado sube a AgendaApp)

'use client';

import React, { useEffect, useState } from 'react';
import { TOAST_DURATION } from './constants';

interface ToastProps {
  message: string | null;
  onDone: () => void;
}

export default function Toast({ message, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, TOAST_DURATION);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : -60}px)`,
      transition: 'transform 0.3s ease',
      background: '#111',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: 20,
      fontSize: 14,
      fontWeight: 600,
      zIndex: 9999,
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    }}>
      {message}
    </div>
  );
}
