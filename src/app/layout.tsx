import type { Viewport } from "next";
import { PT_Sans } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";

const ptsans = PT_Sans({ subsets: ["latin"], weight: "400", preload: false });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id-ID" suppressHydrationWarning>
      <body className={ptsans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
