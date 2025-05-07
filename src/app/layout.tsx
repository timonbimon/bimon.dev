import type React from "react";
import Script from "next/script";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PostHogProvider } from "../components/PostHogProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timon Ruban",
  description: "Personal website of Timon Ruban - Co-founder of Luminovo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://bimon.dev";
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background text-foreground dark:bg-black dark:text-white`}
      >
        <Script
          defer
          data-website-id="e6c7c589-3359-4a0f-ae58-a9f68da6ec2d"
          src="/umami/script.js"
          data-host-url={`${BASE_URL}/umami`}
        />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
