/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,

  // Enable React Compiler (stable in Next.js 16)
  reactCompiler: true,
};

module.exports = withBundleAnalyzer(nextConfig);
