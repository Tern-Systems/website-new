/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['page.tsx', 'jsx', '_app.tsx'],
    swcMinify: true,
    experimental: {
        forceSwcTransforms: true,
        swcTraceProfiling: true,
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                hostname: '127.0.0.1',
                port: '8000',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
            },
        ],
    },
};

export default nextConfig;
