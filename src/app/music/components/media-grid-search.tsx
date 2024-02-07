"use client"

import { SearchIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export type MediaGridSearchProps = {
    initialValue?: string,
    property: string,
    placeholder?: string,
}

export default function MediaGridSearch({ initialValue, property, placeholder = "" }: MediaGridSearchProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    return (
        <form className="relative" onSubmit={e => e.preventDefault()}>
            <input
                onChange={(e) => {
                    const newSearchParams = new URLSearchParams(searchParams)
                    newSearchParams.set(property, e.target.value)
                    router.replace(`?${newSearchParams}`, { scroll: false })
                }}
                name={property}
                className="border border-neutral-200 bg-neutral-50 py-1 px-2 rounded-lg
                appearance-none w-full focus:outline-none focus:ring ring-neutral-100 placeholder:text-neutral-400"
                placeholder={placeholder}
                defaultValue={initialValue}
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 focus:outline-none focus:scale-125
                transition-transform"
                aria-label={placeholder}
            >
                <SearchIcon size={16} />
            </button>
        </form>
    )
}
