/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/process-videos',
        destination: 'http://127.0.0.1:8001/api/process-videos',
      },
    ];
  },
};

module.exports = nextConfig;