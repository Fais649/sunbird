<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	let { form, name, title, description, defaultTime = '10:30:00', showTitle = true } = $props();
	const { form: formData } = form;

	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	let initial = $formData[name];
	let dateValue: DateValue | undefined = $state();
	let timeValue = $state(defaultTime);

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
			{#if showTitle}
				<div class="flex justify-between w-full items-baseline mb-2">
					<Form.Label>{title}</Form.Label>
					<Form.Description>{description}</Form.Description>
				</div>
			{/if}

			<div class="flex not-lg:flex-col h-full items-center w-full">
				<div class="flex w-full">
					<Popover.Root>
						<Popover.Trigger
							{...props}
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'flex w-full justify-start border-0 border-l text-start h-full p-2'
							)}
						>
							{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Pick a date'}
							<CalendarIcon strokeWidth="2" class="ms-auto size-4" />
						</Popover.Trigger>
						<Popover.Content class="w-full p-0" side="top">
							<Calendar
								type="single"
								value={dateValue}
								captionLayout="dropdown"
								minValue={today(getLocalTimeZone())}
								calendarLabel={title}
								onValueChange={(v) => {
									dateValue = v;
								}}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>

				<div class="flex w-full">
					<div class="flex flex-col">
						<Label for="{name}-time" class="hidden px-1">Time</Label>
						<Input
							type="time"
							id="{name}-time"
							step="1"
							bind:value={timeValue}
							class="bg-background mb-0 appearance-none 
           [&::-webkit-calendar-picker-indicator]:hidden 
           [&::-webkit-calendar-picker-indicator]:appearance-none"
						/>
					</div>
				</div>
			</div>
			<Form.FieldErrors />

			<input hidden name={props.name} value={$formData[name]} />
		{/snippet}
	</Form.Control>
</Form.Field>
