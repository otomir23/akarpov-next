"use server"

import { z } from "zod"
import {
    mediaUrlSchema,
    fetchBackend,
    getPaginationSearchParams,
    paginated, parseLookup,
} from "@/data/common"

// Albums

const catalogueAlbumSchema = z.object({
    name: z.string(),
    slug: z.string(),
    image_cropped: mediaUrlSchema.nullable(),
})

export type CatalogueAlbum = z.infer<typeof catalogueAlbumSchema>

const albumsResponseSchema = paginated(catalogueAlbumSchema)

export async function fetchAlbums(page?: number | null) {
    const res = await fetchBackend(`/music/albums/?${getPaginationSearchParams(page)}`)
    return albumsResponseSchema.parse(res)
}

// Authors

const catalogueAuthorSchema = z.object({
    name: z.string(),
    slug: z.string(),
    image_cropped: mediaUrlSchema.nullable(),
})

export type CatalogueAuthor = z.infer<typeof catalogueAuthorSchema>

const authorsResponseSchema = paginated(catalogueAuthorSchema)

export async function fetchAuthors(page?: number | null) {
    const res = await fetchBackend(`/music/authors/?${getPaginationSearchParams(page)}`)
    return authorsResponseSchema.parse(res)
}

// Songs

const catalogueSongSchema = z.object({
    name: z.string(),
    slug: z.string(),
    file: mediaUrlSchema,
    image_cropped: mediaUrlSchema.nullable(),
    length: z.number(),
    album: catalogueAlbumSchema,
    authors: z.array(catalogueAuthorSchema),
    liked: z.boolean().nullable(),
})

export type CatalogueSong = z.infer<typeof catalogueSongSchema>

const songsResponseSchema = paginated(catalogueSongSchema)

export async function fetchSongs(page?: number | null) {
    const res = await fetchBackend(`/music/song/?${getPaginationSearchParams(page)}`)
    return songsResponseSchema.parse(res)
}

// Song

const songDetailsSchema = z.object({
    image: mediaUrlSchema.nullable(),
    link: z.string(),
    length: z.number(),
    played: z.number(),
    name: z.string(),
    file: mediaUrlSchema,
    authors: z.array(catalogueAuthorSchema),
    album: catalogueAlbumSchema,
    liked: z.boolean().nullable(),
})

export type SongDetails = z.infer<typeof catalogueSongSchema>
export async function fetchSong(slug: string) {
    const res = await fetchBackend(`/music/song/${slug}`)
    return parseLookup(res, songDetailsSchema)
}

export type Song = CatalogueSong & SongDetails

// Album

const albumDetailsSchema = z.object({
    name: z.string(),
    image: mediaUrlSchema.nullable(),
    link: z.string(),
    songs: z.array(catalogueSongSchema),
    artists: z.array(catalogueAuthorSchema),
})

export type AlbumDetails = z.infer<typeof albumDetailsSchema>

export async function fetchAlbum(slug: string) {
    const res = await fetchBackend(`/music/albums/${slug}`)
    return parseLookup(res, albumDetailsSchema)
}

// Author

const authorDetailsSchema = z.object({
    name: z.string(),
    image: mediaUrlSchema.nullable(),
    link: z.string(),
    songs: z.array(catalogueSongSchema),
    albums: z.array(catalogueAlbumSchema),
})

export type AuthorDetails = z.infer<typeof authorDetailsSchema>

export async function fetchAuthor(slug: string) {
    const res = await fetchBackend(`/music/authors/${slug}`)
    return parseLookup(res, authorDetailsSchema)
}
