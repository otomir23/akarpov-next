import { auth } from "@/data/user"
import AuthForm from "@/app/auth/form"
import { redirect } from "next/navigation"
import { env } from "@/env.mjs"

export const metadata = {
    title: "Login",
}

export default function AuthPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
    return (
        <AuthForm
            onSubmit={async (token) => {
                "use server"
                const res = await auth(token)
                if (!res) return false
                const redirectTo = searchParams.back
                redirect(!redirectTo?.startsWith("/") ? "/" : redirectTo)
            }}
            tokenUrl={env.CREATE_TOKEN_URL}
        />
    )
}
