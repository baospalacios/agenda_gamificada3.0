<!--
  ╔══════════════════════════════════════════════════════════════════════════════╗
  ║  ARQUITECTO.md v1.0                                                        ║
  ║  Índice maestro · Leyes · Protocolos · Guía de estilo · Diagnósticos      ║
  ║                                                                            ║
  ║  Autor: Acher Baos                                                         ║
  ║  Principio rector: KISS — Keep It Simple, Stupid.                         ║
  ║                                                                            ║
  ║  ESTE ARCHIVO ES LA LEY. Toda IA que trabaje en este proyecto              ║
  ║  debe leerlo completo antes de tocar cualquier archivo de código.          ║
  ║  Prohibido escribir una sola línea sin haberlo leído.                      ║
  ╚══════════════════════════════════════════════════════════════════════════════╝
-->

# ARQUITECTO.md v1.0 — Índice Maestro

---

## ⚠️ LEYES DE USO — NO NEGOCIABLES

> Violar estas leyes destruye la coherencia del proyecto.
> No hay excepciones. No hay "esta vez no hace falta".

### LEY 1 — Sincronización inmediata
Cada vez que se modifica algo del proyecto, se actualiza el doc correspondiente en ese mismo momento.

- Se crea una función → SYMBOL INDEX actualizado ahora
- Se mueve un archivo → STRUCTURE MAP actualizado ahora
- Se completa una subtarea → marcada en `docs/tareas.md` ahora
- Se toma una decisión → registrada en `docs/decisiones.md` ahora
- Se añade una dependencia → registrada en `docs/changelog.md` ahora
- Se detecta un bug → registrado en KNOWN ISSUES ahora
- Se genera deuda técnica → registrada en `docs/deuda-tecnica.md` ahora

### LEY 2 — Código es la verdad, docs reflejan el código
Si código y docs discrepan: el código manda, los docs están mal.
Nunca asumir que los docs son correctos sin verificar contra el código real.

### LEY 3 — Un subagente, un módulo, una conversación
Un subagente no toca archivos fuera de su módulo.
Si necesita algo de otro módulo: usar solo su `index.ts`.
Si necesita modificar otro módulo: parar, registrar en BLOCKERS, notificar al arquitecto.

### LEY 4 — Cero improvisación fuera de los planos
Si una funcionalidad no está en `docs/tareas.md`: no se implementa.
Si surge la necesidad: registrar en Backlog, notificar al arquitecto, continuar con lo asignado.

### LEY 5 — Verificación de integridad antes de empezar
Al inicio de cada sesión, verificar:
1. ¿STRUCTURE MAP coincide con archivos reales en disco?
2. ¿SYMBOL INDEX coincide con funciones reales en el código?
3. ¿Estado de módulos en `docs/modulos.md` es correcto?
Si hay discrepancias: ejecutar Protocolo de Megadiagnóstico antes de continuar.

### LEY 6 — Nunca commitear con docs desactualizados
Antes de cada `git commit` verificar:
- SYMBOL INDEX actualizado ✓
- STRUCTURE MAP actualizado ✓
- Tarea marcada en `docs/tareas.md` ✓
- Decisiones en `docs/decisiones.md` ✓
- Deuda técnica en `docs/deuda-tecnica.md` si la hay ✓
Un commit sin docs actualizados no existe.

### LEY 7 — Sesión no cerrada = sesión perdida
La secuencia de fin de sesión es obligatoria aunque todo haya ido mal.
Sin ella la próxima IA arranca sin contexto y el trabajo se pierde.

### LEY 8 — Scope creep es blocker inmediato
Petición fuera del scope actual:
1. Registrar en Backlog de `docs/tareas.md`
2. Notificar al arquitecto
3. Continuar con la tarea actual
No implementar nada fuera del scope sin aprobación explícita.

### LEY 9 — Los contratos entre módulos son sagrados
Cambiar el contrato público de un módulo requiere:
1. Aprobación del arquitecto
2. Actualizar `docs/arquitectura.md` sección Contratos
3. Notificar a todos los módulos que lo usan
4. Verificar que ningún módulo dependiente se rompe
Cambiar un contrato sin avisar rompe silenciosamente otros módulos.

### LEY 10 — Calidad no es opcional
Ningún subagente entrega código sin pasar el checklist completo de `docs/guia-estilo.md`.
Si el checklist no pasa: el código no se entrega, se arregla primero.

### LEY 11 — Deuda técnica se registra, no se ignora
Código que funciona pero está mal hecho = deuda técnica.
Toda deuda técnica se registra en `docs/deuda-tecnica.md` en el momento de generarse.
No se mezcla con el backlog de features. Son listas separadas.
Cada versión menor debe saldar al menos una deuda técnica antes de añadir features nuevas.

### LEY 12 — Ante fallo: protocolo, nunca improvisación
Si algo se rompe, el build falla, o el sistema está en estado inconsistente:
ejecutar el Protocolo de Recuperación ante Fallos.
Nunca parchear sobre la marcha sin entender la causa raíz.

### LEY 13 — La guía de estilo EUPT es la ley del código
La guía de estilo está embebida en este archivo (sección GUÍA DE ESTILO EMBEBIDA, más abajo).
Basada en: Guía EUPT-Zaragoza 2025/2026 + Clean Code (R. Martin).
Se aplica SIEMPRE, en TODOS los lenguajes, a TODO el código, sin excepción ni código "provisional".
No existe código entregado que no la cumpla. No existe "lo arreglo después".
Si el checklist falla: el subagente corrige antes de entregar, sin esperar instrucción del arquitecto.
El archivo `docs/guia-estilo.md` existe como referencia detallada con ejemplos completos.

### LEY 14 — Los blockers tienen fecha límite de escalado
Un blocker sin resolver tras 2 sesiones de trabajo = blocker crítico.
Un blocker crítico paraliza el proyecto hasta resolución explícita del arquitecto.
La IA no trabaja alrededor de un blocker crítico sin aprobación.
En cada diagnóstico de sesión: verificar fecha de apertura de cada blocker activo.

### LEY 15 — Cambios de arquitectura son eventos formales
Si el arquitecto cambia tech stack, contratos, o estructura de módulos a mitad del proyecto:
1. PARAR todo el trabajo activo
2. Registrar en docs/decisiones.md con fecha y motivo
3. Ejecutar Megadiagnóstico completo
4. Evaluar impacto: qué módulos construidos se ven afectados
5. Actualizar docs/arquitectura.md, docs/modulos.md, docs/plan-desarrollo.md
6. Marcar como `requiere-revision` los módulos afectados en docs/modulos.md
7. Solo entonces: reanudar el trabajo
Un cambio sin este proceso invalida módulos ya construidos de forma silenciosa.

---

## ⚙️ PROTOCOLOS DE TRABAJO

### Protocolo de inicio de sesión
```
1. Leer este archivo completo
2. Leer CURRENT SESSION STATE
   → Si está vacío o dice "primera sesión": ejecutar Protocolo de Primera Sesión
   → Si tiene contenido: continuar con paso 3
3. Verificar integridad (LEY 5):
   → Comparar STRUCTURE MAP con archivos reales en disco
   → Comparar SYMBOL INDEX con funciones reales en código
   → Si hay discrepancias: ejecutar Protocolo de Megadiagnóstico
4. Verificar blockers activos (LEY 14):
   → ¿Hay blockers con más de 2 sesiones sin resolver?
   → Si sí: notificar al arquitecto antes de continuar
5. Identificar qué doc de /docs necesita la tarea
6. Leer solo ese doc, solo las secciones relevantes
7. Empezar a trabajar
```

### Protocolo de primera sesión
```
Cuándo: CURRENT SESSION STATE está vacío o es la primera vez que se abre el proyecto

PASO 1 — Confirmar que los docs de planificación están completos
  → ¿docs/plan-desarrollo.md tiene las fases definidas?
  → ¿docs/arquitectura.md tiene el tech stack y la estructura de carpetas?
  → ¿docs/modulos.md tiene los módulos definidos con contratos?
  → Si alguno está incompleto: PARAR y notificar al arquitecto
    "Los planos no están completos. No se puede empezar a codificar."

PASO 2 — Si los docs están completos: confirmar el primer hito a ejecutar
  → Leer docs/plan-desarrollo.md sección Fase 0
  → Identificar el primer hito desbloqueado
  → Notificar al arquitecto: "Listo para empezar. Primer hito: [X]. ¿Confirmas?"
  → Esperar confirmación antes de escribir código

PASO 3 — Actualizar CURRENT SESSION STATE
  → Escribir el objetivo de la primera sesión
  → Escribir el primer paso concreto
  → Registrar en docs/changelog.md: "Proyecto iniciado - sesión 1"
```

### Protocolo de inicio de módulo nuevo
```
ANTES de escribir la primera línea de código del módulo:

1. Leer la sección completa del módulo en docs/modulos.md
2. Verificar que todas las dependencias del módulo están en estado "completado"
   → Si alguna dependencia no está completada: PARAR y notificar al arquitecto
3. Leer los contratos que este módulo debe respetar en docs/arquitectura.md
4. Confirmar entendimiento de los límites del módulo (qué NO hace)
5. Crear la estructura de carpetas y archivos vacíos
6. Actualizar STRUCTURE MAP con los archivos creados
7. Escribir los tipos internos en tipos.ts ANTES de implementar funciones
8. Solo entonces: empezar a implementar función por función
9. Después de cada función: test + actualizar SYMBOL INDEX
```

### Protocolo de modificación de código
```
Al crear una función:
  → Añadir a SYMBOL INDEX en docs/arquitectura.md AHORA

Al crear o mover un archivo:
  → Actualizar STRUCTURE MAP en docs/arquitectura.md AHORA

Al completar una subtarea:
  → Marcar en docs/tareas.md AHORA

Al tomar una decisión de diseño:
  → Registrar en docs/decisiones.md AHORA

Al añadir una dependencia:
  → Registrar en docs/changelog.md AHORA

Al detectar código mal hecho que funciona:
  → Registrar en docs/deuda-tecnica.md AHORA, continuar

Al detectar un bug:
  → Registrar en KNOWN ISSUES AHORA

Regla de tiempo: si el cambio tarda 5 minutos en código,
la actualización del doc tarda 1 minuto. Hacerlo siempre.
```

### Protocolo de fin de sesión
```
1. Sobrescribir CURRENT SESSION STATE con estado real
2. docs/tareas.md → marcar tareas completadas esta sesión
3. docs/changelog.md → añadir entrada de sesión
4. docs/decisiones.md → añadir decisiones tomadas
5. docs/arquitectura.md → verificar STRUCTURE MAP y SYMBOL INDEX
6. docs/modulos.md → actualizar estado de módulos trabajados
7. docs/deuda-tecnica.md → registrar deuda generada esta sesión
8. Check de dependencia cero:
   "¿Podría una IA nueva continuar solo desde estos archivos?"
   Si NO → rellenar huecos ahora
9. git commit con formato correcto
```

### Protocolo de entrega de subtarea (subagente)
```
El subagente entrega:
1. Código completo del módulo
2. Tests (caso feliz + edge cases + errores)
3. Checklist de calidad completado (docs/guia-estilo.md)
4. Actualización de su sección en docs/modulos.md
5. Lista de funciones nuevas para SYMBOL INDEX
6. Lista de decisiones para docs/decisiones.md
7. Deuda técnica generada para docs/deuda-tecnica.md
8. Observaciones no obvias para AI NOTES
9. Estado actualizado de sus subtareas en docs/tareas.md

El arquitecto verifica antes de aceptar:
1. Checklist de calidad completo
2. Contratos entre módulos respetados
3. Sin código fuera del scope asignado
4. Docs actualizados
5. Tests pasan
Solo entonces: merge a develop, módulo marcado como completado
```

### Protocolo de conflicto entre módulos
```
Cuándo se activa:
En la fase de integración, dos módulos no encajan porque
sus contratos son incompatibles o sus tipos no coinciden.

PASO 1 — Identificar el conflicto exacto
  → ¿Qué función concreta no encaja?
  → ¿Qué tipo o firma es incompatible?
  → Documentar el conflicto en KNOWN ISSUES

PASO 2 — Determinar quién tiene razón
  → Leer el contrato original en docs/arquitectura.md sección Contratos
  → El módulo que se desvió del contrato es el que está mal
  → Si el contrato estaba mal definido desde el principio:
     registrar en docs/decisiones.md y actualizar el contrato

PASO 3 — Resolver sin romper otros módulos
  → Si se modifica el módulo A: verificar que ningún otro módulo
    que usa A se rompe por el cambio
  → Nunca parchear el punto de integración sin arreglar la causa raíz
  → Nunca duplicar código como solución temporal

PASO 4 — Verificar resolución
  → Tests de integración pasan
  → Contrato actualizado en docs/arquitectura.md
  → Decisión registrada en docs/decisiones.md
  → Eliminar de KNOWN ISSUES o marcar como arreglado

PASO 5 — Prevención
  → ¿Por qué ocurrió el conflicto?
  → ¿El contrato estaba mal definido? → mejorar proceso de diseño
  → ¿El subagente se desvió del contrato? → reforzar LEY 9
  → Registrar aprendizaje en AI NOTES
```

### Protocolo de recuperación ante fallos
```
Cuándo se activa:
- El build falla
- Los tests fallan después de funcionar
- El sistema está en estado inconsistente
- Se detecta código corrupto o contradictorio
- Docs y código no coinciden en múltiples puntos

PASO 1 — PARAR. No parchear, no continuar.
  → No escribir más código hasta entender la causa

PASO 2 — Identificar el último estado estable
  → git log → encontrar el último commit donde todo funcionaba
  → Anotar el hash del commit estable

PASO 3 — Diagnosticar la causa raíz
  → ¿Qué cambio exacto introdujo el problema?
  → ¿Es un bug de código o una inconsistencia de docs?
  → ¿Afecta a un solo módulo o a la integración?

PASO 4 — Decidir estrategia
  → Si el problema es localizado (un módulo):
     arreglar el módulo, tests, actualizar docs
  → Si el problema es de integración (contratos rotos):
     ejecutar Protocolo de Conflicto entre Módulos
  → Si el problema es generalizado (múltiples módulos):
     git checkout [hash-commit-estable]
     ejecutar Protocolo de Megadiagnóstico completo
     planificar desde el estado estable

PASO 5 — Registrar
  → KNOWN ISSUES: qué pasó y cómo se resolvió
  → docs/decisiones.md: si se tomó alguna decisión de diseño
  → AI NOTES: qué aprendizaje deja para evitar repetirlo

PASO 6 — Verificar que el sistema está sano antes de continuar
  → Build pasa ✓
  → Tests pasan ✓
  → Docs sincronizados ✓
  → Solo entonces: continuar con el trabajo normal
```

---

## 🔬 SISTEMA DE MEGADIAGNÓSTICOS

> Revisiones periódicas que detectan degradación antes de que sea crítica.
> Un sistema sin revisiones se deteriora silenciosamente.
> La IA ejecuta estos diagnósticos según la frecuencia indicada.

### Diagnóstico de sesión — ejecutar al inicio de CADA sesión
```
Duración estimada: 2-3 minutos
Cuándo: obligatorio al inicio de cada conversación de trabajo

CHECK 1 — Integridad de docs
  [ ] STRUCTURE MAP coincide con archivos reales en disco
  [ ] SYMBOL INDEX coincide con funciones reales en código
  [ ] Estado de módulos en docs/modulos.md es correcto
  [ ] CURRENT SESSION STATE tiene información útil y reciente

CHECK 2 — Estado del sistema
  [ ] No hay BLOCKERS activos sin resolver
  [ ] No hay KNOWN ISSUES críticos sin plan de fix
  [ ] El último commit es estable (build y tests pasan)

CHECK 3 — Sincronización
  [ ] Hay cambios en código sin registrar en docs?
  [ ] Hay tareas completadas sin marcar en docs/tareas.md?
  [ ] Hay decisiones tomadas sin registrar en docs/decisiones.md?

RESULTADO:
  → Todo verde: continuar con la tarea
  → Algún rojo: corregir antes de continuar (LEY 5)
```

### Diagnóstico de módulo — ejecutar al completar cada módulo
```
Duración estimada: 5-10 minutos
Cuándo: antes de marcar un módulo como "completado"

CHECK 1 — Calidad del código
  [ ] Ninguna función supera 20 líneas
  [ ] Ningún archivo supera 200 líneas
  [ ] Sin magic numbers
  [ ] Sin any types
  [ ] Sin console.log
  [ ] Sin catch vacíos
  [ ] Sin lógica duplicada
  [ ] Sin más de 3 niveles de anidamiento

CHECK 2 — Tests
  [ ] Tests para cada función pública
  [ ] Tests de caso feliz, edge cases y errores
  [ ] Cobertura razonable (al menos funciones principales)
  [ ] Todos los tests pasan

CHECK 3 — Contratos
  [ ] El módulo solo expone lo que está en docs/modulos.md
  [ ] El módulo no accede a internos de otros módulos
  [ ] Los tipos del contrato coinciden con los definidos
  [ ] index.ts solo exporta las funciones públicas acordadas

CHECK 4 — Documentación
  [ ] Cabecera de archivo en todos los archivos
  [ ] Cabecera de funciones públicas
  [ ] SYMBOL INDEX actualizado
  [ ] STRUCTURE MAP actualizado
  [ ] Estado del módulo actualizado en docs/modulos.md

CHECK 5 — Deuda técnica
  [ ] Toda la deuda técnica generada está en docs/deuda-tecnica.md
  [ ] No hay TODOs en el código sin registrar

RESULTADO:
  → Todo verde: módulo marcado como completado, merge a develop
  → Algún rojo: no se marca como completado hasta resolverlo
```

### Diagnóstico de versión — ejecutar al cerrar cada versión (vX.Y.0)
```
Duración estimada: 15-20 minutos
Cuándo: antes de tagear una versión en git

CHECK 1 — Estado general
  [ ] Todos los módulos de esta versión en estado "completado"
  [ ] Todos los tests (unitarios e integración) pasan
  [ ] Build de producción sin errores ni warnings
  [ ] No hay BLOCKERS activos

CHECK 2 — Integridad completa del proyecto
  [ ] STRUCTURE MAP coincide exactamente con el filesystem real
  [ ] SYMBOL INDEX tiene todas las funciones y clases del proyecto
  [ ] docs/tareas.md refleja el estado real de todas las tareas
  [ ] docs/modulos.md tiene el estado correcto de todos los módulos
  [ ] docs/decisiones.md tiene todas las decisiones importantes
  [ ] docs/changelog.md tiene la entrada de esta versión

CHECK 3 — Deuda técnica
  [ ] docs/deuda-tecnica.md está actualizado
  [ ] Al menos una deuda técnica pagada en esta versión
  [ ] No hay deuda técnica crítica sin plan de resolución

CHECK 4 — Seguridad
  [ ] Sin credenciales en el código ni en el historial de git
  [ ] Variables de entorno documentadas en docs/seguridad.md
  [ ] Checklist de seguridad de docs/seguridad.md completado

CHECK 5 — Contratos entre módulos
  [ ] Todos los contratos en docs/arquitectura.md respetados
  [ ] Sin acceso a internos de módulos ajenos
  [ ] Sin dependencias circulares entre módulos

CHECK 6 — Rendimiento y calidad
  [ ] Sin funciones que superen 20 líneas en todo el proyecto
  [ ] Sin archivos que superen 200 líneas
  [ ] Sin lógica duplicada entre módulos

RESULTADO:
  → Todo verde: git tag vX.Y.0, actualizar docs/changelog.md
  → Algún rojo: no se taggea la versión hasta resolverlo
```

### Megadiagnóstico completo — ejecutar en momentos críticos
```
Duración estimada: 30-60 minutos
Cuándo ejecutar:
  - Al inicio de la fase de integración
  - Cuando el Protocolo de Recuperación ante Fallos lo indica
  - Cuando hay sospechas de inconsistencia generalizada
  - Al retomar un proyecto después de mucho tiempo sin tocarlo
  - Cuando cambia el arquitecto o el subagente principal

FASE 1 — Auditoría de filesystem vs docs
  Acción: listar todos los archivos reales del proyecto
  Verificar: ¿coincide exactamente con STRUCTURE MAP?
  Si no coincide:
    → Añadir archivos no documentados al STRUCTURE MAP
    → Investigar archivos en docs que no existen: borrar de docs
    → Investigar código huérfano (sin referencias): documentar o eliminar

FASE 2 — Auditoría de funciones vs SYMBOL INDEX
  Acción: listar todas las funciones y clases del proyecto
  Verificar: ¿coincide exactamente con SYMBOL INDEX?
  Si no coincide:
    → Añadir funciones no documentadas al SYMBOL INDEX
    → Eliminar del SYMBOL INDEX funciones que ya no existen
    → Funciones sin referencias en ningún módulo: documentar como dead code

FASE 3 — Auditoría de contratos entre módulos
  Acción: verificar cada contrato en docs/arquitectura.md
  Para cada contrato:
    [ ] La función existe realmente en el módulo origen
    [ ] La firma (tipos) coincide con lo documentado
    [ ] Los módulos destino la usan correctamente
    [ ] Nadie accede a internos del módulo origen
  Si hay desviaciones: ejecutar Protocolo de Conflicto entre Módulos

FASE 4 — Auditoría de tareas vs código
  Acción: revisar docs/tareas.md completo
  Verificar:
    [ ] Tareas marcadas como completadas: ¿el código las implementa?
    [ ] Tareas marcadas como pendientes: ¿hay código que las implementa?
    [ ] Tareas en progreso: ¿coincide con el trabajo real actual?
  Corregir cualquier discrepancia

FASE 5 — Auditoría de deuda técnica
  Acción: revisar docs/deuda-tecnica.md
  Para cada entrada:
    [ ] ¿Sigue existiendo en el código o ya fue pagada?
    [ ] ¿Tiene plan de resolución?
    [ ] ¿Su prioridad sigue siendo correcta?
  Actualizar estados

FASE 6 — Auditoría de calidad de código
  Acción: revisar una muestra representativa del código
  Verificar:
    [ ] Ninguna función supera 20 líneas
    [ ] Ningún archivo supera 200 líneas
    [ ] Sin magic numbers en módulos completados
    [ ] Sin lógica duplicada entre módulos
  Si hay violaciones: registrar en docs/deuda-tecnica.md

FASE 7 — Síntesis y plan de acción
  Documentar en AI NOTES:
    - Qué se encontró en el diagnóstico
    - Qué se corrigió durante el diagnóstico
    - Qué queda pendiente de corregir (con prioridad)
  Actualizar CURRENT SESSION STATE con el estado real post-diagnóstico
  Si el estado es crítico: notificar al arquitecto antes de continuar
```

### Calendario de diagnósticos recomendado
```
Diagnóstico de sesión    → SIEMPRE al inicio (obligatorio, sin excepciones)
Diagnóstico de módulo    → Al completar cada módulo (antes del merge)
Diagnóstico de versión   → Al cerrar cada versión (antes del tag git)
Megadiagnóstico completo → Al inicio de integración + cuando algo huele mal
```

---

## 📐 GUÍA DE ESTILO EMBEBIDA — SIEMPRE ACTIVA

> Esta guía se aplica a TODO el código de este proyecto, en TODO momento, en TODOS los lenguajes.
> No es opcional. No tiene excepciones. No existe código "provisional" que no la cumpla.
> Fuente: Guía EUPT-Zaragoza 2025/2026 + Clean Code (R. Martin) + KISS.
> Referencia con ejemplos completos: `docs/guia-estilo.md`

### NOMENCLATURA

**Variables, parámetros, propiedades**
- Nombres pronunciables y expresivos. camelCase si varias palabras.
- `posicionDerecha` ✅ — `pDer` ❌
- Booleanos: participios o sí/no — `estaActivo`, `tienePermiso`, `esValido`
- Índices de bucle simples: `i`, `j`, `k` son aceptables

**Constantes simbólicas**
- TODO_EN_MAYUSCULAS_CON_GUION_BAJO
- Nombre describe la misión, no el valor — `SEPARADOR_FECHA` ✅ — `BARRA` ❌
- NUNCA números mágicos directos en el código

**Funciones y métodos**
- Sin retorno: infinitivos — `calcularTotal()`, `guardarDatos()`
- Retornan booleano: participios/sí-no — `estaCompletado()`, `tieneFondos()`
- Retornan valor: sustantivos — `obtenerUsuario()`, `calcularMedia()`
- Máximo 4 parámetros. Más de 4 → crear objeto de parámetros.

**@usedBy y @critical — obligatorios en funciones compartidas**

Toda función usada por más de un módulo lleva en su JSDoc:
- `@usedBy` — lista de módulos o componentes que la llaman
- `@critical` — si cambiarla rompe 2 o más módulos simultáneamente

```typescript
/**
 * Determina si un hábito toca un día dado según su frecuencia.
 * @usedBy HoyTab, HabitSection, StatsPage, CoachPage
 * @critical Cambiar la lógica de retorno rompe Hoy + Stats + Coach simultáneamente.
 */
function habitDueOnDate(habit: Habit, date: Date): boolean
```

Protocolo: antes de modificar una función @critical → abrir docs/dependencias.md → revisar cada @usedBy → hacer el cambio → actualizar @usedBy.

**Clases**: PascalCase, sustantivos — `GestorTareas`, `ConexionBaseDatos`
**Archivos**: kebab-case — `gestor-tareas.ts`, `validador-formulario.ts`

---

### FORMATO

- Una sola instrucción por línea
- Siempre llaves `{}` en bloques, aunque sea una sola instrucción
- Máximo 80-100 caracteres por línea
- Sangrías: 2 espacios (JS/TS), 4 espacios (Python/Java/C++). NUNCA tabuladores.
- Líneas en blanco para separar secciones dentro de una función
- NUNCA más de 3 niveles de anidamiento → usar early returns

---

### TAMAÑOS MÁXIMOS — NUNCA SUPERAR

| Unidad | Máximo | Si se supera |
|--------|--------|--------------|
| Función / método | 20 líneas | Dividir en subfunciones |
| Clase | 400-500 líneas | Dividir en clases separadas |
| Archivo | 200 líneas | Dividir en archivos separados |
| Parámetros por función | 4 | Crear objeto de parámetros |
| Niveles de anidamiento | 3 | Early returns o extraer función |

---

### COMENTARIOS

- Comentarios aportan información que el código NO da por sí mismo. Nunca comentar obviedades.
- Cabecera OBLIGATORIA en cada archivo:
```
// nombre-archivo.ext
// Autor: [nombre]
// Versión 1.0 — YYYY-MM-DD — descripción inicial
// Versión 1.1 — YYYY-MM-DD — qué cambió
```
- Cabecera OBLIGATORIA en cada función/método público:
```
/**
 * Descripción de qué hace.
 * Qué devuelve o qué casos especiales tiene.
 */
```

---

### PRINCIPIOS DE DISEÑO — TODOS OBLIGATORIOS

| ID | Principio | Regla concreta |
|----|-----------|----------------|
| D01 | Diseño antes que código | Planos completos ANTES de escribir una línea |
| D02 | Legibilidad > eficiencia | Entre legible y rápido: siempre legible |
| D03 | Sin Copy&Paste | Código repetido → función. Una solución, un lugar. |
| D04 | Funciones pequeñas | Máximo 20 líneas. Una acción por función. |
| D05 | Clases pequeñas | Máximo 400-500 líneas. Una responsabilidad. |
| D06 | Sin optimización prematura | No optimizar hasta problema medido real |
| D07 | Caja negra | Ocultar implementación. Solo exponer lo necesario. |
| D08 | Excepciones solo para errores | `if` para lógica esperada. `try/catch` solo para errores reales. |
| D09 | Sin comparaciones redundantes | `if (estaActivo)` — NUNCA `if (estaActivo === true)` |
| D10 | Retorno directo de booleanos | `return a > b` — NUNCA `if(a>b){return true;}else{return false;}` |
| D11 | Una responsabilidad por clase | Si hace dos cosas → dividir en dos clases |
| D12 | Composición > herencia | Componer objetos en lugar de heredar cuando sea posible |
| D13 | Programación genérica | Funciones que resuelven la familia del problema |
| D14 | Patrón MVC | Separar Model (datos), View (UI), Controller (lógica) |
| D15 | Mínimo acoplamiento | Cada módulo conoce lo menos posible de los demás |

---

### PATRONES ABSOLUTAMENTE PROHIBIDOS

```
❌ any types (TypeScript)
❌ Números mágicos directos en código (usar constantes simbólicas)
❌ Comparaciones con == true o == false
❌ return redundante: if(x){return true;}else{return false;}
❌ Excepciones como control de flujo normal
❌ catch(e) {} vacío
❌ console.log / print de debug commiteado
❌ Credenciales o secretos en el código
❌ var (usar const / let)
❌ Más de 3 niveles de anidamiento
❌ Copy&Paste de código (extraer a función)
❌ Funciones de más de 20 líneas
❌ Archivos de más de 200 líneas
❌ Clases de más de 400 líneas
❌ Más de 4 parámetros por función
```

---

### REGLAS ESPECÍFICAS POR LENGUAJE

**TypeScript / JavaScript**
- `const` por defecto. `let` solo si se reasigna. Nunca `var`.
- `async/await` sobre `.then()`. No `any`. Tipos explícitos siempre.

**Java** ← lenguaje principal asignatura EUPT
- Javadoc obligatorio en clases y métodos públicos
- Una clase por archivo. Nombre archivo = nombre clase exactamente.
- Propiedades privadas por defecto.
- `for-each` sobre `for` con índice cuando sea posible.
- Declarar e inicializar variables al principio del método (salvo control de `for`).
- No usar excepciones como mecanismo de control de flujo.
- Seguir: https://google.github.io/styleguide/javaguide.html

**C++** ← también usado en asignatura EUPT
- Cabecera de archivo y de funciones públicas obligatorias.
- Sin `goto`. Sin variables globales salvo constantes.
- Siempre llaves `{}` aunque haya una sola instrucción.
- Seguir: https://gcc.gnu.org/codingconventions.html

**Python**
- Type hints obligatorios en funciones públicas.
- Docstrings en todas las funciones y clases públicas.
- Seguir PEP 8: https://peps.python.org/pep-0008/

---

### CHECKLIST DE CALIDAD — OBLIGATORIO ANTES DE ENTREGAR CUALQUIER CÓDIGO

> Si algún punto falla: corregir el código antes de entregar. Sin excepciones.

**Código**
- [ ] Cada función hace exactamente una cosa
- [ ] Ninguna función supera 20 líneas
- [ ] Ninguna clase supera 400 líneas
- [ ] Ningún archivo supera 200 líneas
- [ ] Sin nesting mayor de 3 niveles
- [ ] Sin lógica duplicada
- [ ] Sin magic numbers
- [ ] Sin `any` types (TypeScript)
- [ ] Sin `console.log` commiteado
- [ ] Sin credenciales en el código
- [ ] Sin `catch(e) {}` vacío
- [ ] Sin comparaciones con `true` o `false` explícitos
- [ ] Sin `var`
- [ ] Todos los paths de error manejados

**Documentación**
- [ ] Cabecera de archivo presente en todos los archivos
- [ ] Cabecera de funciones públicas presente
- [ ] Imports y variables sin usar eliminados

**Tests**
- [ ] Tests para caso feliz, edge cases y errores
- [ ] Todos los tests pasan

**Docs del proyecto**
- [ ] SYMBOL INDEX actualizado
- [ ] STRUCTURE MAP actualizado si aplica
- [ ] Estado del módulo actualizado en docs/modulos.md
- [ ] Decisiones registradas en docs/decisiones.md
- [ ] Commit con formato correcto

---

## 📋 IDENTIDAD DEL PROYECTO

| Campo | Valor |
|-------|-------|
| **Nombre** | Agenda Gamificada 3.0 |
| **Versión** | 0.1.0 |
| **Fase** | `planning` → listo para Fase 1 |
| **Tipo** | PWA móvil + desktop |
| **Lenguaje principal** | TypeScript |
| **Lenguajes secundarios** | CSS (inline via makeCSS), SQL |
| **Repositorio** | [pendiente — crear en GitHub] |
| **Deploy** | [pendiente — crear en Vercel] |
| **Última actualización** | 2026-06-04 |
| **Actualizado por** | AI sesión 1 |

---

## 🗂️ ÍNDICE DE DOCUMENTACIÓN

| Si la tarea es sobre... | Leer | Sección |
|------------------------|------|---------|
| Planos del sistema | `docs/arquitectura.md` | completo |
| Un módulo concreto | `docs/modulos.md` | solo su sección |
| Tareas y avance | `docs/tareas.md` | fase activa |
| Una decisión ya tomada | `docs/decisiones.md` | buscar por tema |
| Base de datos o API | `docs/datos.md` | tabla o endpoint |
| Seguridad o auth | `docs/seguridad.md` | completo |
| Estilo o convenciones | `docs/guia-estilo.md` | completo |
| Historial de cambios | `docs/changelog.md` | últimas entradas |
| Hoja de ruta y fases | `docs/plan-desarrollo.md` | fase activa |
| Deuda técnica | `docs/deuda-tecnica.md` | completo |
| Dependencias entre módulos | `docs/dependencias.md` | completo |

---

## 🛠 TECH STACK (resumen)

> Detalle completo y justificaciones en `docs/arquitectura.md`

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20.x |
| Framework | Next.js App Router | ^14 |
| Database | Supabase (PostgreSQL) | — |
| ORM / Query | @supabase/supabase-js | ^2 |
| Auth | Supabase Auth (email/password) | — |
| Styling | CSS inline via makeCSS() | — |
| AI Coach | Groq API — llama-3.3-70b-versatile | — |
| PWA | @ducanh2912/next-pwa | ^10 |
| Package manager | npm | — |
| Hosting | Vercel | — |
| CI/CD | GitHub → Vercel automático | — |

---

## 🧭 ESTADO ACTUAL DEL PROYECTO

| Campo | Valor |
|-------|-------|
| **Versión** | 0.1.0 |
| **Fase** | `planning` → listo para Fase 1 |
| **Módulos completados** | 0 / 10 |
| **Porcentaje global** | 0% |
| **Último diagnóstico** | 2026-06-04 — sesión 1 |
| **Salud del proyecto** | 🟢 sano — docs completos, sin código aún |

### Hitos
| Hito | Versión | Estado |
|------|---------|--------|
| Prototipo mínimo funcional | v0.1.0 | `pendiente` |
| Todos los módulos core | v1.0.0 | `pendiente` |

---

## 🚨 BLOCKERS ACTIVOS

| ID | Descripción | Módulo | Acción requerida | Desde |
|----|-------------|--------|-----------------|-------|
| — | Sin blockers | — | — | — |

---

## 🐛 KNOWN ISSUES

| ID | Estado | Descripción | Causa raíz | Fix planificado |
|----|--------|-------------|-----------|----------------|
| — | — | Sin issues conocidos | — | — |

---

## 🎯 CURRENT SESSION STATE

> ⚠️ Si este bloque dice "primera sesión" o está vacío → ejecutar Protocolo de Primera Sesión.
> Sobrescribir al inicio Y al final de cada sesión (LEY 7).
> Debe ser suficientemente concreto para que una IA nueva lo ejecute sin preguntar.

### Objetivo activo
Fase 0 completada. Iniciar Fase 1 — infraestructura base (M01 + M02).

### Estado detallado
- Feature list v1.0 definida y aprobada (2026-06-04)
- 10 módulos definidos con contratos TypeScript en docs/modulos.md
- Schema SQL completo en docs/datos.md (8 tablas + RLS)
- Plan de desarrollo en docs/plan-desarrollo.md (7 fases)
- Convención @usedBy/@critical activa — ver docs/dependencias.md
- Sin código escrito aún — todos los docs están listos

### Siguiente paso inmediato
1. Crear repositorio GitHub y conectarlo a Vercel
2. `npm create next-app@latest` con TypeScript
3. Ejecutar schema SQL de docs/datos.md en Supabase Dashboard
4. Empezar Fase 1: lib/types.ts PRIMERO (tipos antes de implementar)

### Pendiente de acción humana
- Crear repo en GitHub
- Crear proyecto en Vercel y vincularlo al repo
- Crear proyecto en Supabase y ejecutar schema de docs/datos.md
- Añadir variables de entorno en Vercel (ver docs/seguridad.md)

### Último commit estable
ninguno — proyecto no inicializado

### Último diagnóstico ejecutado
2026-06-04 — sesión 1 — planificación completa

---

## 🗒 AI NOTES

> Observaciones no obvias que cualquier IA necesita saber.
> Append-only. Formato: [YYYY-MM-DD] — observación.
> Incluir: bugs de entorno, comportamientos inesperados de librerías,
> patrones que NO funcionan aunque parezcan correctos, trampas del proyecto,
> hallazgos de megadiagnósticos.

[YYYY-MM-DD] — Proyecto inicializado con readmeAI v5.0. Todos los docs son plantillas vacías.

---

## 📂 EVOLUCIÓN DE ESTRUCTURA DE DOCS

> Este apartado define cuándo y cómo escalar la organización de la carpeta /docs.
> La IA verifica estos umbrales en cada Megadiagnóstico completo.
> No reorganizar antes de tiempo: la complejidad añadida tiene un coste real en tokens y navegación.

### Estructura actual (por defecto — hasta 15 archivos en /docs)

```
proyecto/
├── .readmeAI                  ← índice maestro + leyes + protocolos
└── docs/
    ├── plan-desarrollo.md
    ├── arquitectura.md
    ├── modulos.md
    ├── tareas.md
    ├── decisiones.md
    ├── datos.md
    ├── seguridad.md
    ├── guia-estilo.md
    ├── changelog.md
    └── deuda-tecnica.md
```

**Cuándo es suficiente**: menos de 15 archivos en /docs, navegación fluida, sin confusión sobre dónde está cada cosa.

---

### Estructura nivel 2 (cuando /docs supera 15 archivos)

**Señal de que hay que escalar**: la IA tarda más de un paso en encontrar el archivo correcto, o hay más de 15 archivos en /docs sin subcarpetas.

**Qué hacer**:
1. Notificar al arquitecto antes de reorganizar
2. Registrar la decisión en docs/decisiones.md
3. Crear subcarpetas numeradas
4. Mover archivos manteniendo los nombres
5. Actualizar TODAS las referencias en .readmeAI y en otros docs
6. Verificar que ningún enlace interno queda roto

```
proyecto/
├── .readmeAI
└── docs/
    ├── 0-planificacion/
    │   ├── plan-desarrollo.md     ← hoja de ruta lineal de fases
    │   └── decisiones.md          ← registro de decisiones de diseño
    ├── 1-arquitectura/
    │   ├── arquitectura.md        ← planos, estructura, contratos
    │   ├── modulos.md             ← detalle de cada módulo
    │   └── datos.md               ← esquema BD y contratos API
    ├── 2-desarrollo/
    │   ├── tareas.md              ← tareas, subtareas y avance
    │   ├── guia-estilo.md         ← convenciones de código
    │   └── deuda-tecnica.md       ← deuda técnica registrada
    └── 3-operaciones/
        ├── seguridad.md           ← auth, permisos, superficie de ataque
        └── changelog.md           ← historial de versiones
```

**Actualizar el índice de este archivo** con las nuevas rutas:

| Si la tarea es sobre... | Leer | Sección |
|------------------------|------|---------|
| Hoja de ruta y fases | `docs/0-planificacion/plan-desarrollo.md` | fase activa |
| Decisiones tomadas | `docs/0-planificacion/decisiones.md` | buscar por tema |
| Planos del sistema | `docs/1-arquitectura/arquitectura.md` | completo |
| Un módulo concreto | `docs/1-arquitectura/modulos.md` | solo su sección |
| Base de datos o API | `docs/1-arquitectura/datos.md` | tabla o endpoint |
| Tareas y avance | `docs/2-desarrollo/tareas.md` | fase activa |
| Estilo o convenciones | `docs/2-desarrollo/guia-estilo.md` | completo |
| Deuda técnica | `docs/2-desarrollo/deuda-tecnica.md` | completo |
| Seguridad o auth | `docs/3-operaciones/seguridad.md` | completo |
| Historial de cambios | `docs/3-operaciones/changelog.md` | últimas entradas |

---

### Estructura nivel 3 (proyectos muy grandes, +30 archivos en /docs)

**Señal de que hay que escalar**: subcarpetas de nivel 2 superan 8-10 archivos cada una, o hay módulos tan grandes que necesitan su propia documentación separada.

**Qué hacer**: cada módulo grande obtiene su propia subcarpeta dentro de `1-arquitectura/modulos/`.

```
proyecto/
├── .readmeAI
└── docs/
    ├── 0-planificacion/
    │   └── [igual que nivel 2]
    ├── 1-arquitectura/
    │   ├── arquitectura.md        ← visión global, no el detalle
    │   ├── datos.md
    │   └── modulos/
    │       ├── _indice.md         ← lista de todos los módulos y su estado
    │       ├── M01-[nombre].md    ← un archivo por módulo grande
    │       ├── M02-[nombre].md
    │       └── integracion.md     ← contratos y fase de integración
    ├── 2-desarrollo/
    │   ├── tareas/
    │   │   ├── _resumen.md        ← vista global de progreso
    │   │   ├── fase-0.md          ← tareas de planificación
    │   │   ├── fase-1.md          ← tareas de módulos base
    │   │   ├── fase-2.md          ← tareas de módulos secundarios
    │   │   ├── fase-3.md          ← tareas de integración
    │   │   └── fase-4.md          ← tareas de producción
    │   ├── guia-estilo.md
    │   └── deuda-tecnica.md
    └── 3-operaciones/
        └── [igual que nivel 2]
```

---

### Reglas de evolución

- **Nunca reorganizar sin aprobación del arquitecto**
- **Nunca reorganizar en mitad de una fase activa** — esperar a cerrar la versión actual
- **Siempre actualizar el índice de este archivo** después de reorganizar
- **Siempre verificar que no quedan referencias rotas** en otros docs tras mover archivos
- **Registrar la reorganización en docs/changelog.md** como entrada de tipo `chore`
- **La reorganización cuenta como Megadiagnóstico** — ejecutar el completo después

---

<!--
  ARQUITECTO.md v1.0 — END
  Autor: Acher Baos
  15 leyes · 7 protocolos · guía de estilo embebida · 4 niveles de diagnóstico · evolución de estructura
-->
