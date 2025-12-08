<script lang="ts">
	let { children } = $props();
</script>

<div class="text-xl flex items-baseline">
	{@render children()}
</div>
