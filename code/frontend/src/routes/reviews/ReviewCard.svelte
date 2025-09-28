<script>
  export let review;

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getRatingColor(rating) {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    if (rating >= 4) return 'text-orange-600';
    return 'text-red-600';
  }
</script>

<a
  href="/reviews/{review.type}/{review.slug}"
  class="block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6
         hover:shadow-lg dark:hover:shadow-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200"
>
  <!-- Title -->
  <h3 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
    {review.title}
  </h3>

  <!-- Metadata Row -->
  <div class="flex items-center gap-4 text-sm mb-3">
    <!-- Rating -->
    <span class="font-semibold {getRatingColor(review.rating)}">
      {review.rating}/10
    </span>

    <!-- Date -->
    <span class="text-neutral-500 dark:text-neutral-400">
      {formatDate(review.date)}
    </span>

    <!-- Type Badge -->
    <span class="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded text-xs uppercase">
      {review.type}
    </span>
  </div>

  <!-- Tags -->
  {#if review.tags && review.tags.length > 0}
    <div class="flex flex-wrap gap-2">
      {#each review.tags.slice(0, 3) as tag}
        <span class="px-2 py-1 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full text-xs">
          {tag}
        </span>
      {/each}
    </div>
  {/if}

  <!-- Revisit indicator -->
  {#if review.revisit}
    <div class="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
      🔄 Revisit
    </div>
  {/if}
</a>