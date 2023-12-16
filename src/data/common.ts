import { z } from "zod"

export const paginated = <T extends z.ZodTypeAny>(schema: T) => z.object({
    count: z.number(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(schema),
})
