<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	const perPage = [
		{ value: '10', label: '10 Items' },
		{ value: '20', label: '20 Items' },
		{ value: '40', label: '40 Items' },
		{ value: '80', label: '80 Items' },
		{ value: '160', label: '160 Items' }
	];

	let { value = $bindable() } = $props();

	const triggerContent = $derived(
		perPage.find((f) => f.value === value)?.label ?? 'Items Per Page'
	);
</script>

<Select.Root type="single" name="itemsPerPage" bind:value>
	<Select.Trigger class="w-[180px]">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each perPage as items (items.value)}
				<Select.Item value={items.value} label={items.label} disabled={items.value === value}>
					{items.label}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
