import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background text-foreground dark:bg-black dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
