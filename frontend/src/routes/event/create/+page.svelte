<script lang="ts">
	import type { PageData } from './$types.js';
	import Form from '../form.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col w-full">
	<Label class="w-full text-3xl  pb-4 border-b">New Event</Label>
	<Form {data} />
</div>
