<script>
  import Card from '$ui/Card.svelte';

  /**
   * @type {{ slug: string, name: string, description: string, frequency: string, steps: string[] }}
   */
  export let habit;
</script>

<Card href="/habits/{habit.slug}">
  <h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
    {habit.name}
  </h2>
  <p class="text-neutral-600 dark:text-neutral-400 mb-3">
    {habit.description}
  </p>
  <div class="flex items-center gap-2 mb-3">
    <span class="inline-block px-3 py-1 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full">
      {habit.frequency}
    </span>
    <span class="text-xs text-neutral-500 dark:text-neutral-400">
      {habit.steps.length} {habit.steps.length === 1 ? 'step' : 'steps'}
    </span>
  </div>
</Card>
