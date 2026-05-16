<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type Text, type CefrLevel, type Word } from '$lib/db';
  import { recordDailyProgress } from '$lib/db/stats';
  import { toasts } from '$lib/stores/app';
  import { BookOpen, Clock, ChevronRight, Play, Pause, RotateCcw, Target, Volume2, X } from 'lucide-svelte';

  let texts = $state<Text[]>([]);
  let selectedText = $state<Text | null>(null);
  let isReading = $state(false);
  let isPaused = $state(false);
  let startTime = $state(0);
  let elapsedTime = $state(0);
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let currentText = $state('');

  let dbWords = $state<Map<string, Word>>(new Map());
  let selectedWord = $state<Word | null>(null);
  let wordPopoverPos = $state({ x: 0, y: 0 });

  onMount(async () => {
    texts = await db.texts.toArray();
    const words = await db.words.toArray();
    dbWords = new Map(words.map(w => [w.lemma.toLowerCase(), w]));
  });

  function selectText(text: Text) {
    selectedText = text;
    currentText = text.body;
    isReading = false;
    isPaused = false;
    elapsedTime = 0;
    selectedWord = null;
  }

  function startReading() {
    isReading = true;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
    }, 100);
  }

  function pauseReading() {
    isPaused = true;
    if (timerInterval) clearInterval(timerInterval);
  }

  function resumeReading() {
    isPaused = false;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
    }, 100);
  }

  function resetReading() {
    if (timerInterval) clearInterval(timerInterval);
    isReading = false;
    isPaused = false;
    elapsedTime = 0;
  }

  function finishReading() {
    if (timerInterval) clearInterval(timerInterval);
    isReading = false;
    
    if (selectedText) {
      const wpm = Math.round((selectedText.word_count / elapsedTime) * 60000);
      recordDailyProgress({
        reading_time_min: Math.round(elapsedTime / 60000),
        wpm_avg: wpm,
      });
      toasts.success(`Great! You read at ${wpm} WPM`);
    }
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
      <h1 class="text-2xl font-bold text-gray-900">Reading Practice</h1>
      <p class="text-gray-500 mt-1">Click any word to see its translation</p>
    </div>
  </div>

  {#if !selectedText}
    <div class="grid gap-4">
      {#each texts as text}
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
                <span class="text-sm text-gray-500">{text.word_count} words</span>
                <span class="text-sm text-gray-500 capitalize">{text.genre}</span>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-gray-400" />
          </div>
        </button>
      {/each}

      {#if texts.length === 0}
        <div class="card text-center py-12">
          <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">No texts available</p>
          <p class="text-sm text-gray-400 mt-2">Add texts to start reading practice</p>
        </div>
      {/if}
    </div>

  {:else}
    <div class="flex items-center gap-4 flex-wrap">
      <button onclick={() => { selectedText = null; resetReading(); selectedWord = null; }} class="text-gray-500 hover:text-gray-700">
        ← Back to texts
      </button>
      <span class="badge {levelColors[selectedText.cefr_level]}">{selectedText.cefr_level}</span>
      <span class="text-sm text-gray-500">{selectedText.word_count} words</span>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 card">
        <div class="mb-4">
          <h2 class="text-xl font-bold text-gray-900">{selectedText.title}</h2>
        </div>

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
      </div>

      <div class="space-y-4">
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-900">Session Timer</h3>
            <span class="text-2xl font-mono font-bold text-primary-600">
              {formatTime(elapsedTime)}
            </span>
          </div>

          {#if selectedText.word_count > 0 && elapsedTime > 0}
            {@const wpm = Math.round((selectedText.word_count / elapsedTime) * 60000)}
            <div class="text-center mb-4">
              <span class="text-3xl font-bold text-gray-900">{wpm}</span>
              <p class="text-sm text-gray-500">words per minute</p>
            </div>
          {/if}

          <div class="space-y-3">
            {#if !isReading && elapsedTime === 0}
              <button onclick={startReading} class="btn-primary w-full flex items-center justify-center gap-2">
                <Play class="w-5 h-5" />
                Start Reading
              </button>
            {:else if isReading && !isPaused}
              <button onclick={pauseReading} class="btn-secondary w-full flex items-center justify-center gap-2">
                <Pause class="w-5 h-5" />
                Pause
              </button>
            {:else if isPaused}
              <button onclick={resumeReading} class="btn-primary w-full flex items-center justify-center gap-2">
                <Play class="w-5 h-5" />
                Resume
              </button>
              <button onclick={finishReading} class="btn-secondary w-full flex items-center justify-center gap-2">
                <Target class="w-5 h-5" />
                Finish Session
              </button>
            {/if}

            {#if elapsedTime > 0}
              <button onclick={resetReading} class="w-full py-2 text-sm text-gray-500 hover:text-gray-700">
                <RotateCcw class="w-4 h-4 inline mr-1" />
                Reset
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

        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-3">Words in this text</h3>
          <div class="text-xs text-gray-500 space-y-1 mb-3">
            <p><span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>Mastered</p>
            <p><span class="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>Learning</p>
            <p><span class="inline-block w-2 h-2 bg-orange-500 rounded-full mr-1"></span>Not reviewed</p>
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
      </div>
    </div>
  {/if}
</div>