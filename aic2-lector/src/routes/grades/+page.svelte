<script lang="ts">
  import { onMount } from 'svelte';
  import {
    estimateGradeLevel,
    getSkillsByGrade,
    getSkillsByCategory,
    completeSkill,
    uncompleteSkill,
    getOverallProgress,
    getCategoryProgress,
    GRADE_ORDER,
    GRADE_LABELS,
    GRADE_CEFR,
    GRADE_CAN_READ,
    CATEGORY_LABELS,
    CATEGORY_COLORS,
    CATEGORY_STROKE,
    type USGradeLevel,
    type SkillCategory,
    type GradeSkill,
  } from '$lib/db/grades';
  import { getStats, getEstimatedDaysToLevels } from '$lib/db/stats';
  import { ChevronDown, ChevronUp, Check, BookOpen, Search, Trophy, Rocket, Calendar } from 'lucide-svelte';
  import type { UserStats } from '$lib/db';

  type Tab = 'progress' | 'detail' | 'summary';
  type CategoryTab = 'reading' | 'vocabulary' | 'comprehension' | 'analysis';

  let stats: UserStats | undefined = $state();
  let currentGrade: USGradeLevel = $state('K');
  let activeTab = $state<Tab>('progress');
  let activeCategory = $state<CategoryTab>('reading');
  let expandedGrade: USGradeLevel | null = $state(null);
  let gradeSkills = $state<GradeSkill[]>([]);
  let categorySkills = $state<GradeSkill[]>([]);
  let overallProgress = $state({ totalPct: 0, currentGrade: 'K' as USGradeLevel, maxGradeReached: 'K' as USGradeLevel, totalCompleted: 0, totalSkills: 0 });
  let categoryProgress = $state<Record<string, number>>({});
  let gradeProgressMap = $state<Record<string, number>>({});
  let estimatedDays = $state({ currentLevel: 'A1' as any, levels: [] as any[] });

  const categories: CategoryTab[] = ['reading', 'vocabulary', 'comprehension', 'analysis'];

  onMount(async () => {
    stats = await getStats();
    if (stats) {
      currentGrade = estimateGradeLevel(stats);
    }
    const progress = await getOverallProgress();
    overallProgress = progress;

    for (const grade of GRADE_ORDER) {
      gradeProgressMap[String(grade)] = await getGradeProgressLocal(grade);
    }

    for (const cat of categories) {
      categoryProgress[cat] = await getCategoryProgress(cat);
    }

    estimatedDays = await getEstimatedDaysToLevels();

    await loadSkillsForGrade(currentGrade);
    await loadSkillsForCategory('reading');
  });

  async function getGradeProgressLocal(grade: USGradeLevel): Promise<number> {
    const skills = await getSkillsByGrade(grade);
    if (skills.length === 0) return 0;
    const completed = skills.filter(s => s.completed).length;
    return Math.round((completed / skills.length) * 100);
  }

  async function loadSkillsForGrade(grade: USGradeLevel) {
    gradeSkills = await getSkillsByGrade(grade);
  }

  async function loadSkillsForCategory(category: CategoryTab) {
    categorySkills = await getSkillsByCategory(category);
  }

  async function toggleSkill(skill: GradeSkill) {
    if (skill.completed) {
      await uncompleteSkill(skill.id);
    } else {
      await completeSkill(skill.id);
    }
    await loadSkillsForGrade(expandedGrade ?? currentGrade);
    await loadSkillsForCategory(activeCategory);
    const progress = await getOverallProgress();
    overallProgress = progress;
    for (const cat of categories) {
      categoryProgress[cat] = await getCategoryProgress(cat);
    }
    for (const grade of GRADE_ORDER) {
      gradeProgressMap[String(grade)] = await getGradeProgressLocal(grade);
    }
  }

  function formatDays(days: number | null): string {
    if (days === null) return '—';
    if (days === 0) return '¡Hoy!';
    if (days < 7) return `${days} días`;
    if (days < 30) return `${Math.round(days / 7)} semanas`;
    if (days < 365) return `${Math.round(days / 30)} meses`;
    return `${(days / 365).toFixed(1)} años`;
  }

  function getGradeColor(grade: USGradeLevel): string {
    const idx = GRADE_ORDER.indexOf(grade);
    const currentIdx = GRADE_ORDER.indexOf(overallProgress.maxGradeReached);
    if (idx < currentIdx) return 'border-green-500 bg-green-50';
    if (idx === currentIdx) return 'border-primary-500 bg-primary-50 ring-2 ring-primary-200';
    return 'border-gray-200 bg-gray-50';
  }

  function getCircleColor(grade: USGradeLevel): string {
    const idx = GRADE_ORDER.indexOf(grade);
    const currentIdx = GRADE_ORDER.indexOf(overallProgress.maxGradeReached);
    if (idx < currentIdx) return 'bg-green-500';
    if (idx === currentIdx) return 'bg-primary-600';
    return 'bg-gray-300';
  }

  async function switchCategoryTab(cat: CategoryTab) {
    activeCategory = cat;
    await loadSkillsForCategory(cat);
  }

  function switchTab(tab: Tab) {
    activeTab = tab;
  }

  function gradeDisplay(grade: USGradeLevel): string {
    if (typeof grade === 'number') return String(grade);
    if (grade === 'K') return 'K';
    return 'C';
  }

  function nextGradeDisplay(grade: USGradeLevel): string {
    if (grade === 'college') return 'College';
    if (typeof grade === 'number') return String(grade + 1);
    return '1';
  }

  function nextGradeCanRead(grade: USGradeLevel): string {
    if (grade === 'college') return GRADE_CAN_READ['college'];
    const next = typeof grade === 'number' ? grade + 1 : 1;
    return GRADE_CAN_READ[String(next)] ?? GRADE_CAN_READ['college'];
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between flex-wrap gap-3">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">US School Grades</h1>
      <p class="text-gray-500 mt-1">Tu progreso escolar — de Kindergarten a College</p>
    </div>
    <div class="flex items-center gap-2">
      <span class="px-3 py-1.5 rounded-full text-sm font-semibold bg-primary-100 text-primary-700">
        Grado: {GRADE_LABELS[String(currentGrade)]}
      </span>
      <span class="px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700">
        CEFR: {GRADE_CEFR[String(currentGrade)]}
      </span>
    </div>
  </div>

  <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
    <button
      onclick={() => activeTab = 'progress'}
      class="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors {activeTab === 'progress' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
    >
      <BookOpen class="w-4 h-4 inline mr-2" />
      Progreso
    </button>
    <button
      onclick={() => switchTab('detail')}
      class="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors {activeTab === 'detail' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
    >
      <Search class="w-4 h-4 inline mr-2" />
      Detalle
    </button>
    <button
      onclick={() => activeTab = 'summary'}
      class="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors {activeTab === 'summary' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
    >
      <Trophy class="w-4 h-4 inline mr-2" />
      Resumen
    </button>
  </div>

  {#if activeTab === 'progress'}
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Escalera de Grados</h2>
      <div class="space-y-3">
        {#each GRADE_ORDER as grade}
          {@const idx = GRADE_ORDER.indexOf(grade)}
          {@const progress = gradeProgressMap[String(grade)] ?? 0}
          {@const isExpanded = expandedGrade === grade}
          {@const isCurrent = grade === currentGrade}
          {@const isPast = idx < GRADE_ORDER.indexOf(overallProgress.maxGradeReached)}

          <div class="border rounded-lg transition-all {getGradeColor(grade)}">
            <button
              onclick={() => { expandedGrade = isExpanded ? null : grade; loadSkillsForGrade(grade); }}
              class="w-full flex items-center gap-4 p-4 text-left"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 {getCircleColor(grade)}">
                {#if isPast}
                  <Check class="w-5 h-5 text-white" />
                {:else}
                  <span class="text-white font-bold text-sm">{gradeDisplay(grade)}</span>
                {/if}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-gray-900">{GRADE_LABELS[String(grade)]}</span>
                  <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {GRADE_CEFR[String(grade)]}
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-0.5 truncate">{GRADE_CAN_READ[String(grade)]}</p>
                <div class="mt-2 progress-bar">
                  <div class="progress-bar-fill {isPast ? 'bg-green-500' : isCurrent ? 'bg-primary-500' : 'bg-gray-300'}"
                       style="width: {progress}%"></div>
                </div>
              </div>

              {#if isExpanded}
                <ChevronUp class="w-5 h-5 text-gray-400 flex-shrink-0" />
              {:else}
                <ChevronDown class="w-5 h-5 text-gray-400 flex-shrink-0" />
              {/if}
            </button>

            {#if isExpanded && gradeSkills.length > 0}
              <div class="border-t px-4 pb-4 pt-2">
                <div class="space-y-2">
                  {#each gradeSkills as skill}
                    <button
                      onclick={() => toggleSkill(skill)}
                      class="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors text-left"
                    >
                      <div class="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                                  {skill.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}">
                        {#if skill.completed}
                          <Check class="w-3 h-3 text-white" />
                        {/if}
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="font-medium text-sm text-gray-900 {skill.completed ? 'line-through text-gray-400' : ''}">{skill.name}</span>
                          <span class="text-xs px-1.5 py-0.5 rounded text-white {CATEGORY_COLORS[skill.category]}">{CATEGORY_LABELS[skill.category]}</span>
                        </div>
                        <p class="text-xs text-gray-500 mt-0.5">{skill.description}</p>
                        <div class="flex flex-wrap gap-1 mt-1">
                          {#each skill.milestones as m}
                            <span class="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{m}</span>
                          {/each}
                        </div>
                      </div>
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if activeTab === 'detail'}
    <div class="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
      {#each categories as cat}
        <button
          onclick={() => switchCategoryTab(cat)}
          class="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors {activeCategory === cat ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
        >
          {CATEGORY_LABELS[cat]}
        </button>
      {/each}
    </div>

    <div class="space-y-3">
      {#each categorySkills as skill}
        <div class="card p-4">
          <div class="flex items-start gap-3">
            <button onclick={() => toggleSkill(skill)}
              class="w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                     {skill.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}">
              {#if skill.completed}
                <Check class="w-4 h-4 text-white" />
              {/if}
            </button>
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-semibold text-gray-900 {skill.completed ? 'line-through text-gray-400' : ''}">{skill.name}</h3>
                <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Grado {typeof skill.grade === 'number' ? skill.grade : skill.grade}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">{skill.cefr_equiv}</span>
              </div>
              <p class="text-sm text-gray-500 mt-1">{skill.description}</p>
              <div class="mt-3 space-y-1">
                {#each skill.milestones as m, i}
                  <div class="flex items-center gap-2 text-sm">
                    <div class="w-1.5 h-1.5 rounded-full {CATEGORY_COLORS[skill.category]}"></div>
                    <span class="text-gray-600">{m}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if activeTab === 'summary'}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card text-center">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Progreso Total</h2>
        <div class="relative w-48 h-48 mx-auto">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" stroke-width="12" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#2563eb" stroke-width="12"
              stroke-linecap="round"
              style="stroke-dasharray: 314; stroke-dashoffset: {314 - (314 * overallProgress.totalPct / 100)}; transition: stroke-dashoffset 0.5s;" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div>
              <p class="text-4xl font-bold text-gray-900">{overallProgress.totalPct}%</p>
              <p class="text-sm text-gray-500">completado</p>
            </div>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-500">
          <p>{overallProgress.totalCompleted} de {overallProgress.totalSkills} skills completadas</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="card">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Tu Grado Actual</h3>
          <p class="text-3xl font-bold text-primary-600">{GRADE_LABELS[String(currentGrade)]}</p>
          <p class="text-sm text-gray-500 mt-1">CEFR: {GRADE_CEFR[String(currentGrade)]}</p>
        </div>

        <div class="card">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Meta A2 (Conversación)</h3>
          <div class="progress-bar">
            <div class="progress-bar-fill bg-blue-500" style="width: {Math.min((GRADE_ORDER.indexOf(currentGrade) / GRADE_ORDER.indexOf(3)) * 100, 100)}%"></div>
          </div>
          <p class="text-xs text-gray-500 mt-1">Grado 3 = A2</p>
        </div>

        <div class="card">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Meta B1 (Trabajo)</h3>
          <div class="progress-bar">
            <div class="progress-bar-fill bg-green-500" style="width: {Math.min((GRADE_ORDER.indexOf(currentGrade) / GRADE_ORDER.indexOf(5)) * 100, 100)}%"></div>
          </div>
          <p class="text-xs text-gray-500 mt-1">Grado 5 = B1</p>
        </div>

        <div class="card">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Meta $100K (College C2)</h3>
          <div class="progress-bar">
            <div class="progress-bar-fill bg-orange-500" style="width: {Math.min((GRADE_ORDER.indexOf(currentGrade) / (GRADE_ORDER.length - 1)) * 100, 100)}%"></div>
          </div>
          <p class="text-xs text-gray-500 mt-1">College = C2</p>
        </div>
      </div>
    </div>

    <div class="card bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-100">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-indigo-600 rounded-lg">
          <Rocket class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Tu Camino a C2</h2>
          <p class="text-sm text-gray-500">Estimación basada en tu ritmo actual</p>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {#each estimatedDays.levels as lvl}
          <div class="text-center p-3 rounded-lg {lvl.isReached ? 'bg-green-100 border border-green-200' : 'bg-white border border-gray-100'}">
            <span class="inline-block px-2 py-0.5 rounded-full text-xs font-bold {lvl.isReached ? 'bg-green-500 text-white' : lvl.color}">
              {lvl.level}
            </span>
            <p class="text-xs text-gray-500 mt-1">{lvl.label}</p>
            {#if lvl.isReached}
              <p class="text-sm font-bold text-green-600 mt-1">✓ Logrado</p>
            {:else if lvl.daysEstimated !== null}
              <div class="flex items-center justify-center gap-1 mt-1">
                <Calendar class="w-3 h-3 text-indigo-500" />
                <span class="text-sm font-bold text-indigo-600">{formatDays(lvl.daysEstimated)}</span>
              </div>
            {:else}
              <p class="text-xs text-gray-400 mt-1">Estudia para estimar</p>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Progreso por Categoría</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        {#each categories as cat}
          {@const circumference = 2 * 3.14159 * 35}
          {@const pct = categoryProgress[cat] ?? 0}
          {@const offset = circumference - (pct / 100) * circumference}
          <div class="text-center">
            <div class="relative w-24 h-24 mx-auto mb-3">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" stroke-width="8" />
                <circle cx="40" cy="40" r="35" fill="none" stroke-width="8" stroke-linecap="round"
                  class="{CATEGORY_STROKE[cat]}"
                  style="stroke-dasharray: {circumference}; stroke-dashoffset: {offset}; transition: stroke-dashoffset 0.5s;" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-lg font-bold text-gray-900">{pct}%</span>
              </div>
            </div>
            <p class="text-sm font-medium text-gray-700">{CATEGORY_LABELS[cat]}</p>
          </div>
        {/each}
      </div>
    </div>

    <div class="card bg-gradient-to-br from-primary-50 to-blue-50 border-primary-100">
      <h2 class="text-lg font-semibold text-gray-900 mb-3">Lo que puedes leer ahora (Grado {gradeDisplay(currentGrade)})</h2>
      <p class="text-gray-700">{GRADE_CAN_READ[String(currentGrade)]}</p>
      <div class="mt-4 p-3 bg-white rounded-lg">
        <p class="text-sm text-gray-500">Siguiente meta: <span class="font-semibold text-primary-600">Grado {nextGradeDisplay(currentGrade)}</span></p>
        <p class="text-sm text-gray-500 mt-1">Podrás leer: <span class="font-medium text-gray-700">{nextGradeCanRead(currentGrade)}</span></p>
      </div>
    </div>
  {/if}
</div>
