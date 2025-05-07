import fs from "fs";
import path from "path";
import readingTime from "reading-time";

export interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string; // Optional subtitle
  firstPublished: string;
  lastEdited?: string; // Optional: can be the same as firstPublished if not edited
  readTime: number;
  // Optionally add canonical, etc. if present in frontmatter
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), "src/content/blog");
  const fileNames = fs.readdirSync(postsDirectory);

  const posts: BlogPost[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith(".mdx")) continue;
    const slug = fileName.replace(/\.mdx$/, "");
    const mod = await import(`../content/blog/${slug}.mdx`);
    const frontmatter = mod.frontmatter || {};
    // Optionally, you can get content for reading time if needed
    const content = mod.default?.__content || "";
    const stats = readingTime(content);
    posts.push({
      slug,
      title: frontmatter.title,
      subtitle: frontmatter.subtitle, // Will be undefined if not present
      firstPublished: frontmatter.firstPublished,
      lastEdited: frontmatter.lastEdited,
      readTime: Math.max(1, Math.round(stats.minutes)),
      // Add more fields as needed
    });
  }

  // Sort by firstPublished date descending
  posts.sort(
    (a, b) =>
      new Date(b.firstPublished).getTime() -
      new Date(a.firstPublished).getTime()
  );
  return posts;
}
