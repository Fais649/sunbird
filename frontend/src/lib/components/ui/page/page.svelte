<script lang="ts">
	let { children } = $props();
</script>

<div class="w-full flex max-w-2xl flex-col gap-1">{@render children()}</div>
