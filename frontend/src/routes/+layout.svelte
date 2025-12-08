<script lang="ts">
	import './layout.css';
	import logo from '$lib/assets/logo.svg';
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
	import Button from '$lib/components/ui/button/button.svelte';
	import MenuBar from '$lib/components/menu-bar.svelte';

	let showScrollTop = $state(false);
	let titlebar: HTMLElement | undefined = $state();

	let { children } = $props();

	$effect(() => {
		const observer = new IntersectionObserver(
			([entry]) => (showScrollTop = !entry.isIntersecting),
			{ threshold: 0 }
		);
		if (titlebar) observer.observe(titlebar);
		return () => observer.disconnect();
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<link rel="icon" href={logo} />
</svelte:head>

<div class="min-h-screen bg-background flex flex-col w-full items-center p-4">
	<MenuBar bind:ref={titlebar} />

	<div class="w-full h-full flex flex-col flex-1 max-w-4xl items-center z-10">
		<div class="flex w-full h-full justify-center mb-32">
			{@render children()}
		</div>
	</div>

	{#if showScrollTop}
		<div class="fixed bottom-4 right-4 z-100">
			<Button size="icon-sm" variant="outline" onclick={scrollToTop}
				><ChevronUpIcon strokeWidth="2" size={24} /></Button
			>
		</div>
	{/if}
</div>
