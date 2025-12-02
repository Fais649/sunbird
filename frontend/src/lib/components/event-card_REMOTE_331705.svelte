<script lang="ts">
	import ShareIcon from '@lucide/svelte/icons/share';
	import LocationIcon from '@lucide/svelte/icons/map-pin';
	import ClockStartIcon from '@lucide/svelte/icons/clock-1';
	import ClockEndIcon from '@lucide/svelte/icons/clock-7';
	import Item from '$lib/components/ui/item/item.svelte';
	import type { EventData } from '$lib/server/collections';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from './ui/button/button.svelte';
	import ButtonAddToCalendar from './button-add-to-calendar.svelte';
	import ButtonShare from './button-share.svelte';

	interface Props {
		event: EventData;
	}

	let { event }: Props = $props();

	function formatDate(date: string) {
		return new Date(date).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
	}
</script>

{#snippet imageCarousel(imageUrls: string[])}
	<Carousel.Root class=" flex items-center flex-col w-full">
		<Carousel.Content class="gap-0">
			{#each imageUrls as imageUrl}
				<Carousel.Item>
					<img src={imageUrl} alt="banner" class="object-cover aspect-square h-full" />
				</Carousel.Item>
			{/each}
		</Carousel.Content>

		{#if imageUrls.entries.length > 0}{/if}

		<div class="gap-8 flex">
			<Carousel.Previous />
			<Carousel.Next />
		</div>
	</Carousel.Root>
{/snippet}

<div class="flex w-full max-w-xl flex-col bg-muted">
	<Card.Root class="">
		<Card.Header>
			{@render imageCarousel(event.banners)}
		</Card.Header>

		<Card.Content>
			<div class="flex items-baseline justify-between">
				<a href="/event/view-{event.id}">
					<Card.Title class="underline text-6xl px-2">{event.title}</Card.Title>
				</a>
				<a href="/event/edit-{event.id}" class="underline">edit</a>
			</div>

			<Card.Description class="grid grid-cols-2 grid-rows-3 text-xl">
				<div class="col-1 row-1 px-2">
					{@html event.description}
				</div>

				<div class="col-span-full row-2 border">
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

				<div class="col-1 row-3">
					<Item class="px-2 py-0 grid grid-cols-4 ">
						<span class="flex items-center gap-2">
							<ClockStartIcon />
							Start:
						</span>
						{formatDate(event.start)}
					</Item>

					<Item class="px-2 py-0 grid grid-cols-4 ">
						<div class="flex items-center gap-2">
							<ClockEndIcon />
							End:
						</div>
						{formatDate(event.end)}
					</Item>
				</div>

				<div class="col-2 row-3 flex items-baseline-last flex-col justify-between">
					<ButtonShare {event} />
					<ButtonAddToCalendar {event} />
				</div>
			</Card.Description>
		</Card.Content>
	</Card.Root>
</div>
