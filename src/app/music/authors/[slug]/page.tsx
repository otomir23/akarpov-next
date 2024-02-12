import { fetchAuthor } from "@/data/music"
import Image from "next/image"
import SongList from "@/app/music/components/song-list"
import AlbumList from "@/app/music/components/album-list"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata> {
    const author = await fetchAuthor(slug)
    if (!author) notFound()

    const desc = `Musician with ${author.songs.length} songs and ${author.albums.length} albums.`
    return {
        title: `${author.name}'s Music`,
        description: desc,
        openGraph: {
            type: "profile",
            title: author.name,
            description: desc,
            images: author.image ?? undefined,
            username: slug,
        },
    }
}

export default async function AuthorPage({ params: { slug } }: { params: { slug: string } }) {
    const author = await fetchAuthor(slug)
    if (!author) notFound()

    return (
        <div className="flex flex-col gap-4">
            <figure className="flex flex-col md:flex-row gap-4">
                {
                    author.image ? (
                        <Image
                            src={author.image}
                            height={200}
                            width={200}
                            className="object-cover w-[200px] aspect-square rounded-full"
                            alt=""
                        />
                    ) : <div className="rounded-full bg-neutral-300 w-full max-w-[200px] aspect-square" />
                }
                <figcaption>
                    <h3 className="font-bold text-3xl mt-4">{author.name}</h3>
                </figcaption>
            </figure>
            <h2 className="font-bold text-2xl">Songs</h2>
            <SongList songs={author.songs} />
            <h2 className="font-bold text-2xl">Albums</h2>
            <AlbumList albums={author.albums} />
        </div>
    )
}
