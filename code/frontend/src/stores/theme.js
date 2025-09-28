import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Check for saved theme or system preference
function getInitialTheme() {
  if (!browser) return 'light';

  // Check localStorage first
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

function createThemeStore() {
  const { subscribe, set, update } = writable(getInitialTheme());

  return {
    subscribe,
    toggle: () => update(theme => {
      const newTheme = theme === 'light' ? 'dark' : 'light';

      if (browser) {
        localStorage.setItem('theme', newTheme);

        // Update document class
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      return newTheme;
    }),
    set: (theme) => {
      if (browser) {
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      set(theme);
    }
  };
}

export const theme = createThemeStore();