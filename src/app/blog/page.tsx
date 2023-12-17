import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { fetchPosts } from "@/data/blog"

async function Posts() {
    const { results: posts } = await fetchPosts()

    return (
        <>
            {posts.map(p => (
                <article key={p.url} className="rounded-lg p-6 border-2 border-neutral-200 bg-neutral-50">
                    <h2 className="font-bold text-2xl">{p.title}</h2>
                    <pre>{p.summary}</pre>
                    <div className="font-semibold mt-2">
                        Views: {p.post_views} / Rating: {p.rating} / Comments: {p.comment_count}
                    </div>
                    <Link href={`/u/${p.creator.username}`} className="flex gap-2 items-center mt-2">
                        {p.creator.image_cropped && (
                            <Image
                                alt={`${p.creator.username}'s Avatar`}
                                src={p.creator.image_cropped}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        )}
                        <p className="font-medium">{p.creator.username}</p>
                    </Link>
                </article>
            ))}
        </>
    )
}

export default function Home() {
    return (
        <main className="flex flex-col w-full items-stretch gap-6 p-12">
            <Suspense
                fallback={(
                    <>
                        {[...Array(8)].map((_, i) =>
                            <div key={i} className="rounded-lg bg-neutral-200 animate-pulse h-64" />)}
                    </>
                )}
            >
                <Posts />
            </Suspense>
        </main>
    )
}
