"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

export type CatalogueElement = {
    slug: string,
    name: string,
    authors: {
        slug: string,
        name: string,
    }[],
    image_cropped: string | null,
}

export type FetchReturn<E> = {
    results: E[],
    next?: number | null,
    [key: string]: any,
}

type Props<E extends CatalogueElement> = {
    initialData: FetchReturn<E>,
    fetch: (page?: number | null) => Promise<FetchReturn<E>>,
    onSwitch: (el: E) => void,
    isPlayingProvider: (el: E) => boolean,
    linkProvider: (el: E) => string,
    altTextProvider: (el: E) => string,
    circles?: boolean,
}

export default function MediaGrid<E extends CatalogueElement>(
    { initialData, fetch, isPlayingProvider, onSwitch, linkProvider, altTextProvider, circles }: Props<E>
) {
    const rounded = circles ? "rounded-full" : "rounded"
    const [data, setData] = useState(initialData.results)
    const [nextPage, setNextPage] = useState(initialData.next)
    const [loadMoreButton, loadMoreButtonInView, entry] = useInView({
        threshold: 0,
    })

    async function loadMore() {
        const newData = await fetch(nextPage)
        setData([...data, ...newData.results])
        setNextPage(newData.next)
    }

    useEffect(() => {
        setData(initialData.results)
        setNextPage(initialData.next)
    }, [initialData])

    useEffect(() => {
        if (loadMoreButtonInView && nextPage !== null)
            loadMore().then()
    },
    // We don't want to load more when next page changes, only when button enters viewport
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadMoreButtonInView])

    return (
        <>
            {data.map(el => (
                <figure key={el.slug}>
                    <button
                        className="relative w-full max-w-[250px]"
                        onClick={() => onSwitch(el)}
                    >
                        {
                            el.image_cropped ? (
                                <Image
                                    src={el.image_cropped}
                                    height={250}
                                    width={250}
                                    className={`object-cover w-[250px] aspect-square ${rounded}`}
                                    alt={altTextProvider(el)}
                                />
                            ) : <div className={`bg-neutral-300 w-full max-w-[250px] aspect-square ${rounded}`} />
                        }
                        <div
                            className={`absolute inset-0 opacity-0 hover:opacity-100 bg-black/50 transition-opacity
                            flex items-center justify-center text-white text-6xl ${rounded}`}
                        >
                            {isPlayingProvider(el) ? "❚❚" : "▶"}
                        </div>
                    </button>
                    <figcaption>
                        <Link href={linkProvider(el)} className="font-semibold">
                            {el.name}
                        </Link>
                        {el.authors.length > 0 && (
                            <p className="text-sm text-neutral-400">
                                by {
                                    el.authors.map((a, i) => (
                                        <Link href={`/music/authors/${a.slug}`} key={a.slug}>
                                            {a.name}{i !== el.authors.length - 1 && ", "}
                                        </Link>
                                    ))
                                }
                            </p>
                        )}
                    </figcaption>
                </figure>
            ))}
            {nextPage !== null && (
                <button
                    className={`w-full max-w-[250px] aspect-square bg-black text-white ${rounded}`}
                    onClick={loadMore}
                    ref={loadMoreButton}
                >
                    More
                </button>
            )}
        </>
    )
}
