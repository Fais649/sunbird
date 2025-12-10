<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import MailIcon from '@lucide/svelte/icons/mail';
</script>

{#snippet infoItemRtl(name: string, info: string)}
	<li class="flex gap-1" dir="rtl">
		<span class="shrink-0">{name}</span>:<span class="shrink-0 text-foreground/60">{info}</span>
	</li>
{/snippet}

{#snippet step(title: string)}
	<h1 class="text-3xl">{title}</h1>
{/snippet}

<div class="flex flex-col gap-4 w-1/2 items-start text-start border-r pr-4" dir="rtl" lang="ar">
	<div class="pb-2 gap-2 flex flex-col w-full">
		{@render step('أرسل لنا تفاصيل الحدث عبر البريد الإلكتروني')}
		<div class="flex flex-col">
			<ul class="my-2">
				{@render infoItemRtl('العنوان', 'على الأقل 8 أحرف.')}
				{@render infoItemRtl('الوصف', 'على الأقل 16 حرفًا.')}
				{@render infoItemRtl('الموقع', 'عنوان أو رابط خرائط جوجل.')}
				{@render infoItemRtl('تاريخ ووقت البداية', 'يجب أن يكون في المستقبل.')}
				{@render infoItemRtl('تاريخ ووقت الانتهاء', 'يجب أن يكون بعد وقت البداية.')}
			</ul>
			<Button class="text-xl w-full justify-center">
				<MailIcon strokeWidth="1" />
				fais649@proton.me
			</Button>
		</div>
	</div>

	<div class="pb-2 gap-2 flex flex-col w-full">
		{@render step('نقوم بمراجعتها')}
		<div class="flex flex-col text-foreground/60">
			<p>إذا كان هناك أي نقص في المعلومات، سنتواصل معك عبر البريد الإلكتروني.</p>
		</div>
	</div>

	<div class="pb-2 gap-2 flex flex-col w-full">
		{@render step('نقوم بنشرها!')}
		<div class="flex flex-col text-foreground/60">
			<h3>سيظهر الحدث على الصفحة الرئيسية.</h3>
			<h3>وسيصلك بريد تأكيد.</h3>
		</div>
	</div>
</div>
