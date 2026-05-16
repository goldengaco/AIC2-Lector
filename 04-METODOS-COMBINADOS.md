# 04 · MÉTODOS COMBINADOS — Lo que sí funciona, sin aferrarme

## Principio de selección

No hay un método único superior. Cada uno tiene su nicho. AIC2-Lector combina los que tienen evidencia empírica y se complementan. Los siguientes son los 10 métodos núcleo del sistema:

---

## 1. Extensive Reading (Krashen)

**Qué es:** leer mucho material donde entiendes ≥95% sin diccionario. La adquisición ocurre por exposición masiva al `i+1` (un escalón arriba).

**Por qué funciona:** el cerebro generaliza patrones automáticamente cuando hay suficiente input comprensible.

**En AIC2-Lector:** régimen base de Fases 1-3. 30-40 min de cada sesión van a leer textos calibrados al nivel actual.

**Riesgo:** monotonía. Mitigación: rotar géneros (narrativo, periodístico, técnico) cada semana.

**Evidencia:** Day & Bamford 1998, Nation & Waring (Wellington), Krashen 1985+.

---

## 2. Intensive Reading

**Qué es:** leer poco texto, analizarlo profundamente. Cada palabra desconocida se busca, cada estructura se analiza.

**Por qué funciona:** cementa estructuras complejas (cláusulas, frases nominales largas) que extensive reading no enseña directamente.

**En AIC2-Lector:** 10-15 min/sesión en Fases 2-4. Un párrafo difícil, dissected.

**Riesgo:** se vuelve aburrido si es el único método. Por eso no es el principal.

---

## 3. Sentence Mining (método Refold/Migaku adaptado)

**Qué es:** extraer frases reales de contenido auténtico (libros, papers, errores, series con subtítulos) y meterlas en SRS con la frase como contexto.

**Por qué funciona:** la palabra viene con su uso natural, su colocación, su contexto. Retención 3-4× mayor que listas de palabras sueltas.

**En AIC2-Lector:** central desde Fase 1. Cada vez que Carlos encuentra una frase interesante en cualquier texto que lee, la registra. El sistema crea tarjeta SRS automática.

**Implementación:** botón "minar frase" en el lector → marca palabras desconocidas → tarjeta con frase completa + traducción + audio si disponible.

---

## 4. Listening-Reading method (Lonsdale 2010)

**Qué es:** escuchar el audiolibro mientras se lee el texto en pantalla. Conecta sonido con grafía.

**Por qué funciona:** entrena los dos canales simultáneamente sin duplicar tiempo. Acelera la adquisición de fonología (que ayuda a memorizar palabras) y normaliza la prosodia natural del inglés.

**En AIC2-Lector:** uso opcional desde Fase 1. Materiales graded readers ya tienen audio. Project Gutenberg + LibriVox para auténticos.

**Riesgo:** abruma a A1. Empezar en A2.

---

## 5. Cognates Booster

**Qué es:** lección dedicada a aprender los 3,000 cognados latinos/griegos del inglés que un hispanohablante reconoce instantáneamente.

**Por qué funciona:** el cerebro ya tiene el concepto en español, solo necesita asociar la grafía inglesa. Velocidad de aprendizaje 5-10× mayor que palabras sin cognado.

**En AIC2-Lector:** sprint específico en Fase 0-1 (semanas 3-12). Lotes de 50 cognados/sesión en SRS con primer intervalo extendido a 7 días.

**Trampa:** los falsos amigos. Tarjeta especial roja para los 30 falsos amigos críticos.

**Ver:** `semillas/01-cognados-top-200.md`.

---

## 6. Morphology Training

**Qué es:** aprender prefijos, sufijos y raíces como unidades. Una raíz desbloquea 20-50 palabras.

**Por qué funciona:** convierte el aprendizaje de "una palabra" a "patrón de palabras". *port* (llevar) abre: import, export, portable, transport, support, report, deport, comport, transportation, portage, etc.

**En AIC2-Lector:** módulo M4 desde Fase 0. 50 prefijos + 50 sufijos + 100 raíces.

**Ejercicio clave:** dado *introspect* (sin haberlo visto), ¿qué significa? *intro-* (dentro) + *-spect* (ver) → mirar dentro. Ejercicios de inferencia con palabras inventadas pero válidas para entrenar el músculo.

**Ver:** `semillas/02-morfologia-prefijos-sufijos-raices.md`.

---

## 7. Speed Reading entrenado

**Qué es:** medir y subir velocidad de lectura con técnicas explícitas: RSVP (palabras una por una a velocidad creciente), metrónomo (cadencia forzada), cobertura visual ampliada.

**Por qué funciona:** cuando la velocidad es baja, la memoria de trabajo se ocupa decodificando y queda poca para comprender. Subir velocidad libera memoria.

**En AIC2-Lector:** módulo M3 activo desde Fase 2 (B1+). Antes es contraproducente.

**Métrica:** wpm en cada sesión cronometrada. Dashboard mensual con curva.

**Riesgo:** comprensión cae si subes velocidad demasiado rápido. Regla: si comprensión &lt;75%, baja 20% la velocidad.

---

## 8. Subvocalization Control

**Qué es:** entrenarse a no leer "en voz mental" cada palabra (subvocalización). Pasar a lectura directa-a-significado.

**Por qué funciona:** subvocalización limita velocidad al ritmo del habla (~200 wpm máximo). Sin ella, se llega a 300-500 wpm.

**En AIC2-Lector:** técnica activa solo en Fase 4. Antes la subvocalización ayuda a aprender pronunciación implícita.

**Ejercicios:** chewing gum mientras lees (ocupa el aparato fonatorio mental), contar mentalmente "1, 2, 3" mientras lees, leer con metrónomo a velocidad incompatible con subvocalizar.

---

## 9. Material auténtico cuanto antes

**Qué es:** sustituir graded readers por contenido real (BBC, blogs, papers, libros) tan pronto el nivel lo permita.

**Por qué funciona:** los graded readers son escalera, no destino. El inglés real tiene ritmo, registro, vocabulario que los textos adaptados nunca capturan.

**En AIC2-Lector:** cambio definitivo en Fase 3 (B2). Antes solo como muestreo opcional.

**Trampa:** comprensible &lt; 80% = frustración. Empezar siempre con material 1 nivel debajo del estimado.

---

## 10. Spaced Repetition System (SRS) con SM-2 modificado

**Qué es:** algoritmo que programa repaso de cada palabra/regla en el momento óptimo de olvido (curva de Ebbinghaus).

**Por qué funciona:** maximiza retención por hora invertida. Es el método de aprendizaje mejor validado empíricamente.

**En AIC2-Lector:** núcleo. Toda palabra, regla, raíz pasa por SRS. SM-2 con tres modificaciones (ver `03-VOCABULARIO-ESTRATEGIA.md` §"Algoritmo SRS específico").

**Implementación:** se reusa el motor de Entrename V2.

---

## Métodos descartados (con razón)

### Memorización de listas sin contexto

Funciona en exámenes de corto plazo. Retención a largo plazo es 30-40% de SRS con contexto. **Descartado.**

### Apps gamificadas como motor único

Duolingo, Babbel — buenos para mantener hábito y exposición casual. **No bastan para C2.** En AIC2-Lector se usan como complemento, no núcleo.

### Inmersión total sin estructura

Para adultos con tiempo limitado, sin guía estructurada se traduce en años de B1 sin avanzar. **Descartado** como método único.

### Traducción palabra por palabra

Crea dependencia del español como lengua intermediaria. Frena el cerebro de pensar en inglés. **Descartado** después de Fase 1.

### Memorizar gramática para producir

No aplica. Esto es lectura. Solo gramática para reconocer. Producir gramática se aborda en módulo separado de escritura, no aquí.

---

## Cómo se combinan en una sesión típica

```
00:00 — 15 min   M1 SRS Vocabulario (5 nuevas + 25 repaso)
00:15 — 10 min   M4 Morfología (1 raíz nueva + ejercicios de inferencia)
00:25 — 30 min   Lectura del día:
                   · 5 min preview + objetivo
                   · 20 min lectura cronometrada (M2 + M3)
                   · 5 min preguntas comprensión + sentence mining (M6)
00:55 — 15 min   M5 Gramática pasiva (1 patrón + reconocimiento en oraciones)
01:10 — 15 min   Listening-Reading: audiolibro 5 páginas (M2)
01:25 — 5 min    Cierre: actualización portfolio
01:30 — fin
```

Total: 90 min, todos los métodos núcleo activos. Algunos días se simplifica (más vocabulario, menos lectura) según lo que el motor adaptativo decida.

---

**Próximo paso:** leer `05-RECURSOS-CURADOS.md` para los materiales concretos por nivel.
