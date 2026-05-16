<script lang="ts">
  let { variant = 'card' as 'card' | 'text' | 'avatar' | 'button', class: className = '' } = $props();
</script>

{#if variant === 'card'}
  <div class="animate-pulse space-y-4 {className}">
    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
    <div class="space-y-2">
      <div class="h-3 bg-gray-200 rounded"></div>
      <div class="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div class="h-24 bg-gray-200 rounded"></div>
  </div>
{:else if variant === 'text'}
  <div class="animate-pulse space-y-2 {className}">
    <div class="h-4 bg-gray-200 rounded"></div>
    <div class="h-4 bg-gray-200 rounded w-11/12"></div>
    <div class="h-4 bg-gray-200 rounded w-4/5"></div>
  </div>
{:else if variant === 'avatar'}
  <div class="animate-pulse flex items-center gap-3 {className}">
    <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
    <div class="space-y-2">
      <div class="h-3 w-20 bg-gray-200 rounded"></div>
      <div class="h-2 w-16 bg-gray-200 rounded"></div>
    </div>
  </div>
{:else if variant === 'button'}
  <div class="animate-pulse h-10 bg-gray-200 rounded-lg w-24 {className}"></div>
{/if}