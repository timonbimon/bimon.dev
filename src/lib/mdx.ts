import fs from "fs";
import path from "path";
import {
  getRawMdxContentWithoutFrontmatter,
  calculateReadingTime,
} from "./content-utils";

export interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  firstPublished: string;
  lastEdited?: string;
  readTime: number;
  image?: string;
  keywords?: string[];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), "src/content/blog");
  const fileNames = fs.readdirSync(postsDirectory);
  const posts: BlogPost[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith(".mdx")) continue;
    const slug = fileName.replace(/\.mdx$/, "");
    try {
      const mod = await import(`../content/blog/${slug}.mdx`);
      const frontmatter = mod.frontmatter || {}; // Keep as generic object temporarily

      // Basic validation
      if (!frontmatter.title || !frontmatter.firstPublished) {
        console.warn(
          `Skipping ${fileName}: missing essential frontmatter (title or firstPublished).`
        );
        continue;
      }

      const filePath = path.join(postsDirectory, fileName);
      const contentWithoutFrontmatter =
        getRawMdxContentWithoutFrontmatter(filePath);
      const readTime = calculateReadingTime(contentWithoutFrontmatter);

      // Directly populate the BlogPost structure
      posts.push({
        slug,
        title: frontmatter.title,
        firstPublished: frontmatter.firstPublished,
        readTime,
        // Optional fields:
        description: frontmatter.description,
        subtitle: frontmatter.subtitle,
        lastEdited: frontmatter.lastEdited,
        image: frontmatter.image,
        keywords: frontmatter.keywords,
      });
    } catch (error) {
      console.warn(
        `Could not load or parse frontmatter for ${fileName}:`,
        error
      );
    }
  }
  posts.sort(
    (a, b) =>
      new Date(b.firstPublished).getTime() -
      new Date(a.firstPublished).getTime()
  );
  return posts;
}

/**
 * Retrieves a single blog post by its slug.
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const mod = await import(`../content/blog/${slug}.mdx`);
    const frontmatter = mod.frontmatter || {}; // Keep as generic object temporarily

    if (!frontmatter.title || !frontmatter.firstPublished) {
      console.warn(
        `Post with slug "${slug}" is missing essential frontmatter (title or firstPublished).`
      );
      return null;
    }

    const filePath = path.join(
      process.cwd(),
      "src/content/blog",
      `${slug}.mdx`
    );
    const contentWithoutFrontmatter =
      getRawMdxContentWithoutFrontmatter(filePath);
    const readTime = calculateReadingTime(contentWithoutFrontmatter);

    // Directly populate the BlogPost structure
    return {
      slug,
      title: frontmatter.title,
      firstPublished: frontmatter.firstPublished,
      readTime,
      // Optional fields:
      description: frontmatter.description,
      subtitle: frontmatter.subtitle,
      lastEdited: frontmatter.lastEdited,
      image: frontmatter.image,
      keywords: frontmatter.keywords,
    };
  } catch (error) {
    console.warn(
      `Could not load blog post with slug "${slug}". It might not exist or has errors:`,
      error
    );
    return null;
  }
}
