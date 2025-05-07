import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://bimon.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*", // Applies to all web crawlers
        allow: "/", // Allow crawling of all content by default
        // Add disallow rules here if you have specific paths to block
        // e.g., disallow: '/admin/'
      },
      // You can add more specific rules for other user agents if needed
      // {
      //   userAgent: 'Googlebot',
      //   allow: ['/'],
      //   disallow: '/private/',
      // },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
