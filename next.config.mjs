import {env} from "./src/env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: env.MEDIA_BASE_HOSTNAME,
            },
        ],
    },
}

export default nextConfig
