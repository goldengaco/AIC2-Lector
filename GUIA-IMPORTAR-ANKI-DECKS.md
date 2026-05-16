# 🎯 GUÍA: IMPORTAR Y USAR LOS 4 DECKS ANKI

## RESUMEN DE LOS 4 DECKS CREADOS

| # | Deck | Tarjetas | Uso | Cuándo |
|---|------|----------|-----|--------|
| 1 | **80-VERBOS** | 80 | Verbos imperativos base | Semana 1-2 |
| 2 | **500-COGNADOS** | 500 | Palabras con patrón -tion, -ity, etc | Semana 3-8 |
| 3 | **GRAMATICA** | 50 | Tiempos, modales, voz pasiva, phrasal verbs | Semana 3-16 |
| 4 | **VOCABULARIO-IA-TECH** | 330 | Palabras especializadas tu dominio | Semana 15-24 |

**TOTAL: 960 TARJETAS PRE-HECHAS**

---

## PASO 1: DESCARGAR ANKI

**URL:** https://ankiweb.net

**Versión recomendada:** AnkiDroid (móvil) o Desktop (PC/Mac)

**Instalación:**
```
1. Ve a https://ankiweb.net
2. Click "Download"
3. Descarga la versión para tu SO
4. Instala normalmente
```

**Tiempo:** 5 minutos

---

## PASO 2: IMPORTAR DECK 1 (80 VERBOS)

### 2.1 Preparar archivo
```
1. Ve a: C:\Herramientas\AIC2-Lector\
2. Abre: ANKI-DECK-80-VERBOS-IMPERATIVOS.txt
3. Selecciona TODO (Ctrl+A)
4. Copia TODO (Ctrl+C)
5. Crea archivo nuevo: anki-verbos.txt
6. Pega contenido (Ctrl+V)
7. Guarda el archivo
```

### 2.2 Importar a Anki
```
1. Abre Anki
2. Menú: File → Import
3. Selecciona tu archivo anki-verbos.txt
4. Click "Import"
5. En dialogo:
   - Deck name: "AIC2-80-Verbos"
   - Type: "Tab-separated values"
6. Click "Import"
7. ✅ Listo - 80 tarjetas en tu deck
```

**Tiempo:** 10 minutos

---

## PASO 3: IMPORTAR DECK 2 (500 COGNADOS)

Exactamente igual al Paso 2, pero:
```
- Archivo: ANKI-DECK-500-COGNADOS.txt
- Deck name: "AIC2-500-Cognados"
- Import
```

**Tiempo:** 10 minutos

---

## PASO 4: IMPORTAR DECK 3 (GRAMÁTICA)

```
- Archivo: ANKI-DECK-GRAMATICA-COMPLETA.txt
- Deck name: "AIC2-Gramatica"
- Import
```

**Tiempo:** 10 minutos

---

## PASO 5: IMPORTAR DECK 4 (VOCABULARIO TÉCNICO)

```
- Archivo: ANKI-DECK-VOCABULARIO-IA-TECH-NEGOCIO.txt
- Deck name: "AIC2-Vocabulario-Tech"
- Import
```

**Tiempo:** 10 minutos

---

## PASO 6: ORGANIZAR EN ANKI

Una vez importados, tu estructura debería ser:

```
AIC2-Lector (Deck padre - opcional)
├── AIC2-80-Verbos (80 tarjetas)
├── AIC2-500-Cognados (500 tarjetas)
├── AIC2-Gramatica (50 tarjetas)
└── AIC2-Vocabulario-Tech (330 tarjetas)

TOTAL: 960 tarjetas
```

### Para crear estructura:

```
1. En Anki, right-click en deck name
2. "Rename"
3. Escribe: "AIC2-Lector::80-Verbos"
4. El doble: :: crea sub-deck automáticamente
5. Repite para todos
```

---

## PASO 7: CONFIGURAR ESTUDIO DIARIO

### 7.1 Configuración recomendada

```
Menú: Tools → Preferences
o
Deck settings (botón derecho en deck)

NEW CARDS:
- Per day: 20 (cambiar según tu capacidad)
- Graduating interval: 1 (1 día)
- Easy interval: 4 (4 días)

REVIEW:
- Per day: 100 (suficiente para repaso)
- Easy bonus: 130%
- Interval multiplier: 2.5
- Maximum interval: 36500

LAPSE:
- Relearning steps: 10 (vuelve a aprender)
- New interval: 0.5
```

### 7.2 Explicación simple

```
✅ Estudias 20 tarjetas nuevas/día
✅ Repasas tarjetas viejas (100/día máximo)
✅ Anki decide automáticamente cuándo repetir
✅ Las fáciles se espacian más
✅ Las difíciles se repiten antes
```

---

## PASO 8: RUTINA DIARIA (RECOMENDADA)

### Mañana (15 minutos)
```
1. Abre Anki
2. Click: "Study now"
3. Ve a: AIC2-80-Verbos (primera semana)
4. Estudia: 5-10 tarjetas nuevas
5. Responde: "Again", "Good", o "Easy"
```

### Tarde (15 minutos)
```
1. Abre Anki
2. Repite el deck anterior
3. Hoy: repaso de lo que viste ayer
```

### Noche (5 minutos)
```
1. Quick review
2. Asegúrate de haber completado hoy
```

**TOTAL DIARIO:** 35 minutos

---

## CRONOGRAMA DE ACTIVACIÓN DE DECKS

```
SEMANA 1-2:     Estudiar: AIC2-80-Verbos
                Suspender: Cognados, Gramática, Vocabulario

SEMANA 3-4:     Estudiar: AIC2-80-Verbos + AIC2-500-Cognados (NUEVOS)
                Suspender: Gramática, Vocabulario

SEMANA 5-8:     Estudiar: Cognados + Gramática (NUEVO)
                Suspender: Vocabulario

SEMANA 9-14:    Estudiar: Gramática (intenso)
                Estudiar: Vocabulario (introducir gradualmente)

SEMANA 15-24:   Estudiar: Vocabulario (especialización)
                Revisar: Todos los decks
```

### Cómo "suspender" un deck:

```
1. Right-click en deck name
2. "Suspend"
3. Desaparece de la pantalla de estudio
4. Cuando lo necesites: click "Unsuspend"
```

---

## SINCRONIZACIÓN: ANKI WEB (OPTIONAL)

Si quieres estudiar en PC y móvil:

```
1. En Anki: Create AnkiWeb account
2. Tools → Sync with AnkiWeb
3. Descarga AnkiDroid en tu móvil
4. Login con tu cuenta
5. Sync automático
```

**Beneficio:** Estudias en PC por la mañana, repasas en móvil en el transporte

---

## TROUBLESHOOTING

### "No se importó nada"

```
Problema: Archivo no está en formato correcto
Solución:
1. Abre el .txt en Notepad (NO Word)
2. Verifica: Frente[TAB]Reverso[TAB]Etiqueta
3. Cada línea debe tener EXACTAMENTE eso
4. Intenta importar de nuevo
```

### "¿Por qué solo veo 10 tarjetas en lugar de 80?"

```
Problema: Anki distribuye tarjetas por día (20/día es el default)
Solución:
1. Espera a mañana (nuevas tarjetas aparecen cada día)
O
1. Tools → Preferences
2. New cards per day: aumenta a 30-40
3. Verás más tarjetas HOY
```

### "Importé el mismo deck dos veces y ahora tengo duplicados"

```
Solución:
1. Tools → Check Database
2. Anki detecta duplicados automáticamente
3. Elimina duplicados
```

### "Anki es muy lento"

```
Solución:
1. Tools → Check Database (optimiza)
2. Reduce tarjetas nuevas/día (20 es suficiente)
3. Si sigue lento: reinstala Anki
```

---

## MÉTRICAS Y MONITOREO

### Qué ver en Anki

```
Dashboard muestra:
✅ Tarjetas nuevas hoy: cuántas debajo de aprender
✅ Revisiones pendientes: cuántas para repasar
✅ Learning: tarjetas que aún estás aprendiendo
✅ Due: tarjetas vencidas que necesitan repaso
```

### Meta semanal

```
SEMANA 1-2:
- Nuevas: 70-80 verbos
- Revisiones: creciendo
- Objetivo: 0 atrasadas

SEMANA 3-4:
- Nuevas: 50 cognados (ampl

iando)
- Revisiones: ~100-150
- Objetivo: Mantener sin atraso

SEMANA 5-8:
- Nuevas: 50 cognados
- Gramática: 5-10 nuevas
- Revisiones: 200+
- Objetivo: Completar cada día
```

---

## INTEGRACIÓN CON TU ESTUDIO

### Anki es SOLO una herramienta

```
Anki no es TODO tu estudio. Es:
✅ 35 min/día (tarjetas SRS)
❌ Pero TAMBIÉN necesitas:
   - Lectura de artículos (30 min)
   - Escucha de videos (30 min)
   - Búsqueda de frases reales (15 min)

TOTAL DIARIO: 110-120 minutos (1.5-2 horas)
```

### Plan completo de estudio (NO solo Anki)

```
MAÑANA (4.5h):
- Anki: 30 min (SRS)
- Lectura: 2h (artículos, frases modelo)
- Gramática: 1.5h (explicaciones + ejemplos)
- Búsqueda frases reales: 30 min

TARDE (1.5h):
- Anki repaso: 30 min
- Escucha: 1h (YouTube, podcasts)

TOTAL: 6h/día (como planificado)
```

---

## ✅ CHECKLIST: DESPUÉS DE IMPORTAR

- [ ] Descargué Anki
- [ ] Importé Deck 1 (80 verbos)
- [ ] Importé Deck 2 (500 cognados)
- [ ] Importé Deck 3 (Gramática)
- [ ] Importé Deck 4 (Vocabulario tech)
- [ ] Configuré estudio: 20 tarjetas/día
- [ ] Configuré sincronización (AnkiWeb) - OPCIONAL
- [ ] Estudié hoy: 20 tarjetas nuevas
- [ ] Actualicé MI-PROGRESO.txt

---

## 🎯 PRÓXIMOS PASOS

Después de importar Anki:

```
1. HOY: Estudia 20 verbos (AIC2-80-Verbos)
2. MAÑANA: Repasa 20 de ayer + 5 nuevos
3. SEMANA 1: Termina los 80 verbos
4. SEMANA 2: Introce cognados
5. SEMANA 3-4: 80 verbos + 500 cognados (repaso)
6. SEMANA 5+: Agrega gramática y vocabulario
```

---

**Tiempo total de setup: 45 minutos**

**Después:** 35 min/día de estudio SRS

**Resultado:** 960 tarjetas organizadas y listas para 12 meses de aprendizaje

---

Versión: 1.0
Fecha: 2026-05-09
Estado: LISTO PARA USAR
