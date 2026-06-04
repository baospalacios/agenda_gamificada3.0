'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AgendaApp from '@/components/agenda/AgendaApp';

export default function AppPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/login');
      } else {
        setReady(true);
      }
    });
  }, [router]);

  if (!ready) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: '#0E1628',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8A93B0',
        fontFamily: "'Instrument Sans', sans-serif",
        fontSize: 14,
      }}>
        Cargando…
      </div>
    );
  }

  return <AgendaApp />;
}
