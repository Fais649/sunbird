<script lang="ts">
	import { goto } from '$app/navigation';
	import EventCard from '$lib/components/event-card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
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

<div class="flex flex-col h-full gap-16 max-w-lg with-noise items-center">
	{#each data.items as event}
		<div class="flex flex-col items-center">
			<div class="w-full max-w-[50%] border-b flex justify-between text-xl italic">
				<span>today</span> <span>date</span>
			</div>
			<Separator orientation="vertical" class="min-h-52 max-h-52" />
			<EventCard {event} />
		</div>
	{/each}
</div>
