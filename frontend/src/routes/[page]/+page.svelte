<script lang="ts">
	import { goto } from '$app/navigation';
	import EventCard from '$lib/components/event-card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Pagination from './pagination.svelte';
	import Select from './select.svelte';

	let { data } = $props();
	let perPage: string = $state('10');
	$effect(() => {
		const pp = Number(perPage);
		const maxPage = Math.max(1, Math.ceil(data.totalItems / pp));
		const newPage = Math.min(data.page, maxPage);
		goto(`/${newPage}?perPage=${pp}`);
	});
</script>

<div class="grid grid-cols-1 gap-4 max-w-lg">
	<div class="flex flex-col w-full items-center gap-4 p-32">
		<Button href="/event/create" variant="default" size="lg" class="p-8 flex  text-4xl rounded-xl"
			>Create Event +</Button
		>
	</div>

	{#each data.items as event}
		<EventCard {event} />
	{/each}

	<div class="flex">
		<div class="flex-1">
			<Select bind:value={perPage} />
		</div>
		<div class="flex-3 justify-center">
			<Pagination totalItems={data.totalItems} perPage={data.perPage} />
		</div>
	</div>
</div>
