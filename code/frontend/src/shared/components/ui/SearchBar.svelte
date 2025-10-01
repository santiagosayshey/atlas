<script>
  import { Search } from 'lucide-svelte';

  /**
   * @type {string}
   */
  export let value = '';

  /**
   * @type {string}
   */
  export let placeholder = 'Search...';
</script>

<div class="relative">
  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <Search class="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
  </div>
  <input
    type="text"
    bind:value
    {placeholder}
    class="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent"
  />
</div>
