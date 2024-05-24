import Link from "next/link"

export default function Home() {
    return (
        <p className="font-semibold p-4">
            Looking for <Link href="/music" className="rounded px-1 bg-neutral-200">music</Link>?
        </p>
    )
}
