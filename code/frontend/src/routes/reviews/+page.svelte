<script>
  import { onMount } from 'svelte';
  import { getReviews } from '$api/reviews.js';
  import ReviewCard from './ReviewCard.svelte';

  let reviews = [];
  let loading = true;
  let error = null;
  let selectedType = 'all';

  async function loadReviews(type = null) {
    loading = true;
    error = null;

    try {
      reviews = await getReviews(type === 'all' ? null : type);
    } catch (err) {
      error = err.message;
      reviews = [];
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadReviews();
  });

  function handleTypeChange(type) {
    selectedType = type;
    loadReviews(type === 'all' ? null : type);
  }
</script>

<div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Reviews</h1>

      <!-- Filter Tabs -->
      <div class="flex space-x-1 border-b border-neutral-200 dark:border-neutral-800">
        {#each ['all', 'movie', 'tv', 'book'] as type}
          <button
            onclick={() => handleTypeChange(type)}
            class="px-4 py-2 font-medium text-sm capitalize transition-colors
                   {selectedType === type
                     ? 'text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100'
                     : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'}"
          >
            {type === 'all' ? 'All' : type === 'tv' ? 'TV' : type}
          </button>
        {/each}
      </div>
    </div>

    <!-- Content -->
    {#if loading}
      <div class="flex justify-center py-12">
        <p class="text-neutral-500 dark:text-neutral-400">Loading reviews...</p>
      </div>
    {:else if error}
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p class="text-red-800 dark:text-red-300">Error loading reviews: {error}</p>
      </div>
    {:else if reviews.length === 0}
      <div class="text-center py-12">
        <p class="text-neutral-500 dark:text-neutral-400">No reviews found.</p>
      </div>
    {:else}
      <!-- Reviews Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each reviews as review}
          <ReviewCard {review} />
        {/each}
      </div>
    {/if}
  </div>
</div>