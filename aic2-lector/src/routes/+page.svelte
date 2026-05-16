<script lang="ts">
  import { onMount } from 'svelte';
  import { getStats, getTodayProgress, getVocabularyBreakdown } from '$lib/db/stats';
  import { getWordsForToday } from '$lib/db/srs';
  import { Flame, BookOpen, Clock, Target, TrendingUp, Zap } from 'lucide-svelte';
  import type { UserStats, DailyProgress } from '$lib/db';

  let stats: UserStats | undefined = $state();
  let todayProgress: DailyProgress | null = $state(null);
  let vocabBreakdown = $state({ mastered: 0, learning: 0, weak: 0, total: 0 });
  let studyQueue = $state({ newWords: [] as any[], dueWords: [] as any[], totalDue: 0 });
  let showOnboarding = $state(false);

  onMount(async () => {
    stats = await getStats();
    todayProgress = await getTodayProgress();
    vocabBreakdown = await getVocabularyBreakdown();
    studyQueue = await getWordsForToday(5, 20);
    showOnboarding = vocabBreakdown.total === 0;
  });

  const cefrColors: Record<string, string> = {
    A1: 'bg-gray-100 text-gray-700',
    A2: 'bg-blue-100 text-blue-700',
    B1: 'bg-green-100 text-green-700',
    B2: 'bg-yellow-100 text-yellow-700',
    C1: 'bg-orange-100 text-orange-700',
    C2: 'bg-red-100 text-red-700',
  };

  const phaseNames = [
    'Foundation (A0-A2)',
    'Cognates Explosion (A2-B1)',
    'Morphology & AWL (B1-B2)',
    'Authentic Material (B2-C1)',
    'IA Specialization (C1-C2)',
    'Maintenance',
  ];
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-500 mt-1">Track your English reading journey</p>
    </div>
    {#if stats?.cefr_estimated}
      <span class="px-3 py-1.5 rounded-full text-sm font-semibold {cefrColors[stats.cefr_estimated]}">
        Level: {stats.cefr_estimated}
      </span>
    {/if}
  </div>

  {#if showOnboarding}
    <div class="bg-gradient-to-r from-primary-500 via-primary-600 to-indigo-600 rounded-xl p-6 text-white">
      <h2 class="text-xl font-bold mb-2">Welcome to AIC2-Lector!</h2>
      <p class="text-primary-100 mb-4">Sigue estos pasos para empezar tu viaje de inglés:</p>
      <div class="grid sm:grid-cols-2 gap-3">
        <a href="/help" class="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors">
          <span class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">1</span>
          <div>
            <p class="font-semibold text-sm">Aprende Instrucciones</p>
            <p class="text-xs text-primary-200">Entiende qué te piden los ejercicios</p>
          </div>
        </a>
        <a href="/study" class="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors">
          <span class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">2</span>
          <div>
            <p class="font-semibold text-sm">Study SRS</p>
            <p class="text-xs text-primary-200">Repasa vocabulario con flashcards</p>
          </div>
        </a>
        <a href="/reading" class="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors">
          <span class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">3</span>
          <div>
            <p class="font-semibold text-sm">Reading</p>
            <p class="text-xs text-primary-200">Lee textos y haz clic en palabras</p>
          </div>
        </a>
        <button onclick={() => showOnboarding = false} class="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors text-left">
          <span class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">✓</span>
          <div>
            <p class="font-semibold text-sm">Empezar</p>
            <p class="text-xs text-primary-200">Cerrar esta guía rápida</p>
          </div>
        </button>
      </div>
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="card">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-orange-100 rounded-lg">
          <Flame class="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{stats?.current_streak ?? 0}</p>
          <p class="text-sm text-gray-500">Day Streak</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-blue-100 rounded-lg">
          <BookOpen class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{stats?.total_words_learned ?? 0}</p>
          <p class="text-sm text-gray-500">Words Learned</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-green-100 rounded-lg">
          <Target class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{studyQueue.totalDue}</p>
          <p class="text-sm text-gray-500">Due for Review</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-purple-100 rounded-lg">
          <TrendingUp class="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{stats?.avg_wpm ?? 0}</p>
          <p class="text-sm text-gray-500">Avg WPM</p>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h2>
      <div class="space-y-4">
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-600">Words Reviewed</span>
            <span class="font-medium">{todayProgress?.words_reviewed ?? 0}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: {Math.min((todayProgress?.words_reviewed ?? 0) / 20 * 100, 100)}%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-600">New Words</span>
            <span class="font-medium">{todayProgress?.words_learned ?? 0}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill bg-green-500" style="width: {Math.min((todayProgress?.words_learned ?? 0) / 10 * 100, 100)}%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-600">Reading Time</span>
            <span class="font-medium">{todayProgress?.reading_time_min ?? 0} min</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Vocabulary Breakdown</h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span class="text-sm text-gray-600">Mastered</span>
          </div>
          <span class="font-semibold">{vocabBreakdown.mastered}</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span class="text-sm text-gray-600">Learning</span>
          </div>
          <span class="font-semibold">{vocabBreakdown.learning}</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <span class="text-sm text-gray-600">Needs Review</span>
          </div>
          <span class="font-semibold">{vocabBreakdown.weak}</span>
        </div>
        <div class="pt-3 border-t">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Total in database</span>
            <span class="font-medium">{vocabBreakdown.total}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Learning Path</h2>
      <span class="badge-info">Phase {stats?.current_phase ?? 0}</span>
    </div>
    <div class="relative">
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div class="space-y-4">
        {#each phaseNames as name, i}
          <div class="flex items-start gap-4 relative">
            <div class="w-8 h-8 rounded-full flex items-center justify-center z-10 
                        {i <= (stats?.current_phase ?? 0) ? 'bg-primary-600' : 'bg-gray-200'}">
              {#if i < (stats?.current_phase ?? 0)}
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              {:else}
                <span class="text-xs font-medium {i === (stats?.current_phase ?? 0) ? 'text-white' : 'text-gray-500'}">{i + 1}</span>
              {/if}
            </div>
            <div class="flex-1 {i === (stats?.current_phase ?? 0) ? '' : 'opacity-50'}">
              <p class="font-medium text-gray-900">{name}</p>
              {#if i === (stats?.current_phase ?? 0)}
                <p class="text-sm text-primary-600 mt-0.5">Currently here</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  {#if studyQueue.totalDue > 0 || studyQueue.newWords.length > 0}
    <div class="card bg-gradient-to-br from-primary-50 to-blue-50 border-primary-100">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-primary-600 rounded-lg">
          <Zap class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Ready to Study?</h2>
          <p class="text-sm text-gray-600">{studyQueue.totalDue} words due + {studyQueue.newWords.length} new words</p>
        </div>
      </div>
      <a href="/study" class="btn-primary inline-flex items-center gap-2">
        <BookOpen class="w-4 h-4" />
        Start Studying
      </a>
    </div>
  {/if}
</div>