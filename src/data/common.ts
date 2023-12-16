import { z } from "zod"
import { env } from "@/env.mjs"

export const croppedImageUrlSchema = z.string().url()
    .transform(s => s.startsWith("http://") ? s.replace("http", "https") : s)
    .nullable()

export const paginationUrlSchema = z.string().url()
    .transform(u => new URL(u).searchParams.get("page"))
    .transform(n => n ? +n : null)
    .nullable()

export const paginated = <T extends z.ZodTypeAny>(schema: T) => z.object({
    count: z.number(),
    next: paginationUrlSchema,
    previous: paginationUrlSchema,
    results: z.array(schema),
})

export const getPaginationSearchParams = (page?: number | null, params: Record<string, string> = {}) =>
    new URLSearchParams(page ? { page: String(page), ...params } : params)

export const fetchBackend = (pathname: string, init?: RequestInit) =>
    fetch(`${env.API_BASE_URL}${pathname}`, init)
        .then(r => r.json())
