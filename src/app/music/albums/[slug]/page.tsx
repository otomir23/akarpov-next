import { fetchAlbum } from "@/data/music"
import Image from "next/image"
import SongList from "@/app/music/components/song-list"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function SongPage({ params: { slug } }: { params: { slug: string } }) {
    const album = await fetchAlbum(slug)
    if (!album) notFound()

    return (
        <div className="flex flex-col gap-4">
            <figure className="flex flex-col md:flex-row gap-4">
                {
                    album.image ? (
                        <Image
                            src={album.image}
                            height={200}
                            width={200}
                            className="object-cover w-[200px] aspect-square rounded"
                            alt=""
                        />
                    ) : <div className="rounded bg-neutral-300 w-full max-w-[200px] aspect-square" />
                }
                <figcaption>
                    <h3 className="font-bold text-3xl mt-4">{album.name}</h3>
                    <p className="text-xl text-neutral-800 font-medium">
                        by{" "}
                        {album.artists.map((a, i) => (
                            <Link href={`/music/authors/${a.slug}`} key={a.slug}>
                                {a.name}{i !== album.artists.length - 1 && ", "}
                            </Link>
                        ))}
                    </p>
                </figcaption>
            </figure>
            <SongList songs={album.songs} addIds />
        </div>
    )
}