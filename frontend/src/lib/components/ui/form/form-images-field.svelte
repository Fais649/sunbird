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
</script>

{#snippet imageCarousel(imageUrls: FileList)}
	<div class="flex items-center flex-col w-full border-none gap-2">
		<div class="flex w-full aspect-square border p-1">
			{#if activeImage}
				<img
					src={URL.createObjectURL(activeImage)}
					alt="banner"
					class="object-cover aspect-square h-full"
				/>
			{/if}
		</div>

		<div class="flex items-start w-full">
			{#each imageUrls as imageUrl, i}
				<div
					class="flex flex-col w-24 {imageUrl.name == activeImage?.name
						? 'border'
						: 'border-foreground/50'}"
				>
					<Button
						variant="ghost"
						class="object-cover border border-transparent hover:border-foreground hover:bg-background h-full p-1 aspect-square"
						onclick={() => {
							activeImage = imageUrl;
						}}
					>
						<img
							src={URL.createObjectURL(imageUrl)}
							alt="banner"
							class="object-cover aspect-square h-full"
						/>
					</Button>

					<Button
						variant="ghost"
						size="sm"
						class="flex hover:text-primary-foreground hover:bg-primary place-items-center justify-between  p-1"
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

<Form.Field {form} {name} class="flex flex-col">
	<Form.Control>
		<div class="flex flex-col gap-4">
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
		</div>
	</Form.Control>
</Form.Field>
