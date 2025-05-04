import fs from "fs";
import path from "path";
import readingTime from "reading-time";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: number;
  // Optionally add subtitle, canonical, etc. if present in frontmatter
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
      date: frontmatter.date,
      readTime: Math.max(1, Math.round(stats.minutes)),
      // Add more fields as needed
    });
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}
