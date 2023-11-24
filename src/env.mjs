import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    server: {
        API_BASE_URL: z.string().url().default("https://new.akarpov.ru/api/v1/"),
        MEDIA_BASE_HOSTNAME: z.string().default("new.akarpov.ru"),
    },
    experimental__runtimeEnv: {}
})