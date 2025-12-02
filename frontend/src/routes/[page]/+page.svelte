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

<div class="flex flex-col gap-4 max-w-lg">
	<div class="flex w-full items-center justify-between gap-4">
		<Button href="/event/create" variant="default" size="lg" class="flex text-xl rounded-xl"
			>Create Event +</Button
		>

		<div class="flex">
			<Select bind:value={perPage} />
			<Pagination totalItems={data.totalItems} perPage={data.perPage} />
		</div>
	</div>

	{#each data.items as event}
		<EventCard {event} />
	{/each}
</div>
