<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let isOnline = $state(true);
  let lastOnline = $state<Date | null>(null);
  let connectionQuality = $state<'good' | 'slow' | 'offline'>('good');

  function updateOnlineStatus() {
    isOnline = navigator.onLine;
    if (isOnline && !lastOnline) {
      lastOnline = new Date();
    } else if (!isOnline) {
      lastOnline = null;
    }
    connectionQuality = isOnline ? 'good' : 'offline';
  }

  function measureConnection() {
    if (!navigator.onLine) {
      connectionQuality = 'offline';
      return;
    }

    const connection = (navigator as any).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === '4g') {
        connectionQuality = 'good';
      } else if (['3g', '2g'].includes(effectiveType)) {
        connectionQuality = 'slow';
      } else {
        connectionQuality = 'slow';
      }
    }
  }

  onMount(() => {
    if (browser) {
      updateOnlineStatus();
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connection.addEventListener('change', measureConnection);
      }
    }

    return () => {
      if (browser) {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      }
    };
  });
</script>

<div class="flex items-center gap-2">
  {#if !isOnline}
    <div class="flex items-center gap-1.5 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
      </svg>
      <span>Offline</span>
    </div>
  {:else if connectionQuality === 'slow'}
    <div class="flex items-center gap-1.5 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Slow</span>
    </div>
  {:else}
    <div class="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>Online</span>
    </div>
  {/if}
</div>