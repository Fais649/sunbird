<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		parseDateTime,
		parseZonedDateTime,
		today,
		toZoned
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	let { form, name, title, description } = $props();
	const { form: formData } = form;

	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	let initial = $formData[name];
	let dateValue: DateValue | undefined = $state();
	let timeValue = $state('10:30:00');

	if (initial) {
		const d = new Date(initial);
		if (!isNaN(d.getTime())) {
			dateValue = parseDate(d.toISOString().slice(0, 10));
			timeValue = d.toISOString().slice(11, 19);
		}
	} else {
		dateValue = today(getLocalTimeZone());
	}

	$effect(() => {
		if (!dateValue || !timeValue) return;
		const dateString = dateValue.toString(); // yyyy-mm-dd
		const iso = new Date(`${dateString}T${timeValue}`).toISOString();
		if ($formData[name] !== iso) {
			$formData[name] = iso;
		}
	});
</script>

<Form.Field {form} {name} class="flex flex-col">
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>{title}</Form.Label>

			<div class="grid grid-cols-2">
				<div class="columns-1">
					<Popover.Root>
						<Popover.Trigger
							{...props}
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-[280px] justify-start ps-4 text-start',
								!dateValue && 'text-muted-foreground'
							)}
						>
							{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Pick a date'}
							<CalendarIcon class="ms-auto size-4 opacity-50" />
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" side="top">
							<Calendar
								type="single"
								value={dateValue}
								captionLayout="dropdown"
								minValue={new CalendarDate(1900, 1, 1)}
								maxValue={today(getLocalTimeZone())}
								calendarLabel="Date of birth"
								onValueChange={(v) => {
									dateValue = v;
								}}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>

				<div>
					<div class="flex flex-col gap-3">
						<Label for="{name}-time" class="hidden px-1">Time</Label>
						<Input
							type="time"
							id="{name}-time"
							step="1"
							bind:value={timeValue}
							class="bg-background appearance-none 
           [&::-webkit-calendar-picker-indicator]:hidden 
           [&::-webkit-calendar-picker-indicator]:appearance-none"
						/>
					</div>
				</div>
			</div>
			<Form.FieldErrors />
			<Form.Description>{description}</Form.Description>

			<input hidden name={props.name} value={$formData[name]} />
		{/snippet}
	</Form.Control>
</Form.Field>
