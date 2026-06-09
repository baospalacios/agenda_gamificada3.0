// components/agenda/habitos/HabitModal.tsx
// Autor: Acher Baos
// Versión 1.0 — 2026-06-09 — modal crear/editar hábito (bottom sheet)
//
// Campos: nombre, sección, is_key, frecuencia + campos dinámicos según freq.
// @usedBy HabitsModule

'use client';

import React, { useState } from 'react';
import type { Habit, HabitInput, HabitFreq } from '@/lib/types';
import { SECTION_LABELS, SHORT_DAYS } from '@/components/agenda/constants';
import Icon from '@/components/agenda/Icon';

interface Props {
  habit?: Habit;
  onSave:  (data: HabitInput) => Promise<void>;
  onClose: () => void;
}

const FREQ_OPTS: { value: HabitFreq; label: string }[] = [
  { value: 'daily',         label: 'Todos los días' },
  { value: 'weekdays',      label: 'Lunes a viernes' },
  { value: 'weekly',        label: 'Una vez a la semana' },
  { value: 'biweekly',      label: 'Dos veces a la semana' },
  { value: 'every_n',       label: 'Cada N días' },
  { value: 'specific_days', label: 'Días específicos' },
];

const DEFAULT: HabitInput = {
  name: '', section: 'dia', is_key: false,
  freq: 'daily', freq_days: [], freq_every: 2, freq_weekday: 0,
};

export default function HabitModal({ habit, onSave, onClose }: Props) {
  const [form, setForm] = useState<HabitInput>(habit ? {
    name: habit.name, section: habit.section, is_key: habit.is_key,
    freq: habit.freq, freq_days: [...habit.freq_days],
    freq_every: habit.freq_every, freq_weekday: habit.freq_weekday,
  } : DEFAULT);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  function set<K extends keyof HabitInput>(key: K, val: HabitInput[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function toggleDay(day: number) {
    const days = form.freq_days.includes(day)
      ? form.freq_days.filter(d => d !== day)
      : [...form.freq_days, day].sort((a, b) => a - b);
    set('freq_days', days);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave({ ...form, name: form.name.trim() });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
      setSaving(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface)', borderRadius: '16px 16px 0 0',
        padding: '20px 20px env(safe-area-inset-bottom)',
        maxHeight: '90dvh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>
            {habit ? 'Editar hábito' : 'Nuevo hábito'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Icon name="close" size={20} color="var(--sub)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input placeholder="Nombre del hábito" value={form.name} autoFocus
            onChange={e => set('name', e.target.value)} style={iStyle} />

          <div>
            <p style={lStyle}>Momento del día</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['manana', 'dia', 'noche'] as const).map(s => (
                <button key={s} type="button" onClick={() => set('section', s)} style={chip(form.section === s)}>
                  {SECTION_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: 'var(--text)', fontSize: 14 }}>
            <input type="checkbox" checked={form.is_key} onChange={e => set('is_key', e.target.checked)} />
            Hábito clave ⭐
          </label>

          <div>
            <p style={lStyle}>Frecuencia</p>
            <select value={form.freq} onChange={e => set('freq', e.target.value as HabitFreq)} style={iStyle}>
              {FREQ_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {form.freq === 'weekly' && (
            <div>
              <p style={lStyle}>Día de la semana</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SHORT_DAYS.map((d, i) => (
                  <button key={i} type="button" onClick={() => set('freq_weekday', i)} style={chip(form.freq_weekday === i)}>{d}</button>
                ))}
              </div>
            </div>
          )}

          {(form.freq === 'biweekly' || form.freq === 'specific_days') && (
            <div>
              <p style={lStyle}>Días de la semana</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SHORT_DAYS.map((d, i) => (
                  <button key={i} type="button" onClick={() => toggleDay(i)} style={chip(form.freq_days.includes(i))}>{d}</button>
                ))}
              </div>
            </div>
          )}

          {form.freq === 'every_n' && (
            <div>
              <p style={lStyle}>Cada cuántos días</p>
              <input type="number" min={2} max={30} value={form.freq_every}
                onChange={e => set('freq_every', Number(e.target.value))}
                style={{ ...iStyle, width: 80 }} />
            </div>
          )}

          {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}

          <button type="submit" disabled={saving} style={{
            background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10,
            padding: '12px 0', fontWeight: 700, fontSize: 15,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
          }}>
            {saving ? 'Guardando…' : habit ? 'Guardar cambios' : 'Crear hábito'}
          </button>
        </form>
      </div>
    </div>
  );
}

const iStyle: React.CSSProperties = {
  background: 'var(--surface2)', border: '1px solid var(--border)',
  borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14, width: '100%',
};
const lStyle: React.CSSProperties = { color: 'var(--sub)', fontSize: 12, marginBottom: 8 };
const chip = (active: boolean): React.CSSProperties => ({
  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13,
  background: active ? 'var(--accent)' : 'var(--surface2)',
  color: active ? '#fff' : 'var(--sub)',
});
