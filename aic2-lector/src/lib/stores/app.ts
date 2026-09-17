import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

type PersistedEntry = {
  key: string;
  store: Writable<unknown>;
};

const persistedEntries: PersistedEntry[] = [];
let persistenceHydrated = false;

function createPersistedStore<T>(key: string, initialValue: T) {
  const store: Writable<T> = writable(initialValue);
  persistedEntries.push({ key, store: store as Writable<unknown> });

  return store;
}

export function hydratePersistedStores(): void {
  if (!browser || persistenceHydrated) return;
  persistenceHydrated = true;

  for (const { key, store } of persistedEntries) {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      try {
        store.set(JSON.parse(storedValue));
      } catch {
        localStorage.removeItem(key);
      }
    }

    store.subscribe(value => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }
}

export const currentRoute = createPersistedStore('aic2.route', 'dashboard');
export const theme = createPersistedStore('aic2.theme', 'light');
export const dailyGoal = createPersistedStore('aic2.dailyGoal', 20);
export const sessionGoal = createPersistedStore('aic2.sessionGoal', 15);

export const isLoading = writable(true);
export const showOnboarding = createPersistedStore('aic2.onboarding', true);

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

function createToastStore() {
  const { subscribe, update }: Writable<Toast[]> = writable([]);
  
  return {
    subscribe,
    add: (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      update(toasts => [...toasts, { ...toast, id }]);
      
      const duration = toast.duration ?? 3000;
      setTimeout(() => {
        update(toasts => toasts.filter(t => t.id !== id));
      }, duration);
    },
    remove: (id: string) => {
      update(toasts => toasts.filter(t => t.id !== id));
    },
    success: (message: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      update(toasts => [...toasts, { id, type: 'success', message }]);
      setTimeout(() => update(toasts => toasts.filter(t => t.id !== id)), 3000);
    },
    error: (message: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      update(toasts => [...toasts, { id, type: 'error', message, duration: 5000 }]);
      setTimeout(() => update(toasts => toasts.filter(t => t.id !== id)), 5000);
    },
    info: (message: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      update(toasts => [...toasts, { id, type: 'info', message }]);
      setTimeout(() => update(toasts => toasts.filter(t => t.id !== id)), 3000);
    },
    warning: (message: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      update(toasts => [...toasts, { id, type: 'warning', message }]);
      setTimeout(() => update(toasts => toasts.filter(t => t.id !== id)), 4000);
    },
  };
}

export const toasts = createToastStore();
