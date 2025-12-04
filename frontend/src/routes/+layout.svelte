<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/logo.svg';
	import MenuBar from '$lib/components/menu-bar.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={logo} />
</svelte:head>

<div class="flex flex-col py-4 px-4 w-full h-128 gap-24 items-center justify-center with-noise">
	<img class="aspect-square w-24 grayscale border rounded-full" src={logo} alt="lol" />

	<div class="flex flex-col w-full max-w-xl gap-4 h-fit items-center justify-center">
		<div class="flex justify-between items-baseline w-full">
			<a class="text-4xl" href="/"> Sunbird Post </a>

			<div class="flex justify-center gap-4 h-6">
				<a href="/about">About Us</a>
				<Separator orientation="vertical" class="h-6 w-1" />
				<a href="/partners">Our Partners</a>
			</div>
		</div>
		<Separator class="w-full" />
		<div class="flex justify-between w-full">
			<Button href="/event/create" size="lg" class="max-w-64 bg-primary flex text-xl"
				>Create Event +</Button
			>
			<Input class="w-full max-w-52" placeholder="Search..." />
		</div>
	</div>
</div>

<div class="w-full flex flex-col items-center py-8 with-noise">
	<div class="flex w-full max-w-xl justify-center">
		{@render children()}
	</div>
</div>

<div class="h-full w-full flex items-center py-16 justify-center gap-8">
	<span>Sunbird GmbH</span>
</div>
