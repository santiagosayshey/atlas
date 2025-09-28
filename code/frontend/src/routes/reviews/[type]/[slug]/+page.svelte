<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getReview } from '$api/reviews.js';
  import { marked } from 'marked';

  let review = null;
  let loading = true;
  let error = null;

  $: type = $page.params.type;
  $: slug = $page.params.slug;

  async function loadReview() {
    loading = true;
    error = null;

    try {
      review = await getReview(type, slug);
    } catch (err) {
      error = err.message;
      review = null;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadReview();
  });

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getRatingColor(rating) {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    if (rating >= 4) return 'text-orange-600';
    return 'text-red-600';
  }

  $: renderedContent = review?.content ? marked(review.content) : '';
</script>

<div class="min-h-screen bg-neutral-50">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Back navigation -->
    <a
      href="/reviews"
      class="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-8"
    >
      <span class="mr-2">←</span> Back to reviews
    </a>

    {#if loading}
      <div class="flex justify-center py-12">
        <p class="text-neutral-500">Loading review...</p>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">Error: {error}</p>
      </div>
    {:else if review}
      <article class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="px-8 py-6 border-b border-neutral-200">
          <h1 class="text-3xl font-bold text-neutral-900 mb-4">
            {review.title}
          </h1>

          <!-- Metadata -->
          <div class="flex flex-wrap items-center gap-4 text-sm">
            <!-- Rating -->
            <div class="flex items-center">
              <span class="text-neutral-500 mr-2">Rating:</span>
              <span class="font-semibold text-lg {getRatingColor(review.rating)}">
                {review.rating}/10
              </span>
            </div>

            <!-- Date -->
            <div class="flex items-center">
              <span class="text-neutral-500 mr-2">Date:</span>
              <span class="text-neutral-700">{formatDate(review.date)}</span>
            </div>

            <!-- Type -->
            <span class="px-3 py-1 bg-neutral-100 text-neutral-600 rounded text-xs uppercase">
              {review.type}
            </span>

            <!-- Revisit -->
            {#if review.revisit}
              <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                🔄 Revisit
              </span>
            {/if}
          </div>

          <!-- Tags -->
          {#if review.tags && review.tags.length > 0}
            <div class="mt-4 flex flex-wrap gap-2">
              {#each review.tags as tag}
                <span class="px-3 py-1 bg-neutral-50 text-neutral-600 rounded-full text-sm">
                  #{tag}
                </span>
              {/each}
            </div>
          {/if}

          <!-- Who watched with -->
          {#if review.with && review.with.length > 0}
            <div class="mt-4 text-sm text-neutral-600">
              Watched with: {review.with.join(', ')}
            </div>
          {/if}
        </div>

        <!-- Content -->
        <div class="px-8 py-6">
          <div class="prose prose-neutral max-w-none">
            {@html renderedContent}
          </div>
        </div>

        <!-- Footer -->
        {#if review.tmdb_id || review.isbn}
          <div class="px-8 py-4 bg-neutral-50 border-t border-neutral-200">
            <div class="text-sm text-neutral-500">
              {#if review.tmdb_id}
                TMDB ID: {review.tmdb_id}
              {/if}
              {#if review.isbn}
                ISBN: {review.isbn}
              {/if}
            </div>
          </div>
        {/if}
      </article>
    {/if}
  </div>
</div>