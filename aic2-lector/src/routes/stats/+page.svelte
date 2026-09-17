<script lang="ts">
  import { onMount } from 'svelte';
  import { getStats, getMonthlyStats, getWeeklyProgress, getVocabularyBreakdown, getWordsByLayer, getLearningEvidenceSummary, type LearningEvidenceSummary } from '$lib/db/stats';
  import { TrendingUp, Flame, BookOpen, Clock, Target, BarChart3, Trophy } from 'lucide-svelte';
  import type { UserStats, DailyProgress } from '$lib/db';

  let stats: UserStats | undefined = $state();
  let monthly = $state({ totalWordsLearned: 0, totalReadingTime: 0, totalSessions: 0, avgWpm: 0, avgComprehension: 0, daysActive: 0 });
  let weekly = $state<DailyProgress[]>([]);
  let vocabBreakdown = $state({ mastered: 0, learning: 0, weak: 0, total: 0 });
  let wordsByLayer = $state<Record<string, number>>({});
  let evidence = $state<LearningEvidenceSummary | undefined>();

  onMount(async () => {
    stats = await getStats();
    monthly = await getMonthlyStats();
    weekly = await getWeeklyProgress();
    vocabBreakdown = await getVocabularyBreakdown();
    wordsByLayer = await getWordsByLayer();
    evidence = await getLearningEvidenceSummary();
  });

  const cefrLabels = {
    A1: 'Beginner',
    A2: 'Elementary',
    B1: 'Intermediate',
    B2: 'Upper Intermediate',
    C1: 'Advanced',
    C2: 'Proficiency',
  };

  const cefrProgress: Record<string, { current: number; target: number }> = {
    A1: { current: 800, target: 800 },
    A2: { current: 2000, target: 2000 },
    B1: { current: 4000, target: 4000 },
    B2: { current: 7000, target: 7000 },
    C1: { current: 10000, target: 10000 },
    C2: { current: 12000, target: 12000 },
  };

  const evidenceLabels = {
    formative: 'Práctica con ayuda',
    transfer: 'Transferencia a texto nuevo',
    'delayed-retest': 'Retención diferida',
  } as const;

  const formatPercent = (value: number | null) => value === null ? '—' : `${Math.round(value * 100)}%`;
  const formatInterval = (lower: number, upper: number) => `${Math.round(lower * 100)}–${Math.round(upper * 100)}%`;
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Statistics</h1>
    <p class="text-gray-500 mt-1">Track your learning progress</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="card">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-orange-100 rounded-lg">
          <Flame class="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{stats?.current_streak ?? 0}</p>
          <p class="text-sm text-gray-500">Current Streak</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-purple-100 rounded-lg">
          <Trophy class="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{stats?.longest_streak ?? 0}</p>
          <p class="text-sm text-gray-500">Longest Streak</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-blue-100 rounded-lg">
          <BookOpen class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{stats?.total_words_mastered ?? 0}</p>
          <p class="text-sm text-gray-500">Words Mastered</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-green-100 rounded-lg">
          <Clock class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{Math.round((stats?.total_reading_time_min ?? 0) / 60)}h</p>
          <p class="text-sm text-gray-500">Total Reading</p>
        </div>
      </div>
    </div>
  </div>

  <div class="grid lg:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">This Month</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <p class="text-3xl font-bold text-primary-600">{monthly.totalWordsLearned}</p>
          <p class="text-sm text-gray-500">Words Learned</p>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <p class="text-3xl font-bold text-primary-600">{monthly.totalReadingTime}m</p>
          <p class="text-sm text-gray-500">Reading Time</p>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <p class="text-3xl font-bold text-primary-600">{monthly.avgWpm}</p>
          <p class="text-sm text-gray-500">Avg WPM</p>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <p class="text-3xl font-bold text-primary-600">{monthly.daysActive}</p>
          <p class="text-sm text-gray-500">Days Active</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Vocabulary by Layer</h2>
      <div class="space-y-4">
        {#each Object.entries(wordsByLayer) as [layer, count]}
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="capitalize text-gray-600">{layer === 'technical-ia' ? 'Technical IA' : layer}</span>
              <span class="font-medium">{count} words</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-bar-fill"
                style="width: {vocabBreakdown.total > 0 ? (count / vocabBreakdown.total) * 100 : 0}%"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-gray-900 mb-2">Evidencia longitudinal de lectura</h2>
    <p class="text-sm text-gray-500 mb-4">
      Resultados acumulados por actividad. Pueden incluir reintentos, texto visible y texto oculto: no son mediciones equivalentes. El intervalo Wilson supone respuestas independientes, supuesto que puede fallar al repetir textos. Los registros antiguos pueden no indicar el formato. Este resumen no certifica CEFR ni demuestra aprendizaje.
    </p>
    {#if evidence}
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b text-left text-gray-500">
              <th class="py-2 pr-4 font-medium">Tipo</th>
              <th class="py-2 px-2 font-medium">Respuestas</th>
              <th class="py-2 px-2 font-medium">Precisión</th>
              <th class="py-2 pl-2 font-medium">Intervalo orientativo</th>
            </tr>
          </thead>
          <tbody>
            {#each evidence.assessment as ledger}
              <tr class="border-b last:border-0">
                <td class="py-3 pr-4 font-medium text-gray-800">{evidenceLabels[ledger.role]}</td>
                <td class="py-3 px-2 text-gray-600">{ledger.answered} <span class="text-xs">({ledger.measuredSessions} sesiones)</span></td>
                <td class="py-3 px-2 font-semibold">{formatPercent(ledger.accuracy)}</td>
                <td class="py-3 pl-2 text-gray-600">
                  {#if ledger.interval}{formatInterval(ledger.interval.lower, ledger.interval.upper)}{:else}—{/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="mt-4 space-y-2">
        {#each evidence.assessment as ledger}
          {#if ledger.answered > 0 && !ledger.enoughForDescriptiveTrend}
            <p class="text-xs text-amber-700 bg-amber-50 rounded p-2">
              {evidenceLabels[ledger.role]}: muestra exploratoria ({ledger.answered} respuestas). El umbral interno de 30 no garantiza estabilidad ni validez.
            </p>
          {/if}
        {/each}
      </div>
      {@const calibrationTotal = evidence.calibration.reduce((sum, ledger) => sum + ledger.n, 0)}
      {@const calibrationBias = evidence.calibration.reduce((sum, ledger) => sum + (ledger.bias ?? 0) * ledger.n, 0)}
      <div class="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
        <p class="font-medium text-gray-800">Calibración de confianza</p>
        {#if calibrationTotal >= 30}
          <p class="mt-1">Sesgo medio ponderado: {formatPercent(calibrationBias / calibrationTotal)}. Positivo significa exceso de confianza.</p>
        {:else}
          <p class="mt-1">Hay {calibrationTotal} respuestas con confianza declarada. Aún no se muestra una tendencia para evitar sobreinterpretar una muestra pequeña.</p>
        {/if}
      </div>
    {:else}
      <p class="text-sm text-gray-500">Todavía no hay sesiones con evidencia longitudinal.</p>
    {/if}
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-gray-900 mb-2">Hitos internos de práctica</h2>
    <p class="text-sm text-gray-500 mb-4">
      Estos hitos organizan volumen de vocabulario y actividad. No diagnostican ni certifican un nivel CEFR.
    </p>
    <div class="space-y-6">
      {#each Object.entries(cefrLabels) as [level, label]}
        {@const isCurrentLevel = stats?.cefr_estimated === level}
        {@const isPastLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(level) < ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(stats?.cefr_estimated ?? 'A1')}
        <div class="relative">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white
                        {isCurrentLevel ? 'bg-primary-600 ring-4 ring-primary-200' : isPastLevel ? 'bg-green-500' : 'bg-gray-200'}">
              {#if isPastLevel}
                ✓
              {:else}
                {level}
              {/if}
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <span class="font-medium text-gray-900">{label}</span>
                {#if isCurrentLevel}
                  <span class="badge-success">Hito actual</span>
                {/if}
              </div>
              <p class="text-sm text-gray-500 mt-1">
                {isPastLevel ? 'Hito alcanzado (interno)' : isCurrentLevel ? 'En práctica' : 'Pendiente'}
              </p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h2>
    {#if weekly.length > 0}
      <div class="grid grid-cols-7 gap-2">
        {#each weekly as day}
          <div class="text-center">
            <div class="h-24 bg-gray-100 rounded-lg mb-2 flex items-end justify-center p-1">
              <div 
                class="w-full bg-primary-500 rounded transition-all"
                style="height: {Math.min((day.words_learned / 10) * 100, 100)}%"
              ></div>
            </div>
            <p class="text-xs text-gray-500">{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</p>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-center text-gray-500 py-8">No activity data yet. Start studying!</p>
    {/if}
  </div>
</div>
