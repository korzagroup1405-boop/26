/** @type {import('next').NextConfig} */
const previewOrigins =
  process.env.BASE44_PREVIEW_MODE === '1' && process.env.BASE44_PUBLIC_HOST_SUFFIX
    ? [`3000-${process.env.BASE44_PUBLIC_HOST_SUFFIX}`]
    : [];

const nextConfig = {
  reactStrictMode: true,
  // The preview proxy reaches the dev server from a different origin.
  // Only relax the dev-origin allowlist when running inside the sandbox preview.
  allowedDevOrigins: previewOrigins,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
};

export default nextConfig;
