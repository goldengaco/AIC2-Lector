# 06 · EVALUACIÓN Y CHECKPOINTS

## Filosofía: medir lo que importa, no lo que es fácil de medir

Contar minutos estudiados es fácil pero engañoso. Lo que mide AIC2-Lector:

1. **Vocabulario adquirido** (en confianza, no en cantidad bruta).
2. **Velocidad de lectura** (wpm con comprensión ≥75%).
3. **Comprensión de textos auténticos** (% de preguntas correctas en escenarios reales).
4. **Sostenibilidad** (rachas, no abandonos).

---

## Evaluación continua (cada sesión)

Cada sesión registra automáticamente:

- Palabras nuevas introducidas (lista).
- Palabras repasadas (con calidad SRS 0/1/2).
- Texto leído (id + wpm + comprensión).
- Frases minadas (cantidad).
- Tiempo total activo.

Estos datos alimentan el portfolio mensual.

---

## Tests de nivel internos (mensuales)

### Test rápido (15 min)

Cada lunes a primera hora:

- 30 palabras de vocabulario base aleatorias del rango actual + 5 niveles arriba (¿cuántas reconoces?).
- 1 texto cronometrado (200 palabras) + 5 preguntas de comprensión.
- 1 ejercicio de inferencia morfológica (palabra inventada).

Output:

```
Test rápido — Mes 7 — 2026-12-08
==================================
Vocabulario:    87/100   (rango actual: B1 → 89/100)
Velocidad:      135 wpm  (objetivo Fase 2: 130-160) ✅
Comprensión:    4/5      (80%)
Inferencia:     3/3      (100%)
Nivel estimado: B1 alto, próximo B2

Sugerencia del motor: comenzar AWL sublista 4.
```

### Test largo (60 min, trimestral)

- 80 palabras vocabulario.
- 3 textos cronometrados de niveles distintos.
- 1 paper técnico simple con preguntas de inferencia.
- 1 ejercicio de gramática pasiva (identificar 10 estructuras).

Output: certificado interno por trimestre con hash + fecha.

---

## Equivalencias CEFR aproximadas

| Resultado AIC2 | CEFR aprox. | Cambridge | TOEFL iBT lectura | IELTS lectura |
|----------------|--------------|-----------|---------------------|----------------|
| 800 palabras + 60 wpm | A2 | KET | <8 | 3.5 |
| 2,000 palabras + 100 wpm | B1 | PET | 8-12 | 4.0-5.0 |
| 4,000 palabras + 150 wpm | B2 | FCE | 13-17 | 5.5-6.5 |
| 7,000 palabras + 200 wpm | C1 | CAE | 18-23 | 7.0-7.5 |
| 10,000 palabras + 250 wpm | C2 | CPE | 24-30 | 8.0-9.0 |

NOTA: TOEFL/IELTS son tests integrales (4 habilidades). AIC2 solo cubre lectura, así que la equivalencia es solo para la SECCIÓN de reading de esos exámenes.

---

## Checkpoints obligatorios (no se avanza sin pasarlos)

### Checkpoint A1 → A2 (mes 2)

- [ ] Lees las 80 instrucciones sin diccionario.
- [ ] Conoces ≥800 palabras (test).
- [ ] Lees un texto de VOA Learning English y aciertas 4/5 preguntas.

### Checkpoint A2 → B1 (mes 5)

- [ ] ≥2,000 palabras pasivas (test).
- [ ] Lees un graded reader B1 completo.
- [ ] Velocidad ≥100 wpm en texto B1.

### Checkpoint B1 → B2 (mes 12)

- [ ] ≥4,000 palabras pasivas.
- [ ] Lees BBC News sin diccionario.
- [ ] Velocidad ≥150 wpm.
- [ ] Lees un libro auténtico completo (Charlotte's Web o equivalente).

### Checkpoint B2 → C1 (mes 20)

- [ ] ≥7,000 palabras.
- [ ] Lees blog de Karpathy con &lt;5 desconocidas/párrafo.
- [ ] Velocidad ≥200 wpm general.
- [ ] Lees Animal Farm completo.

### Checkpoint C1 → C2 (mes 32)

- [ ] ≥10,000 palabras.
- [ ] Lees Attention Is All You Need con ≥90% comprensión.
- [ ] Velocidad ≥250 wpm general, ≥180 wpm técnico.
- [ ] Lees un libro técnico denso completo.

---

## Métricas de salud del sistema

### Racha (streak)

Días consecutivos con sesión ≥30 min. Mantenerla en verde.

### Distribución de tiempo

```
Vocabulario SRS:         ___% (target 30%)
Lectura cronometrada:    ___% (target 35%)
Sentence mining:         ___% (target 10%)
Morfología/Gramática:    ___% (target 15%)
Listening-Reading:       ___% (target 10%)
```

### Carga cognitiva

Si tres sesiones seguidas tienen comprensión &lt;70%, el motor adaptativo baja un nivel temporalmente.

### Aburrimiento

Si tres sesiones seguidas tienen `subjective_engagement &lt; 3/5` (calificado por Carlos al final), rotación forzada de contenido.

---

## Portfolio mensual exportable

Mismo sistema que Entrename V2. Cada mes genera:

```markdown
# AIC2-Lector — Portfolio Mes 7

**Fechas:** 2026-11-01 a 2026-11-30
**Tiempo activo:** 26.5 horas
**Nivel estimado:** B1 alto

## Vocabulario
- Palabras nuevas: 142
- Palabras dominadas (confianza ≥0.85): 1,847
- Total pasivo: 2,340

## Lectura
- Textos completados: 18
- Palabras leídas total: 24,800
- Velocidad media: 138 wpm
- Comprensión media: 78%

## Top 3 textos del mes
1. "How LLMs work" (Hugging Face) — 220 palabras, 145 wpm, 80% comp
2. ...

## Sentence mining
- Frases extraídas: 47
- Palabras nuevas desde mining: 23

## Cumplimiento de plan
- Días activos: 18/22 (82%) ✅
- Sesiones &lt;30 min: 2 ⚠️

## Próximas metas (Mes 8)
- Cerrar AWL sublista 3
- Empezar 100 raíces latinas
- Primer libro auténtico (Charlotte's Web)
```

---

## Anti-métricas (evitar a propósito)

- ❌ Cantidad de palabras "vistas" (sin SRS confirma retención).
- ❌ Horas estudiadas (no implica progreso).
- ❌ Lecciones "completadas" superficialmente.
- ❌ Apps abiertas vs. realmente trabajadas.

---

**Próximo paso:** leer `07-INTEGRACION-DUOLINGO-IA.md` para entender cómo combinar lo que ya usas.
