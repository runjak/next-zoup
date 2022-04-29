/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // https://nextjs.org/docs/api-reference/next.config.js/rewrites
    return {
      beforeFiles: [
        {
          source: '/yetzt-proxy/feed.json',
          destination: "/api/feed-proxy?url=aHR0cHM6Ly95ZXR6dC5pby9mZWVkLmpzb24="
        },
        {
          source: "/yetzt-proxy/posts/:id.json",
          destination: "/api/post-proxy?url=:id",
        },
      ],
    };
  },
};

module.exports = nextConfig;
