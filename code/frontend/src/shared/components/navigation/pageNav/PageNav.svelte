<script>
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';
  import GroupHeader from './GroupHeader.svelte';
  import GroupItem from './GroupItem.svelte';

  $: currentPath = $page.url.pathname;

  let collapsedGroups = {
    home: false
  };

  function toggleGroup(groupName) {
    collapsedGroups[groupName] = !collapsedGroups[groupName];
  }
</script>

<nav class="w-64 h-full bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto px-2">
  <!-- Home Section -->
  <GroupHeader
    title="Home"
    emoji="🚀"
    href="/"
    active={currentPath === '/'}
    collapsible={true}
    collapsed={collapsedGroups.home}
    onToggle={() => toggleGroup('home')}
  />

  <!-- Items under Home -->
  {#if !collapsedGroups.home}
    <div transition:slide={{ duration: 150 }} class="overflow-hidden border-l-2 border-neutral-300 dark:border-neutral-700 ml-5.5">
      <GroupItem
        title="Reviews"
        href="/reviews"
        emoji="📝"
        active={currentPath.startsWith('/reviews')}
      />
      <GroupItem
        title="Habits"
        href="/habits"
        emoji="🔥"
        active={currentPath.startsWith('/habits')}
      />
    </div>
  {/if}
</nav>
