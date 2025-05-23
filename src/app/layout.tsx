import type React from "react";
import Script from "next/script";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PostHogProvider } from "../components/posthog-provider";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://bimon.dev";

// Define shared metadata constants
const siteTitle = "Timon Ruban | bimon.dev";
const siteDescription = "Timon Ruban's personal website and musings.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: siteTitle,
    template: "%s | bimon.dev",
  },
  description: siteDescription,
  applicationName: "bimon.dev",
  authors: [{ name: "Timon Ruban", url: BASE_URL }],
  keywords: [
    "Timon Ruban",
    "personal website",
    "Goodreads",
    "blog",
    "startup",
    "investments",
    "hiring",
    "founder",
    "Luminovo",
  ],

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "bimon.dev",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    creator: "@timonbimon",
    site: "@timonbimon",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/images/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/images/android-chrome-512x512.png"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.className} bg-background text-foreground dark:bg-black dark:text-white`}
      >
        {process.env.NODE_ENV === "production" && (
          <Script
            defer
            data-website-id="e6c7c589-3359-4a0f-ae58-a9f68da6ec2d"
            src="/umami/script.js"
            data-host-url={`${BASE_URL}/umami`}
          />
        )}
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
