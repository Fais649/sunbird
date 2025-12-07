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

<div class="min-h-screen flex flex-col w-full max-w-xl px-4">
	<div bind:this={titlebar} class="flex flex-col mt-4 h-24 py-4 gap-2 items-center justify-center">
		<div class="flex w-full items-center justify-between">
			<div class="flex flex-col w-full h-full items-baseline justify-center">
				<div class="flex w-full items-center gap-2 text-xl">
					<a href="/" class="w-10 aspect-square bg-foreground grayscale flex h-full">
						<img class="h-full object-cover" src={logo} alt="lol" />
					</a>
					<div class="flex flex-col items-start">
						<a href="/"> Sunbird Post </a>

						<div
							class="flex flex-col lg:flex-row justify-start w-full lg:pt-0 lg:gap-2 lg:h-4 text-xs"
						>
							<a href="/about">About Us</a>
							<Separator orientation="vertical" class="hidden lg:visible h-4 w-1" />
							<a href="/partners">Our Partners</a>
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-center items-center">
				<Button href="/event/create" class="size-10 p-0 bg-primary"><PlusIcon /></Button>
			</div>
		</div>
	</div>

	<div class="w-full h-full flex flex-col flex-1 items-center z-10">
		<div class="flex w-full h-full justify-center mb-32">
			{@render children()}
		</div>
	</div>

	{#if showScrollTop}
		<div class="fixed bottom-4 right-4 z-100">
			<Button size="icon-lg" class="z-100" onclick={scrollToTop}
				><ChevronUpIcon strokeWidth="2" size={24} /></Button
			>
		</div>
	{/if}
</div>
