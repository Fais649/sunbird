<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Form from './index.ts';
	import {
		displaySize,
		FileDropZone,
		MEGABYTE,
		type FileDropZoneProps
	} from '$lib/components/ui/file-drop-zone';
	import ImageIcon from '@lucide/svelte/icons/image';
	import XIcon from '@lucide/svelte/icons/x';
	import { toast } from 'svelte-sonner';
	import { filesProxy } from 'sveltekit-superforms';
	import * as Carousel from '../carousel/index.ts';
	import Separator from '../separator/separator.svelte';

	let { form, name, title, description } = $props();
	const files = filesProxy(form, name);

	const onUpload: FileDropZoneProps['onUpload'] = async (uploadedFiles) => {
		files.set([...Array.from($files), ...uploadedFiles]);
		console.log($files.length);
	};

	const onFileRejected: FileDropZoneProps['onFileRejected'] = async ({ reason, file }) => {
		toast.error(`${file.name} failed to upload!`, { description: reason });
	};

	let activeImage: File | undefined = $state();

	$effect(() => {
		if ($files.length > 0 && !activeImage) {
			activeImage = $files[0];
		}
	});
	let innerWidth = $state(null);
	let horizontalLayout = $derived((innerWidth ?? 0) > 768);
</script>

<svelte:window bind:innerWidth />

{#snippet imageCarousel(imageUrls: FileList)}
	<div class="flex flex-col h-full w-full gap-1 p-1">
		{#if activeImage}
			<div
				class={horizontalLayout
					? 'w-full h-5/6 aspect-square overflow-hidden'
					: 'w-full h-full aspect-3/2 overflow-hidden'}
			>
				<img
					src={URL.createObjectURL(activeImage)}
					alt="banner"
					class="object-cover w-full h-full"
				/>
			</div>
		{/if}

		<div class="flex overflow-x-auto h-1/6 gap-1">
			{#each imageUrls as imageUrl, i}
				<div
					class="flex flex-col w-16 aspect-square p-1 {imageUrl.name == activeImage?.name
						? 'border'
						: 'border-foreground/50'}"
				>
					<Button
						variant="ghost"
						class="overflow-hidden border h-2/3 border-transparent hover:border-foreground hover:bg-background w-full p-0"
						onclick={() => {
							activeImage = imageUrl;
						}}
					>
						<img src={URL.createObjectURL(imageUrl)} alt="banner" class="object-cover w-full" />
					</Button>

					<Button
						variant="ghost"
						size="sm"
						class="h-1/3"
						onclick={() => {
							files.set([...Array.from($files).slice(0, i), ...Array.from($files).slice(i + 1)]);
						}}
					>
						<div class="flex flex-col">
							<span class="text-xs">{displaySize(imageUrl.size)}</span>
						</div>
						<XIcon />
					</Button>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

<Form.Field {form} {name} class="flex flex-col w-full h-full p-1">
	<Form.Control>
		{#if $files.length == 0}
			<FileDropZone
				{title}
				{description}
				{onUpload}
				{onFileRejected}
				maxFileSize={10 * MEGABYTE}
				accept="image/*"
				maxFiles={8}
				fileCount={$files.length ?? 0}
			/>
		{:else}
			{@render imageCarousel($files)}
		{/if}

		<Form.FieldErrors />
		<input {name} type="file" bind:files={$files} class="hidden" />
	</Form.Control>
</Form.Field>
