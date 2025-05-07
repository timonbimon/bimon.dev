import { getBlogPosts } from "@/lib/mdx";
import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://bimon.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();

  const blogPostUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(
      post.lastEdited || post.firstPublished
    ).toISOString(),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(), // Or a specific date for homepage updates
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...blogPostUrls,
    // Add other static pages here if you have them
    // {
    //   url: `${BASE_URL}/about`,
    //   lastModified: new Date().toISOString(),
    //   changeFrequency: 'yearly',
    //   priority: 0.5,
    // },
  ];
}
