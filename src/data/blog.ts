import { z } from "zod"
import { fetchBackend, getPaginationSearchParams, paginated } from "@/data/common"

const postSchema = z.object({
    title: z.string(),
    url: z.string().url(),
    main_tag: z.object({
        name: z.string(),
        color: z.string(),
    }),
    image_cropped: z.string().url().nullable(),
    summary: z.string().transform(s => s.replace("\r", "")),
    creator: z.object({
        id: z.number(),
        username: z.string(),
        url: z.string().url(),
        image_cropped: z.string().url()
            .transform(s => s.startsWith("http://") ? s.replace("http", "https") : s)
            .nullable(),
    }),
    post_views: z.number(),
    rating: z.number(),
    comment_count: z.number(),
    short_link: z.string().url(),
    created: z.string().datetime({ offset: true }),
    edited: z.string().datetime({ offset: true }),
})

const postsResponseSchema = paginated(postSchema)

export async function fetchPosts(page?: number) {
    const res = await fetchBackend(`/blog?${getPaginationSearchParams(page)}`)
    return postsResponseSchema.parse(res)
}
