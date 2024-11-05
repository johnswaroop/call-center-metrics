/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '1000mb',
        },
    },
    logging: {
        fetches: {
            fullUrl: true
        }
    }
};

export default nextConfig;
