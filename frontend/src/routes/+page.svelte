<script lang="ts">
	import { goto } from '$app/navigation';
	import EventCard from '$lib/components/event-card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import type { DateData } from '$lib/server/collections.js';
	import { onMount } from 'svelte';
	import Pagination from './pagination.svelte';
	import Select from './select.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let { data } = $props();
	let perPage: string = $state('10');
	let past: DateData[] = $state([]);
	let upcoming: DateData[] = $state([]);

	onMount(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		past = data.dates.filter((d) => new Date(d.date) < today);
		upcoming = data.dates.filter((d) => new Date(d.date) >= today);
	});

	function relativeDateString(dateStr: string) {
		const today = new Date();
		const date = new Date(dateStr);
		today.setHours(0, 0, 0, 0);
		date.setHours(0, 0, 0, 0);
		const diffDays = Math.round((date - today) / (1000 * 60 * 60 * 24));
		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Tomorrow';
		if (diffDays === -1) return 'Yesterday';
		return diffDays > 0 ? `${diffDays} days from now` : `${Math.abs(diffDays)} days ago`;
	}

	function toLocaleDateString(dateStr: string, locale = navigator.language) {
		const date = new Date(dateStr);
		return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
	}
</script>

{#snippet searchField()}
	<Input class="text-start w-1/2 border-0  h-full  focus:border-0 italic" placeholder="Search..." />
{/snippet}

{#snippet tabTriggers()}
	<Tabs.List class="flex w-1/2  h-full  justify-center items-baseline">
		<Tabs.Trigger value="past" class="w-full px-1  flex h-full">Past</Tabs.Trigger>

		<Tabs.Trigger value="upcoming" class="w-full px-1 flex">Upcoming</Tabs.Trigger>
	</Tabs.List>
{/snippet}

{#snippet tabs()}
	<div class="flex flex-col w-full">
		<div class="flex w-full gap-1 border-t items-baseline justify-between">
			{@render searchField()}
			{@render tabTriggers()}
		</div>
	</div>
{/snippet}

{#snippet noEventsBox(tab: string)}
	<div
		class="text-muted-foreground italic p-16 border flex w-full justify-center shadow-[-4px_4px_0_0_rgba(0,0,0,0.25)] items-center aspect-square"
	>
		No {tab} events
	</div>
{/snippet}

{#snippet dateHeader(date: string)}
	<div class="flex-col w-fit border-b border-t border-l p-3 flex justify-between text-xl italic">
		<span>{relativeDateString(date)}</span>
		<span>{toLocaleDateString(date)}</span>
	</div>
{/snippet}

{#snippet dateContent(date: DateData)}
	<div class="flex flex-col items-start font-thin py-4">
		{@render dateHeader(date.date)}
		{#each date.events as event}
			<Separator orientation="vertical" class="min-h-16 max-h-16" />
			<EventCard {event} />
		{/each}
	</div>
{/snippet}

{#snippet dateTab(key: string, data: DateData[])}
	<Tabs.Content value={key} class="w-full py-0">
		{#if data.length == 0}
			{@render noEventsBox(key)}
		{/if}
		{#each data as date}
			{@render dateContent(date)}
		{/each}
	</Tabs.Content>
{/snippet}

<Tabs.Root value="upcoming" class="flex  w-full flex-col items-center justify-baseline-last">
	<Label class="w-full text-4xl pt-12">Events</Label>
	{@render tabs()}
	{@render dateTab('past', past)}
	{@render dateTab('upcoming', upcoming)}
</Tabs.Root>
