<script lang="ts">
  import { onMount } from 'svelte';
  import { getSettings, setSettings, db } from '$lib/db';
  import { toasts } from '$lib/stores/app';
  import { theme, dailyGoal, sessionGoal } from '$lib/stores/app';
  import { Settings, Database, Download, Upload, Trash2, Sun, Moon, Monitor } from 'lucide-svelte';

  let dailyGoalValue = $state(20);
  let sessionGoalValue = $state(15);
  let themeValue = $state('light');
  let isExporting = $state(false);
  let isImporting = $state(false);

  onMount(async () => {
    const savedDailyGoal = localStorage.getItem('aic2.dailyGoal');
    const savedSessionGoal = localStorage.getItem('aic2.sessionGoal');
    const savedTheme = localStorage.getItem('aic2.theme');

    if (savedDailyGoal) dailyGoalValue = parseInt(savedDailyGoal);
    if (savedSessionGoal) sessionGoalValue = parseInt(savedSessionGoal);
    if (savedTheme) themeValue = savedTheme;

    applyTheme(themeValue);
  });

  function applyTheme(t: string) {
    document.documentElement.classList.toggle('dark', t === 'dark');
  }

  function updateDailyGoal(value: number) {
    dailyGoal.set(value);
    dailyGoalValue = value;
  }

  function updateSessionGoal(value: number) {
    sessionGoal.set(value);
    sessionGoalValue = value;
  }

  function updateTheme(t: string) {
    theme.set(t);
    themeValue = t;
    applyTheme(t);
  }

  async function exportData() {
    isExporting = true;
    try {
      const data = {
        words: await db.words.toArray(),
        texts: await db.texts.toArray(),
        readingSessions: await db.readingSessions.toArray(),
        minedSentences: await db.minedSentences.toArray(),
        morphemes: await db.morphemes.toArray(),
        grammarRules: await db.grammarRules.toArray(),
        userStats: await db.userStats.toArray(),
        dailyProgress: await db.dailyProgress.toArray(),
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aic2-lector-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toasts.success('Data exported successfully');
    } catch (error) {
      toasts.error('Failed to export data');
    }
    isExporting = false;
  }

  async function importData(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    isImporting = true;
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.words) await db.words.bulkPut(data.words);
      if (data.texts) await db.texts.bulkPut(data.texts);
      if (data.readingSessions) await db.readingSessions.bulkPut(data.readingSessions);
      if (data.minedSentences) await db.minedSentences.bulkPut(data.minedSentences);
      if (data.morphemes) await db.morphemes.bulkPut(data.morphemes);
      if (data.grammarRules) await db.grammarRules.bulkPut(data.grammarRules);
      if (data.userStats) await db.userStats.bulkPut(data.userStats);
      if (data.dailyProgress) await db.dailyProgress.bulkPut(data.dailyProgress);

      toasts.success('Data imported successfully');
    } catch (error) {
      toasts.error('Failed to import data. Invalid file format.');
    }
    isImporting = false;
    input.value = '';
  }

  async function resetDatabase() {
    if (!confirm('Are you sure you want to reset all data? This cannot be undone.')) return;
    
    try {
      await db.words.clear();
      await db.texts.clear();
      await db.readingSessions.clear();
      await db.minedSentences.clear();
      await db.morphemes.clear();
      await db.grammarRules.clear();
      await db.dailyProgress.clear();
      await db.userStats.clear();
      
      toasts.success('Database reset. Reload the page to reseed.');
    } catch (error) {
      toasts.error('Failed to reset database');
    }
  }
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
    <p class="text-gray-500 mt-1">Customize your learning experience</p>
  </div>

  <div class="card">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-gray-100 rounded-lg">
        <Settings class="w-5 h-5 text-gray-600" />
      </div>
      <h2 class="text-lg font-semibold text-gray-900">Goals</h2>
    </div>

    <div class="space-y-6">
      <div>
        <label for="daily-goal" class="block text-sm font-medium text-gray-700 mb-2">
          Daily new words goal: {dailyGoalValue}
        </label>
        <input
          id="daily-goal"
          type="range"
          min="5"
          max="50"
          step="5"
          bind:value={dailyGoalValue}
          onchange={() => updateDailyGoal(dailyGoalValue)}
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>5 (Easy)</span>
          <span>50 (Ambitious)</span>
        </div>
      </div>

      <div>
        <label for="session-goal" class="block text-sm font-medium text-gray-700 mb-2">
          Session length: {sessionGoalValue} minutes
        </label>
        <input
          id="session-goal"
          type="range"
          min="5"
          max="60"
          step="5"
          bind:value={sessionGoalValue}
          onchange={() => updateSessionGoal(sessionGoalValue)}
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>5 min</span>
          <span>60 min</span>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-gray-100 rounded-lg">
        <Monitor class="w-5 h-5 text-gray-600" />
      </div>
      <h2 class="text-lg font-semibold text-gray-900">Appearance</h2>
    </div>

    <div class="flex gap-3">
      <button
        onclick={() => updateTheme('light')}
        class="flex-1 p-4 border-2 rounded-lg transition-colors
               {themeValue === 'light' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
      >
        <Sun class="w-6 h-6 mx-auto mb-2 text-yellow-500" />
        <p class="text-sm font-medium text-center">Light</p>
      </button>

      <button
        onclick={() => updateTheme('dark')}
        class="flex-1 p-4 border-2 rounded-lg transition-colors
               {themeValue === 'dark' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
      >
        <Moon class="w-6 h-6 mx-auto mb-2 text-gray-700" />
        <p class="text-sm font-medium text-center">Dark</p>
      </button>
    </div>
  </div>

  <div class="card">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-gray-100 rounded-lg">
        <Database class="w-5 h-5 text-gray-600" />
      </div>
      <h2 class="text-lg font-semibold text-gray-900">Data Management</h2>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p class="font-medium text-gray-900">Export Data</p>
          <p class="text-sm text-gray-500">Download all your data as JSON</p>
        </div>
        <button onclick={exportData} disabled={isExporting} class="btn-primary">
          {#if isExporting}
            Exporting...
          {:else}
            <Download class="w-4 h-4 mr-2" />
            Export
          {/if}
        </button>
      </div>

      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p class="font-medium text-gray-900">Import Data</p>
          <p class="text-sm text-gray-500">Restore from a backup file</p>
        </div>
        <label class="btn-primary cursor-pointer">
          {#if isImporting}
            Importing...
          {:else}
            <Upload class="w-4 h-4 mr-2" />
            Import
          {/if}
          <input type="file" accept=".json" onchange={importData} class="hidden" />
        </label>
      </div>

      <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
        <div>
          <p class="font-medium text-red-900">Reset Database</p>
          <p class="text-sm text-red-600">Delete all data and start fresh</p>
        </div>
        <button onclick={resetDatabase} class="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
          <Trash2 class="w-4 h-4 mr-2" />
          Reset
        </button>
      </div>
    </div>
  </div>

  <div class="card">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">About</h2>
    <div class="text-sm text-gray-600 space-y-2">
      <p><strong>AIC2-Lector</strong> v1.0</p>
      <p>A personalized English reading system designed for technical professionals.</p>
      <p>Built with SvelteKit, Tailwind CSS, and Dexie.js (IndexedDB).</p>
      <p class="text-gray-400 mt-4">Designed to take you from A0/A1 to C2 reading in 18-30 months.</p>
    </div>
  </div>
</div>