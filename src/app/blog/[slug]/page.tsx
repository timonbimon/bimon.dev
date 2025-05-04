import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { extractToc } from "@/lib/toc";
import { TableOfContents } from "@/components/table-of-contents";
import readingTime from "reading-time";
import fs from "fs";
import path from "path";
import FootnotePopoversClient from "@/components/footnote-popovers-client";
import SidenoteShowMore from "@/components/sidenote-show-more";
import Logo from "@/components/logo";
import BlogPostFooterForm from "@/components/blog-post-footer-form";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const { getBlogPosts } = await import("@/lib/mdx");
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let PostComponent, frontmatter;
  try {
    const mod = await import(`@/content/blog/${slug}.mdx`);
    PostComponent = mod.default;
    frontmatter = mod.frontmatter;
  } catch {
    notFound();
  }

  // Read the raw MDX file content for ToC and reading time
  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.mdx`);
  let rawContent = "";
  try {
    rawContent = fs.readFileSync(filePath, "utf8");
  } catch {}

  // Strip YAML frontmatter block if present
  const contentWithoutFrontmatter = rawContent.replace(
    /^---[\s\S]*?---\s*/,
    ""
  );

  // Extract ToC from content without frontmatter
  const toc = extractToc(contentWithoutFrontmatter);

  // Calculate reading time
  const readStats = readingTime(contentWithoutFrontmatter || "");
  const readTime = Math.max(1, Math.round(readStats.minutes));

  return (
    <article className="min-h-screen bg-background xl:grid xl:grid-cols-[1fr_65ch_1fr] p-8">
      <FootnotePopoversClient />
      <SidenoteShowMore />
      {/* <div className="max-w-screen-2xl mx-auto">}
        {/* Header */}
      {/* <div className="max-w-[65ch] mx-auto px-4 xl:px-8 pt-12">  */}
      <header className="mb-4 xl:mb-6 text-left xl:px-8 col-start-2">
        <Logo />
        <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
        <div className="flex items-center text-gray-500">
          <time dateTime={frontmatter.date}>
            {formatDate(frontmatter.date)}
          </time>
          <span className="mx-2">·</span>
          <span>{readTime} min read</span>
        </div>
      </header>
      <TableOfContents
        className="col-start-1 xl:justify-self-end pr-8 xl:sticky xl:top-8 xl:self-start pb-8"
        toc={toc}
      />
      <section className="xl:border-l-2 xl:border-r-2 xl:border-gray-200 xl:px-8 col-start-2">
        <PostComponent />
      </section>
      <section className="xl:border-l-2 xl:border-r-2 border-gray-200 xl:px-8 col-start-2 border-t-2">
        {/* <hr className="border-gray-200 border-t-2 my-8 xl:w-[calc(100%+4rem)] xl:-mx-8" /> */}
        <BlogPostFooterForm postTitle={frontmatter.title} />
      </section>
    </article>
  );
}
