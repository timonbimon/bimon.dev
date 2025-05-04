import { useEffect } from "react";

export default function useFootnotePopovers() {
  useEffect(() => {
    const refs = document.querySelectorAll<HTMLAnchorElement>(
      'sup > a[href^="#user-content-fn-"]'
    );

    function toggle(e: MouseEvent) {
      e.preventDefault();
      const id = (e.currentTarget as HTMLAnchorElement).hash.slice(1);
      const note = document.getElementById(id);
      if (note) note.classList.toggle("!inline-block");
    }

    refs.forEach((r) => r.addEventListener("click", toggle));
    return () => refs.forEach((r) => r.removeEventListener("click", toggle));
  }, []);
}
