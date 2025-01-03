import { z } from "zod"
import { mediaUrlSchema, fetchBackend, composeSearchParams, paginated } from "@/data/common"

const postSchema = z.object({
    title: z.string(),
    url: z.string().url(),
    main_tag: z.object({
        name: z.string(),
        color: z.string(),
    }),
    image_cropped: mediaUrlSchema.nullable(),
    summary: z.string().transform(s => s.replace("\r", "")),
    creator: z.object({
        id: z.number(),
        username: z.string(),
        url: z.string().url(),
        image_cropped: mediaUrlSchema.nullable(),
    }),
    post_views: z.number(),
    rating: z.number(),
    comment_count: z.number(),
    short_link: z.string().url(),
    created: z.string().datetime({ offset: true }),
    edited: z.string().datetime({ offset: true }),
})

const postsResponseSchema = paginated(postSchema)

export async function fetchPosts(page?: number | null) {
    const params = composeSearchParams({
        page,
    })
    const res = await fetchBackend(`/blog/?${params}`)
    return postsResponseSchema.parse(res)
}
