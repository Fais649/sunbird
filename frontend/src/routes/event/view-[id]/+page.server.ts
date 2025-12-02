import { getEvent } from "$lib/server/contentserver";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	return { event: await getEvent(params.id) }
}
