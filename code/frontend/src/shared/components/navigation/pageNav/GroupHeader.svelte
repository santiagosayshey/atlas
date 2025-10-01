<script>
  import { ChevronDown } from 'lucide-svelte';

  /**
   * @type {string}
   */
  export let title;

  /**
   * @type {string}
   */
  export let emoji = '';

  /**
   * @type {string | undefined}
   */
  export let href = undefined;

  /**
   * @type {boolean}
   */
  export let active = false;

  /**
   * @type {boolean}
   */
  export let collapsible = false;

  /**
   * @type {boolean}
   */
  export let collapsed = false;

  /**
   * @type {() => void}
   */
  export let onToggle = () => {};
</script>

{#if href && collapsible}
  <!-- Header with both link and collapse -->
  <div class="flex items-stretch mx-1 mt-3 mb-1.5 rounded transition-colors group {
    active
      ? 'bg-neutral-200/70 dark:bg-neutral-800'
      : 'hover:bg-neutral-200/70 dark:hover:bg-neutral-800'
  }">
    <a {href} class="flex-1 min-w-0 px-2 py-1.5 rounded-l flex items-center">
      <h3 class="font-inter text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
        {#if emoji}<span>{emoji}</span>{/if}<span>{title}</span>
      </h3>
    </a>
    <button
      on:click={onToggle}
      class="px-2 flex items-center rounded-r hover:bg-neutral-300/50 dark:hover:bg-neutral-700 transition-colors flex-shrink-0"
    >
      <ChevronDown
        size={16}
        class="text-neutral-600 dark:text-neutral-400 transition-transform {collapsed ? '-rotate-90' : ''}"
      />
    </button>
  </div>
{:else if href}
  <!-- Header with only link -->
  <a {href} class="block mx-1 mt-3 mb-1.5 px-2 py-1.5 rounded transition-colors {
    active
      ? 'bg-neutral-200/70 dark:bg-neutral-800'
      : 'hover:bg-neutral-200/70 dark:hover:bg-neutral-800'
  }">
    <h3 class="font-inter text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
      {#if emoji}<span>{emoji}</span>{/if}<span>{title}</span>
    </h3>
  </a>
{:else if collapsible}
  <!-- Header with only collapse -->
  <button
    on:click={onToggle}
    class="w-full flex items-center justify-between mx-1 mt-3 mb-1.5 px-2 py-1.5 rounded transition-colors hover:bg-neutral-200/70 dark:hover:bg-neutral-800 text-left"
  >
    <h3 class="font-inter text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
      {#if emoji}<span>{emoji}</span>{/if}<span>{title}</span>
    </h3>
    <ChevronDown
      size={16}
      class="text-neutral-600 dark:text-neutral-400 transition-transform flex-shrink-0 {collapsed ? '-rotate-90' : ''}"
    />
  </button>
{:else}
  <!-- Plain header -->
  <div class="mx-1 mt-3 mb-1.5 px-2 py-1.5">
    <h3 class="font-inter text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
      {#if emoji}<span>{emoji}</span>{/if}<span>{title}</span>
    </h3>
  </div>
{/if}
