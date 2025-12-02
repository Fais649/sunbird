<script lang="ts">
	import ShareIcon from '@lucide/svelte/icons/share';
	import LocationIcon from '@lucide/svelte/icons/map-pin';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ClockStartIcon from '@lucide/svelte/icons/clock-1';
	import ClockEndIcon from '@lucide/svelte/icons/clock-7';
	import Item from '$lib/components/ui/item/item.svelte';
	import type { EventData } from '$lib/server/collections';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from './ui/button/button.svelte';
	import ButtonShare from './button-share.svelte';
	import ButtonAddToCalendar from './button-add-to-calendar.svelte';
	import LocationThumbnail from './location-thumbnail.svelte';

	interface Props {
		event: EventData;
	}

	let { event }: Props = $props();

	function formatDate(date: string) {
		return new Date(date).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
	}
</script>

{#snippet imageCarousel(imageUrls: string[])}
	<Carousel.Root class=" flex items-center flex-col w-full border-none">
		<Carousel.Content class="gap-0">
			{#each imageUrls as imageUrl}
				<Carousel.Item>
					<img src={imageUrl} alt="banner" class="object-cover aspect-square h-full rounded" />
				</Carousel.Item>
			{/each}
		</Carousel.Content>

		<div class="gap-8 flex">
			<Carousel.Previous class="shadow-black shadow-lg" />
			<Carousel.Next class="shadow-black shadow-lg" />
		</div>
	</Carousel.Root>
{/snippet}

<div class="flex w-full max-w-xl flex-col">
	<Card.Root class="shadow-black w-full shadow-xl">
		<Card.Header>
			{@render imageCarousel(event.banners)}
		</Card.Header>
		<Card.Content>
			<div class="flex items-baseline justify-between">
				<a href="/event/view-{event.id}">
					<Card.Title class="underline text-4xl px-2">{event.title}</Card.Title>
				</a>
				<a href="/event/edit-{event.id}" class="underline">edit</a>
			</div>

			<Card.Description class="gap-4 flex flex-col text-xl">
				<div class="px-2">
					{@html event.description}
				</div>

				<div>
					<Button
						variant="link"
						href={event.locationUrl}
						class="text-xl w-full"
						target="_blank"
						rel="noopener noreferrer"
					>
						<LocationIcon />
						<span class="truncate">{event.locationUrl ?? 'nope'}</span>
					</Button>
				</div>

				<Item class="px-2 py-0 flex  justify-between gap-2">
					<span class="flex items-center gap-2">
						<ClockStartIcon />
						Start:
					</span>
					{formatDate(event.start)}
				</Item>

				<Item class="px-2 py-0 flex justify-between gap-2">
					<div class="flex items-center gap-2">
						<ClockEndIcon />
						End:
					</div>
					{formatDate(event.end)}
				</Item>
			</Card.Description>
		</Card.Content>
		<Card.Footer class="w-full flex justify-between">
			<ButtonShare {event} />
			<ButtonAddToCalendar {event} />
		</Card.Footer>
	</Card.Root>
</div>
