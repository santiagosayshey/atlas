<script>
  /**
   * @type {'solid' | 'dashed'}
   */
  export let variant = 'solid';

  /**
   * @type {string}
   */
  export let href = '';

  /**
   * @type {() => void}
   */
  export let onclick = undefined;

  /**
   * @type {string}
   */
  export let className = '';

  $: baseClasses = 'block p-6 bg-white dark:bg-neutral-900 rounded-lg transition-colors';

  $: borderClasses = variant === 'dashed'
    ? 'border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
    : 'border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700';

  $: combinedClasses = `${baseClasses} ${borderClasses} ${className}`;
</script>

{#if href}
  <a {href} class={combinedClasses}>
    <slot />
  </a>
{:else if onclick}
  <button {onclick} class="w-full {combinedClasses}">
    <slot />
  </button>
{:else}
  <div class={combinedClasses}>
    <slot />
  </div>
{/if}
