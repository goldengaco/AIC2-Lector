# 🏛️ ARQUITECTURA WEB DETALLADA — AIC2-Lector

**Documento maestro de arquitectura técnica.**
**Objetivo:** llevar a Carlos de A0 a C2 lectura técnica con un sistema web local-first, adictivo y de alto rendimiento.
**Versión:** 2.0 — 2026-05-09
**Sustituye/complementa:** `01-ARQUITECTURA.md` y `08-STACK-Y-ESTIMACION.md` (compatibles, este los extiende y formaliza).

---

## 0. Resumen ejecutivo (60 segundos)

AIC2-Lector es una **aplicación web local-first** (todos los datos viven en IndexedDB del navegador, sin backend obligatorio) que ingiere los 40+ documentos ya creados (semillas, decks Anki, ejercicios, frases, tests) y los convierte en un sistema vivo de aprendizaje adaptativo.

Tres ideas centrales:

1. **El motor central es FSRS** (algoritmo moderno de repetición espaciada), envuelto en un **motor adaptativo** que decide en cada momento qué mostrar — vocabulario, lectura, morfología, gramática o sentence mining — según tu estado actual y tus puntos débiles.
2. **La adictividad no es decoración:** está diseñada como capa arquitectónica con bucle de Hook (Trigger → Acción → Recompensa Variable → Inversión), microvictorias cada 60-90 s, combos, racha sin culpa, "cerebro visual" que evoluciona, y forecasts personalizados.
3. **El alto rendimiento se consigue por arquitectura, no por trucos:** local-first elimina latencia de red, Web Workers sacan cómputo pesado del hilo principal, virtualización para listas de 10 k+ palabras, Service Worker para offline real, presupuesto estricto INP < 50 ms / LCP < 1 s.

Es **monousuario** (Carlos), **una sola instalación**, **cero coste de infra** en V1, **abierto a sincronización opcional** en V2 sin reescribir nada.

---

## 1. Principios arquitectónicos (no-negociables)

| # | Principio | Implicación práctica |
|---|-----------|----------------------|
| P1 | **Local-first** | IndexedDB es la única fuente de verdad. Sin red ≠ sin app. |
| P2 | **Latencia percibida < 100 ms en toda interacción** | Optimistic updates, prefetch, virtualización, Workers. |
| P3 | **Adictividad por diseño** | Cada vista responde tres preguntas: *¿qué gano hoy?*, *¿qué desbloqueo?*, *¿cómo soy mejor que ayer?* |
| P4 | **Cero idealismo** | Si una técnica no rinde en 4 semanas medidas, se descarta. La métrica manda. |
| P5 | **Pasividad de gramática** | Solo se reconoce; nunca se exige producir. La UI lo refleja. |
| P6 | **Composabilidad de motor** | SRS, adaptativo, mining y telemetría son módulos puros (testables sin DOM). |
| P7 | **Datos portables** | Todo exportable a JSON canónico. Cero lock-in. |
| P8 | **Escalable a backend sin reescritura** | Capa de repositorio abstrae Dexie; mañana puede ser PostgreSQL. |
| P9 | **Privacidad por defecto** | Telemetría local; nada sale del dispositivo salvo backup explícito. |
| P10 | **Sin culpa** | Streak con "pausa legítima". Notificaciones invitan, no castigan. |

---

## 2. Atributos de calidad (objetivos cuantificables)

| Atributo | Objetivo | Medición |
|----------|----------|----------|
| **Cold start (LCP)** | ≤ 1.0 s en máquina del usuario | Lighthouse + Real User Monitoring local |
| **Interacción (INP)** | ≤ 50 ms p95 en SRS, ≤ 80 ms en lector | Performance Observer |
| **Tiempo a primera tarjeta SRS** | ≤ 300 ms desde clic | Custom mark/measure |
| **Capacidad** | 10 000 palabras + 5 000 sesiones + 50 000 reviews sin degradación | Bench sintético |
| **Disponibilidad offline** | 100 % funcional sin red | Service Worker E2E test |
| **Tamaño bundle inicial** | ≤ 180 KB gzip | Bundle analyzer en CI |
| **Confiabilidad de datos** | 0 pérdidas en 1 000 sesiones simuladas | Test de migraciones + backup automático |
| **Portabilidad** | Backup completo en JSON < 5 MB | Export en CI |
| **Adictividad (proxy medible)** | Sesiones planeadas se extienden ≥ 30 % en promedio | Telemetría local (planned vs actual) |

---

## 3. Visión arquitectónica en capas

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAPA 5 · PRESENTACIÓN                        │
│   SvelteKit routes · Componentes Svelte 5 · Tailwind · shadcn-svelte │
│   Animaciones (motion-svelte) · Web Audio (feedback sutil)           │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                     CAPA 4 · APLICACIÓN (estado)                     │
│   Stores Svelte 5 (runes) · Use cases · Comandos · Selectores        │
│   Coordina dominio + UI. Gestiona transacciones de sesión.           │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                       CAPA 3 · DOMINIO (puro TS)                     │
│   FSRS engine · Adaptive engine · Sentence miner · Coverage analyzer │
│   Gamification engine · Reading session engine · Cero dependencias   │
│   de DOM, red o storage. 100 % testable con vitest.                  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                       CAPA 2 · REPOSITORIO                           │
│   Interfaz repositorio (Word, Text, Session, Morpheme, Grammar...)   │
│   Implementación Dexie. Mañana implementación remota sin tocar       │
│   capa 3. Migraciones versionadas.                                   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                  CAPA 1 · INFRAESTRUCTURA                            │
│   IndexedDB (Dexie) · Web Workers · Service Worker · Web Speech      │
│   File API (export/import) · OPFS (cache de audio futuro)            │
└─────────────────────────────────────────────────────────────────────┘

  ─────────  TRANSVERSAL  ─────────
  · Telemetría local (performance, hábitos, errores)
  · Sistema de eventos del dominio (event bus tipado)
  · Logger con niveles · Feature flags locales
```

**Por qué capas estrictas con dominio puro:** el conocimiento (FSRS, adaptación, ingesta, scoring) sobrevivirá al framework. Si en 3 años SvelteKit se sustituye por Solid o React 19, las capas 1-3 se reusan tal cual.

---

## 4. Stack técnico definitivo

### 4.1 Núcleo

| Componente | Elección | Razón |
|------------|----------|-------|
| **Framework** | **SvelteKit 2** (modo SPA, `adapter-static`) | Bundle pequeño, runes (Svelte 5) muy reactivos, build estático servible desde CDN o local |
| **Lenguaje** | **TypeScript 5.x estricto** | `strict: true`, `noUncheckedIndexedAccess`, modelos de 10 k palabras sin type errors |
| **Styling** | **Tailwind CSS v4** + **shadcn-svelte** | Iteración rápida, accesibilidad, sin CSS bespoke |
| **Reactividad de estado** | **Svelte 5 runes** (`$state`, `$derived`, `$effect`) | Reemplaza stores legacy, granularidad fina, menos boilerplate |
| **Persistencia local** | **Dexie.js 4** sobre IndexedDB | API limpia, observables, migraciones, índices compuestos |
| **SRS** | **FSRS-5** (`ts-fsrs`) | Estado del arte; mejor retención que SM-2 con ~25 % menos reviews |
| **Animaciones** | **motion-start/motion-svelte** + transiciones nativas | Feedback "jugoso" sin perder rendimiento |
| **Audio TTS** | **Web Speech API** (`SpeechSynthesis`) + voces nativas | Cero coste, funciona offline en macOS/Win/iOS |
| **Iconos** | **lucide-svelte** | Coherente con shadcn |
| **Charts** | **Chart.js** o **Layer Cake** (Svelte) | Gráficos de WPM, vocabulario, racha |

### 4.2 Build & DX

| Pieza | Elección | Razón |
|-------|----------|-------|
| **Bundler** | **Vite 5** (incluido en SvelteKit) | HMR < 50 ms |
| **Test unitario** | **Vitest** | Mismo motor que Vite |
| **Test E2E** | **Playwright** | Tests cross-browser + visual regression |
| **Linter/Formatter** | **Biome** | 20-50× más rápido que ESLint+Prettier |
| **Husky + lint-staged** | Pre-commit hooks | Cero rotura en main |
| **CI** | **GitHub Actions** (gratis para repo personal) | Lint, test, build, bench, bundle-size budget |
| **Deploy V1** | **Carpeta local + npm preview** o **Cloudflare Pages** | Cero infra; PWA instalable |

### 4.3 Computación pesada

| Tarea | Dónde corre | Tecnología |
|-------|-------------|------------|
| Cálculos FSRS de 10 k palabras al iniciar el día | **Web Worker** | `comlink` para RPC tipado |
| Análisis de cobertura de un texto (qué % conoces) | **Web Worker** | Tokenizer + lookup en Map |
| Generación de batch de tarjetas para sentence mining | **Web Worker** | NLP simple (regex + lemmatizer ligero) |
| Estadísticas mensuales agregadas | **Web Worker** | Reduce sobre sesiones |
| Render de gráficos | Hilo principal con `requestIdleCallback` | Chart.js + IntersectionObserver |

### 4.4 Lo que NO entra en V1

- ❌ Backend propio (Node/Express/Postgres) — solo si V2 requiere sync.
- ❌ LLM integrado en cliente — el sentence mining usa heurísticas + opcionalmente la API de OpenAI/Anthropic vía proxy *backend futuro*.
- ❌ Login/multiusuario — eres uno solo.
- ❌ Cloud storage — backup local en JSON descargable.
- ❌ Tauri/Electron — la web instalable como PWA es suficiente.

### 4.5 Roadmap de stack hacia V2 (sin reescribir)

Cuando te haga falta sync entre dispositivos o IA real:

- **Backend ligero:** Cloudflare Workers + D1 (SQLite) o Supabase. La capa de repositorio (P2 del diseño) ya está abstraída — solo se añade `RemoteRepository` y se sincroniza con Dexie vía CRDT simple (last-write-wins por timestamp del dominio).
- **IA tutor:** SvelteKit endpoint `/api/tutor` que llame a Anthropic/OpenAI con la API key en variable de entorno del Worker; cliente nunca ve la key.

---

## 5. Modelo de datos (Dexie / IndexedDB)

### 5.1 Tablas y esquema (versión 1)

```ts
// db.ts
import Dexie, { type Table } from 'dexie';

export class AICDB extends Dexie {
  // Núcleo de contenido
  words!:        Table<Word, string>;
  morphemes!:    Table<Morpheme, string>;
  grammar!:      Table<GrammarRule, string>;
  texts!:        Table<Text, string>;
  questions!:    Table<Question, string>;

  // Estado de aprendizaje (FSRS)
  cards!:        Table<Card, string>;          // 1 card por (item, lado)
  reviews!:      Table<Review, number>;        // append-only

  // Actividad de lectura
  readingSessions!: Table<ReadingSession, string>;
  minedSentences!:  Table<MinedSentence, string>;

  // Gamificación
  achievements!: Table<Achievement, string>;
  unlocks!:      Table<Unlock, string>;
  streakDays!:   Table<StreakDay, string>;     // 'YYYY-MM-DD' como id

  // Telemetría local
  events!:       Table<DomainEvent, number>;   // event sourcing ligero
  perfMetrics!:  Table<PerfMetric, number>;

  // Configuración
  prefs!:        Table<KV, string>;
  schemaMeta!:   Table<KV, string>;            // 'version', 'lastBackupAt'

  constructor() {
    super('aic2');
    this.version(1).stores({
      words:           'id, lemma, layer, cefr_level, frequency_rank, *roots, *prefixes, *suffixes',
      morphemes:       'id, type, cefr_level, origin',
      grammar:         'id, cefr_level, category',
      texts:           'id, cefr_level, genre, word_count, source',
      questions:       'id, text_id, type',
      cards:           'id, item_type, item_id, due, state, last_reviewed',
      reviews:         '++id, card_id, reviewed_at, rating, elapsed_ms',
      readingSessions: 'id, text_id, started_at, wpm',
      minedSentences:  'id, mined_at, source_type, *unknown_word_ids',
      achievements:    'id, unlocked_at, tier',
      unlocks:         'id, unlocked_at, kind',
      streakDays:      'id, active, minutes',
      events:          '++id, ts, type',
      perfMetrics:     '++id, ts, name',
      prefs:           'k',
      schemaMeta:      'k'
    });
  }
}
```

### 5.2 Tipos clave (extracto)

```ts
// Item de aprendizaje genérico → tarjeta SRS
interface Card {
  id: string;                   // `${item_type}:${item_id}:${face}`
  item_type: 'word' | 'morpheme' | 'grammar' | 'mined';
  item_id: string;
  face: 'recognize' | 'meaning' | 'pattern';
  // Estado FSRS
  state: 0 | 1 | 2 | 3;          // New, Learning, Review, Relearning
  difficulty: number;            // D ∈ [1, 10]
  stability: number;             // S en días
  reps: number;
  lapses: number;
  due: number;                   // epoch ms
  last_reviewed?: number;
  scheduled_days?: number;
}

interface Review {
  id?: number;
  card_id: string;
  reviewed_at: number;
  rating: 1 | 2 | 3 | 4;         // Again, Hard, Good, Easy
  elapsed_ms: number;
  state_before: number;
  state_after: number;
}

interface ReadingSession {
  id: string;
  text_id: string;
  started_at: number;
  finished_at: number;
  duration_ms: number;
  words_read: number;
  wpm: number;
  comprehension_score: number;
  mode: 'free' | 'metronome' | 'rsvp';
  // Métrica derivada para feedback inmediato
  delta_wpm_vs_30d_avg?: number;
}

interface DomainEvent {
  id?: number;
  ts: number;
  type: string;                  // 'card.reviewed', 'text.completed', 'streak.bonus'
  payload: unknown;              // tipado por tipo en runtime via discriminated union
}

interface StreakDay {
  id: string;                    // 'YYYY-MM-DD'
  active: boolean;
  minutes: number;
  legitimate_pause: boolean;     // ⭐ no rompe la racha
}
```

### 5.3 Índices estratégicos

- `cards.due` permite query *"dame las próximas 50 tarjetas vencidas"* en O(log n).
- `words.layer + cefr_level` permite *"siguientes 10 palabras A2 técnicas"*.
- `*roots` (multi-entry) permite *"todas las palabras con la raíz `port`"*.
- `reviews.reviewed_at` para agregaciones temporales (gráficos).
- `events.ts + type` para reconstrucción de cualquier estado por replay.

### 5.4 Migraciones

Cada cambio de schema añade una `version(N).stores({...}).upgrade(tx => ...)`. Siempre hacia adelante; nunca destructivo. Si una migración falla, se *fallback* a backup JSON automático que se hace antes de cada upgrade (`schemaMeta.lastBackupAt`).

### 5.5 Backup y portabilidad

- **Auto-backup local**: cada 7 días, vuelca a OPFS un JSON comprimido con todo el estado.
- **Export manual**: botón en `/settings` → archivo `aic2-backup-YYYY-MM-DD.json.gz`.
- **Import**: drop del archivo → diff → confirmar → reemplaza estado.
- **Schema version embebido** → import seguro entre versiones.

---

## 6. Capa de dominio (motores)

### 6.1 Motor SRS — FSRS-5

**Por qué FSRS** (no SM-2 como mencionaba el doc original):

- SM-2 (Anki clásico, lo que asume `03-VOCABULARIO-ESTRATEGIA.md` §"Algoritmo SRS específico") tiene ~30 años, sobre-revisa lo que ya sabes.
- FSRS modela explícitamente *retrievability, stability, difficulty* y se calibra con tus reviews reales. En estudios independientes (Wozniak, Jarrett, etc.) reduce el número de reviews necesarias 20-30 % para la misma retención.
- Implementación tipada existe (`ts-fsrs`), MIT licensed, 0 deps.

**Adaptaciones específicas para Carlos** (heredadas del diseño existente):

| Caso | Ajuste |
|------|--------|
| `cognate_type === 'cognate'` (cognado puro) | `initial_stability *= 7` (cognados saltan al intervalo de 7 d) |
| `cognate_type === 'false-cognate'` (falso amigo) | `initial_stability *= 0.5` y se marca con badge rojo en UI |
| Familia AWL (acoplamiento) | Si respondes Good/Easy a `analyze`, las cartas de `analysis, analytic, analyst` reciben `learn_steps` saltado y entran en review con `D = D_base + 0.5` |
| Sentence-mined card | Bonus inicial: `S = 1.5` (porque tiene contexto emocional → mayor retención) |

**Interfaz pública del motor**:

```ts
interface FsrsEngine {
  schedule(card: Card, rating: 1|2|3|4, now: number): { card: Card; review: Review };
  forecast(card: Card, days: number): { ts: number; retrievability: number }[];
  getDue(now: number, limit: number): Promise<Card[]>;
  // Telemetría: el motor publica eventos al event bus
}
```

### 6.2 Motor adaptativo — qué mostrar a continuación

**Problema:** en cada sesión hay decenas de candidatos: revisar SRS, leer texto nuevo, lección de morfología, gramática pasiva, sentence mining. ¿Qué maximiza progreso *sin aburrir*?

**Solución:** combinación de **reglas duras** + **bandit multi-brazo (Thompson sampling)** sobre tipos de actividad.

```
Reglas duras (orden de prioridad):
  1. Si hay cards con due ≤ now y count ≥ 15 → SRS (15-25 min, hasta vaciar pendientes críticas).
  2. Si la racha está en peligro hoy (queda < 2 h del día) → microsesión de rescate (5 min).
  3. Si es día de checkpoint (cada 4 sem.) → test calibrado.
  4. Si hay un nuevo tag de morfología desbloqueado → lección breve (10 min).

Cuando ninguna regla aplica → bandit decide entre:
  - "Texto nuevo del día"  (refuerza lectura)
  - "Sentence mining"      (refuerza tu dominio)
  - "Lección de gramática" (refuerza pasiva)
  - "Speed drill"          (RSVP / metrónomo)

Recompensa observada por brazo:
  - Comprehension score - baseline
  - WPM delta vs media móvil 30 d
  - Engagement: ¿extendiste sesión? ¿abandonaste?
  - Consolidation: ¿qué % de palabras vistas hoy se recordaron 7 d después?

Cada acción tiene un Beta(α, β); Thompson elige muestreando.
```

Esto evita el "efecto Duolingo" (mismas lecciones repetitivas) sin caer en aleatoriedad pura.

### 6.3 Sentence Miner

```
Entrada: párrafo o frase pegada por el usuario (paper, error, doc).
Pipeline (Web Worker):
  1. Tokenizar (regex unicode-aware + reglas para contracciones).
  2. Lematizar (tabla pre-construida en build de ~80 k pares).
  3. Para cada lema, lookup en Map<lemma, Word>.
  4. Clasificar:
       a) Conocido → ignorar.
       b) Conocido pero "débil" (S < 7 días) → review boost.
       c) Desconocido → crear Word{ layer: 'mined' } + Card.
  5. Devolver resumen UI: "3 conocidas, 1 débil, 2 nuevas → 2 cartas creadas".
```

**Latencia objetivo:** < 200 ms para párrafo de 200 palabras.

### 6.4 Coverage analyzer (para textos)

Antes de mostrarte un texto, calcula:

- **% de palabras conocidas** en tu vocab actual.
- **% de palabras desconocidas** que están en capa 1 (frecuencia) vs capa 3 (técnica) vs capa 4 (mined).
- **Densidad léxica** y longitud media de oración.
- **Veredicto:** "Recomendado: 92 % cobertura, 8 palabras nuevas → ideal para hoy".

Si cobertura < 85 %, el motor adaptativo lo descarta y sugiere uno más fácil. Si > 98 %, lo descarta por aburrido y sugiere uno más retador.

### 6.5 Reading session engine (M3)

Tres modos:

- **Free**: lees, mide tiempo, post-test → wpm.
- **Metronome**: barra avanza palabra por palabra a `target_wpm`. Empezamos en `0.85 × wpm_actual`, sube 5 % cada sesión.
- **RSVP** (Rapid Serial Visual Presentation): palabras una a una en el centro a `target_wpm`. Útil para romper subvocalización ≤ B1.

Cada sesión:

```
on_start  → emit('reading.started', { text_id, mode })
on_word   → mark performance.measure (para detectar pausas)
on_finish → engine.compute_wpm()
          → engine.show_questions()
          → on_answers → emit('reading.completed', { wpm, comprehension })
          → adaptive.observe(reward)
          → gamification.maybe_award(combo, xp)
```

### 6.6 Gamification engine

Ver §7 — es lo bastante grande para tener su propia sección.

---

## 7. Capa de adictividad (diseño profundo)

> "El sistema solo funciona si es adictivo. 'Debo estudiar' es fracaso. 'Quiero estudiar' es éxito." — `00-MISION.md` §6

Tomamos el **Hook Model** de Nir Eyal y lo cableamos en cada flujo:

```
        ┌──────────────────────────────────────┐
        │            TRIGGER (externo / interno) │
        │  Notificación · email matinal · habit  │
        └──────────────────┬───────────────────┘
                           ▼
        ┌──────────────────────────────────────┐
        │                ACCIÓN                  │
        │  Apertura instantánea (< 300 ms)       │
        │  Primera tarjeta visible YA            │
        └──────────────────┬───────────────────┘
                           ▼
        ┌──────────────────────────────────────┐
        │       RECOMPENSA VARIABLE              │
        │  · De la tribu (XP, ranking vs ayer)   │
        │  · De la caza (palabra rara, level up) │
        │  · Del yo (wpm subió, mastery ↑)       │
        └──────────────────┬───────────────────┘
                           ▼
        ┌──────────────────────────────────────┐
        │              INVERSIÓN                 │
        │  Cada review enriquece tu modelo →     │
        │  Mañana es más personalizado y mejor   │
        └──────────────────┬───────────────────┘
                           │
                           └──→ vuelve al trigger
```

### 7.1 Mecánicas concretas

| # | Mecánica | Detalle |
|---|----------|---------|
| 7.1.1 | **XP y niveles del jugador** | XP por review correcta, bonus por combo, XP doble en weekends. Cada nivel desbloquea cosa real (un tipo de texto, un papel, un tema). |
| 7.1.2 | **Combo system** | 5 correctas seguidas → ⚡ Combo x2; 10 → x3. Se rompe con 1 fallo. Visible en tiempo real con micro-animación. |
| 7.1.3 | **Critical hit (variable reward)** | 1 % de cards al revisar dan x10 XP con animación dorada. Probabilidad baja → dopamina alta. |
| 7.1.4 | **Loot box semanal** | Cada 7 d activos → "Caja de Conocimiento": un paper curado, un easter egg, un dato sobre tu progreso. Sorpresa por diseño. |
| 7.1.5 | **Cerebro de inglés visual** | Una visualización (3 anillos: vocab, gramática, lectura) que crece sesión a sesión. Antes-después semanal. |
| 7.1.6 | **Forecast personalizado** | "Si mantienes este ritmo, llegas a B1 el 23 de octubre 2026". Calculado del bandit + media móvil. |
| 7.1.7 | **Streak con pausa legítima** | Te ausentaste 3 días → "Pausa legítima detectada. Tu progreso está intacto". CERO culpa. La racha computa días activos, no días consecutivos puros. |
| 7.1.8 | **Microvictorias** | Cada 60-90 s: toast pequeño *"+12 XP · vocab técnico"*. Dopamina constante, no esperar a fin de sesión. |
| 7.1.9 | **Auto-rivalidad** | "Eres 23 % más rápido que hace 30 días". Comparación solo contigo mismo (no leaderboards reales). |
| 7.1.10 | **Sound design opcional** | Click sutil al acertar, glow al subir nivel. Toggle off por defecto si molesta. |
| 7.1.11 | **Quest diaria de 5 min** | Aunque solo tengas 5 min, hay una micro-misión clara: *"Repasa 8 cartas"*. Hecho → racha mantenida. |
| 7.1.12 | **Mensaje de cierre adictivo** | Al cerrar, frase tipo *"Mañana tienes 14 cartas frescas y un paper que vas a leer 18 wpm más rápido. 🎯"*. Ancla anticipación. |

### 7.2 Anti-patrones (lo que NO haremos)

- ❌ Vidas/corazones (Duolingo) → genera ansiedad, viola "sin culpa".
- ❌ Notificaciones agresivas → generan culpa al ignorarlas.
- ❌ Leaderboards públicos → no aplica (eres uno).
- ❌ Pay-to-win / micropagos → no es modelo de negocio.
- ❌ Diseño de retención que aliena progreso real → la métrica es dominio C2, no minutos en app.

### 7.3 Cómo se mide que la adictividad *funciona*

```
KPI primario: Lift de tiempo planeado vs real
   Si planeas 15 min y haces 22 → +47 % lift → adictividad sana.

KPI secundario: Frecuencia de retorno espontáneo
   Sesiones del usuario abriendo la app sin trigger externo / total sesiones.

Anti-KPI: Sesiones < 3 min seguidas de abandono
   Indica frustración. Si sube > 20 % semana, se revisa la fricción.
```

Esto se computa contra `events` (event sourcing) sin enviar nada fuera del dispositivo.

---

## 8. Capa de presentación

### 8.1 Mapa de rutas (SvelteKit)

```
src/routes/
├─ +layout.svelte                   shell global, navegación, toaster
├─ +page.svelte                     /  Dashboard "Hoy"
├─ srs/
│  └─ +page.svelte                  /srs  Modo de repaso (focus mode)
├─ read/
│  ├─ +page.svelte                  /read  biblioteca
│  └─ [text_id]/+page.svelte        sesión de lectura (free/metro/rsvp)
├─ vocabulary/
│  ├─ +page.svelte                  /vocabulary  exploración por capas
│  └─ [word_id]/+page.svelte        ficha de palabra (raíces, ejemplos, sesión)
├─ morphology/
│  └─ +page.svelte                  /morphology  raíces y prefijos
├─ grammar/
│  └─ +page.svelte                  /grammar  reglas pasivas
├─ mining/
│  └─ +page.svelte                  /mining  pega frase, mina vocabulario
├─ stats/
│  ├─ +page.svelte                  /stats  WPM, vocab, racha, forecast
│  └─ [phase]/+page.svelte          análisis por fase
├─ checkpoints/
│  └─ +page.svelte                  /checkpoints  tests CEFR
├─ achievements/
│  └─ +page.svelte                  /achievements  logros y "loot boxes"
└─ settings/
   └─ +page.svelte                  /settings  export/import, preferencias
```

### 8.2 Pantallas clave (resumen UX)

#### Dashboard "Hoy"

```
┌────────────────────────────────────────────────────┐
│  Buenos días, Carlos · día 47 · racha 12 ✦         │
├────────────────────────────────────────────────────┤
│                                                     │
│   🧠 [Cerebro evolutivo: 3 anillos]                  │
│   Vocab 1 247 / 4 000  ·  Vel. 92 wpm  ·  A2-      │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Quest del día (12 min)                        │  │
│  │ ▸ Repasar 14 cartas vencidas                  │  │
│  │ ▸ Leer "Ollama README" (8 min, 94 % cob.)    │  │
│  │ ▸ Loot box disponible 🎁 (cada 7 días)        │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  Forecast: B1 estimado el 23 oct 2026 ▸            │
└────────────────────────────────────────────────────┘
```

#### SRS focus mode

- Tarjeta gigante centrada. Atajo: 1=Again, 2=Hard, 3=Good, 4=Easy.
- Combo bar en esquina. Critical hit con flash sutil.
- Al final: animación de XP + "+1 nivel desbloqueado: textos B1 técnicos".

#### Lector cronometrado

- Modo *free*: stopwatch arriba, texto justo, 5 preguntas al final.
- Modo *metronome*: barra de luz baja por las palabras. Velocidad ajustable con `+`/`-`.
- Modo *RSVP*: pantalla limpia, palabra centrada, foco máximo.

#### Mining

- Textarea grande, pega contenido, submit.
- En 200 ms: tabla de palabras detectadas con clasificación. 1 click → crea cards.

### 8.3 Estado y stores

Con runes (Svelte 5):

```ts
// lib/stores/srs.svelte.ts
class SrsStore {
  due = $state<Card[]>([]);
  current = $state<Card | null>(null);
  combo = $state(0);
  xpToday = $state(0);

  async loadDue() { /* worker call */ }
  async rate(rating: 1|2|3|4) {
    const result = await worker.schedule(this.current!, rating);
    this.combo = rating >= 3 ? this.combo + 1 : 0;
    this.xpToday += xpFor(rating, this.combo);
    /* gamification.evaluate(...) */
  }
}
export const srs = new SrsStore();
```

### 8.4 Accesibilidad

- Atajos de teclado en todas las pantallas críticas (SRS, lector).
- Tamaño de fuente ajustable (14-22 px) y modo dyslexic-friendly (OpenDyslexic opcional).
- Contraste WCAG AA mínimo, AAA en lectura.
- Aria-live para feedback de combo/xp.
- Soporte de lector de pantalla en SRS.

---

## 9. Performance, offline y observabilidad

### 9.1 Presupuesto de performance (verificado en CI)

| Métrica | Objetivo | Cómo se valida |
|---------|----------|----------------|
| Bundle inicial gzip | ≤ 180 KB | `vite-bundle-visualizer` + size-limit gate |
| Tiempo a Interactive en cold start | ≤ 1.5 s | Lighthouse en CI |
| INP p95 en SRS | ≤ 50 ms | `performance.measure` + assert en E2E |
| Memory después de 1 h sesión | ≤ 120 MB | Chrome DevTools profile en E2E |
| FCP cold | ≤ 0.8 s | Lighthouse CI |
| Lectura en lector grande (10 k palabras) | scroll 60 fps | Test con throttling |

### 9.2 Estrategias

- **Code-splitting por ruta:** SvelteKit lo hace nativo. `/read/[id]` no descarga código de `/srs`.
- **Critical CSS inline** + Tailwind purge agresivo.
- **Imágenes (futuras):** AVIF + lazy + `loading="lazy"`.
- **Virtualización en listas largas** (`/vocabulary`, `/checkpoints`): `svelte-virtual` para 10 000+ filas a 60 fps.
- **Debounce + RAF** en interacciones costosas (slider de wpm, búsqueda en vocab).
- **Workers para todo cómputo > 16 ms.**
- **Prefetch agresivo:** al pasar mouse sobre link de texto, prefetch del payload.

### 9.3 Service Worker (offline real)

```
Cache strategy:
  · App shell (HTML/JS/CSS): stale-while-revalidate
  · Datos IndexedDB: nativos (no necesitan SW)
  · Audio TTS: cache-first si se descarga para offline
  · Fuentes: cache-first long-term

Fallback offline: pantalla "Estás offline pero todo funciona".
```

PWA instalable → ícono en escritorio/móvil → se siente como app nativa.

### 9.4 Telemetría local (privada)

Tabla `events` + `perfMetrics` registra:

- Latencias de cada interacción crítica.
- Tiempos de sesión planeados vs reales.
- Combos máximos, XP por sesión.
- Errores de runtime (con stack truncado, sin PII).

Pantalla `/stats` lee y agrega. **Nada sale del dispositivo.** Si V2 añade sync, será opt-in con consentimiento explícito.

---

## 10. Pipeline de ingesta del contenido existente

Tienes ya 40+ archivos. La app no debe duplicar contenido en commits ni pedirte que pegues nada. **Build-time ingestion**: un script lee los archivos del repo y produce JSON canónico que se importa a Dexie en la primera apertura.

### 10.1 Script `scripts/ingest.ts`

```
ingest/
  parsers/
    anki.ts           lee ANKI-DECK-*.txt (TSV) → Word[]
    semillas.ts       lee semillas/*.md (markdown) → Word[] / Morpheme[]
    ejercicios.ts     lee EJERCICIOS-*.md → Question[]
    frases.ts         lee FRASES-*.md → Text[] cortos / examples
    tests.ts          lee TESTS-*.md → Checkpoint[]
    fases.ts          lee FASE-*.md → metadata por fase
  emit/
    seed.json         consolidado (versionado, ~3-5 MB)
```

### 10.2 Flujo en cliente

```
on first run:
  if !schemaMeta.seeded:
     fetch('/seed.json') → bulkPut → schemaMeta.seeded = true
on app update:
  if seed.version > schemaMeta.seedVersion:
     diff & merge (no destructivo) → upgrade
```

Esto convierte tus 40+ docs en datos vivos sin que tengas que mantener dos copias.

### 10.3 Mapeo concreto

| Archivo origen | Tipo destino | Cantidad estimada |
|----------------|--------------|-------------------|
| `ANKI-DECK-80-VERBOS-IMPERATIVOS.txt` | Word (layer=general) | 80 |
| `ANKI-DECK-500-COGNADOS.txt` | Word (cognate_type=cognate, layer=general) | 500 |
| `ANKI-DECK-GRAMATICA-COMPLETA.txt` | GrammarRule | 50 |
| `ANKI-DECK-VOCABULARIO-IA-TECH-NEGOCIO.txt` | Word (layer=technical-ia) | 330 |
| `semillas/01-cognados-top-200.md` | Word (cognate) | 200 |
| `semillas/02-morfologia-prefijos-sufijos-raices.md` | Morpheme | 200 |
| `semillas/03-academic-word-list-categorias.md` | Word (layer=awl) | 570 familias × ~5 formas |
| `semillas/04-tecnico-ia-200.md` | Word (layer=technical-ia) | 200 |
| `EJERCICIOS-SEMANA-*.md` | Question + Text cortos | 300+ |
| `FRASES-MODELO-*.md` | Text cortos + ejemplos | 300+ |
| `TESTS-Y-CHECKPOINTS-*.md` | Checkpoint | 13 |
| `FASE-*.md` | Phase metadata | 13 |

**Resultado tras ingesta:** ~960 Words + 200 Morphemes + 50 GrammarRules + 300+ Texts + 300+ Questions + 13 Checkpoints. Listo para el día 1.

---

## 11. Roadmap de implementación (5 hitos)

### Hito 0 — Fundación (semana 1)
- Setup SvelteKit + TS + Tailwind + shadcn-svelte + Biome + Vitest + Playwright.
- Dexie con schema v1 + 3 entidades clave (Word, Card, Review).
- Script `ingest` para Anki decks (80 verbos + 500 cognados).
- CI con bundle-size budget.
- **Entregable verificable:** abres la app, ves 580 palabras importadas, puedes hacer una review SRS y se persiste tras recargar.

### Hito 1 — MVP funcional (semanas 2-4)
- FSRS-5 integrado en Worker.
- Dashboard "Hoy" con quest diaria.
- SRS focus mode (atajos, combos básicos).
- Lector free-mode con cronómetro y 1 set de preguntas.
- Telemetría local activa.
- Backup/restore JSON.
- **Verificable:** una semana de uso real con dogfooding diario; sesiones registradas con WPM medible.

### Hito 2 — Adictividad real (semanas 5-8)
- XP, niveles, combos, critical hits, loot boxes, achievements.
- Cerebro visual evolutivo.
- Forecast personalizado.
- Streak con pausa legítima.
- Notificaciones (Push API local + email opt-in).
- **Verificable:** lift planeado vs real ≥ 30 % en 2 semanas medidas.

### Hito 3 — Motor adaptativo + mining (semanas 9-12)
- Bandit Thompson sampling sobre tipos de actividad.
- Sentence miner con worker (≤ 200 ms en 200 palabras).
- Coverage analyzer.
- Lector con metronome y RSVP.
- **Verificable:** % comprensión sube vs MVP; sesiones más variadas por bandit observable en `/stats`.

### Hito 4 — Material auténtico + checkpoints (semanas 13-16)
- Ingesta de los 13 checkpoints como exámenes ejecutables.
- Catálogo de textos auténticos (BBC LE, VoA, blogs) con coverage analyzer.
- Vista por fase con criterios de avance automáticos.
- **Verificable:** primer test A0→A1 ejecutado dentro de la app, score guardado, recomendación a A1→A2.

### Hito 5 — Pulido C2 (continuo)
- Vocabulario técnico-IA completo (capa 3 plena).
- AWL ingestada al 100 %.
- Optimización fina de FSRS con tus reviews reales.
- Soporte para lectura de papers (PDF inline → tokenizer → coverage).
- IA opcional (Claude API vía endpoint server) para explicaciones bajo demanda.

---

## 12. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Sobreingeniería antes del Hito 1 | Alta | Alto | Time-box hitos. Hito 0 ≤ 1 sem o se replantea. |
| FSRS calibrado pobremente al inicio | Media | Medio | Parámetros por defecto del paper hasta tener 200 reviews; recalibración mensual. |
| IndexedDB se corrompe | Baja | Alto | Auto-backup semanal + manual + checksum del seed |
| Aburrimiento de gamificación tras 3 meses | Media | Alto | Refresh de loot boxes y nuevos achievements cada milestone CEFR |
| Dispersión por intentar todo a la vez | Alta | Alto | Roadmap estricto; cada Hito tiene "no construir X". |
| Pérdida de motivación durante plateau B1→B2 | Alta (típico) | Alto | UI específica para plateau: cambia métrica visible (de wpm a comprensión profunda). |
| Bundle crecer sin control | Media | Medio | size-limit en CI, falla build si > 180 KB |

---

## 13. Decisiones arquitectónicas registradas (ADR-style, resumen)

| # | Decisión | Alternativas descartadas | Razón |
|---|----------|--------------------------|-------|
| ADR-1 | SvelteKit en modo SPA estático | Next.js, Solid, Astro | Bundle pequeño + DX excelente + adapter-static = 0 infra |
| ADR-2 | IndexedDB vía Dexie | LocalStorage, SQLite-WASM, Tauri+SQLite | LocalStorage no escala; SQLite-WASM bundle pesado; Tauri no es "web" |
| ADR-3 | FSRS-5 | SM-2 (Anki clásico), Leitner | Mejor retención por review demostrada |
| ADR-4 | Sin backend en V1 | Supabase, Firebase, Express+PG | Eres un usuario; añadir red mata performance percibida |
| ADR-5 | Web Workers vía Comlink | Mensajería manual postMessage | Tipos compartidos, código limpio |
| ADR-6 | TypeScript estricto | JS puro | Schema de 10 k palabras es ingobernable sin tipos |
| ADR-7 | Tailwind v4 + shadcn-svelte | CSS Modules, vanilla CSS, Bootstrap | Iteración 5× más rápida en personal app |
| ADR-8 | Telemetría 100 % local | Plausible/Posthog | Privacidad por defecto, P9 |
| ADR-9 | Hook Model como capa explícita | Ad-hoc | Mensurable, evolucionable, evita mecánicas tóxicas |
| ADR-10 | Repositorio abstracto | Acceso directo a Dexie | Permite V2 con sync sin reescribir dominio |

---

## 14. Estructura del proyecto

```
aic2-lector/
├─ src/
│  ├─ lib/
│  │  ├─ domain/
│  │  │  ├─ srs/                 ← FSRS + adaptaciones
│  │  │  ├─ adaptive/            ← reglas + bandit
│  │  │  ├─ reading/             ← session, wpm, RSVP, metronome
│  │  │  ├─ mining/              ← tokenizer + lemmatizer + classifier
│  │  │  ├─ coverage/            ← analyzer de textos
│  │  │  ├─ gamification/        ← XP, combos, achievements, hook
│  │  │  └─ events/              ← bus tipado, event sourcing
│  │  ├─ db/
│  │  │  ├─ schema.ts            ← Dexie tables
│  │  │  ├─ migrations/          ← v1 → vN
│  │  │  └─ repositories/        ← WordRepo, CardRepo, ...
│  │  ├─ workers/
│  │  │  ├─ srs.worker.ts
│  │  │  ├─ mining.worker.ts
│  │  │  └─ stats.worker.ts
│  │  ├─ stores/                 ← runes-based stores por feature
│  │  ├─ components/
│  │  │  ├─ ui/                  ← shadcn-svelte primitives
│  │  │  ├─ srs/
│  │  │  ├─ reader/
│  │  │  ├─ vocab/
│  │  │  ├─ stats/
│  │  │  └─ feedback/            ← toasts, combos, level-up
│  │  ├─ a11y/                   ← keyboard, focus management
│  │  ├─ telemetry/
│  │  └─ utils/
│  ├─ routes/                    ← ver §8.1
│  ├─ service-worker.ts
│  └─ app.html
├─ scripts/
│  └─ ingest/                    ← parser por tipo de archivo origen
├─ static/
│  └─ seed.json                  ← generado por ingest, versionado por hash
├─ tests/
│  ├─ unit/                      ← Vitest sobre dominio puro
│  ├─ integration/               ← Dexie con fake-indexeddb
│  └─ e2e/                       ← Playwright
├─ docs/
│  └─ adr/                       ← cada ADR detallada
├─ vite.config.ts
├─ svelte.config.js
├─ biome.json
└─ package.json
```

---

## 15. Cómo este diseño cumple cada requisito del usuario

| Requisito de Carlos | Cómo se cumple |
|---------------------|----------------|
| "lea todos los archivos que hay" | §10 Pipeline de ingesta consume los 40+ docs en build time → seed.json |
| "se requiere toda esa información" | 100 % del contenido vive en Dexie tras seeding (no se discrimina nada) |
| "se quiere poder aprender al máximo" | §6.2 Motor adaptativo + §6.1 FSRS + §6.3 mining → todo se orquesta para máximo aprendizaje por minuto |
| "tiene que ser adictivo para aprender" | §7 capa entera dedicada con Hook Model, microvictorias, combos, loot boxes, sin culpa |
| "llegar a lectura de C2" | §11 Hito 5 + Capa 4 mining + AWL + técnico-IA → 10 k palabras + 250 wpm |
| "alto rendimiento" | §9 budget cuantificado + Workers + virtualización + local-first |
| "consciente del tiempo solo como dato" | §11 hitos por entregables, no por fechas; tiempo informa, no limita |
| "un solo usuario iniciando A0" | §4.4 sin login/multiuser; §8 dashboard "Hoy" personalizado de día 1 |

---

## 16. Próximos pasos recomendados

1. **Validar este documento** — ¿alguna sección la cambias o agregas?
2. **Crear repo y Hito 0** — bootstrap SvelteKit + Dexie + script ingest del primer Anki deck (80 verbos). Tiempo estimado: 8-12 horas de trabajo concentrado.
3. **Dogfooding desde semana 1** — usar el MVP aunque sea feo. La métrica de adictividad solo se valida con uso real.
4. **Decidir** si Carlos quiere el código generado por mí progresivamente (un módulo a la vez con tests), o si prefiere primero la arquitectura visual y luego pasamos a código.

---

**Documento mantenedor:** este archivo es la **fuente de verdad arquitectónica**. Cuando entre en contradicción con `01-ARQUITECTURA.md` u `08-STACK-Y-ESTIMACION.md`, este documento gana, y los otros se actualizan a referenciarlo.

**Versión:** 2.0
**Fecha:** 2026-05-09
**Autor:** Claude (arquitectura), basado en la misión y semillas de Carlos.
