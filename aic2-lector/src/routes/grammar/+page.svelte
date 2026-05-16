<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type GrammarRule, type CefrLevel } from '$lib/db';
  import { GraduationCap, Search, ChevronDown, ChevronRight, BookOpen } from 'lucide-svelte';

  let rules = $state<GrammarRule[]>([]);
  let filteredRules = $state<GrammarRule[]>([]);
  let searchQuery = $state('');
  let filterLevel = $state<CefrLevel | 'all'>('all');
  let filterCategory = $state<string>('all');
  let expandedRules = $state<Set<string>>(new Set());

  onMount(async () => {
    rules = await db.grammarRules.toArray();
    filteredRules = rules;
  });

  $effect(() => {
    let result = [...rules];

    if (filterLevel !== 'all') {
      result = result.filter(r => r.cefr_level === filterLevel);
    }

    if (filterCategory !== 'all') {
      result = result.filter(r => r.category === filterCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.pattern.toLowerCase().includes(query) ||
        r.explanation_md.toLowerCase().includes(query) ||
        r.examples_en.some(e => e.toLowerCase().includes(query))
      );
    }

    filteredRules = result;
  });

  function toggleExpand(id: string) {
    if (expandedRules.has(id)) {
      expandedRules.delete(id);
    } else {
      expandedRules.add(id);
    }
    expandedRules = new Set(expandedRules);
  }

  const levelColors: Record<CefrLevel, string> = {
    A1: 'bg-gray-100 text-gray-700',
    A2: 'bg-blue-100 text-blue-700',
    B1: 'bg-green-100 text-green-700',
    B2: 'bg-yellow-100 text-yellow-700',
    C1: 'bg-orange-100 text-orange-700',
    C2: 'bg-red-100 text-red-700',
  };

  const categoryLabels: Record<string, string> = {
    basico: 'Básico',
    'frecuente-en-tecnico': 'Técnico',
    literario: 'Literario',
    'academico-formal': 'Académico',
  };

  const categoryColors: Record<string, string> = {
    basico: 'bg-gray-100 text-gray-700',
    'frecuente-en-tecnico': 'bg-purple-100 text-purple-700',
    literario: 'bg-blue-100 text-blue-700',
    'academico-formal': 'bg-indigo-100 text-indigo-700',
  };

  const groupedByLevel = $derived.by(() => {
    const groups: Record<string, GrammarRule[]> = {};
    filteredRules.forEach(r => {
      if (!groups[r.cefr_level]) groups[r.cefr_level] = [];
      groups[r.cefr_level].push(r);
    });
    return groups;
  });

  function highlightPattern(pattern: string): string {
    return pattern
      .replace(/Subject/gi, '<mark class="bg-blue-100 px-1 rounded">Subject</mark>')
      .replace(/verb/gi, '<mark class="bg-green-100 px-1 rounded">verb</mark>')
      .replace(/will|would|can|could|should|must|may|might/gi, '<mark class="bg-yellow-100 px-1 rounded">$&</mark>')
      .replace(/if/gi, '<mark class="bg-purple-100 px-1 rounded">if</mark>');
  }
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Grammar Reference</h1>
    <p class="text-gray-500 mt-1">200+ grammar patterns for passive recognition while reading</p>
  </div>

  <div class="card">
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search patterns, examples..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div class="flex gap-2 flex-wrap">
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
          bind:value={filterCategory}
          class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Categories</option>
          {#each Object.entries(categoryLabels) as [value, label]}
            <option {value}>{label}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="text-sm text-gray-500 mb-4">
      {filteredRules.length} rules found
    </div>

    <div class="space-y-6">
      {#each Object.entries(groupedByLevel) as [level, levelRules]}
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span class="px-2 py-1 rounded-lg {levelColors[level as CefrLevel]}">{level}</span>
            <span>{levelRules.length} rules</span>
          </h3>
          <div class="space-y-3">
            {#each levelRules as rule (rule.id)}
              <div class="border border-gray-100 rounded-lg overflow-hidden">
                <button
                  onclick={() => toggleExpand(rule.id)}
                  class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{rule.title}</h4>
                    <p class="text-sm text-gray-500 mt-1">{@html highlightPattern(rule.pattern)}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="badge {categoryColors[rule.category]}">
                      {categoryLabels[rule.category]}
                    </span>
                    {#if expandedRules.has(rule.id)}
                      <ChevronDown class="w-5 h-5 text-gray-400" />
                    {:else}
                      <ChevronRight class="w-5 h-5 text-gray-400" />
                    {/if}
                  </div>
                </button>

                {#if expandedRules.has(rule.id)}
                  <div class="px-4 pb-4 border-t border-gray-100">
                    <div class="mt-4 space-y-4">
                      <div>
                        <p class="text-sm font-medium text-gray-700 mb-2">Explanation</p>
                        <p class="text-gray-600">{rule.explanation_md}</p>
                      </div>

                      <div>
                        <p class="text-sm font-medium text-gray-700 mb-2">Examples</p>
                        <div class="space-y-2">
                          {#each rule.examples_en as example}
                            <div class="p-3 bg-gray-50 rounded-lg">
                              <p class="text-gray-800 italic">"{example}"</p>
                            </div>
                          {/each}
                        </div>
                      </div>

                      <div class="flex items-center gap-4 text-sm text-gray-500">
                        <span class="badge {levelColors[rule.cefr_level]}">{rule.cefr_level}</span>
                        <span>Confidence: {Math.round(rule.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    {#if filteredRules.length === 0}
      <div class="text-center py-12">
        <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">No grammar rules found</p>
      </div>
    {/if}
  </div>

  <div class="card bg-gradient-to-r from-green-50 to-blue-50 border-green-100">
    <div class="flex items-start gap-4">
      <div class="p-3 bg-green-500 rounded-lg">
        <GraduationCap class="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 class="font-semibold text-gray-900 mb-2">Remember: Passive Recognition Only</h3>
        <p class="text-sm text-gray-600">
          You don't need to produce these structures — just recognize them when reading.
          Focus on understanding complex patterns like passive voice, relative clauses, and
          nominalized phrases as they appear in technical papers and academic texts.
        </p>
      </div>
    </div>
  </div>
</div>