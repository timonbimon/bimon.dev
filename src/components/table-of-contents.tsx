"use client";
import React, { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/toc";

const depthToMargin = {
  1: "ml-0",
  2: "ml-4",
  3: "ml-8",
  4: "ml-12",
  5: "ml-16",
};

export function TableOfContents(
  { toc, ...props }: { toc: TocHeading[] } & React.HTMLAttributes<HTMLElement>
) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!toc.length) return;

    const OFFSET = 200; // px from the top of the viewport

    const handleScroll = () => {
      const { scrollY, innerHeight } = window;
      const pageBottom = scrollY + innerHeight;
      const docHeight = document.body.scrollHeight;

      /* 4️⃣ At the bottom of the page → last heading is active */
      if (pageBottom >= docHeight - 1) {
        setActiveId(toc[toc.length - 1].id);
        return;
      }

      /* 2️⃣ & 3️⃣ Find the nearest heading that is above the offset line */
      let current = "";
      for (let i = toc.length - 1; i >= 0; i--) {
        const el = document.getElementById(toc[i].id);
        if (el && el.getBoundingClientRect().top <= OFFSET) {
          current = toc[i].id;
          break;
        }
      }

      /* 1️⃣ If none are above the line, deactivate all */
      setActiveId(current);
    };

    handleScroll(); // run once on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  /* Indentation helpers */
  const minDepth = Math.min(...toc.map((h) => h.depth));
  const getAdjustedDepth = (depth: number) =>
    (Math.min(depth - minDepth + 1, 5) as keyof typeof depthToMargin);

  return (
    <nav {...props}>
      <ul className="max-w-[30ch]">
        {toc.map((heading) => (
          <li key={heading.id} className={depthToMargin[getAdjustedDepth(heading.depth)]}>
            <a
              href={`#${heading.id}`}
              className={`hover:text-blue-600 transition-colors ${
                activeId === heading.id
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              {heading.value}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
