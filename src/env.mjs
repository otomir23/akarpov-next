import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    server: {
        API_BASE_URL: z.string().url().default("https://new.akarpov.ru/api/v1/"),
        MEDIA_BASE_HOSTNAME: z.string().default("new.akarpov.ru"),
        CREATE_TOKEN_URL: z.string().url().default("https://new.akarpov.ru/users/tokens/create/"),
        DATA_LIFETIME_SECONDS: z.number().default(300),
    },
    experimental__runtimeEnv: {},
})
