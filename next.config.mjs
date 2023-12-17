import {env} from "./src/env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
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
