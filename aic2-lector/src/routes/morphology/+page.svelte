<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type Morpheme } from '$lib/db';
  import { toasts } from '$lib/stores/app';
  import { BookOpen, Search, Sparkles, ChevronDown, ChevronRight } from 'lucide-svelte';

  let morphemes = $state<Morpheme[]>([]);
  let filteredMorphemes = $state<Morpheme[]>([]);
  let searchQuery = $state('');
  let filterType = $state<'all' | 'prefix' | 'suffix' | 'root'>('all');
  let expandedItems = $state<Set<string>>(new Set());
  let wordToAnalyze = $state('');
  let analysisResult = $state<{ morphemes: string[]; meaning: string } | null>(null);

  onMount(async () => {
    morphemes = await db.morphemes.toArray();
    filteredMorphemes = morphemes;
  });

  function parseMorphemes(word: string): { morphemes: string[]; meaning: string } {
    const parts: string[] = [];
    const suffixes = ['-tion', '-ity', '-ment', '-ness', '-er', '-ly', '-able', '-ful', '-less'];
    const prefixes = ['un-', 're-', 'dis-', 'pre-', 'mis-'];
    let remaining = word.toLowerCase();
    let found = '';
    
    for (const s of suffixes) {
      if (remaining.endsWith(s)) {
        parts.push(s);
        remaining = remaining.slice(0, -s.length);
      }
    }
    for (const p of prefixes) {
      if (remaining.startsWith(p)) {
        parts.push(p);
        remaining = remaining.slice(p.length);
      }
    }
    if (remaining) parts.push(remaining);
    
    return { morphemes: parts, meaning: parts.join(' + ') };
  }

  $effect(() => {
    let result = [...morphemes];
    
    if (filterType !== 'all') {
      result = result.filter(m => m.type === filterType);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.id.toLowerCase().includes(query) ||
        m.meaning_es.toLowerCase().includes(query) ||
        m.example_words.some(w => w.toLowerCase().includes(query))
      );
    }
    
    filteredMorphemes = result;
  });

  function toggleExpand(id: string) {
    if (expandedItems.has(id)) {
      expandedItems.delete(id);
    } else {
      expandedItems.add(id);
    }
    expandedItems = new Set(expandedItems);
  }

  function handleAnalyze() {
    if (!wordToAnalyze.trim()) {
      toasts.error('Enter a word to analyze');
      return;
    }
    
    analysisResult = parseMorphemes(wordToAnalyze.trim());
    if (analysisResult.morphemes.length === 0) {
      toasts.info('No known morphemes found in this word');
    }
  }

  const typeColors = {
    prefix: 'bg-blue-100 text-blue-700',
    suffix: 'bg-green-100 text-green-700',
    root: 'bg-purple-100 text-purple-700',
  };

  const groupedMorphemes = $derived.by(() => {
    const groups: Record<string, Morpheme[]> = {
      prefix: [],
      suffix: [],
      root: [],
    };

    filteredMorphemes.forEach(m => {
      if (m.type in groups) {
        groups[m.type].push(m);
      }
    });

    return groups;
  });
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Morphology</h1>
    <p class="text-gray-500 mt-1">Learn prefixes, suffixes, and roots to expand your vocabulary exponentially</p>
  </div>

  <div class="card bg-gradient-to-r from-purple-50 to-blue-50">
    <div class="flex items-center gap-3 mb-4">
      <Sparkles class="w-6 h-6 text-purple-600" />
      <h2 class="text-lg font-semibold text-gray-900">Word Analyzer</h2>
    </div>
    <div class="flex gap-3">
      <input
        type="text"
        bind:value={wordToAnalyze}
        placeholder="Enter a word to analyze (e.g., international, rewrite, happiness)"
        class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
        onkeydown={(e) => e.key === 'Enter' && handleAnalyze()}
      />
      <button onclick={handleAnalyze} class="btn-primary">
        <Search class="w-4 h-4 mr-2" />
        Analyze
      </button>
    </div>
    
    {#if analysisResult}
      <div class="mt-4 p-4 bg-white rounded-lg border">
        <h3 class="font-semibold text-gray-900 mb-2">Analysis: "{wordToAnalyze}"</h3>
        {#if analysisResult.morphemes.length > 0}
          <div class="space-y-2">
            {#each analysisResult.morphemes as morpheme}
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span class="text-gray-700">{morpheme}</span>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500">No known morphemes found. Try breaking it down yourself!</p>
        {/if}
      </div>
    {/if}
  </div>

  <div class="card">
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search morphemes..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div class="flex gap-2">
        <button
          onclick={() => filterType = 'all'}
          class="px-4 py-2 rounded-lg font-medium transition-colors
                 {filterType === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
        >
          All
        </button>
        <button
          onclick={() => filterType = 'prefix'}
          class="px-4 py-2 rounded-lg font-medium transition-colors
                 {filterType === 'prefix' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}"
        >
          Prefixes
        </button>
        <button
          onclick={() => filterType = 'suffix'}
          class="px-4 py-2 rounded-lg font-medium transition-colors
                 {filterType === 'suffix' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600 hover:bg-green-200'}"
        >
          Suffixes
        </button>
        <button
          onclick={() => filterType = 'root'}
          class="px-4 py-2 rounded-lg font-medium transition-colors
                 {filterType === 'root' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}"
        >
          Roots
        </button>
      </div>
    </div>

    <div class="space-y-6">
      {#each Object.entries(groupedMorphemes) as [type, items]}
        {#if (filterType === 'all' || filterType === type) && items.length > 0}
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3 capitalize">{type}s ({items.length})</h3>
            <div class="grid gap-3">
              {#each items as morpheme (morpheme.id)}
                <div class="border border-gray-100 rounded-lg overflow-hidden">
                  <button
                    onclick={() => toggleExpand(morpheme.id)}
                    class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div class="flex items-center gap-4">
                      <span class="px-3 py-1 rounded-full font-mono font-bold {typeColors[morpheme.type]}">
                        {morpheme.id}
                      </span>
                      <span class="text-gray-700">{morpheme.meaning_es}</span>
                    </div>
                    {#if expandedItems.has(morpheme.id)}
                      <ChevronDown class="w-5 h-5 text-gray-400" />
                    {:else}
                      <ChevronRight class="w-5 h-5 text-gray-400" />
                    {/if}
                  </button>
                  
                  {#if expandedItems.has(morpheme.id)}
                    <div class="px-4 pb-4 border-t border-gray-100">
                      <p class="text-sm text-gray-500 mt-3 mb-2">Words with this {type}:</p>
                      <div class="flex flex-wrap gap-2">
                        {#each morpheme.example_words as word}
                          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {word}
                          </span>
                        {/each}
                      </div>
                      <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>Origin: {morpheme.origin}</span>
                        <span>Level: {morpheme.cefr_level}</span>
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    </div>

    {#if filteredMorphemes.length === 0}
      <div class="text-center py-12">
        <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">No morphemes found</p>
      </div>
    {/if}
  </div>

  <div class="card bg-yellow-50 border-yellow-200">
    <h3 class="font-semibold text-yellow-900 mb-3">Why Morphology?</h3>
    <div class="space-y-3 text-sm text-yellow-800">
      <p><strong>Multiplier Effect:</strong> Learning one root like <em>port</em> (carry) unlocks 20-50 words: import, export, transport, portable, portfolio, etc.</p>
      <p><strong>Guess Unknown Words:</strong> With enough morphology knowledge, you can infer the meaning of words you've never seen before.</p>
      <p><strong>Perfect for Technical English:</strong> Scientific and technical vocabulary is heavily Latin/Greek based — morphology knowledge accelerates comprehension.</p>
    </div>
  </div>
</div>