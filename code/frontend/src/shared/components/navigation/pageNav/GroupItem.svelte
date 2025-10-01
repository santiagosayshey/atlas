<script>
  /**
   * @type {string}
   */
  export let title;

  /**
   * @type {string}
   */
  export let href;

  /**
   * @type {string}
   */
  export let emoji = '';

  /**
   * @type {boolean}
   */
  export let active = false;
</script>

<a
  {href}
  class="font-inter flex items-center gap-2 ml-2 mr-1 my-1 px-2 py-1.5 rounded transition-colors text-sm {
    active
      ? 'text-neutral-900 dark:text-neutral-100 font-normal bg-neutral-200/70 dark:bg-neutral-800'
      : 'text-neutral-700 dark:text-neutral-300 font-normal hover:bg-neutral-200/70 dark:hover:bg-neutral-800'
  }"
>
  <span>{title}</span>
</a>
