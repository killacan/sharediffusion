/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'f004.backblazeb2.com',
                port: '',
                pathname: '/file/**/*',
            }
        ]
    }
}

module.exports = nextConfig
