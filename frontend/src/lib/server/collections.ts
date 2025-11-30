export const EVENT_DATA_FIELDS = 'id,title,description,start,end,created,updated,banners,location'

export interface EventData extends Record<string, unknown> {
	id: string,
	title: string;
	description: string;
	start: string;
	end: string;
	created: string;
	updated: string;
	location: { lat: number; lon: number, query?: string; };
	locationUrl: string;
	locationDisplayName: string;
	banners: string[];
}

export interface CreateEventData extends Record<string, unknown> {
	id: string;
	title: string;
	description: string;
	start: string;
	end: string;
	location: { lat: number; lon: number };
	banners: File[];
}
