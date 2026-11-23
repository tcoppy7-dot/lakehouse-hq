import type { Metadata, Viewport } from "next";
import { Newsreader, Onest } from "next/font/google";
import "./globals.css";

// Onest carries the whole interface. Newsreader is used only for the wordmark.
const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-text",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-serif-display",
});

export const metadata: Metadata = {
  title: "Lakehouse HQ",
  description: "Request services, check on your lakehouse, and keep house details in one place.",
};

export const viewport: Viewport = {
  themeColor: "#FAF9F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${onest.variable} ${newsreader.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
