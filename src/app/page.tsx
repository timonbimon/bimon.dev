import Link from "next/link";
import RandomQuote from "@/components/random-quote";
import BlogPostList from "@/components/blog-post-list";
import InvestmentList from "@/components/investment-list";
import { getBlogPosts } from "@/lib/mdx";

export default async function HomePage() {
  const posts = await getBlogPosts();
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 md:px-12 flex justify-center">
        <div className="max-w-[70ch] w-full">
          <h1 className="text-4xl md:text-5xl font-normal leading-[1.3] mb-6">
            <span className="font-bold">Hi, I&apos;m </span>
            <Link
              href="https://www.linkedin.com/in/timon-ruban/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-bold"
            >
              Timon
            </Link>
            <span className="font-bold">. </span>
            <span>I co-founded </span>
            <Link
              href="https://luminovo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Luminovo
            </Link>{" "}
            <span>with </span>
            <Link
              href="https://www.linkedin.com/in/sebastian-schaal-luminovo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Seba
            </Link>{" "}
            <span>and lead our product and engineering teams.</span>
          </h1>
        </div>
      </section>

      {/* Quote Section */}
      <RandomQuote />

      {/* Reading Section */}
      <section className="pt-12 pb-4 px-6 md:px-12 flex justify-center">
        <div className="max-w-[70ch] w-full">
          <h2 className="text-4xl font-bold mb-5">Reading</h2>
          <p className="text-xl mb-4">
            I read a lot in my free time and post reviews of all books that I
            read. You can find them on my favorite social network{" "}
            <Link
              href="https://www.goodreads.com/user/show/82383663-timon-ruban"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              here
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Writing Section */}
      <section className="py-4 px-6 md:px-12 flex justify-center">
        <div className="max-w-[70ch] w-full">
          <h2 className="text-4xl font-bold mb-5">Writing</h2>
          <BlogPostList posts={posts} textSize="xl" />
        </div>
      </section>

      {/* Investments Section */}
      <section className="py-4 px-6 md:px-12 flex justify-center">
        <div className="max-w-[70ch] w-full">
          <h2 className="text-4xl font-bold mb-5">Investments</h2>
          <p className="text-xl mb-6">
            I invest 10–25 k EUR tickets into very early-stage startups.
            Preferably vertical AI-enabled software companies, because
            that&apos;s what I know best. I only invest in founders I like and
            respect to the degree that I would love to stay in touch with them
            even if their startup fails.
          </p>
          <InvestmentList />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-4 pb-24 px-6 md:px-12 flex justify-center">
        <div className="max-w-[70ch] w-full">
          <h2 className="text-4xl font-bold mb-5">Say&nbsp;hi</h2>
          <p className="text-xl">
            You can shoot me an email at&nbsp;
            <a
              href="mailto:timon@bimon.dev"
              className="text-blue-600 hover:text-blue-800"
            >
              timon@bimon.dev
            </a>{" "}
            anytime. I try to respond to all messages, especially if you
            follow&nbsp;
            <Link
              href="https://sriramk.com/coldemail"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              this advice
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
