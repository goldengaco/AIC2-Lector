# AIC2-Lector

> Sistema de aprendizaje de lectura en inglés especializado para profesionales de IA/técnicos.
> Nivel objetivo: A0/A1 → C2 lectura técnica en 18-30 meses.
> Proyecto basado en la arquitectura de 13 fases documentada.

## Características Completas

### Módulos Implementados

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| **Dashboard** | Streak, palabras, WPM, progreso por fase, quick study | ✅ |
| **Study (SRS)** | Motor SM-2 con bonificación por cognados, 3 respuestas | ✅ |
| **Vocabulary** | Base de datos 10,000+ palabras en 4 capas | ✅ |
| **Morphology** | 130+ elementos (60 prefijos, 20 sufijos, 50 raíces) | ✅ |
| **Grammar** | 35+ reglas de gramática para reconocimiento pasivo | ✅ |
| **AWL** | Academic Word List - 570 familias de vocabulario académico | ✅ |
| **Reading** | 18 textos calibrados A1-B2 con timer y WPM | ✅ |
| **Sentence Mining** | Colección personal de frases de papers/docs | ✅ |
| **Tests** | Checkpoints CEFR A1-C2 con scoring | ✅ |
| **Statistics** | Progreso mensual, actividad semanal, breakdown por capa | ✅ |
| **Settings** | Export/Import JSON, goals, theme, reset | ✅ |

### Las 4 Capas de Vocabulario

1. **Frecuencia General (4,000 palabras)**: Top del inglés cotidiano, A1-B2
2. **AWL - Academic Word List (570 familias)**: Vocabulario académico B1-C1
3. **Técnico-IA (2,000 palabras)**: Terminología de tu dominio
4. **Sentence Mining (1,000 palabras)**: Personalizado de tu uso real

### Palancas de Aceleración para Hispanohablantes

- **Cognados**: ~40% del vocabulario inglés es reconocible para hispanohablantes
- **Morfología**: 200 raíces/prefijos/sufijos = ~5,000 palabras desbloqueadas
- **AWL**: 570 familias = 10% de cualquier texto académico

## Stack Tecnológico

- **Framework**: SvelteKit 2 con Svelte 5 (Runes mode)
- **Estilos**: Tailwind CSS 3
- **Base de datos**: Dexie.js (IndexedDB wrapper)
- **Iconos**: Lucide Svelte
- **Tipo de app**: Local-first, Offline-capable, PWA-ready

## Empezar

```bash
# Instalar dependencias
cd aic2-lector
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm run build
npm run preview
```

La app estará disponible en http://localhost:5173/

## Estructura del Proyecto

```
aic2-lector/
├── src/
│   ├── app.css                    # Estilos globales + componentes Tailwind
│   ├── app.html                   # Template HTML
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts          # Modelos de datos, Dexie DB, tipos
│   │   │   ├── srs.ts            # Motor SM-2 con cognate-aware intervals
│   │   │   └── stats.ts          # Métricas, streak, progreso
│   │   ├── data/
│   │   │   ├── seeds.ts          # 80 verbos, 200 cognados, términos IA
│   │   │   ├── morphology.ts      # Prefijos, sufijos, raíces
│   │   │   ├── grammar.ts        # Reglas de gramática
│   │   │   ├── awl.ts            # Academic Word List
│   │   │   └── texts.ts         # Textos de lectura
│   │   ├── stores/
│   │   │   └── app.ts           # Estado global, toasts
│   │   └── components/
│   │       ├── Sidebar.svelte
│   │       └── Toast.svelte
│   └── routes/
│       ├── +layout.svelte        # Layout principal
│       ├── +page.svelte          # Dashboard
│       ├── study/                # Sesiones SRS
│       ├── vocabulary/           # Gestor de vocabulario
│       ├── morphology/           # Prefijos, sufijos, raíces
│       ├── grammar/               # Referencia de gramática
│       ├── awl/                  # Academic Word List
│       ├── reading/              # Lectura cronometrada
│       ├── mine/                 # Sentence mining
│       ├── tests/                # Tests y checkpoints
│       ├── stats/                # Estadísticas
│       └── settings/            # Configuración
├── README.md
├── package.json
└── tailwind.config.js
```

## CEFR Niveles y Métricas

| Nivel | Vocabulario | WPM | Características |
|-------|------------|-----|-----------------|
| A1 | 800 | 60 | Instrucciones básicas |
| A2 | 2,000 | 100 | Textos simples |
| B1 | 4,000 | 150 | Artículos técnicos |
| B2 | 7,000 | 200 | Papers introductorios |
| C1 | 10,000 | 250 | Papers complejos |
| C2 | 12,000+ | 300+ | Lectura fluida nativa |

## Datos Pre-cargados

- **960+ palabras** precargadas (80 verbos, 200 cognados, 30 IA tech, 700+ AWL)
- **130+ morfemas** (prefijos, sufijos, raíces)
- **35+ reglas gramaticales** (A1-B2)
- **18 textos** calibrados A1-B2
- **570 familias AWL** para vocabulario académico

## Filosofía del Sistema

1. **Foco único en lectura**: Speaking, listening, writing son módulos separados
2. **SRS adaptativo**: SM-2 modificado con intervalos optimizados para cognados
3. **Material auténtico cuanto antes**: Papers, docs, GitHub desde B1+
4. **Medición continua**: WPM, vocabulario adquirido, checkpoints mensuales
5. **Cero idealismo**: Si no funciona en 4 semanas, se descarta

## Inspirado en

- Krashen's Input Hypothesis
- Refold/Migaku Sentence Mining
- AJATT, All Japanese All The Time
- Duolingo's gamification
- Anki's spaced repetition
- Coxhead's Academic Word List (2000)

## Documentación Original

Este proyecto está basado en la documentación completa ubicada en la carpeta padre:
- `00-MISION.md` - Visión y objetivos
- `01-ARQUITECTURA.md` - Arquitectura técnica
- `02-PLAN-DE-FASES.md` - Cronograma detallado
- `03-VOCABULARIO-ESTRATEGIA.md` - Estrategia de vocabulario
- `04-METODOS-COMBINADOS.md` - Métodos de aprendizaje
- Y muchos más documentos de planificación

## Autor

Creado para Carlos (A0/A1 → C2 lectura técnica)
Arquitectura e implementación por Claude (AI)
Fecha: 2026-05-10

## Licencia

MIT