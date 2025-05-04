import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import type { Heading, Root, PhrasingContent } from "mdast";

export interface TocHeading {
  value: string;
  depth: number;
  id: string;
}

export function extractToc(markdown: string): TocHeading[] {
  const tree = unified().use(remarkParse).parse(markdown) as Root;
  const headings: TocHeading[] = [];
  const slugger = new GithubSlugger();
  visit(tree, "heading", (node: Heading) => {
    const text = node.children
      .map((c: PhrasingContent) => {
        if (c.type === "text") return c.value;
        // Optionally handle other phrasing content types (emphasis, strong, etc.)
        return "";
      })
      .join("");
    const id = slugger.slug(text);
    headings.push({ value: text, depth: node.depth, id });
  });
  return headings;
}
