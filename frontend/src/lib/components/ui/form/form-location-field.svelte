<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index';
	import * as Item from '$lib/components/ui/item/index.js';
	import XIcon from '@lucide/svelte/icons/x';
	import Button from '../button/button.svelte';
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
				<InputGroup.Root class="h-fit w-full">
					<InputGroup.Input
						name="location"
						type="text"
						placeholder={title}
						class="border-0 aria-invalid:border-l-destructive"
						bind:value={query}
						oninput={onInput}
					/>
					{#if query}
						<InputGroup.Button
							variant="ghost"
							size="icon-sm"
							onclick={() => {
								query = '';
								selected = null;
								results = [];
								$formData[name] = { lat: 0.0, lon: 0.0 };
							}}
							class="hover:bg-primary hover:text-primary-foreground"><XIcon /></InputGroup.Button
						>
					{/if}
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
				<Item.Root variant="outline" class="border-r-0 border-t-0 border-b-0 pr-0">
					<Item.Group class="gap-4 p-4">
						{#each results as r}
							<Item.Root class="w-full">
								{#snippet child()}
									<Button
										variant="outline"
										class="whitespace-normal text-start p-4 h-full border-l  border-r-0 border-t-0 border-b-0 w-full truncate"
										onclick={() => choose(r)}
									>
										<Item.Content>
											<Item.Title>{r.display_name}</Item.Title>
										</Item.Content>
									</Button>
								{/snippet}
							</Item.Root>
						{/each}
					</Item.Group>
				</Item.Root>
			{/if}
			<Form.FieldErrors />
		</Form.Description>
	</Form.Field>
</Item.Root>

<style>
	@import 'maplibre-gl/dist/maplibre-gl.css';

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
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
