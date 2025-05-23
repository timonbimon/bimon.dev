import React from "react";
import type { TocHeading } from "@/lib/toc";

const depthToMargin = {
  1: "ml-0",
  2: "ml-4",
  3: "ml-8",
  4: "ml-12",
  5: "ml-16",
};

export function TableOfContents({
  toc,
  ...props
}: { toc: TocHeading[] } & React.HTMLAttributes<HTMLElement>) {
  // Find the minimum depth in the TOC
  const minDepth = Math.min(...toc.map((heading) => heading.depth));

  // Adjust depth relative to minimum depth
  const getAdjustedDepth = (depth: number) => {
    const adjusted = depth - minDepth + 1;
    return Math.min(adjusted, 5) as keyof typeof depthToMargin;
  };

  return (
    <nav {...props}>
      <ul className="max-w-[30ch]">
        {toc.map((heading) => (
          <li
            key={heading.id}
            className={depthToMargin[getAdjustedDepth(heading.depth)]}
          >
            <a href={`#${heading.id}`} className="hover:text-blue-600 transition-colors">{heading.value}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
