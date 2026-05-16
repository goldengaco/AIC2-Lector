<script lang="ts">
  import { page } from '$app/stores';
  import { Home, BookOpen, ListChecks, BarChart3, Settings, Sparkles, ClipboardCheck, FileText, BookMarked, Layers, GraduationCap, HelpCircle } from 'lucide-svelte';

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/help', label: 'Instructions', icon: HelpCircle },
    { href: '/study', label: 'Study', icon: GraduationCap },
    { href: '/vocabulary', label: 'Vocabulary', icon: BookOpen },
    { href: '/morphology', label: 'Morphology', icon: Sparkles },
    { href: '/grammar', label: 'Grammar', icon: BookMarked },
    { href: '/awl', label: 'AWL', icon: Layers },
    { href: '/reading', label: 'Reading', icon: ListChecks },
    { href: '/mine', label: 'Mine', icon: FileText },
    { href: '/tests', label: 'Tests', icon: ClipboardCheck },
    { href: '/stats', label: 'Statistics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  let isCollapsed = $state(false);
</script>

<aside 
  class="bg-white border-r border-gray-200 flex flex-col transition-all duration-300 {isCollapsed ? 'w-16' : 'w-64'}"
>
  <div class="p-4 border-b border-gray-100">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold text-lg">AI</span>
      </div>
      {#if !isCollapsed}
        <div>
          <h1 class="font-bold text-gray-900">AIC2-Lector</h1>
          <p class="text-xs text-gray-500">English Reader</p>
        </div>
      {/if}
    </div>
  </div>

  <nav class="flex-1 p-3 space-y-1">
    {#each navItems as item}
      {@const isActive = $page.url.pathname === item.href}
      <a
        href={item.href}
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200
               {isActive 
                 ? 'bg-primary-50 text-primary-700' 
                 : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
        aria-label={item.label}
      >
        <item.icon class="w-5 h-5 flex-shrink-0" />
        {#if !isCollapsed}
          <span class="font-medium">{item.label}</span>
        {/if}
      </a>
    {/each}
  </nav>

  <div class="p-3 border-t border-gray-100">
    <button
      onclick={() => isCollapsed = !isCollapsed}
      class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      aria-label="Toggle sidebar"
    >
      <svg 
        class="w-5 h-5 transition-transform duration-300 {isCollapsed ? 'rotate-180' : ''}" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    </button>
  </div>
</aside>