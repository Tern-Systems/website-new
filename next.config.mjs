/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["page.tsx", "_app.tsx"],
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true,
    swcTraceProfiling: true,
  },
  webpack(config, { dev }) {
    if (dev) config.cache = true;
    config.module.rules.push({
      test: /\.*-spec\.tsx?$/,
      use: "ignore-loader",
    });
    config.module.rules.push({
      test: /tests([\/\\])regression/i,
      loader: "ignore-loader",
    });
    return config;
  },
  compiler: {
    removeConsole: { exclude: ["log"] },
  },
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
    loader: "default",
  },
};

export default nextConfig;
