<script>
  import ThemeToggle from './ThemeToggle.svelte';
</script>

<nav class="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
  <div class="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
      <img src="/world-map.png" alt="World Map" class="w-6 h-6" />
      atlas
    </a>
    <ThemeToggle />
  </div>
</nav>