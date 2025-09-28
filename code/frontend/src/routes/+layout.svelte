<script>
	import "../app.css";
	import "@fontsource-variable/inter";
	import Navbar from "$ui/Navbar.svelte";

	let { children } = $props();
</script>

<Navbar />
{@render children?.()}
