'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const [mode,    setMode]    = useState<Mode>('login');
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? 'Error al crear la cuenta');
        }
        // Iniciar sesión automáticamente tras el registro
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (loginError) throw loginError;
      }
      router.push('/app');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0E1628',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: "'Instrument Sans', sans-serif",
    }}>
      <div style={{
        background: '#1A2540',
        borderRadius: 16,
        padding: 32,
        width: '100%',
        maxWidth: 380,
        border: '1px solid #2A3A5C',
      }}>
        <h1 style={{ color: '#E8EAF0', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Agenda Gamificada
        </h1>
        <p style={{ color: '#8A93B0', fontSize: 13, marginBottom: 28 }}>
          {mode === 'login' ? 'Accede a tu agenda' : 'Crea tu cuenta'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={e => setPass(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />

          {error && (
            <p style={{ color: '#F87171', fontSize: 13, background: '#2A1515', padding: '8px 12px', borderRadius: 8 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#3A4A7A' : '#7C9EF8',
              color: '#0E1628',
              border: 'none',
              borderRadius: 10,
              padding: '12px 0',
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4,
            }}
          >
            {loading ? 'Cargando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <p style={{ color: '#8A93B0', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
            style={{ background: 'none', border: 'none', color: '#7C9EF8', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: '#0E1628',
  border: '1px solid #2A3A5C',
  borderRadius: 10,
  padding: '11px 14px',
  color: '#E8EAF0',
  fontSize: 14,
  width: '100%',
};
