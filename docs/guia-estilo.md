# Guía de Estilo — Agenda Gamificada 3.0

> La guía completa (nomenclatura, formato, tamaños, principios) está embebida en ARQUITECTO_1.md.
> Este archivo recoge SOLO las convenciones específicas de este proyecto.

---

## Convención @usedBy — obligatoria en funciones compartidas

Toda función usada por más de un módulo lleva en su JSDoc:

```typescript
/**
 * Determina si un hábito toca un día dado según su frecuencia.
 * @usedBy HoyTab, HabitSection, StatsPage, CoachPage
 * @critical Cambiar la lógica de retorno rompe Hoy + Stats + Coach simultáneamente.
 */
function habitDueOnDate(habit: Habit, date: Date): boolean {
```

Si la función es usada solo dentro de su propio módulo: no necesita @usedBy.

---

## Convención @critical — funciones de alto impacto

Se marca @critical cuando cambiarla afecta a 2 o más módulos simultáneamente.

**Protocolo obligatorio antes de tocar una función @critical**:
1. Abrir `docs/dependencias.md`
2. Ver TODOS los módulos en @usedBy
3. Revisar cómo la usa CADA módulo antes de tocar nada
4. Hacer el cambio
5. Actualizar @usedBy en el JSDoc si cambió quién la usa
6. Actualizar `docs/dependencias.md` si cambió el grafo

---

## Formato de JSDoc para funciones públicas

```typescript
/**
 * Descripción de qué hace en una línea.
 * Si tiene comportamiento no obvio, segunda línea aquí.
 * @usedBy ModuloA, ModuloB          ← si es shared
 * @critical Motivo concreto.         ← si es crítica
 */
```

No escribir qué hace cuando el nombre ya lo dice. Solo escribir el JSDoc cuando aporte información que el nombre NO da.

---

## Naming de archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes React | PascalCase | `HabitSection.tsx` |
| Hooks | camelCase con prefijo `use` | `useHabits.ts` |
| Lib / config | camelCase | `supabase.ts`, `groq.ts` |
| Tipos | PascalCase | `types.ts` |
| Docs | kebab-case | `plan-desarrollo.md` |

---

## Tipos — reglas de este proyecto

- Todos los tipos en `lib/types.ts` — nunca definir tipos locales en componentes
- El tipo Input siempre es `Omit<T, 'id' | 'user_id' | 'created_at'>`
- IDs siempre `string` en TypeScript aunque en BD sean UUID
- No usar `any`. No usar `as unknown as X` como atajo.

---

## Supabase — reglas de este proyecto

- El cliente siempre desde `lib/supabase.ts` — nunca crear una instancia nueva
- Las queries van en los hooks (`hooks/`) — nunca en los componentes directamente
- Siempre destructurar el error: `const { data, error } = await supabase...`
- Nunca ignorar el error silenciosamente — al menos `console.error` en desarrollo

---

## CSS — reglas de este proyecto

- CSS solo desde `makeCSS(theme)` en `constants.ts`
- Nunca colores hex hardcodeados en componentes — usar tokens del tema activo
- Nunca `style={{ color: '#xxx' }}` — siempre `style={{ color: theme.textPrimary }}`
- Excepción documentada: `LoginPage.tsx` tiene su propio `<style>` local (fuera del sistema de temas porque se renderiza antes de saber el tema)

---

## Tamaños máximos (del ARQUITECTO_1.md)

| Unidad | Máximo |
|--------|--------|
| Función / método | 20 líneas |
| Archivo | 200 líneas |
| Parámetros por función | 4 |
| Niveles de anidamiento | 3 |
