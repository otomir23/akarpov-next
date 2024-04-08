import { token } from "@/data/user"
import { cookies } from "next/headers"
import { z } from "zod"
import { fetchBackend } from "@/data/common"

const anonIdCookie = "anon"

export type MusicAuth = { type: "token", token: string } | { type: "anon", id: string }

export async function getMusicAuth(): Promise<MusicAuth> {
    const tokenValue = token()
    if (tokenValue) {
        return {
            type: "token",
            token: tokenValue,
        }
    }
    return {
        type: "anon",
        id: await anonId(),
    }
}

export async function anonId(): Promise<string> {
    const saved = cookies().get(anonIdCookie)
    return saved?.value ?? await getNewAnonId()
}

const createAnonIdResponse = z.object({ id: z.string().uuid() })
export async function getNewAnonId(): Promise<string> {
    const res = await fetchBackend("/music/anon/create/", {
        method: "POST",
    })
    return createAnonIdResponse.parse(res).id
}
