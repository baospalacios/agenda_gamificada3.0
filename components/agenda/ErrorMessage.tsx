// components/agenda/ErrorMessage.tsx
// Autor: Acher Baos
// Versión 1.0 — 2026-06-09 — muestra errores de datos (Supabase, Groq, red)
//
// Componente inline para errores en módulos: Supabase falla, Groq no responde, etc.
// Distinto de ErrorBoundary (que captura errores de render).
// @usedBy HabitsModule, TasksModule, TodayModule, ProjectsModule, CoachModule

'use client';

import React from 'react';

interface ErrorMessageProps {
  error: string | Error | null;
  onRetry?: () => void;
  compact?: boolean;  // true = una línea, para usar dentro de módulos
}

export default function ErrorMessage({ error, onRetry, compact = false }: ErrorMessageProps) {
  if (!error) return null;

  const message = error instanceof Error ? error.message : error;

  if (compact) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
        background: 'rgba(248,113,113,0.1)',
        border: '1px solid rgba(248,113,113,0.3)',
        borderRadius: 8,
        color: 'var(--danger)',
        fontSize: 13,
      }}>
        <span>⚠ {message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              background: 'none', border: 'none',
              color: 'var(--danger)', cursor: 'pointer',
              fontSize: 12, textDecoration: 'underline', padding: 0,
            }}
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      padding: 20,
      background: 'rgba(248,113,113,0.08)',
      border: '1px solid rgba(248,113,113,0.25)',
      borderRadius: 12,
      color: 'var(--danger)',
      fontSize: 14,
      textAlign: 'center',
    }}>
      <p style={{ marginBottom: onRetry ? 12 : 0 }}>⚠ {message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'rgba(248,113,113,0.15)',
            border: '1px solid rgba(248,113,113,0.4)',
            color: 'var(--danger)',
            borderRadius: 8,
            padding: '6px 16px',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
