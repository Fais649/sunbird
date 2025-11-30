import { message, superValidate, type Infer, type SuperValidated } from "sveltekit-superforms";
import { formSchema, type FormSchema } from "./form-schema";
import { zod4 } from "sveltekit-superforms/adapters";

export async function formValidate(request?: Request) {
	if (request) {
		return await superValidate(request, zod4(formSchema))
	}
	return await superValidate(zod4(formSchema))
}

export function formResponse(form: SuperValidated<Infer<FormSchema>>, responseMessage: string) {
	return message(form, responseMessage)
}
