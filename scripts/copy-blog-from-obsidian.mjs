import fs from 'fs/promises';
import path from 'path';
import Slugger from 'github-slugger';

const OBSIDIAN_BLOG_DIR = '/Users/timon/Library/Mobile Documents/iCloud~md~obsidian/Documents/Notes/blog';
const CONTENT_BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

const slugger = new Slugger();

// Transform Obsidian internal links
function transformInternalLinks(content) {
  // Match [[filename#section|link text]] pattern
  return content.replace(/\[\[([^#\]]+)(?:#([^\]]+))?\|([^\]]+)\]\]/g, (match, filename, section, linkText) => {
    if (section) {
      // If there's a section, slugify it and create a proper link
      return `[${linkText}](#${slugger.slug(section)})`;
    }
    // If no section, just use the filename as the link
    return `[${linkText}](/blog/${filename})`;
  });
}

// Transform absolute image paths
function transformImagePaths(content) {
  // Match ![alt text](file:///absolute/path/to/image.ext) pattern
  return content.replace(
    /!\[([^\]]*)\]\(file:\/\/\/Users\/timon\/code\/bimon\.dev\/public(\/[^)]+)\)/g,
    (match, altText, imagePath) => {
      return `![${altText}](${imagePath})`;
    }
  );
}

async function copyAndTransformBlogPost(title) {
  try {
    // Ensure the content directory exists
    await fs.mkdir(CONTENT_BLOG_DIR, { recursive: true });

    const sourcePath = path.join(OBSIDIAN_BLOG_DIR, `${title}.md`);
    const targetPath = path.join(CONTENT_BLOG_DIR, `${title}.mdx`);

    // Read the source file
    const content = await fs.readFile(sourcePath, 'utf-8');

    // Apply transformations
    let transformedContent = content;
    transformedContent = transformInternalLinks(transformedContent);
    transformedContent = transformImagePaths(transformedContent);

    // Write the transformed content
    await fs.writeFile(targetPath, transformedContent, 'utf-8');

    console.log(`✅ Successfully copied and transformed "${title}" to ${targetPath}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get the blog post title from command line arguments
const title = process.argv[2];
if (!title) {
  console.error('❌ Please provide a blog post title');
  console.error('Usage: yarn copy-blog-from-obsidian "title-of-blogpost"');
  process.exit(1);
}

copyAndTransformBlogPost(title); 