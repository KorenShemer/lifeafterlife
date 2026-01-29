/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // S3 buckets
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com', // Cloudflare R2
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // הוספנו את זה בשביל האווטארים
      },
    ],
  },

  experimental: {
    reactCompiler: true, // Enable React Compiler
  },
}

module.exports = nextConfig