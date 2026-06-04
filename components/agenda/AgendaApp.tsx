// components/agenda/AgendaApp.tsx
// Shell principal de la app. Gestiona: tema, sección activa, nav, toast.
// @critical — punto de montaje de todos los módulos.
// @usedBy app/app/page.tsx (único consumidor)

'use client';

import React, { useState, useCallback } from 'react';
import { makeCSS } from './constants';
import Icon from './Icon';
import Toast from './Toast';
import type { ThemeKey } from '@/lib/types';

// Módulos — se irán descomentando conforme se implementen
// import HabitsModule   from './HabitsModule';
// import TasksModule    from './TasksModule';
// import TodayModule    from './TodayModule';
// import ProjectsModule from './ProjectsModule';
// import CalendarModule from './CalendarModule';
// import StatsModule    from './StatsModule';
// import CoachModule    from './CoachModule';
// import SettingsModule from './SettingsModule';

type Section = 'habits' | 'tasks' | 'today' | 'projects' | 'calendar' | 'stats' | 'coach' | 'settings';

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'habits',   label: 'Hábitos'  },
  { id: 'tasks',    label: 'Tareas'   },
  { id: 'today',    label: 'Hoy'      },
  { id: 'projects', label: 'Proyectos'},
  { id: 'calendar', label: 'Calendario'},
  { id: 'stats',    label: 'Stats'    },
  { id: 'coach',    label: 'Coach'    },
  { id: 'settings', label: 'Ajustes'  },
];

interface AgendaAppProps {
  initialTheme?: ThemeKey;
}

export default function AgendaApp({ initialTheme = 'navy' }: AgendaAppProps) {
  const [theme,   setTheme]   = useState<ThemeKey>(initialTheme);
  const [section, setSection] = useState<Section>('today');
  const [toast,   setToast]   = useState<string | null>(null);

  const showToast = useCallback((msg: string) => setToast(msg), []);
  const clearToast = useCallback(() => setToast(null), []);

  function renderSection() {
    switch (section) {
      // Se irán activando por fases:
      // case 'habits':   return <HabitsModule theme={theme} showToast={showToast} />;
      // case 'tasks':    return <TasksModule  theme={theme} showToast={showToast} />;
      // case 'today':    return <TodayModule  theme={theme} showToast={showToast} />;
      // case 'projects': return <ProjectsModule theme={theme} />;
      // case 'calendar': return <CalendarModule theme={theme} />;
      // case 'stats':    return <StatsModule    theme={theme} />;
      // case 'coach':    return <CoachModule    theme={theme} />;
      // case 'settings': return <SettingsModule theme={theme} setTheme={setTheme} />;
      default:
        return (
          <div style={{ padding: 32, color: 'var(--sub)', textAlign: 'center', marginTop: 40 }}>
            <Icon name={section} size={40} color="var(--sub)" />
            <p style={{ marginTop: 12, fontSize: 14 }}>{section} — en desarrollo</p>
          </div>
        );
    }
  }

  return (
    <div
      style={{
        ...makeCSS(theme),
        minHeight: '100dvh',
        display: 'flex',
        position: 'relative',
      }}
    >
      {/* Sidebar — desktop (≥768px) */}
      <nav style={{
        display: 'none',        // flex en @media 768+, gestionado con className o style tag
        width: 172,
        flexDirection: 'column',
        padding: '24px 12px',
        borderRight: '1px solid var(--border)',
        gap: 2,
        position: 'sticky',
        top: 0,
        height: '100dvh',
        background: 'var(--surface)',
      }} className="sidebar-nav">
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', padding: '0 8px 16px' }}>
          Agenda 3.0
        </div>
        {NAV_ITEMS.map(item => (
          <SidebarItem
            key={item.id}
            item={item}
            active={section === item.id}
            onClick={() => setSection(item.id)}
          />
        ))}
      </nav>

      {/* Contenido principal */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 72 }}>
        {renderSection()}
      </main>

      {/* Bottom nav — mobile */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        display: 'flex',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '6px 0 env(safe-area-inset-bottom)',
        zIndex: 100,
      }} className="bottom-nav">
        {NAV_ITEMS.slice(0, 5).map(item => (
          <BottomNavItem
            key={item.id}
            item={item}
            active={section === item.id}
            onClick={() => setSection(item.id)}
          />
        ))}
      </nav>

      <Toast message={toast} onDone={clearToast} />

      {/* Variables CSS globales para sidebar en desktop */}
      <style>{`
        @media (min-width: 768px) {
          .sidebar-nav { display: flex !important; }
          .bottom-nav  { display: none  !important; }
          main { padding-bottom: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-componentes de nav ──────────────────────────────────────────────────

function SidebarItem({ item, active, onClick }: {
  item: { id: Section; label: string };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 8px',
        borderRadius: 8,
        border: 'none', cursor: 'pointer',
        background: active ? 'var(--accent-light)' : 'none',
        color: active ? 'var(--accent)' : 'var(--sub)',
        fontSize: 13, fontWeight: active ? 600 : 400,
        textAlign: 'left', width: '100%',
        transition: 'background 0.15s',
      }}
    >
      <Icon name={item.id} size={16} color={active ? 'var(--accent)' : 'var(--sub)'} />
      {item.label}
    </button>
  );
}

function BottomNavItem({ item, active, onClick }: {
  item: { id: Section; label: string };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        padding: '6px 0',
        border: 'none', background: 'none', cursor: 'pointer',
        color: active ? 'var(--accent)' : 'var(--sub)',
        fontSize: 10,
      }}
    >
      <Icon name={item.id} size={22} color={active ? 'var(--accent)' : 'var(--sub)'} />
      {item.label}
    </button>
  );
}
