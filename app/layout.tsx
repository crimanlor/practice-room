import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Practice Room - Aprende a Pinchar Música",
  description: "Una aplicación educativa para practicar y aprender a pinchar música, con marcadores y análisis de tracks.",
  keywords: ["DJ", "música", "práctica", "educación", "mezclas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
