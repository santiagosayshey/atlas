<script>
  import { Moon, Sun } from 'lucide-svelte';
  import { theme } from '$shared/stores/theme.js';
</script>

<button
  onclick={() => theme.toggle()}
  class="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
  aria-label="Toggle theme"
>
  {#if $theme === 'light'}
    <Moon class="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
  {:else}
    <Sun class="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
  {/if}
</button>