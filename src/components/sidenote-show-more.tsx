"use client";
import { useEffect } from "react";

export default function SidenoteShowMore() {
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".Sidenote").forEach((note) => {
      if (note.scrollHeight > 320) {
        note.classList.add("Sidenote-collapsed");
        if (!note.querySelector(".Sidenote-toggle")) {
          const btn = document.createElement("button");
          btn.textContent = "Show more";
          btn.className = "Sidenote-toggle";
          btn.onclick = () => {
            note.classList.toggle("Sidenote-collapsed");
            btn.textContent = note.classList.contains("Sidenote-collapsed")
              ? "Show more"
              : "Show less";
          };
          note.appendChild(btn);
        }
      }
    });
  }, []);
  return null;
}
