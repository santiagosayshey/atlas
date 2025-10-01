<script>
  export let rating;

  function getRatingStyle(rating) {
    if (rating === 10) return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    if (rating >= 7) return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    if (rating >= 5) return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
  }

  $: style = getRatingStyle(rating);
</script>

<span class="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold border {style}">
  {rating}/10
</span>
