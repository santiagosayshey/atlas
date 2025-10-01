<script>
	import { onMount } from 'svelte';
	import "../app.css";
	import "@fontsource-variable/inter";
	import Navbar from "$shared/components/navigation/navbar/Navbar.svelte";
	import { theme } from "../shared/stores/theme.js";

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

<Navbar />
{@render children?.()}
