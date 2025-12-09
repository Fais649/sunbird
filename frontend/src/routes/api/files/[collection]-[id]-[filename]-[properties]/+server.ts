import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { buildInternalAPIUrl } from '$lib/server/contentserver';

export const GET: RequestHandler = async ({ params }) => {
	const imageUrl = buildInternalAPIUrl(params.collection, params.id, params.filename, params.properties);
	console.log(imageUrl)
	const res = await fetch(imageUrl);

	if (!res.ok) {
		throw error(res.status, `Failed to fetch image: ${params.filename}`);
	}

	const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
	const blob = await res.blob();

	return new Response(blob, {
		status: 200,
		headers: {
			'Content-Type': contentType,
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=360000'
		}
	});
};
