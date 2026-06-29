/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  // Mongoose is server-only; keep it out of the client/edge bundle.
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
