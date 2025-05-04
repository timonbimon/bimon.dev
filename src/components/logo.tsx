import Link from "next/link";

export default function Logo() {
  return (
    <nav className="mt-4 mb-2">
      <Link
        href="/"
        className="text-xl font-bold tracking-tight text-blue-700 hover:text-blue-900 transition-colors"
        aria-label="Go to homepage"
      >
        bimon.dev
      </Link>
    </nav>
  );
}
