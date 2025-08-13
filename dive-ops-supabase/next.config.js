/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 可选：配置图像优化
  images: {
    domains: ['your-supabase-domain.supabase.co'],
  },
  
  // 可选：配置环境变量
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  }
};

module.exports = nextConfig;
