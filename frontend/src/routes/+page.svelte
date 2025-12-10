<script lang="ts">
	import EventCard from '$lib/components/event-card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Page from '$lib/components/ui/page/index.js';
	import type { DateData } from '$lib/server/collections.js';
	import { onMount } from 'svelte';
	import Search from '@lucide/svelte/icons/search';

	let { data } = $props();
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
	<Button variant="outline" size="icon-sm">
		<Search strokeWidth="1" class="size-4" />
	</Button>
{/snippet}

{#snippet tabTriggers()}
	<Tabs.List class="flex  h-full w-full items-center">
		<Tabs.Trigger value="past" class="w-full px-4 border-r  flex h-fit">Past</Tabs.Trigger>
		<Tabs.Trigger value="upcoming" class="w-full px-4  flex h-fit">Upcoming</Tabs.Trigger>
	</Tabs.List>
{/snippet}

{#snippet tabs()}
	{@render tabTriggers()}
{/snippet}

{#snippet noEventsBox(tab: string)}
	<div
		class="text-foreground italic p-16 border flex w-full justify-center items-center aspect-square"
	>
		No {tab} events
	</div>
{/snippet}

{#snippet dateHeader(date: string)}
	<div class="flex-col w-1/2 border-b flex items-start text-xl italic">
		<span class="pt-2">{relativeDateString(date)}</span>
		<span class="pb-2">{toLocaleDateString(date)}</span>
	</div>
{/snippet}

{#snippet dateContent(date: DateData)}
	<div class="flex flex-col items-start max-w-2xl font-thin">
		{@render dateHeader(date.date)}
		{#each date.events as event}
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

<Page.Root>
	<Tabs.Root class="flex w-full" value="upcoming">
		<Page.Title>
			<Page.TitleLeading>Events</Page.TitleLeading>
			<Page.TitleTrailing>
				{@render tabs()}
			</Page.TitleTrailing>
		</Page.Title>
		<Page.Content>
			{@render dateTab('past', past)}
			{@render dateTab('upcoming', upcoming)}
		</Page.Content>
	</Tabs.Root>
</Page.Root>
