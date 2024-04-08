import { z } from "zod"
import { fetchBackend, mediaUrlSchema } from "@/data/common"
import { cookies } from "next/headers"

const tokenCookie = "token"

export const userSchema = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().email(),
    is_staff: z.boolean(),
    is_superuser: z.boolean(),
    about: z.string().nullable(),
    image: mediaUrlSchema.nullable(),
})

export async function auth(token: string) {
    const success = await getSelf(token).then(() => true, () => false)
    if (success) {
        cookies().set(tokenCookie, token)
    }
    return success
}

export function token() {
    return cookies().get(tokenCookie)?.value ?? null
}

export async function getSelf(overrideToken?: string) {
    const requestToken = overrideToken ?? token()
    if (!requestToken) return null

    const res = await fetchBackend("/users/self/", {
        headers: {
            Authorization: `Bearer ${requestToken}`,
        },
    })
    return userSchema.parse(res)
}
