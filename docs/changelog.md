# Changelog — Agenda Gamificada 3.0

> Historial de versiones y sesiones.
> Append-only. Nunca editar entradas existentes.
> Formato sesiones: [fecha] — AI sesión N — resumen.

---

## Sesiones de trabajo

### 2026-06-04 — AI sesión 1 — Planificación completa

**Added**:
- Feature list v1.0 definida y aprobada por el arquitecto
- ARQUITECTO_1.md: identidad del proyecto, tech stack, session state actualizados
- docs/plan-desarrollo.md: 7 fases con hitos y subtareas ejecutables
- docs/arquitectura.md: structure map proyectado + contratos entre módulos
- docs/modulos.md: 10 módulos con contratos públicos TypeScript definidos
- docs/tareas.md: feature list completa como subtareas por fase
- docs/datos.md: schema SQL completo (8 tablas, RLS, JSONB subtasks)
- docs/decisiones.md: 10 decisiones de arquitectura registradas con motivos
- docs/guia-estilo.md: convenciones específicas (@usedBy, @critical, naming, tipos, CSS)
- docs/seguridad.md: auth, RLS, variables de entorno, superficie de ataque
- docs/dependencias.md: grafo de dependencias + tabla de funciones @critical
- docs/changelog.md: este archivo
- docs/deuda-tecnica.md: inicializado sin deuda

**Decisiones de sesión**:
- Stack: Next.js 14 + TypeScript + Supabase + Groq + Vercel
- Arquitectura multi-archivo frente a JSX monolítico (causa raíz de bugs anteriores)
- Convención @usedBy/@critical para prevenir cambios ciegos

**Pendiente de acción humana**:
- Crear repo GitHub
- Crear proyecto en Vercel y Supabase
- Ejecutar schema SQL de docs/datos.md en Supabase

---

## Versiones

*(se añadirán al tagear cada versión con git tag)*
