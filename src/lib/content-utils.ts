import fs from "fs";
import readingTime from "reading-time";

/**
 * Reads a file and returns its raw content after stripping YAML frontmatter.
 * @param filePath - The absolute path to the MDX file.
 * @returns The raw content of the file without frontmatter, or an empty string if an error occurs.
 */
export function getRawMdxContentWithoutFrontmatter(filePath: string): string {
  try {
    const rawContentWithFrontmatter = fs.readFileSync(filePath, "utf8");
    // Strip YAML frontmatter block if present
    return rawContentWithFrontmatter.replace(/^---[\s\S]*?---\s*/, "");
  } catch (error) {
    console.error(`Error reading or processing file at ${filePath}:`, error);
    return ""; // Return empty string on error to prevent crashes downstream
  }
}

/**
 * Calculates the estimated reading time in minutes for a given content string.
 * @param content - The content string (e.g., MDX content without frontmatter).
 * @returns The estimated reading time in minutes (minimum 1 minute).
 */
export function calculateReadingTime(content: string): number {
  if (!content) {
    return 1; // Avoid errors with empty content
  }
  const stats = readingTime(content);
  return Math.max(1, Math.round(stats.minutes));
}
