import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Embedding allowed only on the company site (X-Frame-Options is omitted: it cannot whitelist origins).
  // A full script-src CSP needs per-request nonces (see Next.js CSP guide).
  { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://oberfritz.com.br https://www.oberfritz.com.br" },
];

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
