import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { getEvent, updateEvent } from "$lib/server/contentserver.js";
import { formResponse, formValidate } from "../validator.js";

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id
	const event = await getEvent(id)
	const form = await formValidate()
	return { form, event }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await formValidate(request)

		if (!form.valid) {
			return fail(400, {
				form: form,
			});
		}

		await updateEvent(form.data)
		return formResponse(form, 'Event updated successfully!')
	},
} satisfies Actions;
