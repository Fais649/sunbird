<script lang="ts">
	let { children } = $props();
</script>

<div class="flex px-4 border border-t-0 gap-4 border-b-0 flex-col w-full">{@render children()}</div>
