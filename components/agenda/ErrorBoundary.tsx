// components/agenda/ErrorBoundary.tsx
// Autor: Acher Baos
// Versión 1.0 — 2026-06-09 — captura errores de render en toda la app
//
// React class component obligatorio para error boundaries (los hooks no pueden hacerlo).
// Muestra stack trace completo en desarrollo. Mensaje amigable en producción.
// @usedBy app/app/page.tsx (envuelve AgendaApp)

'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const isDev = process.env.NODE_ENV === 'development';

    return (
      <div style={{
        minHeight: '100dvh',
        background: '#1a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'monospace',
      }}>
        <div style={{
          background: '#2a0a0a',
          border: '1px solid #8B1A1A',
          borderRadius: 12,
          padding: 24,
          maxWidth: 640,
          width: '100%',
        }}>
          <p style={{ color: '#F87171', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
            Error de renderizado
          </p>
          <p style={{ color: '#FCA5A5', fontSize: 14, marginBottom: 16 }}>
            {error.message}
          </p>

          {isDev && error.stack && (
            <pre style={{
              color: '#F87171',
              fontSize: 11,
              overflow: 'auto',
              maxHeight: 300,
              background: '#1a0505',
              padding: 12,
              borderRadius: 8,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}>
              {error.stack}
            </pre>
          )}

          <button
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: 16,
              background: '#8B1A1A',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
}
