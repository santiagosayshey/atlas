<script>
  import { scale } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';

  /**
   * @type {boolean}
   */
  export let isOpen = false;

  /**
   * @type {'left' | 'right' | 'center'}
   */
  export let position = 'left';

  /**
   * @type {() => void}
   */
  export let onClose = () => {};

  let dropdownContainer;

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  };

  function handleClickOutside(event) {
    if (isOpen && dropdownContainer && !dropdownContainer.closest('.relative').contains(event.target)) {
      onClose();
    }
  }

  $: if (typeof window !== 'undefined') {
    if (isOpen) {
      setTimeout(() => {
        window.addEventListener('click', handleClickOutside);
      }, 0);
    } else {
      window.removeEventListener('click', handleClickOutside);
    }
  }

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', handleClickOutside);
    }
  });
</script>

{#if isOpen}
  <div
    bind:this={dropdownContainer}
    class="absolute top-full mt-2 z-10 {positionClasses[position]}"
    in:scale={{ duration: 150, start: 0.95 }}
  >
    <div class="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden">
      <slot />
    </div>
  </div>
{/if}
