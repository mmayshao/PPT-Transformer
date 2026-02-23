import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 启用 standalone 输出用于 Docker 部署
  output: 'standalone',
  // 允许较大的body size用于PDF上传
  serverRuntimeConfig: {
    maxBodySize: '20mb',
  },
  // 优化图片处理
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 禁用x-powered-by头
  poweredByHeader: false,
  // 启用SWC压缩
  swcMinify: true,
};

export default nextConfig;
