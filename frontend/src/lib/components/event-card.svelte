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

	interface Props {
		event: EventData;
	}

	let { event }: Props = $props();

	function formatDate(date: string) {
		return new Date(date).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
	}

	function generateICS(event: EventData) {
		const ics = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourApp//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${event.id}
DTSTAMP:${new Date(event.created).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${new Date(event.start).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(event.end).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.locationUrl ?? ''}
END:VEVENT
END:VCALENDAR`.trim();

		const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
		return URL.createObjectURL(blob);
	}

	function isMobile() {
		return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	}

	function addToCalendar(event: EventData) {
		const url = generateICS(event);
		const fileName = `${event.title.replace(/\s+/g, '_')}.ics`;

		if (isMobile()) {
			try {
				window.location.href = url;
			} catch {
				window.open(url, '_blank');
			}
		} else {
			const link = document.createElement('a');
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}
	}
	async function shareEvent(event: EventData) {
		const icsUrl = generateICS(event);

		const response = await fetch(icsUrl);
		const blob = await response.blob();
		const file = new File([blob], `${event.title.replace(/\s+/g, '_')}.ics`, {
			type: 'text/calendar'
		});

		if (navigator.share) {
			try {
				await navigator.share({
					title: event.title,
					text: event.description,
					files: [file]
				});
			} catch (err) {
				console.warn('Share canceled or failed', err);
			}
		} else {
			const link = document.createElement('a');
			link.href = icsUrl;
			link.download = file.name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
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
			<a href="/event/{event.id}">
				<Card.Title class="text-4xl px-2">{event.title}</Card.Title>
			</a>

			<a href="/event/edit-{event.id}"> edit </a>
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
