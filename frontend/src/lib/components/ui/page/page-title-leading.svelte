<script lang="ts">
	let { children } = $props();
</script>

<div class="text-3xl flex items-baseline">
	{@render children()}
</div>
