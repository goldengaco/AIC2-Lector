<script lang="ts">
  import { toasts } from '$lib/stores/app';
  import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-svelte';

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };
</script>

{#if $toasts.length > 0}
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    {#each $toasts as toast (toast.id)}
      <div 
        class="flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in {styles[toast.type]}"
        role="alert"
      >
        {#if toast.type === 'success'}
          <CheckCircle class="w-5 h-5 flex-shrink-0" />
        {:else if toast.type === 'error'}
          <AlertCircle class="w-5 h-5 flex-shrink-0" />
        {:else if toast.type === 'warning'}
          <AlertTriangle class="w-5 h-5 flex-shrink-0" />
        {:else}
          <Info class="w-5 h-5 flex-shrink-0" />
        {/if}
        <p class="text-sm font-medium">{toast.message}</p>
        <button 
          onclick={() => toasts.remove(toast.id)}
          class="ml-2 hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    {/each}
  </div>
{/if}

<style>
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
</style>