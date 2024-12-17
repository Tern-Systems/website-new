/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { // TODO
        remotePatterns: [
            {
                hostname: '127.0.0.1',
                port: '8000',
            },
        ],
    },
};

export default nextConfig;
