<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/logo.svg';
	import MenuBar from '$lib/components/menu-bar.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={logo} />
</svelte:head>

<div class="flex w-full sticky items-center justify-center py-8">
	<a href="/">
		<img class="h-32 w-32" src={logo} alt="lol" />
	</a>
</div>

<div class="w-full flex flex-col items-center py-8">
	<div class="flex w-full max-w-xl justify-center">
		{@render children()}
	</div>
</div>

<div class="h-full w-full flex items-center py-16 justify-center gap-8">
	<span>test</span>
	<span>test</span>
	<span>test</span>
	<span>test</span>
	<span>test</span>
</div>
