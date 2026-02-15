import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',               // البروتوكول اللي الصورة عليه
        hostname: 'res.cloudinary.com', // فقط الدومين بدون http:// أو https://
        port: '',                        // عادة فاضي
        pathname: '/**',                 // أي مسار
      },
    ],
  },
}

export default nextConfig
