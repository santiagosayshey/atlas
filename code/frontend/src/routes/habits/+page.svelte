<script>
  import { onMount } from 'svelte';
  import { getHabits } from '$api/habits.js';
  import AddHabitCard from './components/AddHabitCard.svelte';
  import HabitCard from './components/HabitCard.svelte';
  import SearchBar from '$ui/SearchBar.svelte';

  let habits = [];
  let loading = true;
  let error = null;
  let searchQuery = '';
  let gridColumns = 3;

  $: filteredHabits = searchQuery
    ? habits.filter(habit =>
        habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        habit.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : habits;

  async function loadHabits() {
    loading = true;
    error = null;

    try {
      habits = await getHabits();
    } catch (err) {
      error = err.message;
      habits = [];
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadHabits();
  });
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Habits</h1>
      <div class="relative">
        <AddHabitCard bind:searchQuery bind:gridColumns />
      </div>
    </div>

    <!-- Content -->
    {#if loading}
      <div class="flex justify-center py-12">
        <p class="text-neutral-500 dark:text-neutral-400">Loading habits...</p>
      </div>
    {:else if error}
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p class="text-red-800 dark:text-red-300">Error loading habits: {error}</p>
      </div>
    {:else}
      <!-- Habits List -->
      {#if filteredHabits.length === 0 && habits.length === 0}
        <div class="text-center py-12">
          <p class="text-neutral-500 dark:text-neutral-400">No habits yet. Create your first one!</p>
        </div>
      {:else if filteredHabits.length === 0}
        <div class="text-center py-12">
          <p class="text-neutral-500 dark:text-neutral-400">No habits match your search.</p>
        </div>
      {:else}
        <div class="grid gap-4 {gridColumns === 1 ? 'grid-cols-1' : gridColumns === 2 ? 'grid-cols-1 md:grid-cols-2' : gridColumns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}">
          {#each filteredHabits as habit}
            <HabitCard {habit} />
          {/each}
        </div>
      {/if}
    {/if}
</div>
