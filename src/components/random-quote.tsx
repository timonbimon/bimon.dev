"use client";

import { useState, useEffect, useRef } from "react";
import type { Quote } from "@/content/types";
import { quotes } from "@/content/quotes";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function RandomQuote() {
  const [shuffledQuotes, setShuffledQuotes] = useState<Quote[]>([]);
  const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [height, setHeight] = useState<number | null>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShuffledQuotes(shuffleArray(quotes));
    setIndex(0);
  }, []);

  const nextQuote = () => {
    if (shuffledQuotes.length === 0) return;
    if (contentRef.current) {
      setHeight(contentRef.current.offsetHeight);
    }
    setFadeIn(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % shuffledQuotes.length);
      setFadeIn(true);
    }, 500);
  };

  const quote = shuffledQuotes[index];

  useEffect(() => {
    if (contentRef.current && quote) {
      setTimeout(() => {
        setHeight(contentRef.current!.offsetHeight);
      }, 50);
    }
  }, [quote]);

  return (
    <section
      className="border-2 border-blue-500 bg-[#F0F4F8] cursor-pointer transition-all hover:opacity-90 active:opacity-75"
      onClick={nextQuote}
      role="button"
      aria-label="Click to see another quote"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          nextQuote();
        }
      }}
      ref={quoteRef}
    >
      <div className="max-w-2xl mx-auto px-6 md:px-12 md:pr-18 py-12">
        <div
          className="overflow-hidden transition-height duration-500 ease-in-out"
          style={{ height: height ? `${height}px` : "auto" }}
        >
          <div
            ref={contentRef}
            className={`transition-opacity duration-500 ${
              fadeIn ? "opacity-100" : "opacity-0"
            } quote-animation`}
          >
            {quote && (
              <blockquote className="text-xl md:text-2xl italic font-normal text-gray-700 quote-text whitespace-pre-wrap">
                {quote.text}
                <footer className="text-right mt-4 flex flex-col items-end">
                  <cite className="text-lg text-gray-600 not-italic">
                    — {quote.author}
                  </cite>
                  {quote.context &&
                    (quote.url ? (
                      <a
                        href={quote.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-blue-600 hover:text-blue-800 mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {quote.context}
                      </a>
                    ) : (
                      <span className="text-lg text-gray-500 mt-1">
                        {quote.context}
                      </span>
                    ))}
                </footer>
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
