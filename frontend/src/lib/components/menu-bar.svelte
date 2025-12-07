<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import logo from '$lib/assets/logo.svg';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	let { ref = $bindable() } = $props();

	let innerWidth = $state(null);
	let horizontalLayout = $derived((innerWidth ?? 0) > 768);
</script>

<svelte:window bind:innerWidth />

<div
	bind:this={ref}
	class="flex border-foreground justify-start items-end gap-1 w-full lg:max-w-4xl mb-4"
>
	<div class="flex h-8 items-end w-full gap-2 text-3xl">
		<a href="/" class="rounded-full aspect-square bg-foreground grayscale h-8">
			<img class="h-full object-cover" src={logo} alt="lol" />
		</a>
		<a href="/">Sunbird Post</a>
	</div>

	<DropdownMenu.Root>
		<div class="gap-2 items-start flex w-fit">
			<a
				href="/event/create"
				class="rounded-full size-8 aspect-square place-items-center bg-primary items-center justify-center flex"
				><PlusIcon strokeWidth="1" class="stroke-background" /></a
			>
			<DropdownMenu.Trigger
				class="size-8 rounded-full aspect-square place-items-center bg-transparent border border-foreground p-1 items-center justify-center flex"
			>
				<MenuIcon strokeWidth="1" class="stroke-foreground" /></DropdownMenu.Trigger
			>
		</div>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>My Account</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<a href="/about">About</a>
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<a href="/partners">Partners</a>
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<a href="/partners">Contact</a>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
