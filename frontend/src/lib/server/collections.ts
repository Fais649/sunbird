

export const DATE_DATA_FIELDS = 'id,date,events'
export interface DateData extends Record<string, unknown> {
	id: string,
	date: string;
	events: EventData[];
}

export const EVENT_DATA_FIELDS = 'id,title,description,start,end,created,updated,banners,location,address'
export interface EventData extends Record<string, unknown> {
	id: string,
	title: string;
	description: string;
	start: string;
	end: string;
	created: string;
	updated: string;
	address: string;
	location: { lat: number; lon: number, query?: string; };
	locationUrl: string;
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
