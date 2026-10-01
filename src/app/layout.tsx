import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const poppins = localFont({
  src: [
    { path: "../fonts/poppins-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/poppins-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/poppins-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/poppins-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const outfit = localFont({
  src: "../fonts/outfit-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-outfit",
  display: "swap",
});

const syne = localFont({
  src: "../fonts/syne-latin-800-normal.woff2",
  weight: "800",
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "ByteSpace | Online courses from creators worldwide", template: "%s | ByteSpace" },
  description:
    "Get access to hundreds of courses. Unlock your creativity, gain valuable knowledge, and grow your business with ByteSpace.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "ByteSpace",
    description: "Get access to hundreds of courses from creators around the world.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#003BE2", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${outfit.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
