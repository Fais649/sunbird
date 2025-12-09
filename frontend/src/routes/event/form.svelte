<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import type { EventData } from '$lib/server/collections';
	import { onMount } from 'svelte';
	import { formSchema, type FormSchema } from './form-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import { zod4Client } from 'sveltekit-superforms/adapters';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import * as Card from '$lib/components/ui/layout/index.js';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>>; event?: EventData } } = $props();

	const form = superForm(data.form, {
		validators: zod4Client(formSchema),
		dataType: 'json'
	});

	const { form: formData, enhance } = form;

	onMount(async () => {
		if (data.event) {
			const event = data.event;
			let banners = [];

			for (const b of event.banners) {
				let file = await fetch(b);
				let filename = b.split('/').reverse()[0];
				const nameParts = filename.split('_');
				filename = nameParts[0] + '_' + nameParts[1];
				banners.push(
					new File([await file.blob()], filename, { type: file.type || 'application/octet-stream' })
				);
			}

			formData.set({ ...event, banners: banners });
		}
	});

	let innerWidth = $state(null);
	let horizontalLayout = $derived((innerWidth ?? 0) > 768);
</script>

{#snippet imagesField()}
	<Form.ImagesField
		{form}
		name="banners"
		title="Event Banners"
		description="Cover photos for your event"
	/>
{/snippet}

{#snippet textFields()}
	<Form.TextField {form} name="title" title="Title" description="The title of your event" />

	<ScrollArea
		class="italic h-28 {horizontalLayout ? 'pr-[5%] mr-[5%]' : ''}"
		scrollbarYClasses="w-1"
	>
		<Form.TextField
			{form}
			name="description"
			title="Description"
			description="Details about the event"
		/>
	</ScrollArea>

	<Form.LocationField
		{form}
		name="location"
		title="Location"
		description="Where does it take place?"
		defaultQuery={data.event?.location.query ?? ''}
	/>
	<Form.DateTimeField
		{form}
		name="start"
		title="Timings"
		showTitle={false}
		description="When does it take place?"
	/>
	<Form.DateTimeField
		{form}
		showTitle={false}
		name="end"
		title="End Date"
		description="When does it end?"
		defaultTime="11:30:00"
	/>
{/snippet}

<svelte:window bind:innerWidth />

<form
	method="POST"
	enctype="multipart/form-data"
	use:enhance
	class="flex w-full flex-col"
	data-slot="form"
>
	<Card.Root>
		<Card.Leading>
			{#if horizontalLayout}
				{@render textFields()}
			{:else}
				{@render imagesField()}
			{/if}
		</Card.Leading>
		<Card.Trailing>
			{#if horizontalLayout}
				{@render imagesField()}
			{:else}
				{@render textFields()}
			{/if}
		</Card.Trailing>
	</Card.Root>

	{#if data.event}
		<input type="hidden" name="id" value={data.event.id} />
	{/if}

	<div class="flex justify-center pt-4">
		<Form.Button size="lg">Submit</Form.Button>
	</div>
</form>
