<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type Word, type CefrLevel, type VocabLayer } from '$lib/db';
  import { Search, Filter, BookOpen, ChevronRight, Sparkles, Brain, Cpu } from 'lucide-svelte';

  let words = $state<Word[]>([]);
  let filteredWords = $state<Word[]>([]);
  let searchQuery = $state('');
  let filterLevel = $state<CefrLevel | 'all'>('all');
  let filterLayer = $state<VocabLayer | 'all'>('all');
  let sortBy = $state<'lemma' | 'confidence' | 'frequency'>('frequency');
  let selectedWord = $state<Word | null>(null);

  onMount(async () => {
    words = await db.words.toArray();
    filterWords();
  });

  function filterWords() {
    let result = [...words];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(w => 
        w.lemma.toLowerCase().includes(query) ||
        w.translations_es.some(t => t.toLowerCase().includes(query))
      );
    }

    if (filterLevel !== 'all') {
      result = result.filter(w => w.cefr_level === filterLevel);
    }

    if (filterLayer !== 'all') {
      result = result.filter(w => w.layer === filterLayer);
    }

    result.sort((a, b) => {
      if (sortBy === 'lemma') return a.lemma.localeCompare(b.lemma);
      if (sortBy === 'confidence') return b.confidence - a.confidence;
      return a.frequency_rank - b.frequency_rank;
    });

    filteredWords = result;
  }

  $effect(() => {
    filterWords();
  });

  const layerIcons: Record<VocabLayer, typeof Sparkles> = {
    frequency: BookOpen,
    awl: Brain,
    'technical-ia': Cpu,
    mined: Sparkles,
  };

  const layerColors: Record<VocabLayer, string> = {
    frequency: 'bg-blue-100 text-blue-700',
    awl: 'bg-purple-100 text-purple-700',
    'technical-ia': 'bg-orange-100 text-orange-700',
    mined: 'bg-green-100 text-green-700',
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
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Vocabulary</h1>
    <p class="text-gray-500 mt-1">Manage your word database</p>
  </div>

  <div class="card">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search words..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div class="flex gap-3">
        <select 
          bind:value={filterLevel}
          class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Levels</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </select>

        <select 
          bind:value={filterLayer}
          class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Layers</option>
          <option value="frequency">Frequency</option>
          <option value="awl">AWL</option>
          <option value="technical-ia">Technical IA</option>
          <option value="mined">Mined</option>
        </select>

        <select 
          bind:value={sortBy}
          class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="frequency">By Frequency</option>
          <option value="lemma">By Word</option>
          <option value="confidence">By Confidence</option>
        </select>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-gray-500">{filteredWords.length} words</p>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left py-3 px-2 text-sm font-medium text-gray-500">Word</th>
            <th class="text-left py-3 px-2 text-sm font-medium text-gray-500">Translation</th>
            <th class="text-left py-3 px-2 text-sm font-medium text-gray-500">Level</th>
            <th class="text-left py-3 px-2 text-sm font-medium text-gray-500">Layer</th>
            <th class="text-left py-3 px-2 text-sm font-medium text-gray-500">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredWords.slice(0, 50) as word (word.id)}
            <tr 
              class="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
              onclick={() => selectedWord = word}
            >
              <td class="py-3 px-2">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-900">{word.lemma}</span>
                </div>
              </td>
              <td class="py-3 px-2 text-gray-600">
                {word.translations_es[0]}
              </td>
              <td class="py-3 px-2">
                <span class="badge {levelColors[word.cefr_level]}">{word.cefr_level}</span>
              </td>
              <td class="py-3 px-2">
                <span class="inline-flex items-center gap-1 badge {layerColors[word.layer]}">
                  {#if word.layer === 'frequency'}
                    <BookOpen class="w-3 h-3" />
                  {:else if word.layer === 'awl'}
                    <Brain class="w-3 h-3" />
                  {:else if word.layer === 'technical-ia'}
                    <Cpu class="w-3 h-3" />
                  {:else}
                    <Sparkles class="w-3 h-3" />
                  {/if}
                  {word.layer}
                </span>
              </td>
              <td class="py-3 px-2">
                <div class="flex items-center gap-2">
                  <div class="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all"
                      class:bg-green-500={word.confidence >= 0.85}
                      class:bg-yellow-500={word.confidence >= 0.5 && word.confidence < 0.85}
                      class:bg-red-500={word.confidence < 0.5}
                      style="width: {word.confidence * 100}%"
                    ></div>
                  </div>
                  <span class="text-xs text-gray-500">{Math.round(word.confidence * 100)}%</span>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if filteredWords.length === 0}
        <div class="text-center py-12">
          <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">No words found</p>
        </div>
      {/if}
    </div>
  </div>
</div>

{#if selectedWord}
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="word-modal-title"
    tabindex="-1"
    onclick={() => selectedWord = null}
    onkeydown={(e) => e.key === 'Escape' && (selectedWord = null)}
  >
    <div
      class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="presentation"
    >
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 id="word-modal-title" class="text-xl font-bold text-gray-900">{selectedWord.lemma}</h3>
          {#if selectedWord.ipa}
            <p class="text-gray-500">/{selectedWord.ipa}/</p>
          {/if}
        </div>
        <button onclick={() => selectedWord = null} class="text-gray-400 hover:text-gray-600" aria-label="Close">
          ✕
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-500 mb-1">Translations</p>
          <div class="flex flex-wrap gap-2">
            {#each selectedWord.translations_es as translation}
              <span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full">{translation}</span>
            {/each}
          </div>
        </div>

        {#if selectedWord.cognate_es}
          <div>
            <p class="text-sm text-gray-500 mb-1">Cognate (Español)</p>
            <span class="text-green-600 font-medium">{selectedWord.cognate_es}</span>
          </div>
        {/if}

        {#if selectedWord.examples.length > 0}
          <div>
            <p class="text-sm text-gray-500 mb-1">Examples</p>
            {#each selectedWord.examples as example}
              <p class="text-gray-700 italic">"{example}"</p>
            {/each}
          </div>
        {/if}

        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p class="text-sm text-gray-500">Level</p>
            <span class="badge {levelColors[selectedWord.cefr_level]}">{selectedWord.cefr_level}</span>
          </div>
          <div>
            <p class="text-sm text-gray-500">Layer</p>
            <span class="badge {layerColors[selectedWord.layer]}">{selectedWord.layer}</span>
          </div>
          <div>
            <p class="text-sm text-gray-500">Reviews</p>
            <p class="font-medium">{selectedWord.review_count}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Confidence</p>
            <p class="font-medium">{Math.round(selectedWord.confidence * 100)}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
