// hooks/useHabits.ts
// Autor: Acher Baos
// Versión 1.0 — 2026-06-09 — CRUD hábitos + habit_logs + streak_logs
//
// Carga hábitos del usuario y sus checks de los últimos 30 días.
// Expone toggleCheck con optimistic update y CRUD completo.
// @usedBy HabitsModule, TodayModule (Fase 3)

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { dateKey, addDays, habitDueOnDate, keyToDate } from '@/components/agenda/helpers';
import type { Habit, HabitInput } from '@/lib/types';

// ─── Helpers internos ────────────────────────────────────────────────────────

function buildChecksMap(logs: { habit_id: string; log_date: string }[]) {
  const map: Record<string, Record<string, boolean>> = {};
  for (const log of logs) {
    if (!map[log.habit_id]) map[log.habit_id] = {};
    map[log.habit_id][log.log_date] = true;
  }
  return map;
}

function calcDayStatus(
  habits: Habit[],
  date: string
): 'full' | 'partial' | 'empty' | null {
  const due = habits.filter(h => habitDueOnDate(h, keyToDate(date)));
  if (!due.length) return null;
  const checked = due.filter(h => h.checks[date]).length;
  if (checked === due.length) return 'full';
  return checked > 0 ? 'partial' : 'empty';
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void load(); }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const today = new Date();
      const from = dateKey(addDays(today, -30));
      const to   = dateKey(addDays(today, 7));

      const [{ data: raw, error: e1 }, { data: logs, error: e2 }] = await Promise.all([
        supabase.from('habits').select('*').eq('user_id', user.id).order('created_at'),
        supabase.from('habit_logs').select('habit_id, log_date')
          .eq('user_id', user.id).gte('log_date', from).lte('log_date', to),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;

      const checksMap = buildChecksMap(logs ?? []);
      setHabits((raw ?? []).map(h => ({
        ...h,
        freq_days: h.freq_days ?? [],
        checks: checksMap[h.id] ?? {},
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar hábitos');
    } finally {
      setLoading(false);
    }
  }

  async function upsertStreakLog(date: string, updatedHabits: Habit[]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const status = calcDayStatus(updatedHabits, date);
    if (!status) return;
    await supabase.from('streak_logs').upsert({ user_id: user.id, log_date: date, status });
  }

  const toggleCheck = useCallback(async (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    const wasChecked = !!habit.checks[date];
    const updated = habits.map(h =>
      h.id !== habitId ? h : { ...h, checks: { ...h.checks, [date]: !wasChecked } }
    );
    setHabits(updated);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      if (wasChecked) {
        const { error } = await supabase.from('habit_logs').delete()
          .eq('habit_id', habitId).eq('log_date', date);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('habit_logs')
          .insert({ habit_id: habitId, user_id: user.id, log_date: date });
        if (error) throw error;
      }
      await upsertStreakLog(date, updated);
    } catch (err) {
      setHabits(habits);
      setError(err instanceof Error ? err.message : 'Error al guardar check');
    }
  }, [habits]);

  const addHabit = useCallback(async (data: HabitInput) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sin sesión');
    const { data: newHabit, error } = await supabase.from('habits')
      .insert({ ...data, user_id: user.id }).select().single();
    if (error) throw error;
    setHabits(prev => [...prev, { ...newHabit, freq_days: newHabit.freq_days ?? [], checks: {} }]);
  }, []);

  const editHabit = useCallback(async (id: string, data: Partial<HabitInput>) => {
    const { error } = await supabase.from('habits').update(data).eq('id', id);
    if (error) throw error;
    setHabits(prev => prev.map(h => h.id !== id ? h : { ...h, ...data }));
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) throw error;
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  return { habits, loading, error, toggleCheck, addHabit, editHabit, deleteHabit };
}
