<script lang="ts">
	import LocationIcon from '@lucide/svelte/icons/map-pin';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ClockEndIcon from '@lucide/svelte/icons/clock-7';
	import EditIcon from '@lucide/svelte/icons/pencil';
	import Item from '$lib/components/ui/item/item.svelte';
	import type { EventData } from '$lib/server/collections';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import ButtonShare from './button-share.svelte';
	import ButtonAddToCalendar from './button-add-to-calendar.svelte';
	import Separator from './ui/separator/separator.svelte';
	import { ScrollArea } from './ui/scroll-area/index.ts';
	import Button from './ui/button/button.svelte';

	interface Props {
		event: EventData;
	}

	let { event }: Props = $props();

	function formatDate(date: string) {
		return new Date(date).toLocaleString('de-DE', { dateStyle: 'short' });
	}

	function formatTime(date: string) {
		return new Date(date).toLocaleString('de-DE', { timeStyle: 'short' });
	}
	let innerWidth = $state(null);
	let horizontalLayout = $derived((innerWidth ?? 0) > 768);
</script>

{#snippet imageCarousel(imageUrls: string[])}
	<Carousel.Root
		class={horizontalLayout
			? 'w-1/2 h-full aspect-square overflow-hidden'
			: 'w-full h-full aspect-3/2 overflow-hidden'}
	>
		<Carousel.Content class="gap-0">
			{#each imageUrls as imageUrl}
				<Carousel.Item>
					<img src={imageUrl} alt="banner" class="object-cover w-full h-full" />
				</Carousel.Item>
			{/each}
		</Carousel.Content>

		{#if imageUrls.entries.length > 0}
			<div class="gap-8 flex">
				<Carousel.Previous class="shadow-black shadow-lg" />
				<Carousel.Next class="shadow-black shadow-lg" />
			</div>
		{/if}
	</Carousel.Root>
{/snippet}

<svelte:window bind:innerWidth />
<div class="flex w-full p-0 z-10">
	<div
		class="flex mb-4 border {horizontalLayout
			? 'flex-row'
			: 'flex-col'} bg-transparent w-full p-0 z-10"
	>
		{#if !horizontalLayout}
			{@render imageCarousel(event.banners)}
		{/if}
		<div class="flex flex-col {horizontalLayout ? 'w-1/2  py-4' : 'w-full py-2'} h-full px-4">
			<div class="flex flex-col h-1/2">
				<div class="flex items-baseline justify-between">
					<a href="/event/view-{event.id}">
						<div class="hover:underline decoration-1 text-3xl">{event.title}</div>
					</a>
					<Button variant="outline" size="icon-sm" href="/event/edit-{event.id}">
						<EditIcon strokeWidth="1" class="size-4" />
					</Button>
				</div>

				<div class="flex flex-col">
					<ScrollArea class="italic h-28  pr-[5%] mr-[5%]" scrollbarYClasses="w-1">
						<div class="py-4">
							{@html event.description}
						</div>
					</ScrollArea>
				</div>
			</div>

			<div class="flex flex-col h-1/2 border-t justify-between pt-2">
				<div class="flex flex-col h-3/4 pt-2 gap-1">
					<Item class="flex items-center gap-1">
						<LocationIcon strokeWidth="1" class="shrink-0" />
						<a
							href={event.locationUrl}
							class="truncate hover:underline decoration-1 min-w-0 flex-1"
						>
							{event.locationUrl ?? 'nope'}
						</a>
					</Item>

					<Item class="flex  justify-start ">
						<CalendarIcon strokeWidth="1" />
						{formatDate(event.start)}
					</Item>

					<Item class="flex justify-start ">
						<ClockEndIcon strokeWidth="1" />
						{formatTime(event.start)}
						->
						{formatTime(event.end)}
					</Item>
				</div>
				<div class="flex gap-2 pt-2 items-end {horizontalLayout ? '' : 'pb-2'}">
					<ButtonShare {event} />
					<ButtonAddToCalendar {event} />
				</div>
			</div>
		</div>
		{#if horizontalLayout}
			{@render imageCarousel(event.banners)}
		{/if}
	</div>
</div>
