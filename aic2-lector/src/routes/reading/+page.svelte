<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import ReadingCoach from '$lib/components/ReadingCoach.svelte';
  import ReadingBudget from '$lib/components/ReadingBudget.svelte';
  import { getFoundationLesson } from '$lib/data/foundation';
  import { db, type Text, type CefrLevel, type Word, type ReadingSession } from '$lib/db';
  import { recordDailyProgress } from '$lib/db/stats';
  import { getReadingQuestions } from '$lib/data/readingQuestions';
  import {
    calculateCalibrationSummary,
    calculateGlossCoverage,
    calculateWpm,
    isWpmValidated,
    minimumCorrectAnswers,
    PILOT_COMPREHENSION_THRESHOLD,
    PILOT_MAX_VALIDATED_WPM,
    scoreByQuestionKind,
    scoreComprehension,
    type CalibrationSummary,
    type ConfidenceLevel,
    type QuestionKindScore,
  } from '$lib/reading/metrics';
  import { validateParallelForms } from '$lib/reading/parallelForms';
  import { getRetestPlans, type RetestPlan } from '$lib/reading/retention';
  import { buildReadingLearningEvents } from '$lib/reading/learningEvents';
  import { toasts } from '$lib/stores/app';
  import { BookOpen, ChevronRight, Play, Pause, RotateCcw, Target, Volume2, X, CheckCircle2, AlertTriangle } from 'lucide-svelte';

  type ReadingPhase = 'reading' | 'quiz' | 'results';

  type SessionResult = {
    wpm: number;
    comprehension: number;
    correct: number;
    total: number;
    wpmValidated: boolean;
    glossClicks: number;
    firstAttempt: boolean;
    assessmentRole: 'formative' | 'transfer' | 'delayed-retest';
    evidenceByKind: QuestionKindScore[];
    calibration: CalibrationSummary;
  };

  let texts = $state<Text[]>([]);
  let levelFilter = $state<'all' | 'A1' | 'A2'>('A1');
  let selectedText = $state<Text | null>(null);
  let isReading = $state(false);
  let isPaused = $state(false);
  let startTime = $state(0);
  let elapsedTime = $state(0);
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let currentText = $state('');
  let phase = $state<ReadingPhase>('reading');
  let quizAnswers = $state<Array<number | undefined>>([]);
  let confidenceAnswers = $state<Array<ConfidenceLevel | null>>([]);
  let sessionResult = $state<SessionResult | null>(null);
  let glossClickCount = $state(0);
  let finishedDurationMs = $state(0);
  let sessionStartedAt = $state(0);
  let pauseStartedAt = $state(0);
  let totalPausedMs = $state(0);
  let pauseCount = $state(0);

  let dbWords = $state<Map<string, Word>>(new Map());
  let selectedWord = $state<Word | null>(null);
  let wordPopoverPos = $state({ x: 0, y: 0 });
  let readingSessions = $state<ReadingSession[]>([]);
  let retestPlans = $state<RetestPlan[]>([]);
  let activeRetestPlan = $state<RetestPlan | null>(null);
  let questions = $derived(selectedText ? getReadingQuestions(selectedText.id) : []);
  let foundationLesson = $derived(selectedText ? getFoundationLesson(selectedText.id) : undefined);
  let glossCoverage = $derived(calculateGlossCoverage(currentText, dbWords.keys()));
  const TRANSFER_TEXT_ID = 'mulesoft-runtime-policy-transfer-b1';

  onMount(async () => {
    texts = await db.texts.toArray();
    const words = await db.words.toArray();
    dbWords = new Map(words.map(w => [w.lemma.toLowerCase(), w]));
    await refreshRetestPlans();
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
  });

  function clearTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  async function refreshRetestPlans() {
    readingSessions = await db.readingSessions.toArray();
    retestPlans = getRetestPlans(readingSessions);
  }

  function selectText(text: Text, retestPlan: RetestPlan | null = null) {
    selectedText = text;
    activeRetestPlan = retestPlan;
    currentText = text.body;
    isReading = false;
    isPaused = false;
    elapsedTime = 0;
    finishedDurationMs = 0;
    sessionStartedAt = 0;
    pauseStartedAt = 0;
    totalPausedMs = 0;
    pauseCount = 0;
    phase = 'reading';
    quizAnswers = [];
    confidenceAnswers = [];
    sessionResult = null;
    glossClickCount = 0;
    selectedWord = null;
  }

  function isTransferText(text: Text): boolean {
    return text.id === TRANSFER_TEXT_ID;
  }

  function evidenceLabel(kind: string): string {
    const labels: Record<string, string> = {
      literal: 'Información explícita',
      sequence: 'Cohesión y secuencia',
      causal: 'Relaciones causales',
      inference: 'Inferencia',
      evaluative: 'Evaluación',
      modality: 'Modalidad y obligación',
      stance: 'Postura del autor',
      cohesion: 'Cohesión',
      implicature: 'Implicatura',
      'rhetorical-purpose': 'Propósito retórico',
      unclassified: 'Sin clasificar',
    };
    return labels[kind] ?? kind;
  }

  function startTransferProbe() {
    const transferText = texts.find(text => text.id === TRANSFER_TEXT_ID);
    if (transferText) selectText(transferText);
  }

  function findRetestText(plan: RetestPlan): Text | null {
    const sourceText = texts.find(text => text.id === plan.sourceTextId);
    const expectedForm = plan.windowDays === 7 ? 'B' : 'C';
    if (!sourceText?.parallel_group || sourceText.parallel_form !== 'A') return null;

    const parallelTexts = texts.filter(text => (
      text.parallel_group === sourceText.parallel_group
      && text.parallel_form
    ));
    const validation = validateParallelForms(parallelTexts.map(text => ({
      formId: `${text.parallel_group}-${text.parallel_form}`,
      textId: text.id,
      level: text.cefr_level,
      genre: text.genre,
      wordCount: text.word_count,
      itemCount: getReadingQuestions(text.id).length,
      capabilityKinds: getReadingQuestions(text.id).map(question => question.kind),
      version: '1.0.0',
    })));
    if (!validation.valid) return null;

    const seenTextIds = new Set(readingSessions.map(session => session.text_id).filter(Boolean));
    return texts.find(text => (
      text.id !== sourceText.id
      && !seenTextIds.has(text.id)
      && text.parallel_group === sourceText.parallel_group
      && text.parallel_form === expectedForm
    )) ?? null;
  }

  function startRetest(plan: RetestPlan) {
    if (plan.status === 'upcoming') return;
    const retestText = findRetestText(plan);
    if (!retestText) {
      toasts.warning('No hay todavía un texto paralelo no visto del mismo nivel y género.');
      return;
    }
    selectText(retestText, plan);
  }

  function formatRetestDate(date: Date): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(date);
  }

  function startReading() {
    isReading = true;
    isPaused = false;
    if (elapsedTime === 0) sessionStartedAt = Date.now();
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
    }, 100);
  }

  function pauseReading() {
    isPaused = true;
    pauseStartedAt = Date.now();
    pauseCount += 1;
    clearTimer();
  }

  function resumeReading() {
    if (pauseStartedAt > 0) {
      totalPausedMs += Date.now() - pauseStartedAt;
      pauseStartedAt = 0;
    }
    isPaused = false;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
    }, 100);
  }

  function resetReading() {
    clearTimer();
    isReading = false;
    isPaused = false;
    elapsedTime = 0;
    finishedDurationMs = 0;
    sessionStartedAt = 0;
    pauseStartedAt = 0;
    totalPausedMs = 0;
    pauseCount = 0;
    phase = 'reading';
    quizAnswers = [];
    confidenceAnswers = [];
    sessionResult = null;
    glossClickCount = 0;
  }

  function finishReading() {
    if (!selectedText || elapsedTime < 1_000) {
      toasts.warning('Lee al menos un segundo antes de terminar.');
      return;
    }
    if (questions.length === 0) {
      toasts.warning('Este texto todavía no tiene preguntas; la sesión no puede validarse.');
      return;
    }

    if (isPaused && pauseStartedAt > 0) {
      totalPausedMs += Date.now() - pauseStartedAt;
      pauseStartedAt = 0;
    }
    clearTimer();
    isReading = false;
    isPaused = false;
    finishedDurationMs = elapsedTime;
    quizAnswers = Array(questions.length).fill(undefined);
    confidenceAnswers = Array(questions.length).fill(null);
    selectedWord = null;
    phase = 'quiz';
  }

  function answerQuestion(questionIndex: number, answerIndex: number) {
    quizAnswers[questionIndex] = answerIndex;
    quizAnswers = [...quizAnswers];
  }

  function setConfidence(questionIndex: number, level: ConfidenceLevel | null) {
    confidenceAnswers[questionIndex] = level;
    confidenceAnswers = [...confidenceAnswers];
  }

  async function submitComprehension() {
    if (!selectedText || quizAnswers.some(answer => answer === undefined)) {
      toasts.warning('Responde todas las preguntas antes de guardar.');
      return;
    }

    const score = scoreComprehension(quizAnswers, questions);
    const evidenceByKind = scoreByQuestionKind(quizAnswers, questions);
    const calibration = calculateCalibrationSummary(quizAnswers, questions, confidenceAnswers);
    const wpm = calculateWpm(selectedText.word_count, finishedDurationMs);
    const wpmValidated = !foundationLesson && isWpmValidated(score.percentage, wpm);
    const previousAttempts = await db.readingSessions.where('text_id').equals(selectedText.id).count();
    const firstAttempt = previousAttempts === 0;
    const finishedAt = new Date();
    const assessmentRole = activeRetestPlan
      ? 'delayed-retest'
      : isTransferText(selectedText) ? 'transfer' : 'formative';
    const sessionId = `reading-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    await db.readingSessions.add({
      id: sessionId,
      text_id: selectedText.id,
      started_at: new Date(sessionStartedAt || finishedAt.getTime() - finishedDurationMs),
      finished_at: finishedAt,
      duration_sec: Math.round(finishedDurationMs / 1_000),
      words_read: selectedText.word_count,
      wpm,
      comprehension_score: score.percentage,
      subvocalization_estimated: 0,
      question_count: score.total,
      assessment_format: foundationLesson ? 'open-text' : 'closed-text',
      correct_count: score.correct,
      gloss_click_count: glossClickCount,
      wpm_validated: wpmValidated,
      first_attempt: firstAttempt,
      assessment_role: assessmentRole,
      assessment_parent_id: activeRetestPlan?.parentSessionId,
      assessment_window_days: activeRetestPlan?.windowDays,
      assessment_evidence: evidenceByKind,
      calibration_evidence: questions.map((question, index) => ({
        question_id: question.id,
        is_correct: quizAnswers[index] === question.correct_index,
        confidence: confidenceAnswers[index] ?? null,
      })),
      pause_count: pauseCount,
      paused_duration_sec: Math.round(totalPausedMs / 1_000),
    });

    await db.learningEvents.bulkAdd(buildReadingLearningEvents({
      sessionId,
      textId: selectedText.id,
      occurredAt: finishedAt,
      assessmentRole,
      assessmentWindowDays: activeRetestPlan?.windowDays,
      questions: questions.map((question, index) => ({
        id: question.id,
        kind: question.kind,
        isCorrect: quizAnswers[index] === question.correct_index,
        confidence: confidenceAnswers[index] ?? null,
      })),
    }));

    await recordDailyProgress({
      reading_time_min: finishedDurationMs / 60_000,
      sessions_count: 1,
      comprehension_avg: score.percentage,
      comprehension_sessions: 1,
      wpm_avg: wpmValidated ? wpm : 0,
      validated_wpm_sessions: wpmValidated ? 1 : 0,
    });

    sessionResult = {
      wpm,
      comprehension: score.percentage,
      correct: score.correct,
      total: score.total,
      wpmValidated,
      glossClicks: glossClickCount,
      firstAttempt,
      assessmentRole,
      evidenceByKind,
      calibration,
    };
    await refreshRetestPlans();
    phase = 'results';
    toasts.success(`Comprensión registrada: ${score.percentage}%`);
  }

  function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function handleWordClick(e: MouseEvent, word: string) {
    const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (!clean) return;
    const found = dbWords.get(clean);
    if (found) {
      selectedWord = found;
      glossClickCount += 1;
      wordPopoverPos = { x: e.clientX, y: e.clientY };
    }
  }

  function speakWord(word: string) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }

  function extractWords(text: string): string[] {
    return [...new Set(text.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z]/g, '')).filter(w => w.length > 2))];
  }

  function getWordStatus(word: string): 'mastered' | 'learning' | 'unknown' | 'new' {
    const w = dbWords.get(word.toLowerCase());
    if (!w) return 'unknown';
    if (w.confidence >= 0.85) return 'mastered';
    if (w.review_count > 0) return 'learning';
    return 'new';
  }

  const statusColors = {
    mastered: 'text-green-600',
    learning: 'text-yellow-600',
    unknown: 'text-gray-500',
    new: 'text-blue-600',
  };

  const levelColors: Record<CefrLevel, string> = {
    A1: 'bg-gray-100 text-gray-700',
    A2: 'bg-blue-100 text-blue-700',
    B1: 'bg-green-100 text-green-700',
    B2: 'bg-yellow-100 text-yellow-700',
    C1: 'bg-orange-100 text-orange-700',
    C2: 'bg-red-100 text-red-700',
  };
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Práctica de lectura</h1>
      <p class="text-gray-500 mt-1">Haz clic en una palabra coloreada para ver su glosa en español.</p>
    </div>
  </div>

  {#if !selectedText}
    <ReadingBudget />
    <div class="card space-y-3">
      <h2 class="font-semibold">Bases de lectura: A1 y A2</h2>
      <p class="text-sm text-gray-600">Empieza con situaciones cotidianas. Cada unidad nueva incluye un objetivo, una pista de gramática y vocabulario. Las etiquetas de nivel son orientativas.</p>
      <div class="flex gap-2" aria-label="Filtrar nivel">
        {#each ['A1', 'A2', 'all'] as level}
          <button class="btn-secondary" aria-pressed={levelFilter === level} onclick={() => levelFilter = level as 'A1' | 'A2' | 'all'}>{level === 'all' ? 'Todos los niveles' : level}</button>
        {/each}
      </div>
    </div>
    {#if retestPlans.length > 0}
      <div class="card border-indigo-200 bg-indigo-50">
        <div class="flex items-start gap-3">
          <Target class="w-6 h-6 text-indigo-600 mt-0.5" />
          <div class="flex-1">
            <h2 class="font-semibold text-indigo-950">Retests diferidos</h2>
            <p class="text-sm text-indigo-800 mt-1">
              Recuperación en textos no vistos. Es una medida de retención, no una certificación CEFR.
            </p>
            <div class="space-y-2 mt-4">
              {#each retestPlans as plan}
                {@const retestText = findRetestText(plan)}
                <div class="flex items-center justify-between gap-3 rounded-md bg-white p-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900">Ventana de {plan.windowDays} días</p>
                    <p class="text-xs text-gray-600">
                      Programado para {formatRetestDate(plan.dueAt)} ·
                      {plan.status === 'upcoming' ? ' todavía no disponible' : plan.status === 'overdue' ? ' atrasado' : ' disponible'}
                    </p>
                  </div>
                  {#if retestText && plan.status !== 'upcoming'}
                    <button type="button" onclick={() => startRetest(plan)} class="btn-secondary whitespace-nowrap">
                      Hacer retest
                    </button>
                  {:else if !retestText}
                    <span class="text-xs text-amber-700 text-right">Falta texto paralelo</span>
                  {:else}
                    <span class="text-xs text-gray-500 text-right">Espera la fecha</span>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <div class="grid gap-4">
      {#each texts.filter(text => !text.retest_only && (levelFilter === 'all' || text.cefr_level === levelFilter)) as text}
        <button
          onclick={() => selectText(text)}
          class="card-hover text-left"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{text.title}</h3>
              <p class="text-sm text-gray-500 mt-1 line-clamp-2">{text.body}</p>
              <div class="flex items-center gap-4 mt-3">
                <span class="badge {levelColors[text.cefr_level]}">{text.cefr_level}</span>
                <span class="text-sm text-gray-500">{text.word_count} palabras</span>
                <span class="text-sm text-gray-500 capitalize">{text.genre}</span>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-gray-400" />
          </div>
        </button>
      {/each}

      {#if !texts.some(text => !text.retest_only && (levelFilter === 'all' || text.cefr_level === levelFilter))}
        <div class="card text-center py-12">
          <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">No hay textos disponibles</p>
          <p class="text-sm text-gray-400 mt-2">Agrega textos para comenzar la práctica.</p>
        </div>
      {/if}
    </div>

  {:else if phase === 'quiz'}
    <div class="max-w-3xl mx-auto space-y-5">
      <div class="card border-primary-200 bg-primary-50">
        <div class="flex items-start gap-3">
          <Target class="w-6 h-6 text-primary-600 mt-0.5" />
          <div>
            <h2 class="text-xl font-bold text-gray-900">Comprueba lo que entendiste</h2>
            <p class="text-sm text-gray-600 mt-1">
              {foundationLesson ? 'Puedes consultar el texto mientras respondes: practica encontrar la evidencia. Esta actividad no mide memoria sin apoyo.' : 'El texto está oculto para medir recuperación. Las frases en español solo explican la pregunta.'}
            </p>
          </div>
        </div>
      </div>

      {#if foundationLesson}
        <article class="card whitespace-pre-wrap leading-relaxed" lang="en" aria-label="Texto de consulta">{foundationLesson.body}</article>
      {/if}
      {#each questions as question, questionIndex}
        <fieldset class="card">
          <legend class="font-semibold text-gray-900 mb-1">
            {questionIndex + 1}. {question.prompt_en}
          </legend>
          <p class="text-sm text-gray-500 mb-4">{question.support_es}</p>
          <div class="grid gap-2">
            {#each question.options as option, answerIndex}
              <button
                type="button"
                onclick={() => answerQuestion(questionIndex, answerIndex)}
                aria-pressed={quizAnswers[questionIndex] === answerIndex}
                class="text-left rounded-lg border px-4 py-3 transition-colors
                  {quizAnswers[questionIndex] === answerIndex
                    ? 'border-primary-500 bg-primary-50 text-primary-800'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'}"
              >
                {option}
              </button>
            {/each}
          </div>
          <div class="mt-4 border-t border-gray-100 pt-4">
            <p class="text-sm font-medium text-gray-700">Después de elegir: ¿qué tan seguro estás?</p>
            <p class="text-xs text-gray-500 mt-1">No suma ni resta puntos. Sirve para detectar cuándo tu confianza no coincide con la comprensión.</p>
            <div class="flex flex-wrap gap-2 mt-2">
              {#each [
                { value: 0 as ConfidenceLevel, label: 'Baja' },
                { value: 1 as ConfidenceLevel, label: 'Media' },
                { value: 2 as ConfidenceLevel, label: 'Alta' },
              ] as option}
                <button
                  type="button"
                  onclick={() => setConfidence(questionIndex, option.value)}
                  aria-pressed={confidenceAnswers[questionIndex] === option.value}
                  class="rounded-md border px-3 py-2 text-sm transition-colors
                    {confidenceAnswers[questionIndex] === option.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                      : 'border-gray-200 text-gray-600 hover:border-indigo-300'}"
                >
                  {option.label}
                </button>
              {/each}
              <button
                type="button"
                onclick={() => setConfidence(questionIndex, null)}
                aria-pressed={confidenceAnswers[questionIndex] === null}
                class="rounded-md border px-3 py-2 text-sm transition-colors
                  {confidenceAnswers[questionIndex] === null
                    ? 'border-gray-500 bg-gray-100 text-gray-800'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}"
              >
                Prefiero no decir
              </button>
            </div>
          </div>
        </fieldset>
      {/each}

      <div class="flex items-center justify-between gap-4">
        <p class="text-sm text-gray-500">
          {quizAnswers.filter(answer => answer !== undefined).length}/{questions.length} respondidas
        </p>
        <button
          onclick={submitComprehension}
          disabled={quizAnswers.some(answer => answer === undefined)}
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Calificar y guardar
        </button>
      </div>
    </div>

  {:else if phase === 'results' && sessionResult}
    {#key sessionResult}
      <ReadingCoach evidence={sessionResult.evidenceByKind} />
    {/key}
    <div class="max-w-3xl mx-auto space-y-5">
      <div class="card text-center">
        {#if foundationLesson}
          <p class="text-sm text-gray-600">Práctica con texto de consulta: el WPM inicial es descriptivo y no cuenta como velocidad validada.</p>
        {:else if sessionResult.wpmValidated}
          <CheckCircle2 class="w-12 h-12 text-green-500 mx-auto mb-3" />
        {:else}
          <AlertTriangle class="w-12 h-12 text-amber-500 mx-auto mb-3" />
        {/if}
        <h2 class="text-2xl font-bold text-gray-900">Resultado de comprensión</h2>
        <p class="text-sm text-gray-500 mt-2">
          Chequeo formativo de esta lectura; no certifica ni estima tu nivel CEFR.
        </p>
        {#if isTransferText(selectedText)}
          <p class="text-sm text-indigo-700 mt-2">
            Sonda de transferencia: texto nuevo del mismo dominio, con preguntas nuevas; compárala con la sesión formativa, no con un examen CEFR.
          </p>
        {/if}
        {#if sessionResult.assessmentRole === 'delayed-retest'}
          <p class="text-sm text-indigo-700 mt-2">
            Retest diferido de {activeRetestPlan?.windowDays ?? '?'} días: texto no visto elegido del mismo nivel y género. Este resultado mide retención aproximada, no nivel CEFR.
          </p>
        {/if}
        <div class="grid sm:grid-cols-3 gap-4 mt-6">
          <div class="rounded-lg bg-primary-50 p-4">
            <p class="text-3xl font-bold text-primary-700">{sessionResult.comprehension}%</p>
            <p class="text-sm text-gray-600">comprensión</p>
          </div>
          <div class="rounded-lg bg-gray-50 p-4">
            <p class="text-3xl font-bold text-gray-900">{sessionResult.correct}/{sessionResult.total}</p>
            <p class="text-sm text-gray-600">respuestas correctas</p>
          </div>
          <div class="rounded-lg bg-gray-50 p-4">
            <p class="text-3xl font-bold text-gray-900">{sessionResult.wpm}</p>
            <p class="text-sm text-gray-600">WPM bruto</p>
          </div>
        </div>

        <div class="mt-6 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="font-semibold text-indigo-950">Perfil de evidencia</h3>
              <p class="text-sm text-indigo-800 mt-1">
                {sessionResult.assessmentRole === 'transfer' ? 'Transferencia técnica' : 'Práctica formativa'}.
                Desglosa esta sesión; no convierte el resultado en un nivel CEFR.
              </p>
            </div>
            <span class="text-xs font-medium text-indigo-700">{sessionResult.evidenceByKind.length} dimensiones</span>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {#each sessionResult.evidenceByKind as evidence}
              <div class="rounded-md bg-white p-3">
                <p class="text-xs text-gray-600">{evidenceLabel(evidence.kind)}</p>
                <p class="text-xl font-bold text-indigo-700 mt-1">{evidence.percentage}%</p>
                <p class="text-xs text-gray-500">{evidence.correct}/{evidence.total} correctas</p>
              </div>
            {/each}
          </div>
        </div>

        <div class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left">
          <h3 class="font-semibold text-gray-900">Termómetro de confianza</h3>
          <p class="text-sm text-gray-600 mt-1">
            Registraste {sessionResult.calibration.n}/{sessionResult.calibration.n + sessionResult.calibration.omitted} respuestas de confianza.
            No afecta tu calificación.
          </p>
          {#if sessionResult.calibration.reportable}
            <p class="text-sm text-gray-700 mt-2">
              Sesgo: {sessionResult.calibration.bias}; error Brier aproximado: {sessionResult.calibration.brierLike}.
              Un sesgo positivo indica sobreconfianza.
            </p>
          {:else}
            <p class="text-xs text-gray-500 mt-2">
              Se necesitan al menos 10 observaciones para mostrar un indicador de calibración; por ahora solo se registra el conteo.
            </p>
          {/if}
        </div>

        {#if foundationLesson}
          <p class="mt-5 text-sm text-gray-600">Resultado de práctica con texto visible. Esta sesión no certifica un nivel ni valida velocidad.</p>
        {:else if sessionResult.wpmValidated}
          <p class="mt-5 text-sm text-green-700">
            WPM validado: se necesitaban {minimumCorrectAnswers(sessionResult.total)}/{sessionResult.total}
            respuestas correctas (umbral piloto de {PILOT_COMPREHENSION_THRESHOLD}%).
          </p>
        {:else if sessionResult.comprehension < PILOT_COMPREHENSION_THRESHOLD}
          <p class="mt-5 text-sm text-amber-700">
            El WPM queda solo como referencia: se necesitaban {minimumCorrectAnswers(sessionResult.total)}/{sessionResult.total}
            respuestas correctas (umbral piloto de {PILOT_COMPREHENSION_THRESHOLD}%).
          </p>
        {:else}
          <p class="mt-5 text-sm text-amber-700">
            El WPM queda solo como referencia porque superó el techo piloto de {PILOT_MAX_VALIDATED_WPM} WPM.
            Inicia el temporizador antes de leer; el objetivo es comprensión, no romper el contador.
          </p>
        {/if}
        <p class="text-sm text-gray-500 mt-2">
          Glosas consultadas: {sessionResult.glossClicks}. Intento: {sessionResult.firstAttempt ? 'texto nuevo' : 'relectura'}.
        </p>
      </div>

      <div class="card">
        <h3 class="font-semibold text-gray-900 mb-4">Retroalimentación</h3>
        <div class="space-y-4">
          {#each questions as question, index}
            {@const wasCorrect = quizAnswers[index] === question.correct_index}
            <div class="rounded-lg border p-4 {wasCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}">
              <p class="font-medium text-gray-900">{index + 1}. {question.prompt_en}</p>
              <p class="text-sm mt-1 {wasCorrect ? 'text-green-700' : 'text-red-700'}">
                {wasCorrect ? 'Correcta' : `Tu respuesta: ${question.options[quizAnswers[index] ?? 0]}`}
              </p>
              <p class="text-sm text-gray-600 mt-2">{question.explanation_es}</p>
            </div>
          {/each}
        </div>
      </div>

      <details class="card">
        <summary class="cursor-pointer font-semibold text-gray-900">
          Revisar el texto después de la calificación
        </summary>
        <p class="text-sm text-gray-500 mt-2 mb-4">
          Esta revisión es estudio y retroalimentación; no cambia la nota ya guardada.
        </p>
        <div class="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">{currentText}</div>
      </details>

      <div class="flex flex-wrap gap-3 justify-end">
        <button onclick={() => { selectedText = null; resetReading(); }} class="btn-secondary">
          Volver a textos
        </button>
        {#if !isTransferText(selectedText!) && texts.some(text => isTransferText(text))}
          <button onclick={startTransferProbe} class="btn-secondary">
            Probar texto nuevo
          </button>
        {/if}
        <button onclick={() => selectText(selectedText!)} class="btn-primary">
          Repetir texto
        </button>
      </div>
    </div>

  {:else}
    <div class="flex items-center gap-4 flex-wrap">
      <button onclick={() => { selectedText = null; resetReading(); selectedWord = null; }} class="text-gray-500 hover:text-gray-700">
        ← Volver a textos
      </button>
      <span class="badge {levelColors[selectedText.cefr_level]}">{selectedText.cefr_level}</span>
      <span class="text-sm text-gray-500">{selectedText.word_count} palabras</span>
      <span class="badge-info">Glosas exactas: {glossCoverage.percentage}%</span>
      {#if isTransferText(selectedText)}
        <span class="badge-info">Sonda de transferencia</span>
      {/if}
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 card">
        <div class="mb-4">
          <h2 class="text-xl font-bold text-gray-900">{selectedText.title}</h2>
          {#if foundationLesson}
            <p class="mt-2 text-sm text-indigo-800">Objetivo: {foundationLesson.objective_es}</p>
            <details class="mt-3 text-sm">
              <summary class="cursor-pointer font-medium">Ayuda para esta lectura</summary>
              <p class="mt-2">{foundationLesson.grammar_es}</p>
              <ul class="mt-2 list-disc pl-5">
                {#each foundationLesson.glossary as entry}<li><span lang="en">{entry.en}</span>: {entry.es}</li>{/each}
              </ul>
            </details>
          {/if}
        </div>

        {#if isReading || isPaused || elapsedTime > 0}
          <div class="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
            {#each currentText.split(/(\s+)/) as segment}
              {#if segment.trim()}
                {@const clean = segment.replace(/[^a-zA-Z]/g, '').toLowerCase()}
                {@const word = dbWords.get(clean)}
                {#if word}
                  <button
                    onclick={(e) => handleWordClick(e, segment)}
                    class="inline cursor-pointer transition-colors rounded hover:bg-yellow-100 px-0.5
                           {word.confidence >= 0.85 ? 'text-green-700' : word.review_count > 0 ? 'text-blue-700' : 'text-orange-700'}"
                    title="{word.lemma}: {word.translations_es[0]}"
                  >
                    {segment}
                  </button>
                {:else}
                  <span class="text-gray-800">{segment}</span>
                {/if}
              {:else}
                <span>{segment}</span>
              {/if}
            {/each}
          </div>
        {:else}
          <div class="rounded-lg border border-dashed border-primary-300 bg-primary-50 p-8 text-center">
            <BookOpen class="w-10 h-10 text-primary-400 mx-auto mb-3" />
            <p class="font-medium text-gray-800">El texto aparecerá al iniciar el temporizador.</p>
            <p class="text-sm text-gray-500 mt-1">Así la medición comienza antes de que leas.</p>
          </div>
        {/if}
      </div>

      <div class="space-y-4">
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-900">Temporizador</h3>
            <span class="text-2xl font-mono font-bold text-primary-600">
              {formatTime(elapsedTime)}
            </span>
          </div>

          <p class="text-sm text-gray-500 mb-4">
            El WPM se mostrará después del cuestionario y solo contará si la comprensión lo valida.
            Puedes pausar sin penalización; el tiempo de pausa se registra aparte.
          </p>
          <p class="text-xs text-gray-500 mb-4">
            Cobertura del banco de glosas: {glossCoverage.coveredTokens}/{glossCoverage.totalTokens} tokens
            ({glossCoverage.percentage}%). Es una coincidencia exacta con el banco, no una medida de vocabulario conocido ni de nivel CEFR.
          </p>

          <div class="space-y-3">
            {#if !isReading && elapsedTime === 0}
              <button onclick={startReading} class="btn-primary w-full flex items-center justify-center gap-2">
                <Play class="w-5 h-5" />
                Comenzar lectura
              </button>
            {:else if isReading && !isPaused}
              <button onclick={pauseReading} class="btn-secondary w-full flex items-center justify-center gap-2">
                <Pause class="w-5 h-5" />
                Pausar
              </button>
              <button onclick={finishReading} class="btn-primary w-full flex items-center justify-center gap-2">
                <Target class="w-5 h-5" />
                Terminar y comprobar
              </button>
            {:else if isPaused}
              <button onclick={resumeReading} class="btn-primary w-full flex items-center justify-center gap-2">
                <Play class="w-5 h-5" />
                Continuar
              </button>
              <button onclick={finishReading} class="btn-secondary w-full flex items-center justify-center gap-2">
                <Target class="w-5 h-5" />
                Terminar y comprobar
              </button>
            {/if}

            {#if elapsedTime > 0}
              <button onclick={resetReading} class="w-full py-2 text-sm text-gray-500 hover:text-gray-700">
                <RotateCcw class="w-4 h-4 inline mr-1" />
                Reiniciar
              </button>
            {/if}
          </div>
        </div>

        {#if selectedWord}
          <div class="card bg-primary-50 border-primary-200">
            <div class="flex items-start justify-between mb-3">
              <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                {selectedWord.lemma}
                <button onclick={() => speakWord(selectedWord!.lemma)} class="text-gray-400 hover:text-primary-600">
                  <Volume2 class="w-4 h-4" />
                </button>
              </h3>
              <button onclick={() => selectedWord = null} class="text-gray-400 hover:text-gray-600">
                <X class="w-4 h-4" />
              </button>
            </div>
            {#each selectedWord.translations_es as translation}
              <span class="inline-block px-3 py-1 bg-white text-primary-700 rounded-full text-sm font-medium mr-1 mb-1">
                {translation}
              </span>
            {/each}
            {#if selectedWord.ipa}
              <p class="text-xs text-gray-500 mt-2">/{selectedWord.ipa}/</p>
            {/if}
            {#if selectedWord.examples.length > 0}
              <p class="text-sm text-gray-600 mt-2 italic">"{selectedWord.examples[0]}"</p>
            {/if}
            <div class="flex items-center gap-2 mt-2">
              <span class="badge {levelColors[selectedWord.cefr_level]}">{selectedWord.cefr_level}</span>
              <span class="text-xs text-gray-500 capitalize">{selectedWord.layer}</span>
            </div>
          </div>
        {/if}

        {#if isReading || isPaused || elapsedTime > 0}
          <div class="card">
            <h3 class="font-semibold text-gray-900 mb-3">Palabras del texto</h3>
            <div class="text-xs text-gray-500 space-y-1 mb-3">
              <p><span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>Dominada</p>
              <p><span class="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>En aprendizaje</p>
              <p><span class="inline-block w-2 h-2 bg-orange-500 rounded-full mr-1"></span>Sin revisar</p>
            </div>
            <div class="space-y-1 max-h-64 overflow-y-auto">
              {#each extractWords(currentText) as word}
                {@const status = getWordStatus(word)}
                {#if status !== 'unknown'}
                  <div class="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-gray-50">
                    <span class="{statusColors[status]}">{word}</span>
                    <span class="text-xs text-gray-400">{status}</span>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
