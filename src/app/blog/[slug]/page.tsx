import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { extractToc } from "@/lib/toc";
import { TableOfContents } from "@/components/table-of-contents";
import path from "path";
import FootnotePopoversClient from "@/components/footnote-popovers-client";
import SidenoteShowMore from "@/components/sidenote-show-more";
import Logo from "@/components/logo";
import {
  getRawMdxContentWithoutFrontmatter,
  calculateReadingTime,
} from "@/lib/content-utils";
import { getBlogPostBySlug, getBlogPosts, BlogPost } from "@/lib/mdx";
import type { Metadata, ResolvingMetadata } from "next";
import BlogPostList from "@/components/blog-post-list";
import SubscribeForm from "@/components/subscribe-form";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: BlogPostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    const parentTitle = (await parent).title?.absolute || "Post not found";
    return {
      title: parentTitle,
      description: "This blog post could not be found.",
    };
  }

  const siteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bimon.dev";
  const postUrl = `${siteBaseUrl}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description || post.title,
    keywords: post.keywords || [],
    authors: [{ name: "Timon Ruban", url: siteBaseUrl }],

    alternates: {
      canonical: postUrl,
    },

    openGraph: {
      title: post.title,
      description: post.description || post.title,
      url: postUrl,
      type: "article",
      publishedTime: post.firstPublished,
      modifiedTime: post.lastEdited || post.firstPublished,
      authors: [siteBaseUrl],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || post.title,
    },
  };
}

export async function generateStaticParams() {
  const { getBlogPosts } = await import("@/lib/mdx");
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

function getNextNPosts(posts: BlogPost[], currentSlug: string, n: number) {
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);
  if (currentIndex === -1) return [];
  const result: BlogPost[] = [];
  let idx = currentIndex;
  for (let i = 0; i < n; i++) {
    idx = (idx + 1) % posts.length;
    if (posts[idx].slug === currentSlug) break; // avoid infinite loop if only one post
    result.push(posts[idx]);
  }
  return result;
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

  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.mdx`);
  const contentWithoutFrontmatter =
    getRawMdxContentWithoutFrontmatter(filePath);
  const toc = extractToc(contentWithoutFrontmatter);
  const readTime = calculateReadingTime(contentWithoutFrontmatter);
  const posts = await getBlogPosts();
  const nextPosts = getNextNPosts(posts, slug, 3);

  return (
    <article className="min-h-screen bg-background xl:grid xl:grid-cols-[1fr_65ch_1fr] p-8">
      <FootnotePopoversClient />
      <SidenoteShowMore />
      <header className="mb-4 xl:mb-6 text-left xl:px-8 col-start-2">
        <Logo />
        <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
        {frontmatter.subtitle && (
          <p className="text-xl text-gray-600 mb-4">{frontmatter.subtitle}</p>
        )}
        <div className="flex items-center text-gray-500">
          <time dateTime={frontmatter.firstPublished}>
            {formatDate(frontmatter.firstPublished)}
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
        <PostComponent currentSlug={slug} />
      </section>
      <section className="xl:border-l-2 xl:border-r-2 border-gray-200 xl:px-8 col-start-2 border-t-2">
        <SubscribeForm postTitle={frontmatter.title} />
      </section>
      {nextPosts.length > 0 && (
        <section className="xl:border-l-2 xl:border-r-2 border-gray-200 xl:px-8 col-start-2 border-t-2 pb-8">
          <span className="text-sm block font-medium mb-4 pt-8">
            Keep reading
          </span>
          <BlogPostList posts={nextPosts} textSize="l" />
        </section>
      )}
    </article>
  );
}
