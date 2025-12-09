<script lang="ts">
	let { children } = $props();
</script>

<div class="w-full flex flex-col gap-1">{@render children()}</div>
