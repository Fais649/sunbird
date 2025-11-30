<script lang="ts">
	import { Button } from '$lib/components/ui/button';
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
	import SuperDebug from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Control } from 'formsnap';

	let { form, name } = $props();

	const { form: formData } = form;

	const onUpload: FileDropZoneProps['onUpload'] = async (uploadedFiles) => {
		files.set([...Array.from($files), ...uploadedFiles]);
		console.log($files.length);
	};

	const onFileRejected: FileDropZoneProps['onFileRejected'] = async ({ reason, file }) => {
		toast.error(`${file.name} failed to upload!`, { description: reason });
	};

	const files = filesProxy(form, name);
</script>

<Form.Field class="flex flex-col  w-full p-0" {form} {name}>
	<Form.Control>
		<div class="flex flex-col gap-4">
			<FileDropZone
				{onUpload}
				{onFileRejected}
				maxFileSize={10 * MEGABYTE}
				accept="image/*"
				maxFiles={4}
				fileCount={$files.length ?? 0}
			/>

			<div class="flex flex-col gap-2">
				{#each Array.from($files) as file, i (file.name)}
					<Button
						variant="ghost"
						size="lg"
						class="flex place-items-center gap-2 justify-between"
						onclick={() => {
							files.set([...Array.from($files).slice(0, i), ...Array.from($files).slice(i + 1)]);
						}}
					>
						<div class="flex flex-col">
							<span class="gap-4 flex">
								<ImageIcon />
								{file.name}</span
							>
							<span class="text-muted-foreground text-xs">{displaySize(file.size)}</span>
						</div>
						<XIcon />
					</Button>
				{/each}
			</div>

			<input {name} type="file" bind:files={$files} class="hidden" />
			<Form.FieldErrors />
		</div>
	</Form.Control>
</Form.Field>
