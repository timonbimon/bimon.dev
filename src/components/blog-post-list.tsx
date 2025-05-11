import Link from "next/link";
import { BlogPost } from "@/lib/mdx";

interface BlogPostListProps {
  posts?: BlogPost[];
  textSize?: "xl" | "l";
}

export default function BlogPostList({
  posts = [],
  textSize = "xl",
}: BlogPostListProps) {
  const titleClass = textSize === "xl" ? "text-xl" : "text-l";
  const listSpacing = textSize === "xl" ? "space-y-5" : "space-y-3";
  return (
    <ul className={listSpacing}>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`} className="group">
            <div
              className={`flex flex-col lg:flex-row items-start lg:items-center font-medium mb-1 ${titleClass}`}
            >
              <span className="text-blue-600 group-hover:text-blue-800 transition-colors">
                {post.title}
              </span>
              <span className="hidden lg:inline mx-0 lg:mx-2 text-gray-400">
                ·
              </span>
              <span className="text-base text-gray-500 lg:ml-0">
                {post.readTime} min read
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
