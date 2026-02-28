import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // No exponer que el servidor usa Next.js
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Evita que la app sea embebida en un iframe (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Evita que el navegador detecte el MIME type por sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No enviar Referer a otros orígenes
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restringir acceso a APIs sensibles del navegador
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Content Security Policy
          // - WaveSurfer usa Web Workers con blob: URLs → worker-src blob:
          // - Los audios se sirven desde IndexedDB como blob: URLs → media-src blob:
          // - Framer Motion y WaveSurfer necesitan estilos inline → style-src 'unsafe-inline'
          // - WaveSurfer necesita eval para el backend WebAudio → script-src 'unsafe-eval'
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "media-src 'self' blob:",
              "worker-src blob:",
              "connect-src 'self' blob:",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
