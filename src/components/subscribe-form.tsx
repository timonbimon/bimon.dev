"use client";
import { useState, useEffect } from "react";

export default function SubscribeForm({
  postTitle,
}: { postTitle?: string } = {}) {
  const [subscribe, setSubscribe] = useState(true);
  const [leaveMessage, setLeaveMessage] = useState(false);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<null | "success" | "error" | "loading">(
    null
  );
  const [generalError, setGeneralError] = useState("");

  let buttonLabel = "Subscribe";
  if (subscribe && leaveMessage) buttonLabel = "Subscribe & send message";
  else if (leaveMessage) buttonLabel = "Send message";
  else if (subscribe) buttonLabel = "Subscribe";

  const isDisabled = (!subscribe && !leaveMessage) || status === "loading";

  useEffect(() => {
    setStatus(null);
  }, [subscribe, leaveMessage]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setGeneralError("");
    setStatus("loading");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message: msg, subscribe, postTitle }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
        setMsg("");
        if (subscribe) setEmail("");
      } else {
        setStatus("error");
        if (data.error) {
          if (data.error.includes("Subscription and message failed")) {
            setGeneralError("Subscription and message failed.");
          } else if (data.error.includes("Subscription failed")) {
            setGeneralError("Subscription failed.");
          } else if (data.error.includes("Message failed")) {
            setGeneralError("Message failed.");
          } else {
            setGeneralError(data.error);
          }
        } else {
          setGeneralError("Something went wrong. Please try again.");
        }
      }
    } else {
      setStatus("error");
      setGeneralError("Something went wrong. Please try again.");
    }
  }

  return (
    <form className="my-8 max-w-xl mx-auto text-sm" onSubmit={handleSubmit}>
      <div className="flex items-center gap-6 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={subscribe}
            onChange={() => setSubscribe((v) => !v)}
            className="accent-blue-600"
          />
          Want to hear about new posts?
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={leaveMessage}
            onChange={() => setLeaveMessage((v) => !v)}
            className="accent-blue-600"
          />
          Leave a message?
        </label>
      </div>
      {(subscribe || leaveMessage) && (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              subscribe
                ? "your@email.com"
                : "your@email.com (optional but needed if you want a reply)"
            }
            className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required={subscribe}
          />
          {leaveMessage && (
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder='"You are all wrong..."'
              className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={4}
              required={leaveMessage}
            />
          )}
          <button
            type="submit"
            disabled={isDisabled || status === "success"}
            style={{ display: status === "success" ? "none" : undefined }}
            className={`px-4 py-2 rounded transition-colors ${
              isDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {status === "loading" ? "Sending..." : buttonLabel}
          </button>
        </>
      )}
      {status === "success" && (
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 inline text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <span className="text-green-600">
            {subscribe && leaveMessage
              ? "Sent & subscribed. Check your inbox."
              : subscribe
                ? "Subscribed. Check your inbox."
                : leaveMessage
                  ? "Sent."
                  : null}
          </span>
        </div>
      )}
      {status === "error" && generalError && (
        <div className="flex items-center gap-2 text-red-600 mt-2">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>
            {subscribe &&
            leaveMessage &&
            generalError === "Subscription failed."
              ? "Message sent, but subscription failed."
              : subscribe && leaveMessage && generalError === "Message failed."
                ? "Subscribed, but message failed."
                : generalError}
          </span>
        </div>
      )}
    </form>
  );
}
