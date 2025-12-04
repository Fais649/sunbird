<script lang="ts">
	import LocationIcon from '@lucide/svelte/icons/map-pin';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ClockEndIcon from '@lucide/svelte/icons/clock-7';
	import EditIcon from '@lucide/svelte/icons/pencil';
	import Item from '$lib/components/ui/item/item.svelte';
	import type { EventData } from '$lib/server/collections';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import ButtonShare from './button-share.svelte';
	import ButtonAddToCalendar from './button-add-to-calendar.svelte';
	import Separator from './ui/separator/separator.svelte';
	import { ScrollArea } from './ui/scroll-area/index.ts';
	import PaperImage from './paper-image.svelte';

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
</script>

{#snippet imageCarousel(imageUrls: string[])}
	<Carousel.Root
		class="flex items-center flex-col w-full h-104  border-none shadow-[0_4px_12px_0_rgba(0,0,0,0.25)]"
	>
		<Carousel.Content class="gap-0">
			{#each imageUrls as imageUrl}
				<Carousel.Item>
					<img src={imageUrl} alt="banner" class="noisy object-cover aspect-square h-full" />
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

<div class="flex w-full max-w-xl flex-col">
	<Card.Root class="w-full shadow-[-6px_6px_0_0_rgba(0,0,0,0.12)]  gap-0 p-0">
		<Card.Header>
			{@render imageCarousel(event.banners)}
		</Card.Header>
		<Card.Content class="flex flex-col py-6 gap-4 px-6">
			<div class="flex flex-col">
				<div class="flex items-baseline justify-between pt-2">
					<a href="/event/view-{event.id}">
						<Card.Title class="hover:underline decoration-1 text-4xl">{event.title}</Card.Title>
					</a>
					<a href="/event/edit-{event.id}" class="">
						<EditIcon strokeWidth="1" />
					</a>
				</div>

				<div class="flex flex-col">
					<ScrollArea class="italic h-24  pr-[5%] mr-[5%]" scrollbarYClasses="w-1">
						<div class="py-4">
							{@html event.description}
						</div>
					</ScrollArea>

					<Separator class="with-noise" />
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<Item class="flex items-center gap-1 ">
					<LocationIcon strokeWidth="1" class="shrink-0" />
					<a href={event.locationUrl} class="truncate hover:underline decoration-1 min-w-0 flex-1">
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

				<div class="flex gap-2 pt-4">
					<ButtonShare {event} />
					<ButtonAddToCalendar {event} />
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
