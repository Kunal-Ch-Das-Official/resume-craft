/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Allow remote images from Cloudinary for optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "http://localhost:8080/api/v1/:path*", // Correct format
      },
      {
        source: "/api/service2/:path*",
        destination: "http://127.0.0.1:8000/api/v1/:path*", // Correct format
      },
    ];
  },
};

export default nextConfig;
