/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['page.tsx', 'not-found.tsx', '_app.tsx'],
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
