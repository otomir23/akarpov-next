"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function AuthForm({ onSubmit, tokenUrl }: {
    onSubmit: (token: string) => Promise<boolean>,
    tokenUrl: string,
}) {
    const [token, setToken] = useState<string>("")
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        setFailed(false)
    }, [token])

    return (
        <form
            className="flex flex-col w-full max-w-xl mx-auto border rounded-lg mt-16 px-6 py-8 gap-4 bg-neutral-50"
            onSubmit={async (e) => {
                e.preventDefault()
                if (!token) return
                const res = await onSubmit(token)
                setFailed(!res)
            }}
        >
            <h1 className="font-bold text-2xl">Login</h1>
            <label className="flex flex-col gap-1">
                <p>Token {!token && <span className="text-red-500">*</span>}</p>
                <input
                    className="rounded-md border px-4 py-2 w-full focus:outline-0 focus:ring-4 ring-neutral-100"
                    name="token"
                    placeholder="Your token"
                    type="password"
                    required
                    onChange={e => setToken(e.target.value)}
                    value={token ?? ""}
                />
                <Link className="text-sm text-blue-600" href={tokenUrl}>Get your token here {"-->"}</Link>
            </label>
            <button
                disabled={!token}
                type="submit"
                className="px-4 py-2 rounded transition-colors font-bold
                bg-blue-700 border border-blue-800 text-blue-50 ring-blue-100
                hover:bg-blue-800 hover:border-blue-900
                disabled:bg-neutral-600 disabled:text-neutral-50 disabled:border-neutral-700
                focus:outline-0 focus:ring-4 focus:border-blue-900 focus:bg-blue-800"
            >
                Login
            </button>
            {failed && <p className="text-red-500">Invalid token</p>}
        </form>
    )
}
