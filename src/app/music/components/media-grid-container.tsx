import { ReactNode, Suspense } from "react"
import MediaGridSkeleton from "@/app/music/components/media-grid-skeleton"

export default function MediaGridContainer({ name, children }: { name: string, children: ReactNode }) {
    return (
        <>
            <h2 className="font-bold text-2xl mb-4">{name}</h2>
            <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7
                gap-4 flex-wrap"
            >
                <Suspense
                    fallback={[...Array(16)].map((_, i) => <MediaGridSkeleton key={i} />)}
                >
                    {children}
                </Suspense>
            </div>
        </>
    )
}
