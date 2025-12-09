<script lang="ts">
	import type { PageData } from './$types.js';
	import Form from '../form.svelte';
	import * as Page from '$lib/components/ui/page/index.js';
	let { data }: { data: PageData } = $props();
</script>

{#snippet topLeft()}
	<div class="flex h-full w-full">topL</div>
{/snippet}

{#snippet topRight()}
	<div class="flex h-full w-full">topR</div>
{/snippet}

{#snippet bottomLeft()}
	<div class="flex h-full w-full">botL</div>
{/snippet}

{#snippet bottomRight()}
	<div class="flex h-full w-full">botR</div>
{/snippet}

<Page.Root>
	<Page.Title>
		<Page.TitleLeading>New Event</Page.TitleLeading>
	</Page.Title>
	<Page.Content>
		<Form {data} />
	</Page.Content>
</Page.Root>
