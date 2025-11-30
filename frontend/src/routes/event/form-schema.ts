import { z } from "zod";
import type { Transport } from '@sveltejs/kit';

export interface FormLocation {
	lat: number;
	lon: number;
}

export const transport: Transport = {
	FormLocation: {
		encode: (value) => value.toString(),
		decode: (str) => JSON.parse(str) as FormLocation
	}
};

const fileSchema = z.instanceof(File, { message: "Each banner must be a valid file" }).array()

export const formSchema = z
	.object({
		id: z.string(),
		title: z
			.string()
			.min(8, "Title must be at least 8 characters long")
			.max(64, "Title must be at most 64 characters long"),

		description: z
			.string()
			.min(16, "Description must be at least 16 characters long")
			.max(1024, "Description must be at most 1024 characters long"),

		start: z
			.string()
			.refine(
				(val) => new Date(val) >= new Date(),
				"Start date must be in the future"
			),

		end: z.string(),
		location: z
			.object({
				lat: z.number().refine((v) => v !== 0.0, "Latitude cannot be 0.0"),
				lon: z.number().refine((v) => v !== 0.0, "Longitude cannot be 0.0")
			})
			.refine((loc) => loc.lat && loc.lon, {
				message: "Location is required",
			}),

		banners: fileSchema.min(1, "At least one banner image is required"),
	})
	.refine(
		(data) => new Date(data.end) > new Date(data.start),
		{
			message: "End date/time must be after start date/time",
			path: ["end"],
		}
	);

export type FormSchema = typeof formSchema;

