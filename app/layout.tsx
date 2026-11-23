import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader, Onest } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-text",
});

export const metadata: Metadata = {
  title: "Lakehouse HQ",
  description: "Local property management for lakehouse owners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${newsreader.variable} ${onest.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}>{children}</body>
    </html>
  );
}
