import { getEventList } from "$lib/server/contentserver";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, params }) => {
	const perPage = url.searchParams.get("perPage") ?? "10";
	let res = await getEventList(Number(params.page), Number(perPage));
	return { ...res }
}
