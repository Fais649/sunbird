import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { createEvent } from "$lib/server/contentserver.js";
import { formResponse, formValidate } from "../validator.js";

export const load: PageServerLoad = async () => {
	return {
		form: await formValidate()
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await formValidate(request);

		if (!form.valid) {
			return fail(400, {
				form: form,
			});
		}

		await createEvent(form.data)
		return formResponse(form, 'Event created')
	},
} satisfies Actions;
