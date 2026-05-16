<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { initializeDatabase } from '$lib/db';
  import { seedDatabase, seedMorphemes, seedGrammarRules, seedAWL, seedMoreTexts, seedTechnicalTexts, seedGradeSkills, initializeStats } from '$lib/data/seeds';
  import { initializeUserGrade } from '$lib/db/grades';
  import { isLoading } from '$lib/stores/app';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import KeyboardShortcuts from '$lib/components/KeyboardShortcuts.svelte';

  let { children } = $props();

  onMount(async () => {
    const t0 = performance.now();
    
    await initializeDatabase();
    await initializeStats();
    await seedDatabase();
    
    const remaining = [seedMorphemes(), seedGrammarRules(), seedAWL(), seedMoreTexts(), seedTechnicalTexts(), seedGradeSkills(), initializeUserGrade()];
    await Promise.allSettled(remaining);
    
    $isLoading = false;
    console.log('Ready in', Math.round(performance.now() - t0), 'ms');
  });
</script>

<div class="flex h-screen bg-gray-50">
  <Sidebar />
  
  <main class="flex-1 overflow-auto">
    <div class="max-w-7xl mx-auto p-6">
      {#if $isLoading}
        <div class="flex items-center justify-center h-64">
          <div class="text-center">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent mx-auto mb-3"></div>
            <p class="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
      {:else}
        {@render children()}
      {/if}
    </div>
  </main>
</div>

<Toast />
<KeyboardShortcuts />

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>