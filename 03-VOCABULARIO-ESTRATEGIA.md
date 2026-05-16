# 03 · VOCABULARIO — Estrategia de las 10,000 palabras

## La pirámide

```
                    ┌─────────────────────┐
                    │  CAPA 4 (1,000)      │
                    │  Mining personal     │     ← lo que TÚ usas
                    │  C1-C2               │
                    └─────────────────────┘
                  ┌──────────────────────────┐
                  │   CAPA 3 (2,000)          │
                  │   Técnico-IA              │     ← tu dominio
                  │   B2-C2                   │
                  └──────────────────────────┘
                ┌─────────────────────────────────┐
                │     CAPA 2 (3,000)               │
                │     Academic Word List (AWL)     │     ← académico general
                │     B1-C1                        │
                └─────────────────────────────────┘
              ┌──────────────────────────────────────┐
              │       CAPA 1 (4,000)                  │
              │       Frecuencia general top 4000     │     ← lengua cotidiana
              │       A1-B2                           │
              └──────────────────────────────────────┘

Total: 10,000 palabras pasivas → C2 lectura técnica funcional
```

---

## CAPA 1 — Frecuencia general (4,000 palabras)

### Por qué

Las primeras 4,000 palabras de frecuencia cubren ~88% de cualquier texto general. Sin esto, ningún paper, blog o libro es legible. Esta es la base no-negociable.

### Fuentes canónicas

- **COCA Top 5000** (Corpus of Contemporary American English) — la lista más usada.
- **BNC/COCA combinado** (British National Corpus + COCA) — más balanceada UK/US.
- **Oxford 3000** y **Oxford 5000** — listas curadas pedagógicamente.

### Subdivisión por nivel CEFR

| Rango | Cantidad | Nivel CEFR | Cubre |
|-------|----------|-----------|--------|
| 1-500 | 500 | A1 | 76% del texto |
| 501-1000 | 500 | A2 | 80% |
| 1001-2000 | 1000 | B1 | 85% |
| 2001-3000 | 1000 | B2 | 87% |
| 3001-4000 | 1000 | B2-C1 | 88% |

### Marcado de cognados

Cada palabra se etiqueta:

- **Cognate puro** (40% del top 5000): *information, develop, important, possible, organization*. Aprendes en 1 vista.
- **Cognado parcial** (15%): *general* (igual escrito pero pronunciación distinta), *attend* (atender pero matiz distinto). Aprendes en 2-3 vistas.
- **No cognado** (43%): *however, although, even though, work, get, need, want*. Aprendes en 5-15 vistas.
- **Falso amigo** (2%): *actually* (en realidad, no actualmente), *embarrassed* (avergonzado, no embarazada), *library* (biblioteca, no librería), *constipated* (estreñido, no resfriado), *exit* (salida, no éxito). Tarjeta especial con advertencia roja.

### Ritmo sugerido

10 palabras nuevas/día × 4 días/semana = 40/semana. 4,000 palabras se aprenden en ~100 semanas activas (~24 meses con tu ritmo). PERO los cognados se procesan en lotes de 50/sesión sin contar como "nuevas" — eso reduce a ~14-16 meses real.

---

## CAPA 2 — Academic Word List (3,000 palabras = 570 familias)

### Por qué

La AWL de Coxhead (2000) son las 570 **familias** de palabras académicas más frecuentes en inglés. Cada familia tiene 4-6 formas (verbo, sustantivo, adjetivo, adverbio): *analyze, analysis, analytic, analytical, analytically, analyst* = 1 familia, 6 formas. Total ≈ 3,000 palabras.

Cubren el 10% de cualquier texto académico (incluyendo papers de IA, libros técnicos, journalismo serio).

### Fuente

- **Lista oficial de Coxhead 2000** — disponible públicamente en universidad de Wellington.
- Organizada en 10 sublistas por frecuencia.

### Sublistas

| Sublista | Familias | Cobertura acumulada en texto académico |
|----------|----------|----------------------------------------|
| 1 | 60 | 5.0% |
| 2 | 60 | 6.7% |
| 3 | 60 | 7.7% |
| 4 | 60 | 8.5% |
| 5 | 60 | 9.0% |
| 6 | 60 | 9.4% |
| 7 | 60 | 9.7% |
| 8 | 60 | 9.8% |
| 9 | 60 | 9.9% |
| 10 | 30 | 10.0% |

Empezar por sublista 1 y avanzar.

### Ritmo sugerido

5 familias nuevas/día × 4 días/semana = 20/semana. 570 familias en ~28 semanas (~7 meses).

### Ver semilla `semillas/03-academic-word-list-categorias.md`

---

## CAPA 3 — Técnico-IA (2,000 palabras)

### Por qué

Tu dominio. Las palabras que aparecen en papers de IA, docs de Hugging Face, errores de PyTorch, configuraciones de Ollama. Sin estas, lectura técnica B2 se convierte en lectura técnica C2.

### Subcategorías

| # | Subcategoría | Cantidad | Ejemplos |
|---|--------------|----------|----------|
| 1 | Arquitectura de modelos | 200 | transformer, attention, encoder, decoder, residual, embedding, positional, head |
| 2 | Entrenamiento | 250 | gradient, backpropagation, loss, optimizer, batch, epoch, learning rate, regularization |
| 3 | Inferencia | 150 | generation, sampling, beam search, temperature, top-k, top-p, perplexity, latency |
| 4 | Cuantización y hardware | 200 | precision, FP16, INT4, GGUF, AWQ, KV cache, VRAM, throughput, bandwidth |
| 5 | RAG y embeddings | 150 | embedding space, cosine similarity, vector database, chunk, retrieval, reranker |
| 6 | Fine-tuning | 200 | LoRA, QLoRA, adapter, distillation, supervised, RLHF, DPO, dataset curation |
| 7 | Agentes y orquestación | 200 | agent, tool calling, function call, ReAct, MCP, sandbox, planner, executor |
| 8 | Evaluación | 150 | benchmark, metric, accuracy, F1, BLEU, ROUGE, MMLU, HumanEval, leaderboard |
| 9 | DevOps de ML | 250 | deployment, scaling, container, orchestration, monitoring, observability, telemetry |
| 10 | Programación general | 250 | repository, branch, commit, merge, pull request, dependency, package, runtime |

### Fuente

- Glosarios oficiales de Hugging Face, OpenAI, Anthropic.
- Indexación de README y docs de proyectos open-source de IA.
- Ver semilla `semillas/04-tecnico-ia-200.md` (las 200 críticas para arrancar).

### Ritmo sugerido

Empezar al inicio de Fase 3 (mes 13). 5 palabras técnicas/día × 4 días/semana = 20/semana. 2,000 palabras en ~100 semanas (~24 meses), pero la mayoría son cognados con español o muy similares al ya conocido del trabajo, así que en realidad ~12-15 meses reales.

---

## CAPA 4 — Sentence Mining personal (1,000 palabras)

### Por qué

Las palabras que aparecen en TU vida digital y NO están en las capas anteriores. Cada hispanohablante adulto técnico tiene un vocabulario "personal" único: las palabras de los productos que usa, los errores que más le aparecen, los géneros literarios que le gustan.

### Cómo se construye

1. Cada vez que encuentras una palabra desconocida en algo real (paper, error, libro, video), la pegas (o screenshot + OCR).
2. El sistema verifica si ya está en capas 1-3. Si sí, refuerzo. Si no, va a capa 4.
3. Crea tarjeta SRS con la frase original como contexto.
4. Etiqueta automática (paper, error-msg, novela, blog, doc).

### Ritmo

Variable. En Fase 3-4 puede ser 5-10 palabras nuevas/semana. Lo crítico es que cada palabra de capa 4 viene con contexto y motivación inmediata, lo que dispara la retención.

---

## Algoritmo SRS específico para vocabulario

Reuso del SM-2 de Entrename V2, pero con tres modificaciones:

### Modificación 1 — Bonificación por cognado

Si la palabra es `cognate_type === 'cognate'`, el primer intervalo es 7 días en vez de 1. (Ya la sabes prácticamente, no necesitas verla mañana.)

### Modificación 2 — Penalización por falso amigo

Si la palabra es `cognate_type === 'false-cognate'`, el primer intervalo es 1 día y el segundo 3 días (más agresivo). Necesitas reforzar para no caer en la trampa.

### Modificación 3 — Acoplamiento por familia AWL

Si responde correctamente *analyze*, el sistema marca *analysis, analytic, analytical, analyst* con confianza inicial 0.6 (presunción de conocimiento). Solo se preguntan si fallas la familia.

## Métricas de progreso de vocabulario

```
Confianza media de top 1000:        ___ / 1.0
Confianza media de AWL sublista 1-3: ___ / 1.0
Palabras "dominadas" (confianza ≥0.85): ___
Palabras "en aprendizaje" (0.5-0.85):    ___
Palabras "débiles" (≤0.5):                ___
Vocabulario activo total:                  ___
```

Estas métricas se muestran en el portfolio del usuario y disparan recomendaciones del motor adaptativo.

---

**Próximo paso:** leer `04-METODOS-COMBINADOS.md` para entender qué técnicas usar y cuándo.
