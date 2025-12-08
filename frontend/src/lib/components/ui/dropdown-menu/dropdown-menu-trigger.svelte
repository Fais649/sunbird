<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	let { ref = $bindable(null), ...restProps }: DropdownMenuPrimitive.TriggerProps = $props();
</script>

<DropdownMenuPrimitive.Trigger
	bind:ref
	data-slot="dropdown-menu-trigger"
	class="size-8 rounded-full aspect-square place-items-center hover:bg-foreground hover:text-background bg-transparent border border-foreground p-1 items-center justify-center flex"
	{...restProps}
/>
