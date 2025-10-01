<script>
  import ThemeToggle from './ThemeToggle.svelte';
  import { PanelLeft, PanelLeftClose } from 'lucide-svelte';
  import { pageNavCollapsed } from '$stores/pagenav.js';

  function togglePageNav() {
    pageNavCollapsed.update(val => !val);
  }
</script>

<nav class="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
  <div class="h-16 flex items-center justify-between">
    <div class="relative w-64">
      <div class="pl-7 flex items-center gap-2">
        <a href="/" class="flex items-center gap-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          <img src="/world-map.png" alt="World Map" class="w-6 h-6" />
          atlas
        </a>
      </div>
      <button
        onclick={togglePageNav}
        class="absolute -right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        aria-label="Toggle navigation"
      >
        {#if $pageNavCollapsed}
          <PanelLeft class="w-5 h-5" />
        {:else}
          <PanelLeftClose class="w-5 h-5" />
        {/if}
      </button>
    </div>
    <div class="px-4 sm:px-6 lg:px-8">
      <ThemeToggle />
    </div>
  </div>
</nav>