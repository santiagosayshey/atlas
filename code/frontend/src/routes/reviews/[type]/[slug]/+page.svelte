<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getReview } from '$api/reviews.js';
  import { marked } from 'marked';
  import { ArrowLeft, Calendar, Clock, User, Tag, Users, RotateCcw, ExternalLink, Film } from 'lucide-svelte';
  import RatingBadge from './RatingBadge.svelte';

  let review = null;
  let loading = true;
  let error = null;
  let imageError = false;

  function handleImageError() {
    console.error('Image failed to load:', review?.poster);
    imageError = true;
  }

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

  function getTypeDisplay(type) {
    if (type === 'tv') return 'TV Show';
    if (type === 'movie') return 'Movie';
    if (type === 'book') return 'Book';
    return type;
  }

  function formatRuntime(minutes) {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  $: renderedContent = review?.content ? marked(review.content) : '';
  $: tmdbUrl = review?.tmdb_id ? `https://www.themoviedb.org/${review.type}/${review.tmdb_id}` : null;
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <!-- Back navigation -->
  <a
    href="/reviews"
    class="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-8 transition-colors"
  >
    <ArrowLeft class="w-4 h-4" />
    Back to reviews
  </a>

  {#if loading}
      <div class="flex justify-center py-12">
        <p class="text-neutral-500 dark:text-neutral-400">Loading review...</p>
      </div>
    {:else if error}
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p class="text-red-800 dark:text-red-300">Error: {error}</p>
      </div>
    {:else if review}
      <article class="space-y-8">
        <!-- Hero Section -->
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div class="p-8">
            <div class="flex gap-8 h-[350px]">
              <!-- Poster -->
              {#if review.poster && !imageError}
                <div class="flex-shrink-0 h-full">
                  <img
                    src={review.poster.startsWith('/') ? `http://localhost:7667${review.poster}` : review.poster}
                    alt={review.title}
                    class="h-full w-auto object-cover rounded-lg shadow-lg"
                    on:error={handleImageError}
                  />
                </div>
              {/if}

              <!-- Main Info -->
              <div class="flex-1 min-w-0 overflow-y-auto">
                <!-- Title and TMDB Link -->
                <div class="flex items-start justify-between gap-4 mb-4">
                  <h1 class="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                    {review.title}
                  </h1>
                  {#if tmdbUrl}
                    <a
                      href={tmdbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      <Film class="w-4 h-4" />
                      TMDB
                      <ExternalLink class="w-3 h-3" />
                    </a>
                  {/if}
                </div>

                <!-- TMDB Overview -->
                {#if review.tmdb?.overview}
                  <p class="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                    {review.tmdb.overview}
                  </p>
                {/if}

                <!-- Metadata Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <!-- Type -->
                  <div class="flex items-center gap-2 text-sm">
                    <Film class="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                    <span class="text-neutral-600 dark:text-neutral-400">Type:</span>
                    <span class="font-medium text-neutral-900 dark:text-neutral-100">{getTypeDisplay(review.type)}</span>
                  </div>

                  <!-- Date -->
                  <div class="flex items-center gap-2 text-sm">
                    <Calendar class="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                    <span class="text-neutral-600 dark:text-neutral-400">Watched:</span>
                    <span class="font-medium text-neutral-900 dark:text-neutral-100">{formatDate(review.date)}</span>
                  </div>

                  <!-- Director -->
                  {#if review.tmdb?.director}
                    <div class="flex items-center gap-2 text-sm">
                      <User class="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      <span class="text-neutral-600 dark:text-neutral-400">Director:</span>
                      <span class="font-medium text-neutral-900 dark:text-neutral-100">{review.tmdb.director}</span>
                    </div>
                  {/if}

                  <!-- Runtime -->
                  {#if review.tmdb?.runtime}
                    <div class="flex items-center gap-2 text-sm">
                      <Clock class="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      <span class="text-neutral-600 dark:text-neutral-400">Runtime:</span>
                      <span class="font-medium text-neutral-900 dark:text-neutral-100">{formatRuntime(review.tmdb.runtime)}</span>
                    </div>
                  {/if}

                  <!-- Watched With -->
                  {#if review.with && review.with.length > 0}
                    <div class="flex items-center gap-2 text-sm sm:col-span-2">
                      <Users class="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      <span class="text-neutral-600 dark:text-neutral-400">Watched with:</span>
                      <span class="font-medium text-neutral-900 dark:text-neutral-100">{review.with.join(', ')}</span>
                    </div>
                  {/if}
                </div>

                <!-- Genres -->
                {#if review.tmdb?.genres && review.tmdb.genres.length > 0}
                  <div class="flex flex-wrap gap-2">
                    {#each review.tmdb.genres as genre}
                      <span class="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm">
                        {genre}
                      </span>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Review Content -->
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div class="px-8 py-6">
            <div class="flex items-center justify-between gap-4 mb-4">
              <h2 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Review</h2>

              <div class="flex items-center gap-2">
                <!-- Tags -->
                {#if review.tags && review.tags.length > 0}
                  {#each review.tags as tag}
                    <span class="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm">
                      {tag}
                    </span>
                  {/each}
                {/if}

                <!-- Rewatch Badge -->
                {#if review.revisit}
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                    <RotateCcw class="w-3.5 h-3.5" />
                    Rewatch
                  </span>
                {/if}

                <!-- Rating -->
                <RatingBadge rating={review.rating} />
              </div>
            </div>

            <div class="prose prose-neutral dark:prose-invert max-w-none">
              {@html renderedContent}
            </div>
          </div>
        </div>
      </article>
  {/if}
</div>