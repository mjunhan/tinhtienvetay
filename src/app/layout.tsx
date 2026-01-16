import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"], // Important for Vietnamese support
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Logistics Cost Estimator",
  description: "Real-time logistics cost estimator for China-Vietnam imports",
};

import { StickyFooter } from "@/components/common/StickyFooter";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-[#F8F9FC] text-text-main min-h-screen pb-24 md:pb-0`}
        suppressHydrationWarning
      >
        {children}
        <StickyFooter />
      </body>
    </html>
  );
}
