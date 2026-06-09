// app/app/page.tsx
// Autor: Acher Baos
// Versión 1.1 — 2026-06-09 — auth guard con ErrorBoundary + errores visibles
//
// Flujo: getSession() → sin sesión → redirect /login | con sesión → AgendaApp
// ErrorBoundary envuelve AgendaApp para capturar errores de render de cualquier módulo.

'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AgendaApp from '@/components/agenda/AgendaApp';
import ErrorBoundary from '@/components/agenda/ErrorBoundary';

type Status = 'loading' | 'ready' | 'error';

export default function AppPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setErrorMsg(error.message);
        setStatus('error');
        return;
      }
      if (!data.session) {
        router.replace('/login');
        return;
      }
      setStatus('ready');
    });
  }, [router]);

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100dvh', background: '#0E1628',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#8A93B0', fontFamily: "'Instrument Sans', sans-serif", fontSize: 14,
      }}>
        Cargando…
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{
        minHeight: '100dvh', background: '#0E1628',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, fontFamily: "'Instrument Sans', sans-serif",
      }}>
        <div style={{
          background: '#2a0a0a', border: '1px solid #8B1A1A',
          borderRadius: 12, padding: 24, maxWidth: 400, width: '100%',
        }}>
          <p style={{ color: '#F87171', fontWeight: 700, marginBottom: 8 }}>Error de autenticación</p>
          <p style={{ color: '#FCA5A5', fontSize: 14, marginBottom: 16 }}>{errorMsg}</p>
          <button
            onClick={() => router.replace('/login')}
            style={{
              background: '#8B1A1A', color: '#fff', border: 'none',
              borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13,
            }}
          >
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AgendaApp />
    </ErrorBoundary>
  );
}
