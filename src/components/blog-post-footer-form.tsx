"use client";
import { useState } from "react";

export default function BlogPostFooterForm({
  postTitle,
}: {
  postTitle: string;
}) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "success" | "error" | "loading">(
    null
  );
  const [emailError, setEmailError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    // Basic email validation
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      setStatus(null);
      return;
    }
    setStatus("loading");
    const res = await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, email, postTitle }),
    });
    if (res.ok) {
      setStatus("success");
      setMessage("");
      setEmail("");
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="my-8 max-w-xl mx-auto text-sm">
      <label className="block mb-2 font-medium" htmlFor="blog-message">
        Leave a message
      </label>
      <textarea
        id="blog-message"
        className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
        rows={4}
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message..."
      />
      <label className="block mb-2 font-medium" htmlFor="blog-email">
        Your email
      </label>
      <input
        id="blog-email"
        type="email"
        className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com (optional but needed if you want a reply)"
      />
      {emailError && <p className="text-red-600 mb-2">{emailError}</p>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
        disabled={status === "loading" || status === "success"}
        style={{ display: status === "success" ? "none" : undefined }}
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
      {status === "success" && (
        <div className="flex items-center gap-2 text-green-600 mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <span>Message sent.</span>
        </div>
      )}
      {status === "error" && (
        <p className="text-red-600 mt-2">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
