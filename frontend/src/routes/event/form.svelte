<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { EventData } from '$lib/server/collections';
	import { onMount } from 'svelte';
	import { formSchema, type FormSchema } from './form-schema';
	import SuperDebug from 'sveltekit-superforms';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import { zod4Client } from 'sveltekit-superforms/adapters';

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
</script>

<form
	method="POST"
	enctype="multipart/form-data"
	use:enhance
	class="w-full gap-4 flex flex-col max-w-[95vw]"
>
	<Label class="text-4xl">Create an event</Label>
	<div class="border rounded gap-2 flex flex-col w-full p-4 bg-card">
		{#if data.event}
			<input type="hidden" name="id" value={data.event.id} />
		{/if}
		<Form.ImagesField
			{form}
			name="banners"
			title="Banners"
			description="Upload some cool images to help your event stand out"
		/>

		<Form.TextField {form} name="title" title="Title" description="The title of your event" />

		<Form.TextField
			{form}
			name="description"
			title="Description"
			description="Details about the event"
		/>

		<Form.LocationField
			{form}
			name="location"
			title="Location"
			description="Where does it take place?"
			defaultQuery={data.event?.location.query ?? ''}
		/>

		<Form.DateTimeField {form} name="start" title="Start Date" description="When does it start?" />
		<Form.DateTimeField
			{form}
			name="end"
			title="End Date"
			description="When does it end?"
			defaultTime="11:30:00"
		/>
	</div>

	<div class="flex justify-center">
		<Form.Button size="lg" class="text-4xl font-bold w-full p-4 h-full">Submit</Form.Button>
	</div>

	<SuperDebug data={$formData} />
</form>
