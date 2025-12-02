<script lang="ts">
	import type { EventData } from '$lib/server/collections';
	import Button from './ui/button/button.svelte';
	import ShareIcon from '@lucide/svelte/icons/share';

	let { event } = $props();

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

<Button
	size="lg"
	class="w-full text-foreground"
	variant="outline"
	onclick={() => shareEvent(event)}
>
	<ShareIcon />
	Share
</Button>
