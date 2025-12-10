import { getEventList } from "$lib/server/contentserver";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	let res = await getEventList();
	return { dates: res }
}
