<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { toasts } from '$lib/stores/app';

  interface ErrorInfo {
    message: string;
    stack?: string;
    timestamp: Date;
    context?: string;
  }

  let errors = $state<ErrorInfo[]>([]);
  let errorCount = $state(0);

  const MAX_STORED_ERRORS = 50;

  export function logError(error: Error | unknown, context?: string) {
    const errorInfo: ErrorInfo = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
      context,
    };

    errors = [...errors.slice(-MAX_STORED_ERRORS + 1), errorInfo];
    errorCount++;

    if (browser) {
      console.error('[AIC2 Error]', errorInfo);
    }
  }

  export function clearErrors() {
    errors = [];
    errorCount = 0;
  }

  export function getErrors(): ErrorInfo[] {
    return [...errors];
  }

  export function getErrorCount(): number {
    return errorCount;
  }

  onMount(() => {
    if (browser) {
      window.addEventListener('error', (event) => {
        logError(event.error || new Error(event.message), 'window.onerror');
      });

      window.addEventListener('unhandledrejection', (event) => {
        logError(event.reason || new Error('Unhandled promise rejection'), 'unhandledrejection');
      });
    }
  });
</script>

<div class="hidden"></div>