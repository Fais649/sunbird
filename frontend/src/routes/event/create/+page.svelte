<script lang="ts">
	import type { PageData } from './$types.js';
	import Form from '../form.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-8 w-full">
	<Label class="italic w-full text-xl border-b py-4">New Event</Label>
	<Form {data} />
</div>
