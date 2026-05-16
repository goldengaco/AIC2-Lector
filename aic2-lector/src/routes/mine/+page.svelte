<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type MinedSentence, type Word } from '$lib/db';
  import { toasts } from '$lib/stores/app';
  import { Plus, Trash2, Copy, BookOpen, Search, Tag, Clock, Globe, Terminal, FileText } from 'lucide-svelte';

  let sentences = $state<MinedSentence[]>([]);
  let filteredSentences = $state<MinedSentence[]>([]);
  let searchQuery = $state('');
  let filterSource = $state<string>('all');
  let newSentence = $state('');
  let newSourceType = $state<MinedSentence['source_type']>('paper');
  let newSourceUrl = $state('');
  let showAddForm = $state(false);
  let unknownWords = $state<string[]>([]);
  let wordSearch = $state('');

  onMount(async () => {
    sentences = await db.minedSentences.orderBy('created_at').reverse().toArray();
    filteredSentences = sentences;
  });

  $effect(() => {
    let result = [...sentences];

    if (filterSource !== 'all') {
      result = result.filter(s => s.source_type === filterSource);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => s.sentence.toLowerCase().includes(query));
    }

    filteredSentences = result;
  });

  async function addSentence() {
    if (!newSentence.trim()) {
      toasts.error('Enter a sentence to mine');
      return;
    }

    const words = newSentence.trim().split(/\s+/);
    const unknown = words.filter(w => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, '');
      return clean.length > 3;
    });

    const mined: MinedSentence = {
      id: `mined-${Date.now()}`,
      sentence: newSentence.trim(),
      source_type: newSourceType,
      source_url: newSourceUrl || undefined,
      word_ids: [],
      created_at: new Date(),
    };

    await db.minedSentences.add(mined);
    sentences = [mined, ...sentences];
    
    newSentence = '';
    newSourceUrl = '';
    showAddForm = false;
    
    toasts.success('Sentence mined successfully!');
  }

  async function deleteSentence(id: string) {
    await db.minedSentences.delete(id);
    sentences = sentences.filter(s => s.id !== id);
    toasts.success('Sentence deleted');
  }

  function copySentence(text: string) {
    navigator.clipboard.writeText(text);
    toasts.success('Copied to clipboard');
  }

  function analyzeSentence() {
    if (!newSentence.trim()) return;
    
    const words = newSentence.trim().split(/\s+/);
    const longWords = words.filter(w => w.length > 5);
    unknownWords = longWords.map(w => w.replace(/[^a-z]/gi, '').toLowerCase());
  }

  $effect(() => {
    if (newSentence.length > 10) {
      analyzeSentence();
    }
  });

  const sourceTypeIcons: Record<string, typeof BookOpen> = {
    paper: BookOpen,
    error: Terminal,
    novel: BookOpen,
    blog: Globe,
    doc: FileText,
    other: FileText,
  };

  const sourceTypeColors: Record<string, string> = {
    paper: 'bg-blue-100 text-blue-700',
    error: 'bg-red-100 text-red-700',
    novel: 'bg-purple-100 text-purple-700',
    blog: 'bg-green-100 text-green-700',
    doc: 'bg-yellow-100 text-yellow-700',
    other: 'bg-gray-100 text-gray-700',
  };

  const sourceTypeLabels: Record<string, string> = {
    paper: 'Paper/Research',
    error: 'Error/Console',
    novel: 'Book/Novel',
    blog: 'Blog/Article',
    doc: 'Documentation',
    other: 'Other',
  };

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Sentence Mining</h1>
      <p class="text-gray-500 mt-1">Extract phrases from real content and build your personal vocabulary</p>
    </div>
    <button onclick={() => showAddForm = !showAddForm} class="btn-primary flex items-center gap-2">
      <Plus class="w-4 h-4" />
      Mine Sentence
    </button>
  </div>

  {#if showAddForm}
    <div class="card">
      <h2 class="font-semibold text-gray-900 mb-4">Add New Sentence</h2>
      
      <div class="space-y-4">
        <div>
          <label for="sentence-input" class="block text-sm font-medium text-gray-700 mb-2">
            Paste your sentence (from paper, doc, error, etc.)
          </label>
          <textarea
            id="sentence-input"
            bind:value={newSentence}
            placeholder="Paste a sentence you found interesting or challenging..."
            rows="4"
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          ></textarea>
          
          {#if unknownWords.length > 0}
            <div class="mt-2 flex flex-wrap gap-2">
              <span class="text-sm text-gray-500">Potential unknown words:</span>
              {#each unknownWords as word}
                <span class="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm">{word}</span>
              {/each}
            </div>
          {/if}
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label for="source-type" class="block text-sm font-medium text-gray-700 mb-2">Source Type</label>
            <select
              id="source-type"
              bind:value={newSourceType}
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {#each Object.entries(sourceTypeLabels) as [value, label]}
                <option {value}>{label}</option>
              {/each}
            </select>
          </div>

          <div>
            <label for="source-url" class="block text-sm font-medium text-gray-700 mb-2">URL (optional)</label>
            <input
              id="source-url"
              type="url"
              bind:value={newSourceUrl}
              placeholder="https://..."
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <button onclick={addSentence} class="btn-primary">
            <Plus class="w-4 h-4 mr-2" />
            Add to Collection
          </button>
          <button onclick={() => { showAddForm = false; newSentence = ''; }} class="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}

  <div class="card">
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search sentences..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div class="flex gap-2 flex-wrap">
        <select
          bind:value={filterSource}
          class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Sources</option>
          {#each Object.entries(sourceTypeLabels) as [value, label]}
            <option {value}>{label}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="text-sm text-gray-500 mb-4">
      {filteredSentences.length} sentences in your collection
    </div>

    {#if filteredSentences.length > 0}
      <div class="space-y-4">
        {#each filteredSentences as sentence (sentence.id)}
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <p class="text-gray-800 leading-relaxed">"{sentence.sentence}"</p>
                <div class="flex items-center gap-3 mt-3 flex-wrap">
                  <span class="badge {sourceTypeColors[sentence.source_type]}">
                    {sourceTypeLabels[sentence.source_type]}
                  </span>
                  {#if sentence.source_url}
                    <a href={sentence.source_url} target="_blank" class="text-xs text-primary-600 hover:underline">
                      Source ↗
                    </a>
                  {/if}
                  <span class="text-xs text-gray-400 flex items-center gap-1">
                    <Clock class="w-3 h-3" />
                    {formatDate(sentence.created_at)}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  onclick={() => copySentence(sentence.sentence)}
                  class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy sentence"
                >
                  <Copy class="w-4 h-4" />
                </button>
                <button
                  onclick={() => deleteSentence(sentence.id)}
                  class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-12">
        <FileText class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">No sentences mined yet</p>
        <p class="text-sm text-gray-400 mt-2">
          Paste sentences from papers, docs, or error messages to build your collection
        </p>
      </div>
    {/if}
  </div>

  <div class="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
    <div class="flex items-start gap-4">
      <div class="p-3 bg-purple-500 rounded-lg">
        <Tag class="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 class="font-semibold text-gray-900 mb-2">How Sentence Mining Works</h3>
        <div class="text-sm text-gray-600 space-y-2">
          <p><strong>1. Find interesting sentences</strong> in papers, docs, GitHub, error messages, or any real English content.</p>
          <p><strong>2. Paste them here</strong> with the source type and URL so you can reference them later.</p>
          <p><strong>3. Review regularly</strong> — these sentences contain words from your domain, making them high-value for retention.</p>
          <p><strong>4. The context is key</strong> — unlike isolated flashcards, sentences teach you words in their natural context.</p>
        </div>
      </div>
    </div>
  </div>
</div>