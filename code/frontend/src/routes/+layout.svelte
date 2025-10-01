<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import "../app.css";
	import "@fontsource-variable/inter";
	import Navbar from "$shared/components/navigation/navbar/Navbar.svelte";
	import PageNav from "$shared/components/navigation/pageNav/PageNav.svelte";
	import { theme } from "../shared/stores/theme.js";
	import { pageNavCollapsed } from "$stores/pagenav.js";

	let { children } = $props();

	// Initialize theme on mount
	onMount(() => {
		// Apply the initial theme
		const currentTheme = $theme;
		if (currentTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});
</script>

<div class="flex flex-col h-screen">
	<Navbar />
	<div class="flex flex-1 overflow-hidden">
		{#if !$pageNavCollapsed}
			<div transition:slide={{ duration: 300, axis: 'x' }}>
				<PageNav />
			</div>
		{/if}
		<main class="flex-1 overflow-auto">
			{@render children?.()}
		</main>
	</div>
</div>
