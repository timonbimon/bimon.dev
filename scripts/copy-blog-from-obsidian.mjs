import fs from 'fs/promises';
import path from 'path';
import Slugger from 'github-slugger';
import chokidar from 'chokidar';

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

async function copyAndTransformBlogPostFile(sourceFile) {
  try {
    await fs.mkdir(CONTENT_BLOG_DIR, { recursive: true });
    const title = path.basename(sourceFile, '.md');
    const sourcePath = path.join(OBSIDIAN_BLOG_DIR, sourceFile);
    const targetPath = path.join(CONTENT_BLOG_DIR, `${title}.mdx`);
    const content = await fs.readFile(sourcePath, 'utf-8');
    let transformedContent = content;
    transformedContent = transformInternalLinks(transformedContent);
    transformedContent = transformImagePaths(transformedContent);
    await fs.writeFile(targetPath, transformedContent, 'utf-8');
    console.log(`✅ Copied and transformed "${title}" to ${targetPath}`);
  } catch (error) {
    console.error(`❌ Error copying ${sourceFile}:`, error.message);
  }
}

async function copyAllBlogPosts() {
  try {
    await fs.mkdir(CONTENT_BLOG_DIR, { recursive: true });
    const files = await fs.readdir(OBSIDIAN_BLOG_DIR);
    const mdFiles = files.filter((f) => f.endsWith('.md'));
    await Promise.all(mdFiles.map(copyAndTransformBlogPostFile));
    console.log(`✅ All blog posts copied and transformed.`);
  } catch (error) {
    console.error('❌ Error copying blog posts:', error.message);
    process.exit(1);
  }
}

async function watchBlogDir() {
  console.log('👀 Watching for changes in Obsidian blog directory...');
  const watcher = chokidar.watch(OBSIDIAN_BLOG_DIR, {
    ignoreInitial: false,      
    usePolling: true,
    interval: 500,
  });
  watcher.on('change', (filePath) => {
    copyAndTransformBlogPostFile(path.basename(filePath));
  });
}

const watchMode = process.argv.includes('--watch');

if (watchMode) {
  // await copyAllBlogPosts();
  await watchBlogDir();
} else {
  await copyAllBlogPosts();
} 