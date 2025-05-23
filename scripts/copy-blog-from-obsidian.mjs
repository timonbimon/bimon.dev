import fs from 'fs/promises';
import path from 'path';
import Slugger from 'github-slugger';
import chokidar from 'chokidar';

const OBSIDIAN_BLOG_DIR = '/Users/timon/Library/Mobile Documents/iCloud~md~obsidian/Documents/Notes/blog';
const CONTENT_BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

const slugger = new Slugger();

// Function to renumber footnotes
function renumberFootnotes(content) {
  let newContent = content;
  let counter = 1;
  
  // First handle all footnote references [^X] (excluding footnote definitions)
  newContent = newContent.replace(/\[\^(\d+)\](?!:)/g, (match) => {
    return `[^${counter++}]`;
  });
  
  // Reset counter and handle all footnote definitions [^X]:
  counter = 1;
  newContent = newContent.replace(/\[\^(\d+)\]:/g, (match) => {
    return `[^${counter++}]:`;
  });
  
  return newContent;
}

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
    
    // Read the original content
    const content = await fs.readFile(sourcePath, 'utf-8');
    
    // First renumber the footnotes in the original content
    const contentWithRenumberedFootnotes = renumberFootnotes(content);
    
    // Only write back to source if content actually changed
    if (content !== contentWithRenumberedFootnotes) {
      await fs.writeFile(sourcePath, contentWithRenumberedFootnotes, 'utf-8');
    }
    
    // Then transform for the MDX version
    let transformedContent = contentWithRenumberedFootnotes;
    transformedContent = transformInternalLinks(transformedContent);
    transformedContent = transformImagePaths(transformedContent);
    
    // Write the transformed content to MDX
    await fs.writeFile(targetPath, transformedContent, 'utf-8');
    
    console.log(`✅ Copied and transformed "${title}" to ${targetPath}${content !== contentWithRenumberedFootnotes ? ' (with renumbered footnotes)' : ''}`);
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