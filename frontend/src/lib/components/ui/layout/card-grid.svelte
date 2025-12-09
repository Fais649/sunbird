<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		right?: Snippet<[]>;
		left?: Snippet<[]>;
		topRight?: Snippet<[]>;
		topLeft?: Snippet<[]>;
		bottomRight?: Snippet<[]>;
		bottomLeft?: Snippet<[]>;
	}
	let { right, left, topLeft, topRight, bottomLeft, bottomRight }: Props = $props();
</script>

{#snippet topRow(snippet: Snippet<[]>)}
	<div class="h-5/6 border">
		{@render snippet()}
	</div>
{/snippet}

{#snippet bottomRow(snippet: Snippet<[]>)}
	<div class="h-1/6 border">
		{@render snippet()}
	</div>
{/snippet}

<div class="flex p-1 gap-1 grid-rows-2 h-64 w-full border">
	<div class="flex flex-col w-1/2 h-full gap-1">
		{#if left}
			{@render left()}
		{:else if topLeft && bottomLeft}
			{@render topRow(topLeft)}
			{@render bottomRow(bottomLeft)}
		{/if}
	</div>

	<div class="flex flex-col w-1/2 h-full gap-1">
		{#if right}
			{@render right()}
		{:else if topRight && bottomRight}
			{@render topRow(topRight)}
			{@render bottomRow(bottomRight)}
		{/if}
	</div>
</div>
