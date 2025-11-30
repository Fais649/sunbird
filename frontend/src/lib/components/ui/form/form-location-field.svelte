<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index';
	import * as Item from '$lib/components/ui/item/index.js';
	import * as Form from './index.js';
	import PinIcon from '@lucide/svelte/icons/pin';
	import { MapLibre, NavigationControl, ScaleControl, GlobeControl } from 'svelte-maplibre-gl';

	let { form, name, title, description, defaultQuery = '' } = $props();
	const { form: formData } = form;

	let query = $state(defaultQuery);
	let results = $state<Array<any>>([]);

	let selected = $state<{
		lat: number;
		lon: number;
		display_name: string;
	} | null>(null);

	let controller: AbortController | null = null;
	let timeout: NodeJS.Timeout;

	async function fetchSuggestions(q: string) {
		if (controller) controller.abort();
		controller = new AbortController();

		const url =
			'https://nominatim.openstreetmap.org/search?' +
			new URLSearchParams({
				q,
				format: 'json',
				addressdetails: '1',
				limit: '5'
			});

		const res = await fetch(url, {
			signal: controller.signal,
			headers: { 'Accept-Language': 'en' }
		});

		if (res.ok) results = await res.json();
	}

	function onInput() {
		selected = null;
		if (timeout) {
			clearTimeout(timeout);
		}

		if (query.trim().length < 3) {
			results = [];
			return;
		}

		timeout = setTimeout(() => fetchSuggestions(query), 250);
	}

	async function choose(item: any) {
		results = [];
		query = item.display_name;

		selected = {
			lat: Number(item.lat),
			lon: Number(item.lon),
			display_name: item.display_name
		};

		$formData[name] = {
			lon: Number(item.lon),
			lat: Number(item.lat)
		};
	}
</script>

<Item.Root class="flex flex-col gap-4 w-full p-0">
	<Form.Field class="flex flex-col  w-full p-0" {form} {name}>
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{title}</Form.Label>

				<InputGroup.Root class="h-fit p-4">
					<InputGroup.Input
						type="text"
						placeholder="Search Address..."
						bind:value={query}
						oninput={onInput}
					/>
				</InputGroup.Root>

				{#if selected}
					<input type="hidden" name={props.name} value={$formData[name]} />
					<MapLibre
						class="h-[30vh] min-h-[300px]"
						style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
						zoom={16}
						center={{ lng: selected.lon, lat: selected.lat }}
					>
						<NavigationControl />
						<ScaleControl />
						<GlobeControl />
					</MapLibre>
				{/if}
			{/snippet}
		</Form.Control>
		<Form.Description>
			{#if results.length}
				<Item.Root variant="muted">
					<Item.Group class="gap-4 p-4">
						{#each results as r}
							<Item.Root>
								{#snippet child()}
									<button onclick={() => choose(r)}>
										<div class="flex w-full gap-4">
											<Item.Media>
												<PinIcon class="size-8" />
											</Item.Media>
											<Item.Content>
												<Item.Title>{r.display_name}</Item.Title>
											</Item.Content>
										</div>
									</button>
								{/snippet}
							</Item.Root>
						{/each}
					</Item.Group>
				</Item.Root>
			{/if}
			<Form.FieldErrors />
		</Form.Description>
		{#if !selected}
			<Form.Description>{description}</Form.Description>
		{/if}
	</Form.Field>
</Item.Root>

<style>
	@import 'maplibre-gl/dist/maplibre-gl.css';

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		border: 1px solid #ddd;
	}
	button {
		padding: 6px 10px;
		cursor: pointer;
		text-align: left;
		width: 100%;
	}
	button:hover {
		background: #eee;
	}
</style>
