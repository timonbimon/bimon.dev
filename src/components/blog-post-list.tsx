import Link from "next/link";
import { getBlogPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

export default async function BlogPostList() {
  const posts = await getBlogPosts();

  return (
    <ul className="space-y-5">
      {posts.map((post) => (
        <li
          key={post.slug}
          className="border-b border-gray-200 last:border-b-0 pb-4"
        >
          <Link href={`/blog/${post.slug}`} className="group">
            <div className="flex items-center text-lg text-gray-500 mb-1">
              <span>{formatDate(post.firstPublished)}</span>
              <span className="mx-2">·</span>
              <span>{post.readTime} min read</span>
            </div>
            <h3 className="text-xl font-medium group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
