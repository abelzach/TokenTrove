/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint checks during build
  },
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript type checks during build
  },
};


export default nextConfig;
