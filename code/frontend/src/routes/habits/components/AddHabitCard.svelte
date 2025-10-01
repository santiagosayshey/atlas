<script>
  import { Plus, X, Type, MessageSquare, Repeat, ListChecks, Check, Search, Flame, Grid3x3 } from 'lucide-svelte';
  import { scale } from 'svelte/transition';
  import Card from '$ui/Card.svelte';
  import Dropdown from '$ui/Dropdown.svelte';

  export let searchQuery = '';
  export let gridColumns = 3;

  let isExpanded = false;
  let isGridDropdownOpen = false;
  let hoveredColumns = 0;
  let name = '';
  let description = '';
  let frequency = 'daily';
  let steps = [''];

  function toggleForm() {
    isExpanded = !isExpanded;
    if (!isExpanded) {
      // Reset form when closing
      name = '';
      description = '';
      frequency = 'daily';
      steps = [''];
    }
  }

  function addStep() {
    steps = [...steps, ''];
  }

  function removeStep(index) {
    steps = steps.filter((_, i) => i !== index);
    if (steps.length === 0) {
      steps = [''];
    }
  }

  async function handleSubmit() {
    // Filter out empty steps
    const validSteps = steps.filter(s => s.trim() !== '');

    // TODO: API call to create habit
    console.log('Creating habit:', { name, description, frequency, steps: validSteps });

    // Reset and close for now
    toggleForm();
  }

  function handleCancel() {
    toggleForm();
  }
</script>

<!-- Search Bar + Buttons -->
<div class="flex">
  <!-- Search Input -->
  <div class="relative flex-1">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Search class="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
    </div>
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search habits..."
      class="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-l-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent"
    />
  </div>

  <!-- Grid Button -->
  <div class="relative flex">
    <button
      type="button"
      onclick={() => isGridDropdownOpen = !isGridDropdownOpen}
      class="px-3 py-2 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 border-l-0 transition-colors flex items-center justify-center h-full"
    >
      <Grid3x3 class="w-5 h-5" />
    </button>
    <Dropdown isOpen={isGridDropdownOpen} position="right" onClose={() => isGridDropdownOpen = false}>
      <div class="p-2">
        <div class="flex gap-1.5">
          {#each [1, 2, 3, 4] as cols}
            <button
              type="button"
              onclick={() => {
                gridColumns = cols;
                isGridDropdownOpen = false;
              }}
              onmouseenter={() => hoveredColumns = cols}
              onmouseleave={() => hoveredColumns = 0}
              class="w-7 h-7 border-2 rounded transition-colors {
                gridColumns === cols
                  ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30'
                  : hoveredColumns >= cols
                  ? 'border-neutral-400 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-800'
                  : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900'
              }"
            />
          {/each}
        </div>
      </div>
    </Dropdown>
  </div>

  <!-- Add Habit Button -->
  <button
    type="button"
    onclick={toggleForm}
    class="px-3 py-2 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 border-l-0 rounded-r-lg transition-colors flex items-center justify-center"
  >
    <Flame class="w-5 h-5" />
  </button>
</div>

{#if isExpanded}
  <!-- Form Dropdown -->
  <div class="relative mt-3">
    <div in:scale={{ duration: 200, start: 0.95 }}>
      <Card>
        <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
      <!-- Name -->
      <div>
        <label for="name" class="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1">
          <Type class="w-4 h-4" />
          Name
        </label>
        <input
          id="name"
          type="text"
          bind:value={name}
          required
          class="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-600"
          placeholder="What habit do you want to build?"
        />
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1">
          <MessageSquare class="w-4 h-4" />
          Description
        </label>
        <input
          id="description"
          type="text"
          bind:value={description}
          required
          class="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-600"
          placeholder="Brief description of your habit"
        />
      </div>

      <!-- Frequency -->
      <div>
        <label for="frequency" class="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-1">
          <Repeat class="w-4 h-4" />
          Frequency
        </label>
        <select
          id="frequency"
          bind:value={frequency}
          class="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-600"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <!-- Steps -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-400">
            <ListChecks class="w-4 h-4" />
            Steps
          </label>
          <button
            type="button"
            onclick={addStep}
            class="text-xs text-neutral-600 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors flex items-center gap-1"
          >
            <Plus class="w-3 h-3" />
            Add Step
          </button>
        </div>
        <div class="space-y-2">
          {#each steps as step, index}
            <div class="flex gap-2">
              <input
                type="text"
                bind:value={steps[index]}
                placeholder="Step name or parameter like {'{'}duration{'}'}"
                class="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-600"
              />
              {#if steps.length > 1}
                <button
                  type="button"
                  onclick={() => removeStep(index)}
                  class="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  <X class="w-4 h-4" />
                </button>
              {/if}
            </div>
          {/each}
        </div>
        <p class="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Add checkable steps. Use plain text or parameters in curly braces for variable inputs.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-between pt-2">
        <button
          type="button"
          onclick={handleCancel}
          class="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
        >
          <X class="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
        >
          <Check class="w-4 h-4" />
          Create Habit
        </button>
        </div>
      </form>
    </Card>
    </div>
  </div>
{/if}
