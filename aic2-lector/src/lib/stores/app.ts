import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

function createPersistedStore<T>(key: string, initialValue: T) {
  const storedValue = browser ? localStorage.getItem(key) : null;
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;
  
  const store: Writable<T> = writable(initial);
  
  if (browser) {
    store.subscribe(value => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }
  
  return store;
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