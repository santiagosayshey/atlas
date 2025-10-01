<script>
  import { Moon, Sun } from 'lucide-svelte';
  import { theme } from '../../shared/stores/theme.js';
</script>

<button
  onclick={() => theme.toggle()}
  class="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800
         hover:bg-neutral-100 dark:hover:bg-neutral-900
         text-neutral-600 dark:text-neutral-400
         transition-all duration-150"
  aria-label="Toggle theme"
>
  {#if $theme === 'light'}
    <Moon class="w-4 h-4" />
  {:else}
    <Sun class="w-4 h-4" />
  {/if}
</button>