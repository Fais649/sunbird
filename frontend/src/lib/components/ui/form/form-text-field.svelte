<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import { type WithElementRef, type WithoutChildren } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import * as Form from './index.js';
	import * as FormPrimitive from 'formsnap';
	import Input from '../input/input.svelte';
	import type { FormPath } from 'sveltekit-superforms';

	let {
		ref = $bindable(null),
		class: className,
		form,
		name,
		title,
		description,
		children: childrenProp,
		...restProps
	}: {
		description: string;
	} & FormPrimitive.FieldProps<T, U> &
		WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props();

	const { form: formData } = form;
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<Input {...props} {...restProps} bind:value={$formData[name]} placeholder={title} />
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
