const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // 配置自定义域名
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  // 配置图片域名
  images: {
    domains: ['njcheckin.com', 'www.njcheckin.com'],
  },
  // 配置环境变量
  env: {
    SITE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://njcheckin.com' 
      : 'http://localhost:3000',
  },
}) 