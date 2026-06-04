# Deuda Técnica — Agenda Gamificada 3.0

> Código que funciona pero está mal hecho.
> Append-only. Estados: pendiente / en-progreso / pagada.
> Cada versión menor salda al menos una deuda antes de añadir features (LEY 11).
> No mezclar con el backlog de features — son listas separadas.

---

## Sin deuda registrada

El proyecto está en fase de planificación. Esta lista se actualiza en el momento en que se detecta código mal hecho durante el desarrollo, no después.

---

## Formato de nueva entrada

```
| ID | Archivo:línea | Descripción | Impacto | Prioridad | Estado | Versión objetivo |
|----|--------------|-------------|---------|-----------|--------|-----------------|
| DT-001 | helpers.ts:45 | La función X hace dos cosas: debería dividirse en X1 y X2 | Dificulta tests | Media | pendiente | v1.1.0 |
```

---

## Tabla de deuda

| ID | Archivo:línea | Descripción | Impacto | Prioridad | Estado | Versión objetivo |
|----|--------------|-------------|---------|-----------|--------|-----------------|
| DT-001 | components/agenda/*.ts(x) | Cabeceras de archivo incompletas: falta `// Autor:` y `// Versión 1.0 — fecha` según LEY 13 | Violación guía de estilo; no afecta funcionalidad | Baja | pendiente | v0.2.0 |
| DT-002 | ARQUITECTO_1.md | LEY 1 violada en sesión 2: STRUCTURE MAP y SYMBOL INDEX no se actualizaron al crear cada archivo, sino al final de la sesión | Riesgo de docs desincronizados en futuras sesiones | Media | pagada (corregido en sesión 2) | — |
