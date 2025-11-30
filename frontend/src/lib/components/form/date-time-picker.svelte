<script lang="ts">
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { getLocalTimeZone } from '@internationalized/date';
	import type { DateValue } from '@internationalized/date';

	let { id, defaultTime, value = $bindable() } = $props();

	let open = $state(false);
	let dateValue: DateValue | undefined = $state();
	let timeValue: string | undefined = $state(defaultTime ?? '10:30:00');

	$effect(() => {
		if (dateValue && dateValue.toString() + ' ' + timeValue != value) {
			value = dateValue.toString() + ' ' + timeValue;
			console.log(value);
		}
	});
</script>

<div class="flex gap-4">
	<div class="flex flex-col gap-3">
		<Label for="{id}-date" class="px-1">Date</Label>
		<Popover.Root bind:open>
			<Popover.Trigger id="{id}-date">
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="w-32 justify-between font-normal">
						{dateValue ? dateValue.toDate(getLocalTimeZone()).toLocaleDateString() : 'Select date'}
						<ChevronDownIcon />
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto overflow-hidden p-0" align="start">
				<Calendar
					type="single"
					bind:value={dateValue}
					onValueChange={() => {
						open = false;
					}}
					captionLayout="dropdown"
				/>
			</Popover.Content>
		</Popover.Root>
	</div>
	<div class="flex flex-col gap-3">
		<Label for="{id}-time" class="px-1">Time</Label>
		<Input
			type="time"
			id="{id}-time"
			step="1"
			bind:value={timeValue}
			class="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
		/>
	</div>
</div>
