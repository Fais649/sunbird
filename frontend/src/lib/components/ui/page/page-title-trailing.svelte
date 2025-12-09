<script lang="ts">
	let { children } = $props();
</script>

<div class="flex w-fit h-full items-center justify-end">
	{@render children()}
</div>
