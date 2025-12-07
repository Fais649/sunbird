<script lang="ts">
	import './layout.css';
	import logo from '$lib/assets/logo.svg';
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let showScrollTop = $state(false);
	let titlebar: HTMLElement;

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

<div class="min-h-screen gap-16 flex flex-col w-full max-w-xl px-4">
	<div bind:this={titlebar} class="flex flex-col mt-12 py-4 gap-2 items-center justify-center">
		<div class="flex w-full gap-8 items-center justify-center">
			<a href="/" class="flex justify-center items-baseline w-1/6">
				<div class="rounded-full">
					<img class="aspect-square w-12 grayscale invert" src={logo} alt="lol" />
				</div>
			</a>

			<div class="flex flex-col w-4/6 max-w-lg h-full items-center justify-baseline">
				<a class="text-3xl lg:text-5xl" href="/"> Sunbird Post </a>
			</div>

			<div class="flex justify-center items-baseline w-1/6">
				<Button href="/event/create" size="icon-lg" class="p-0 bg-primary text-xl"
					><PlusIcon /></Button
				>
			</div>
		</div>

		<div class="flex justify-center gap-4 h-4 text-[12px]">
			<a href="/about">About Us</a>
			<Separator orientation="vertical" class="h-4 w-1" />
			<a href="/partners">Our Partners</a>
		</div>
	</div>

	<div class="w-full h-full flex flex-col flex-1 items-center z-10">
		<div class="flex w-full h-full max-w-lg justify-center mb-32">
			{@render children()}
		</div>
	</div>

	{#if showScrollTop}
		<div class="fixed bottom-4 right-4 z-100">
			<Button size="icon-lg" class="z-100" onclick={scrollToTop}
				><ChevronUpIcon strokeWidth="2" /></Button
			>
		</div>
	{/if}
</div>
