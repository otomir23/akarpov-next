import { fetchAuthors } from "@/data/music"
import Authors from "@/app/music/authors/authors"
import MediaGridContainer from "@/app/music/components/media-grid-container"
import { Metadata } from "next"
import MediaGridSearch from "@/app/music/components/media-grid-search"

export const metadata: Metadata = {
    title: "Authors",
}

async function AuthorList({ search }: { search?: string }) {
    const data = await fetchAuthors(undefined, search)
    return <Authors initialData={data} />
}

export default function AuthorsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
    const { q } = searchParams
    return (
        <MediaGridContainer
            name="Authors"
            aside={<MediaGridSearch property="q" initialValue={q} placeholder="Search..." />}
        >
            <AuthorList search={q} />
        </MediaGridContainer>
    )
}
