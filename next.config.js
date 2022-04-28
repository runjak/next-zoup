/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // https://nextjs.org/docs/api-reference/next.config.js/rewrites
    return {
      beforeFiles: [
        {
          source: "/yetzt-proxy/posts/:id.json",
          destination: "/api/yetzt-proxy/posts/:id",
        },
      ],
    };
  },
};

module.exports = nextConfig;
