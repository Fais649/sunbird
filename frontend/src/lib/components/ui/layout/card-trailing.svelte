<script lang="ts">
	let { children } = $props();

	let innerWidth = $state(null);
	let verticalLayout = $derived((innerWidth ?? 0) < 768);
</script>

<svelte:window bind:innerWidth />

<div class="flex flex-col {verticalLayout ? 'w-full h-2/5' : 'h-full w-1/2'}">
	{@render children()}
</div>
