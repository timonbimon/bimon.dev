import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkFrontmatter from "remark-frontmatter";
import mdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeSidenotes from "@jrsinclair/rehype-sidenotes";
// import remarkSidenotes from "./plugins/remarkSidenotes"; // to be added

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // OPTIONAL – if you don't need the Rust compiler, disable it so Turbopack + plugins work
  experimental: { mdxRs: false },
};

const withMDX = createMDX({
  // This ensures all .mdx files are processed, not just those in /pages or /app
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      [remarkFrontmatter, ["yaml"]],
      [mdxFrontmatter, { name: "frontmatter" }],
      [remarkGfm],
      // [remarkSidenotes], // to be added
    ],
    rehypePlugins: [
      [rehypeSlug],
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [rehypeSidenotes],
    ],
  },
});

export default withMDX(nextConfig);
