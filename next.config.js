const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
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