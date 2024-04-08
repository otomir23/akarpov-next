import { z } from "zod"
import { env } from "@/env.mjs"

export const mediaUrlSchema = z.string()
    .transform(s => s.startsWith("http://") ? s.replace("http", "https") : s)
    .transform(s => new URL(s, `https://${env.MEDIA_BASE_HOSTNAME}`).href)

export const composeSearchParams = (
    params: Record<string, string | number | boolean | null | undefined>
): URLSearchParams =>
    new URLSearchParams(
        Object
            .entries(params)
            .map(([k, v]) => [k, (v ?? null) !== null ? `${v}` : null] as const)
            .filter((e): e is [string, string] => e[1] !== null && e[1] !== undefined)
    )

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

const lookupFailureSchema = z.object({
    detail: z.literal("Not found."),
})

export const parseLookup = <T extends z.ZodTypeAny>(value: unknown, schema: T): z.infer<T> | null => {
    if (lookupFailureSchema.safeParse(value).success) return null
    return schema.parse(value)
}

export const fetchBackend = (pathname: string, init?: RequestInit, parse = true) =>
    fetch(`${env.API_BASE_URL}${pathname}`, {
        ...init,
        next: {
            revalidate: init?.next?.revalidate ?? env.DATA_LIFETIME_SECONDS,
            ...(init?.next),
        },
    }).then(r => (parse ? r.json() : r.text()) as Promise<unknown>)
