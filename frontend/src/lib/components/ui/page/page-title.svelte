<script lang="ts">
	import Label from '../label/label.svelte';

	let { children } = $props();
</script>

<Label class="border-b border-t w-full text-xl flex justify-between my-4 h-12">
	{@render children()}
</Label>
