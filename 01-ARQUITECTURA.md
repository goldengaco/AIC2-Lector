# 01 · ARQUITECTURA DEL SISTEMA

## 1. Visión de 30 segundos

AIC2-Lector reusa el motor de Entrename V2 con tres adaptaciones específicas:

1. **Vocabulario estratificado** en 4 capas (frecuencia, AWL, técnico-IA, sentence mining personal).
2. **Comprensión lectora con escenarios CEFR-aligned** (textos calibrados al nivel actual).
3. **Velocidad de lectura medida y entrenada** con metrónomo y RSVP.

El motor adaptativo (mismo de Entrename V2) detecta debilidades y dirige al usuario al siguiente paso óptimo.

## 2. Los 6 módulos

```
┌─────────────────────────────────────────────────────────────┐
│                       AIC2-LECTOR                             │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐  │
│  │  M1         │  │  M2         │  │  M3                  │  │
│  │  Vocab SRS  │  │  Comprensión│  │  Velocidad           │  │
│  │  4 capas    │  │  lectora    │  │  lectora             │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬───────────┘  │
│         │                │                      │             │
│         └────────────┬───┴──────────────────────┘             │
│                      │                                        │
│              ┌───────▼────────┐                               │
│              │  Motor         │                               │
│              │  adaptativo    │ ← mismo de Entrename V2       │
│              └───────┬────────┘                               │
│                      │                                        │
│         ┌────────────┼──────────────────┐                     │
│         │            │                   │                    │
│  ┌──────▼─────┐ ┌────▼─────┐ ┌──────────▼──────┐             │
│  │  M4        │ │  M5      │ │  M6              │             │
│  │  Morfología│ │  Gramática│ │  Mining personal │             │
│  │  + raíces  │ │  pasiva  │ │  (sentence mining)│            │
│  └────────────┘ └──────────┘ └─────────────────┘             │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### M1 — Vocabulario SRS (núcleo)

Las 10,000 palabras meta, estratificadas en 4 capas con currículum por capa. Detalle en `03-VOCABULARIO-ESTRATEGIA.md`.

### M2 — Comprensión lectora

Textos calibrados con preguntas de comprensión. Escala A0 → C2. Cada texto registra:
- Nivel CEFR objetivo
- Densidad léxica (palabras únicas / total)
- Complejidad sintáctica (longitud media de oración, cláusulas subordinadas)
- Cobertura de vocabulario actual del usuario

### M3 — Velocidad lectora

Entrenamiento explícito de palabras por minuto. Tres técnicas:
- **RSVP** (Rapid Serial Visual Presentation): palabras una por una a velocidad creciente.
- **Metrónomo**: lectura con cadencia forzada.
- **Cronometrada normal**: lectura libre con stopwatch + comprensión post.

### M4 — Morfología

50 prefijos + 50 sufijos + 100 raíces latinas/griegas. Cada elemento con 5-10 palabras ejemplo, SRS, ejercicios de inferencia (palabra inventada con raíz conocida → adivinar significado).

### M5 — Gramática pasiva

NO para producción. Solo para reconocer al leer. 200 reglas core enfocadas en lo que aparece en lectura técnica:
- Voz pasiva
- Cláusulas relativas (defining/non-defining)
- Frases nominales largas (typical of academic writing)
- Reported speech
- Conditionals
- Modal verbs en contexto académico (may, might, could indicar probabilidad)
- Discourse markers (however, therefore, nevertheless, furthermore)

### M6 — Sentence mining personal

Carlos pega frases reales que encuentra en su trabajo (errores de consola, líneas de docs, fragmentos de papers) y el sistema:
1. Identifica palabras desconocidas (cruza con su vocabulario actual).
2. Genera tarjeta SRS con la frase completa como contexto.
3. Sugiere lecturas relacionadas.

## 3. Schemas de datos (compatibles con Entrename V2)

### 3.1. Word (palabra de vocabulario)

```js
/**
 * @typedef {Object} Word
 * @property {string}   id              - Slug en inglés en minúscula. Ej: "develop".
 * @property {string}   lemma           - Forma canónica.
 * @property {string[]} pos             - Partes del habla: ['verb', 'noun'].
 * @property {string[]} translations_es - Traducciones primarias al español.
 * @property {string}  [cognate_es]     - Cognado español si existe. Ej: "desarrollar".
 * @property {('cognate'|'partial-cognate'|'false-cognate'|'no-cognate')} cognate_type
 * @property {number}   frequency_rank  - Posición en lista de frecuencia (1 = más frecuente).
 * @property {('A1'|'A2'|'B1'|'B2'|'C1'|'C2')} cefr_level - Nivel donde se introduce.
 * @property {('general'|'awl'|'technical-ia'|'mined')} layer
 * @property {string[]} examples        - 3-5 frases ejemplo reales.
 * @property {string[]}[roots]          - Raíces presentes (ej: ['vid', 'port']).
 * @property {string[]}[prefixes]
 * @property {string[]}[suffixes]
 * @property {string}  [audio_url]      - Pronunciación opcional (no usada en C2 lectura, pero almacenada).
 * @property {string}  [ipa]            - Transcripción fonética IPA opcional.
 * @property {string[]} collocations    - Colocaciones frecuentes. Ej: ['develop a model', 'develop skills'].
 * @property {string[]} synonyms_en
 * @property {string[]} antonyms_en
 */
```

### 3.2. Text (texto de comprensión lectora)

```js
/**
 * @typedef {Object} Text
 * @property {string}   id
 * @property {string}   title
 * @property {string}   body            - Texto completo en inglés.
 * @property {('A1'|'A2'|'B1'|'B2'|'C1'|'C2')} cefr_level
 * @property {('narrativo'|'periodistico'|'tecnico-ia'|'instructivo'|'academico'|'literario')} genre
 * @property {number}   word_count
 * @property {number}   unique_words
 * @property {number}   avg_sentence_length
 * @property {string}   source           - URL de origen si auténtico.
 * @property {boolean}  is_authentic     - true si no es texto adaptado.
 * @property {string[]} key_vocabulary   - IDs de Words críticas para entender.
 * @property {Question[]} comprehension_questions - 5-10 preguntas.
 * @property {string}  [audio_url]       - Si tiene audio (Listening-Reading method).
 */
```

### 3.3. ReadingSession (sesión cronometrada)

```js
/**
 * @typedef {Object} ReadingSession
 * @property {string}   id
 * @property {string}   text_id
 * @property {string}   started_at
 * @property {string}   finished_at
 * @property {number}   duration_sec
 * @property {number}   words_read
 * @property {number}   wpm              - Words per minute.
 * @property {number}   comprehension_score - 0-100 basado en preguntas post.
 * @property {number}   subvocalization_estimated - 0-100 (proxy: si wpm < 150, alto)
 */
```

### 3.4. Morpheme (prefijo, sufijo, raíz)

```js
/**
 * @typedef {Object} Morpheme
 * @property {string}   id              - "vid" / "un-" / "-tion"
 * @property {('root'|'prefix'|'suffix')} type
 * @property {string}   meaning_es      - Significado en español.
 * @property {string}   origin          - "latin" / "greek" / "germanic" / "french"
 * @property {string[]} example_words   - 5-10 IDs de Words que lo contienen.
 * @property {('A1'|'A2'|'B1'|'B2'|'C1'|'C2')} cefr_level
 */
```

### 3.5. GrammarRule (regla pasiva)

```js
/**
 * @typedef {Object} GrammarRule
 * @property {string}   id
 * @property {string}   title           - "Voz pasiva en presente"
 * @property {string}   pattern         - Forma resumida.
 * @property {string}   explanation_md  - Explicación corta en español.
 * @property {string[]} examples_en     - 5-10 oraciones reales.
 * @property {('A1'|'A2'|'B1'|'B2'|'C1'|'C2')} cefr_level
 * @property {('basico'|'frecuente-en-tecnico'|'literario'|'academico-formal')} category
 */
```

## 4. Flujo de usuario en una sesión típica de 90 minutos

```
00:00 — Apertura
        │
        ▼
00:01 — Motor adaptativo elige siguiente paso
        │
        ├──→ Si hay ≥15 palabras SRS pendientes → Vocabulario primero (15-20 min)
        │
        ├──→ Si hay tag de morfología nuevo → Lección de raíz/prefijo (10 min)
        │
        ├──→ Texto del día (40-50 min):
        │       1. Lectura cronometrada (registra wpm)
        │       2. Preguntas de comprensión
        │       3. Sentence mining: marca 3-5 frases interesantes
        │       4. Sistema crea tarjetas SRS automáticamente
        │
        ├──→ Sesión de gramática (10-15 min):
        │       Reconocimiento de patrón en oraciones reales
        │
        └──→ Cierre: revisión de portfolio (5 min)
```

## 5. Almacenamiento local

La version web recomendada no debe usar LocalStorage como base principal. Para una app de largo plazo con SRS, textos, metricas y 10,000+ palabras, la base principal sera:

```txt
Dexie + IndexedDB
```

LocalStorage queda solo para preferencias simples. La decision completa de stack esta documentada en `08-STACK-Y-ESTIMACION.md`.

### Preferencias simples (LocalStorage opcional)

```js
const STORAGE_KEYS = {
  WORDS_SRS:        'aic2.words.srs',
  WORDS_KNOWN:      'aic2.words.known',
  TEXTS_READ:       'aic2.texts.read',
  READING_SESSIONS: 'aic2.reading.sessions',
  MORPHEMES_KNOWN:  'aic2.morphemes.known',
  GRAMMAR_KNOWN:    'aic2.grammar.known',
  MINED_SENTENCES:  'aic2.mined',
  CURRENT_PHASE:    'aic2.current.phase',  // 0..5
  PORTFOLIO:        'aic2.portfolio',
  PREFS:            'aic2.prefs'
};
```

## 6. Reuso del motor de Entrename V2

Cuando llegue el momento de programar AIC2-Lector, NO se construye desde cero:

1. Se clona el repo de Entrename V2.
2. Se cambia el contenido en `src/data/`:
   - `lessons/` → lecciones de inglés (gramática pasiva, morfología).
   - `questions.js` → preguntas de comprensión lectora.
   - `hitos/` → proyectos hito de lectura (ej: "Lee tu primer paper", "Lee un libro de 100 páginas").
3. Se agregan los módulos M1, M2, M3 que son específicos de AIC2-Lector:
   - `src/engine/words.js`
   - `src/engine/reading-session.js`
   - `src/engine/morphology.js`
4. Se reusa tal cual: SRS engine, motor adaptativo, portfolio, exámenes simulados, UI shell.

**Estimación de trabajo de conversión:** ~30% del esfuerzo de construir Entrename V2 desde cero, asumiendo V2 está terminado. Esto refuerza el argumento de terminar V2 primero.

## 7. Lo que NO se construye

- ❌ Sintetizador de voz (no es habla).
- ❌ Reconocedor de voz (no es habla).
- ❌ Editor de ensayos (no es escritura).
- ❌ Sistema de chat con tutor IA (otro módulo).
- ❌ Multi-usuario (es para Carlos solo).

---

**Próximo paso:** leer `02-PLAN-DE-FASES.md` para el cronograma detallado.
