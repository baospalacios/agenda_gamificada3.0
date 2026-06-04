# Decisiones — Agenda Gamificada 3.0

> Registro de decisiones de diseño y arquitectura.
> Append-only. Nunca borrar entradas existentes.
> Formato: fecha | decisión | motivo | alternativas descartadas.

---

| Fecha | Decisión | Motivo | Alternativas descartadas |
|-------|----------|--------|------------------------|
| 2026-06-04 | Next.js 14 App Router + TypeScript | Stack probado en Proyecto 1; mismas variables Supabase/Vercel reutilizables; TypeScript evita errores de tipo en runtime | React + Vite monolítico (causa raíz de bugs en cascada del Proyecto 2) |
| 2026-06-04 | Groq / llama-3.3-70b-versatile para el Coach | API rápida, tier gratuito, clave ya disponible. En Proyecto 1, Gemini tenía bug de variable de entorno en entorno equivocado | Gemini Flash (historial de bugs de configuración en proyectos anteriores) |
| 2026-06-04 | Subtareas como JSONB en projects.subtasks | Evita N+1 queries, simplifica modelo de datos, probado en Proyecto 1. La tabla subtasks separada quedó como dead code en Proyecto 1 | Tabla subtasks separada (añade JOIN innecesario, fue dead code en v anterior) |
| 2026-06-04 | Arquitectura multi-archivo (1 módulo = 1 carpeta, máx 200 líneas por archivo) | Elimina el "soluciono uno y rompo 5": archivos pequeños = contexto manejable por IA y por humano | Archivo monolítico JSX de 2200+ líneas (causa raíz de bugs en cascada en Proyecto 2) |
| 2026-06-04 | Memoria del Coach en Supabase (tabla chat_messages) | Continuidad entre sesiones y entre dispositivos sin depender de localStorage | localStorage (se pierde al cambiar dispositivo o limpiar caché) |
| 2026-06-04 | CSS inline via makeCSS(theme) en constants.ts | Patrón probado y centralizado del Proyecto 1. Tematización completa desde un punto. Sin dependencia de librerías de CSS | CSS Modules, Tailwind (añaden complejidad; Tailwind purge puede romper CSS dinámico) |
| 2026-06-04 | Sin registro público — usuarios en Supabase Dashboard | Uso personal exclusivo. Simplifica auth y seguridad. No hay riesgo de usuarios no deseados | Formulario de registro (añade superficie de ataque innecesaria para uso personal) |
| 2026-06-04 | Festivos sin RLS y sin user_id | Son datos públicos, iguales para todos los usuarios. Simplifica queries del calendario | Por usuario (innecesario: festivos no son personales) |
| 2026-06-04 | GROQ_API_KEY sin prefijo NEXT_PUBLIC_ | La key debe ser server-side only — nunca expuesta al cliente. La ruta /api/chat es el único punto de acceso | NEXT_PUBLIC_GROQ_API_KEY (expondría la key en el bundle del cliente — vulnerabilidad) |
| 2026-06-04 | Convención @usedBy + @critical en JSDoc | Previene cambios ciegos en funciones compartidas. La IA puede ver inmediatamente el impacto antes de modificar | Sin convención (el Proyecto 2 no tenía ninguna y era la causa de los errores en cascada) |
| 2026-06-04 | Valores de section en BD como ASCII ('manana','dia','noche') | Los caracteres ñ/í en CHECK constraints de PostgreSQL causan errores de encoding en el SQL Editor de Supabase. La UI usa SECTION_LABELS para mostrar "Mañana"/"Día"/"Noche" | Valores con acentos en BD (probado: rompe el parser SQL en Supabase) |
