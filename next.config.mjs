/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['tsx', 'page.tsx', 'jsx', '_app.tsx', 'js', 'ts'],
    swcMinify: true,
    experimental: {
        forceSwcTransforms: true,
        swcTraceProfiling: true,
    },
    webpack(config, { dev }) {
        if (dev) config.cache = true;
        return config;
    },
    compiler: {
        removeConsole: { exclude: ['log'] },
    },
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'localhost',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '/**',
            },
        ],
        loader: 'default',
    },
};

export default nextConfig;
