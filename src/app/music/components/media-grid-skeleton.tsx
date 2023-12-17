export default function MediaGridSkeleton() {
    return (
        <div className="animate-pulse">
            <div
                className="rounded bg-neutral-300 w-full max-w-[250px] aspect-square"
            />
            <div
                className="rounded bg-neutral-300 w-24 h-4 mt-2"
            />
            <div
                className="rounded bg-neutral-200 w-16 h-3 mt-1"
            />
        </div>
    )
}
