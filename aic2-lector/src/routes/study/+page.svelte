<script lang="ts">
  import { onMount } from 'svelte';
  import { getWordsForToday, reviewWord, markWordAsKnown, resetWordProgress, type ReviewQuality } from '$lib/db/srs';
  import { recordDailyProgress } from '$lib/db/stats';
  import { toasts } from '$lib/stores/app';
  import { ArrowLeft, ArrowRight, Check, X, RotateCcw, Volume2, BookOpen, Target } from 'lucide-svelte';
  import type { Word } from '$lib/db';

  type StudyMode = 'loading' | 'front' | 'back' | 'complete';

  let studyQueue = $state({ newWords: [] as Word[], dueWords: [] as Word[], totalDue: 0 });
  let currentIndex = $state(0);
  let mode = $state<StudyMode>('loading');
  let sessionStats = $state({ reviewed: 0, correct: 0, wrong: 0 });
  let showAnswer = $state(false);

  let currentWord: Word | null = $derived(
    currentIndex < studyQueue.dueWords.length
      ? studyQueue.dueWords[currentIndex]
      : studyQueue.newWords[currentIndex - studyQueue.dueWords.length] ?? null
  );

  let isNewWord = $derived(currentIndex >= studyQueue.dueWords.length);

  onMount(async () => {
    await loadWords();
  });

  async function loadWords() {
    studyQueue = await getWordsForToday(10, 30);
    sessionStats = { reviewed: 0, correct: 0, wrong: 0 };
    mode = 'front';
    showAnswer = false;
  }

  function showBack() {
    mode = 'back';
    showAnswer = true;
  }

  async function handleResponse(quality: ReviewQuality) {
    if (!currentWord) return;

    const wasCorrect = quality >= 3;
    sessionStats.reviewed++;
    if (wasCorrect) sessionStats.correct++;
    else sessionStats.wrong++;

    await reviewWord(currentWord.id, quality);
    await recordDailyProgress({ 
      words_reviewed: 1, 
      words_learned: isNewWord ? 1 : 0,
      sessions_count: 0 
    });

    nextCard();
  }

  async function handleKnown() {
    if (!currentWord) return;
    await markWordAsKnown(currentWord.id);
    sessionStats.reviewed++;
    sessionStats.correct++;
    nextCard();
  }

  async function handleReset() {
    if (!currentWord) return;
    await resetWordProgress(currentWord.id);
    toasts.success('Word reset for relearning');
  }

  function nextCard() {
    showAnswer = false;
    const totalCards = studyQueue.dueWords.length + studyQueue.newWords.length;

    if (currentIndex + 1 >= totalCards) {
      mode = 'complete';
      toasts.success(`Session complete! ${sessionStats.correct}/${sessionStats.reviewed} correct`);
    } else {
      currentIndex++;
      mode = 'front';
    }
  }

  function getQualityLabel(quality: ReviewQuality): string {
    const labels: Record<ReviewQuality, string> = {
      0: 'Again',
      1: 'Hard',
      2: 'Good',
      3: 'Good',
      4: 'Easy',
      5: 'Easy',
    };
    return labels[quality];
  }

  function getQualityColor(quality: ReviewQuality): string {
    if (quality < 2) return 'bg-red-500 hover:bg-red-600';
    if (quality < 4) return 'bg-yellow-500 hover:bg-yellow-600';
    return 'bg-green-500 hover:bg-green-600';
  }

  function speakWord(word: string) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
</script>

<div class="max-w-2xl mx-auto space-y-6">
  {#if mode === 'loading'}
    <div class="card text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-gray-500">Loading your study session...</p>
    </div>

  {:else if mode === 'complete'}
    <div class="card text-center py-12">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check class="w-10 h-10 text-green-600" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h2>
      <p class="text-gray-600 mb-8">Great job! Here's how you did:</p>
      
      <div class="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-8">
        <div class="text-center">
          <p class="text-3xl font-bold text-gray-900">{sessionStats.reviewed}</p>
          <p class="text-sm text-gray-500">Reviewed</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-green-600">{sessionStats.correct}</p>
          <p class="text-sm text-gray-500">Correct</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-red-500">{sessionStats.wrong}</p>
          <p class="text-sm text-gray-500">Again</p>
        </div>
      </div>

      <div class="progress-bar max-w-xs mx-auto mb-8">
        <div 
          class="progress-bar-fill bg-green-500" 
          style="width: {sessionStats.reviewed > 0 ? (sessionStats.correct / sessionStats.reviewed) * 100 : 0}%"
        ></div>
      </div>

      <div class="flex gap-4 justify-center">
        <a href="/" class="btn-secondary">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Dashboard
        </a>
        <button onclick={loadWords} class="btn-primary">
          Study More
        </button>
      </div>
    </div>

  {:else if currentWord}
    <div class="flex items-center justify-between">
      <a href="/" class="text-gray-500 hover:text-gray-700">
        <ArrowLeft class="w-5 h-5" />
      </a>
      <div class="flex items-center gap-4 text-sm">
        <span class="badge {isNewWord ? 'badge-info' : 'badge-warning'}">
          {isNewWord ? 'New' : 'Review'}
        </span>
        <span class="text-gray-500">
          {currentIndex + 1} / {studyQueue.dueWords.length + studyQueue.newWords.length}
        </span>
      </div>
      <button onclick={handleReset} class="text-gray-400 hover:text-gray-600">
        <RotateCcw class="w-5 h-5" />
      </button>
    </div>

    <div class="card min-h-[400px] flex flex-col">
      <div class="flex-1 flex flex-col items-center justify-center p-8">
        {#if mode === 'front'}
          <div class="text-center">
            <p class="text-4xl font-bold text-gray-900 mb-4">{currentWord.lemma}</p>
            {#if currentWord.ipa}
              <p class="text-lg text-gray-500 mb-6">/{currentWord.ipa}/</p>
            {/if}
            <button 
              onclick={() => speakWord(currentWord!.lemma)}
              class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8"
            >
              <Volume2 class="w-5 h-5" />
              <span class="text-sm">Listen</span>
            </button>
          </div>

        {:else}
          <div class="text-center w-full">
            <p class="text-4xl font-bold text-gray-900 mb-4">{currentWord.lemma}</p>
            <div class="space-y-4">
              {#each currentWord.translations_es as translation}
                <span class="inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-lg font-medium">
                  {translation}
                </span>
              {/each}
            </div>
            {#if currentWord.cognate_es}
              <p class="text-sm text-green-600 mt-4">
                Cognate: {currentWord.cognate_es}
              </p>
            {/if}
            {#if currentWord.examples.length > 0}
              <p class="text-gray-600 mt-4 italic">
                "{currentWord.examples[0]}"
              </p>
            {/if}
          </div>
        {/if}
      </div>

      <div class="border-t pt-6">
        {#if mode === 'front'}
          <button onclick={showBack} class="btn-primary w-full text-lg py-4">
            Show Answer
          </button>
        {:else}
          <div class="space-y-3">
            <p class="text-center text-sm text-gray-500 mb-3">How well did you remember?</p>
            <div class="grid grid-cols-3 gap-3">
              <button 
                onclick={() => handleResponse(0)}
                class="{getQualityColor(0)} text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Again
                <span class="block text-xs opacity-75">&lt;1 day</span>
              </button>
              <button 
                onclick={() => handleResponse(2)}
                class="{getQualityColor(2)} text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Good
                <span class="block text-xs opacity-75">2-4 days</span>
              </button>
              <button 
                onclick={() => handleResponse(4)}
                class="{getQualityColor(4)} text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Easy
                <span class="block text-xs opacity-75">7+ days</span>
              </button>
            </div>
            <button 
              onclick={handleKnown}
              class="w-full py-2 text-sm text-gray-500 hover:text-green-600 transition-colors"
            >
              I already know this word
            </button>
          </div>
        {/if}
      </div>
    </div>

    <div class="flex items-center justify-center gap-6 text-sm text-gray-500">
      <div class="flex items-center gap-1">
        <Target class="w-4 h-4" />
        <span>Confidence: {Math.round(currentWord.confidence * 100)}%</span>
      </div>
      <span>Reviews: {currentWord.review_count}</span>
    </div>
  {/if}
</div>