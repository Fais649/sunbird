<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { EventData } from '$lib/server/collections';
	import { onMount } from 'svelte';
	import { formSchema, type FormSchema } from './form-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import { zod4Client } from 'sveltekit-superforms/adapters';
	import Separator from '$lib/components/ui/separator/separator.svelte';

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

<div class=" relative flex w-full gap-0 mt-12">
	<div
		class="absolute border -left-2 -top-2 h-[calc(100%+var(--spacing)*4)] w-[calc(100%+var(--spacing)*4)] pointer-events-none z-0"
	>
		<div
			class="halftone relative -left-2 -top-2 w-[calc(100%+var(--spacing)*4)] h-[calc(100%+var(--spacing)*4)]"
		></div>
	</div>

	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance
		class="flex w-full flex-col border-none gap-0 p-0 z-10"
		data-slot="form"
	>
		<div
			class="flex w-full flex-col bg-background border-none [box-shadow:0_0_60px_10px_rgba(0,0,0,0.8)] gap-0 p-0 z-10"
		>
			<div class="gap-4 flex flex-col w-full p-4">
				{#if data.event}
					<input type="hidden" name="id" value={data.event.id} />
				{/if}

				<Form.ImagesField
					{form}
					name="banners"
					title="Event Banners"
					description="Cover photos for your event"
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

				<div class="flex flex-col gap-1">
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
				</div>
			</div>
		</div>

		<div class="flex justify-center z-100">
			<Form.Button size="lg" class="text-xl italic  w-full p-4 h-full">Submit</Form.Button>
		</div>
	</form>
</div>

<style>
	.halftone {
		background: url('$lib/assets/halftone.svg') repeat;
		background-size: 100px auto;

		-webkit-mask-image: radial-gradient(ellipse, transparent 50%, black 60%, transparent 97.5%);
		mask-image: radial-gradient(ellipse, transparent 50%, black 60%, transparent 97.5%);

		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;

		-webkit-mask-position: center;
		mask-position: center;

		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
