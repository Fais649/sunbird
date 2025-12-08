<script lang="ts">
	import Label from '../label/label.svelte';

	let { children } = $props();
</script>

<Label class="w-full text-3xl flex justify-between pt-4 h-12">
	{@render children()}
</Label>
