import { z } from "zod"
import { env } from "@/env.mjs"

export const paginated = <T extends z.ZodTypeAny>(schema: T) => z.object({
    count: z.number(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(schema),
})

export const getPaginationSearchParams = (page?: number, params: Record<string, string> = {}) =>
    new URLSearchParams(page ? { page: String(page), ...params } : params)

export const fetchBackend = (pathname: string, init?: RequestInit) =>
    fetch(`${env.API_BASE_URL}${pathname}`, init)
        .then(r => r.json())
