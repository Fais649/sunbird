import { env } from "$env/dynamic/private"
import { env as publicEnv } from "$env/dynamic/public"
import PocketBase, { ClientResponseError } from "pocketbase"
import { DATE_DATA_FIELDS, EVENT_DATA_FIELDS, type CreateEventData, type DateData, type EventData } from "./collections"
import { form } from "$app/server"
import { format } from "path"

const authUsername = env.INTERNAL_API_AUTH_USERNAME ?? ''
const authPassword = env.INTERNAL_API_AUTH_PASSWORD ?? ''

const publicURL = publicEnv.PUBLIC_API_URL ?? ''
const internalURL = env.INTERNAL_API_URL ?? ''

const client = new PocketBase(env.INTERNAL_API_URL ?? '')
const userData = client.collection('_superusers')
const eventData = client.collection('events')
const dateData = client.collection('dates')


export async function getEvent(id: string, server: boolean = false, locationQuery: boolean = false): Promise<EventData> {
	await authenticate()
	let event = await eventData.getOne<EventData>(id, { fields: EVENT_DATA_FIELDS })
	return hydrateEvent(event, server, locationQuery)
}


export async function getEventList() {
	await authenticate()
	let res = await dateData.getFullList<DateData>({ fields: DATE_DATA_FIELDS })

	let dates = []
	for (const date of res) {
		let events = []
		for (const event of date.events) {
			events.push(await hydrateEvent(event, false))
		}

		date.events = events
		dates.push(date)
	}

	console.log(dates)
	return dates
}

async function hydrateEvent(event: EventData, server: boolean = false, locationQuery: boolean = false) {
	console.log(event)
	let imageUrls = event.banners.map((filename) => (server ? buildInternalFileURL('events', event.id, filename, 'thumb=720x720f') : buildPublicFileURL('events', event.id, filename, 'thumb=540x540')))
	event.banners = imageUrls

	event.locationUrl = buildPublicLocationUrl(event.location)
	if (locationQuery && event.location.lat && event.location.lon) {
		const url =
			'https://nominatim.openstreetmap.org/reverse?' +
			new URLSearchParams({
				lat: String(event.location.lat),
				lon: String(event.location.lon),
				format: 'json',
				limit: '1',
				'accept-language': 'en'
			});

		try {
			const res = await fetch(url, {
				headers: { 'Accept-Language': 'en' }
			});
			if (res.ok) {
				const reverseData = await res.json();

				event.location.query = reverseData.display_name;
			}
		} catch (error) {
			console.error('Reverse geocoding failed', error);
		}
	}

	return event
}

export async function getFullEventList() {
	await authenticate()
	let events = await eventData.getFullList<EventData>({ fields: EVENT_DATA_FIELDS })
	let response = events.map((event) => {
		let imageUrls = event.banners.map((filename) => (buildPublicFileURL('events', event.id, filename, 'thumb=540x540')))
		event.banners = imageUrls
		event.locationUrl = buildPublicLocationUrl(event.location)
		return event
	})
	return response
}

export async function getEventCount() {
	await authenticate()
	let events = await eventData.getList<EventData>(1, 1, { fields: '' })
	return events
}

export async function updateEvent(data: CreateEventData) {
	try {
		await authenticate()

		let response = await eventData.update(data.id, data);

		return {
			title: response.title,
			description: response.description,
			start: response.start,
			end: response.end,
		};
	} catch (error: ClientResponseError | any) {
		console.error(error.response)
		console.error(error.response.data)
	}
}

export async function createEvent(data: CreateEventData) {
	try {
		await authenticate()

		let response = await eventData.create(data);

		return {
			title: response.title,
			description: response.description,
			start: response.start,
			end: response.end,
		};
	} catch (error: ClientResponseError | any) {
		console.error(error.response)
		console.error(error.response.data)
	}
}

async function authenticate() {
	if (!client.authStore.isValid) {
		await userData.authWithPassword(authUsername, authPassword)
	}
}

export function buildPublicFileURL(collectionName: string, id: string, filename: string, properties?: string): string {
	return publicURL + '/api/files/' + collectionName + '/' + id + '/' + filename + '?' + properties
}

export function buildInternalFileURL(collectionName: string, id: string, filename: string, properties?: string): string {
	return '/api/files/' + collectionName + '-' + id + '-' + filename + '-' + properties
}

export function buildInternalAPIUrl(collectionName: string, id: string, filename: string, properties?: string): string {
	return internalURL + '/api/files/' + collectionName + '/' + id + '/' + filename + '?' + properties
}

function buildPublicLocationUrl(location: { lat: number; lon: number }): string {
	return `https://www.google.com/maps?q=${location.lat},${location.lon}`;
}
