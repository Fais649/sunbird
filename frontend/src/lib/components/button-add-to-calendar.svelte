<script lang="ts">
	import type { EventData } from '$lib/server/collections';
	import Button from './ui/button/button.svelte';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

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
</script>

<Button size="lg" class="w-full text-xl" onclick={() => addToCalendar(event)}>
	<CalendarIcon />
	Add to Calendar
</Button>
