<script>
	import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
	<div class="text-center">
		<h1 class="text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
			{$page.status}
		</h1>
		<p class="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
			{$page.error?.message || 'Page not found'}
		</p>
		<a
			href="/"
			class="inline-block px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
		>
			Go Home
		</a>
	</div>
</div>
