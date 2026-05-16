# 08 · STACK Y ESTIMACION DE DESARROLLO

## Decision principal

Para AIC2-Lector se recomienda construir una **web local-first**:

```txt
SvelteKit + TypeScript + Tailwind CSS + shadcn-svelte + Dexie/IndexedDB
```

Este stack prioriza:

- Rapidez de desarrollo.
- Poco codigo comparado con alternativas mas pesadas.
- Interfaz bonita y mantenible.
- Funcionamiento offline.
- Datos locales en el navegador.
- Posibilidad de crecer despues a backend, IA o sincronizacion sin rehacer todo.

## Por que este stack

### SvelteKit

Permite crear una app web moderna con rutas, layouts y estructura limpia. Es mas completo que usar solo Svelte + Vite, pero sigue siendo ligero. Conviene porque AIC2-Lector no sera una sola pantalla: tendra lector, SRS, estadisticas, textos, vocabulario, checkpoints y posiblemente writing despues.

### TypeScript

Evita errores cuando crezcan los modelos de datos: palabras, sesiones, textos, preguntas, reglas SRS, metricas y progreso.

### Tailwind CSS

Permite construir una interfaz profesional rapido, sin escribir CSS enorme desde cero.

### shadcn-svelte

Aporta componentes reutilizables: botones, tabs, dialogs, tables, cards, inputs, progress bars y menus. Esto ayuda a que el sistema se vea consistente desde la primera version.

### Dexie + IndexedDB

IndexedDB es la base local del navegador. Dexie simplifica su uso. Es mejor que LocalStorage para este proyecto porque AIC2-Lector guardara muchos datos:

- 10,000+ palabras pasivas.
- Historial SRS.
- Textos leidos.
- Sesiones cronometradas.
- Preguntas de comprension.
- Frases minadas.
- Metricas mensuales.

LocalStorage sirve para preferencias simples, pero no para la base principal.

## Backend

### Version 1

No requiere backend.

La app puede funcionar 100% en el navegador:

- Offline.
- Sin login.
- Sin servidor propio.
- Sin base de datos externa.
- Con export/import de backup en JSON.

### Cuando si conviene backend

Agregar backend solo cuando exista una necesidad real:

- Sincronizar entre dispositivos.
- Login de usuario.
- Backups automaticos en nube.
- IA con API keys protegidas.
- Compartir progreso.
- Multiusuario.

Para IA futura, SvelteKit permite agregar endpoints server-side sin cambiar la UI principal.

## Lo que NO conviene al inicio

- Next.js + PostgreSQL + Prisma: bueno, pero mas pesado para una app personal local-first.
- Tauri + SQLite: solido, pero ya no seria solo web; conviene despues si se quiere app instalada.
- Microservicios: innecesario.
- Kubernetes, colas, observabilidad completa: overkill.
- LocalStorage como base principal: demasiado limitado para datos de largo plazo.

## Arquitectura inicial sugerida

```txt
src/
  lib/
    db/              # Dexie, tablas, migraciones locales
    srs/             # algoritmo de repeticion espaciada
    reading/         # sesiones, wpm, comprension
    content/         # textos, vocabulario inicial, semillas
    stats/           # metricas y agregados
  routes/
    /                # dashboard principal
    /read            # lector cronometrado
    /srs             # repaso diario
    /vocabulary      # palabras y familias
    /texts           # biblioteca de textos
    /stats           # progreso y checkpoints
    /settings        # export/import, preferencias
```

## Estimacion de tiempo de desarrollo

La estimacion asume trabajo constante, sin buscar perfeccion extrema de diseno desde el dia 1.

| Version | Alcance | Tiempo estimado |
|---|---|---|
| MVP usable | Dashboard, SRS basico, lector, textos semilla, progreso simple, Dexie | 2-4 semanas |
| Version diaria | Import/export, preguntas, sesiones cronometradas, metricas, vocabulario por capas | 6-10 semanas |
| Version fuerte | Motor adaptativo, coverage por texto, sentence mining, portfolio mensual, checkpoints | 3-5 meses |
| Version completa C2 lectura | 10k palabras, AWL, tecnico-IA, exam mode, reportes, pulido UX | 6-12 meses |

## Estimacion por modulos

| Modulo | Tiempo |
|---|---|
| Setup SvelteKit + Tailwind + shadcn-svelte | 1-2 dias |
| Dexie y modelos locales | 2-4 dias |
| SRS basico | 3-5 dias |
| Lector cronometrado | 3-5 dias |
| Biblioteca de textos | 3-5 dias |
| Preguntas de comprension | 3-6 dias |
| Dashboard de progreso | 4-8 dias |
| Export/import JSON | 2-4 dias |
| Sentence mining | 1-2 semanas |
| Motor adaptativo | 2-4 semanas |
| Pulido visual y UX | continuo |

## Recomendacion final

Construir primero una version pequena pero real:

1. SRS diario.
2. Lector cronometrado.
3. Registro de palabras conocidas.
4. Textos A1/A2.
5. Metricas basicas.
6. Export/import.

Cuando esa version ya ayude a estudiar de verdad, se agregan modulos avanzados.

La meta no es crear una app enorme desde el inicio. La meta es tener una herramienta que Carlos use todos los dias y que pueda crecer sin romperse.
