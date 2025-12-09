<script lang="ts">
	let { children } = $props();

	let innerWidth = $state(null);
	let verticalLayout = $derived((innerWidth ?? 0) < 768);
</script>

<svelte:window bind:innerWidth />

<div class="flex border {verticalLayout ? 'flex-col' : 'h-80'}">{@render children()}</div>
