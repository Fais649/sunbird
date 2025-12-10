<script lang="ts">
	import * as Page from '$lib/components/ui/page/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import MailIcon from '@lucide/svelte/icons/mail';
</script>

{#snippet infoItem(name: string, info: string)}
	<li class="flex gap-1">
		<span class="shrink-0">{name}</span>:<span class="shrink-0 text-foreground/60">{info}</span>
	</li>
{/snippet}

{#snippet step(title: string)}
	<h1 class="text-3xl">{title}</h1>
{/snippet}

<Page.Root>
	<Page.Title>
		<Page.TitleLeading>New Event</Page.TitleLeading>
	</Page.Title>

	<Page.Content>
		<div class="w-full max-w-2xl h-full flex gap-6">
			<div class="flex flex-col gap-4 w-full text-start">
				<div class="pb-2 gap-2 flex flex-col">
					{@render step('E-mail us your event')}
					<div class=" flex flex-col">
						<ul class="my-2">
							{@render infoItem('Title', 'min. 8 letters.')}
							{@render infoItem('Description', 'min. 16 letters.')}
							{@render infoItem('Location', 'Address or Google Maps link.')}
							{@render infoItem('Start Date/Time', 'sometime in the future.')}
							{@render infoItem('End Date/Time', 'after start date/time.')}
						</ul>
						<Button class="text-xl w-fit justify-center">
							<MailIcon strokeWidth="1" />fais649@proton.me
						</Button>
					</div>
				</div>

				<div class="pb-2 gap-2 flex flex-col">
					{@render step('We review it')}
					<div class="flex flex-col text-foreground/60">
						<p>If anything's missing, we'll e-mail you.</p>
					</div>
				</div>

				<div class="pb-2 gap-2 flex flex-col">
					{@render step('We post it!')}
					<div class="flex flex-col text-foreground/60">
						<h3>The event will appear on the homepage.</h3>
						<h3>You get a confirmation mail.</h3>
					</div>
				</div>
			</div>
		</div>
	</Page.Content>
</Page.Root>

<style lang="postcss">
	[lang='ar'] {
		font-family: 'Segoe UI', 'Cairo', 'Droid Arabic Kufi', sans-serif;
	}
</style>
