<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type Word, type CefrLevel, type VocabLayer } from '$lib/db';
  import { BookOpen, Search, CheckCircle } from 'lucide-svelte';

  let awlWords = $state<Word[]>([]);
  let filteredWords = $state<Word[]>([]);
  let searchQuery = $state('');

  const awlData = [
    { family: ['approach', 'approaches'], es: 'enfoque' },
    { family: ['analysis', 'analyze', 'analytical'], es: 'análisis' },
    { family: ['assess', 'assessment', 'assessed'], es: 'evaluación' },
    { family: ['concept', 'concepts', 'conceptual'], es: 'concepto' },
    { family: ['context', 'contexts', 'contextual'], es: 'contexto' },
    { family: ['data'], es: 'datos' },
    { family: ['environment', 'environmental'], es: 'entorno' },
    { family: ['evidence', 'evident'], es: 'evidencia' },
    { family: ['factor', 'factors'], es: 'factor' },
    { family: ['function', 'functions', 'functional'], es: 'función' },
  ];

  onMount(async () => {
    awlWords = await db.words.where('layer').equals('awl').toArray();
    filteredWords = awlWords;
  });

  $effect(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredWords = awlWords.filter(w => w.lemma.toLowerCase().includes(q));
    } else {
      filteredWords = awlWords;
    }
  });
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Academic Word List (AWL)</h1>
    <p class="text-gray-500 mt-1">Vocabulary for academic texts</p>
  </div>

  <div class="card">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search AWL words..."
        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
      />
    </div>
  </div>

  <div class="card">
    <p class="text-sm text-gray-500 mb-4">{filteredWords.length} words</p>
    
    <div class="grid gap-3">
      {#each filteredWords as word}
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-semibold text-gray-900">{word.lemma}</h3>
              <p class="text-sm text-gray-600">{word.translations_es[0]}</p>
            </div>
            {#if word.confidence >= 0.85}
              <CheckCircle class="w-5 h-5 text-green-500" />
            {/if}
          </div>
          <div class="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-primary-500 rounded-full" style="width: {word.confidence * 100}%"></div>
          </div>
        </div>
      {/each}
    </div>

    {#if filteredWords.length === 0}
      <div class="text-center py-12 text-gray-500">
        <BookOpen class="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No AWL words found</p>
      </div>
    {/if}
  </div>
</div>