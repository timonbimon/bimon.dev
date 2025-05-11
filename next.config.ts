import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkFrontmatter from "remark-frontmatter";
import mdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeSidenotes from "@jrsinclair/rehype-sidenotes";
import rehypeImageCaption from "rehype-image-caption";
import remarkAttributes from "remark-attributes";
// import remarkSidenotes from "./plugins/remarkSidenotes"; // to be added

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // OPTIONAL – if you don't need the Rust compiler, disable it so Turbopack + plugins work
  experimental: { mdxRs: false },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
      {
        source: "/umami/script.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/umami/api/send",
        destination: "https://cloud.umami.is/api/send",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

const withMDX = createMDX({
  // This ensures all .mdx files are processed, not just those in /pages or /app
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      [remarkFrontmatter, ["yaml"]],
      [mdxFrontmatter, { name: "frontmatter" }],
      [remarkGfm],
      [remarkAttributes, { mdx: true }],
    ],
    rehypePlugins: [
      [rehypeSlug],
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [rehypeSidenotes],
      [rehypeImageCaption, { wrapImagesWithoutCaptions: true }],
    ],
  },
});

export default withMDX(nextConfig);
