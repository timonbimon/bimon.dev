# bimon.dev – Personal Site & Blog PRD

_(Next.js 15 · Node 22 LTS · Tailwind CSS · Vercel)_

---

## 0 · Overview

This document captures the goals, content, features, tech stack, and acceptance
criteria for **Timon Ruban’s** minimalist personal website.

Everything is written in **TypeScript** on **Next 15 App Router** and built /
served on **Node 22 LTS** (default on Vercel).

---

## 1 · Goals & KPIs

| Goal                                           | Success metric                                     |
| ---------------------------------------------- | -------------------------------------------------- |
| Site live at **bimon.dev**                     | Production deploy on Vercel by *T‑0*               |
| Effortless authoring                           | `yarn new:post` scaffolds an MDX draft             |
| Page‑view analytics not blocked by ad‑blockers | ≥ 95 % capture rate (Umami Cloud Hobby)            |
| Engagement                                     | Heart‑click p95 ≤ 150 ms; counts survive redeploys |

---

## 2 · Content Spec (as provided)

```text
Hi, I'm Timon. I co‑founded Luminovo and lead their product and engineering teams. (LinkedIn icon → https://www.linkedin.com/in/timon-ruban/)

Reading
  I read a lot in my free time and post reviews of all books that I read. You can find them on my favorite social network here → https://www.goodreads.com/user/show/82383663-timon-ruban.

Writing
  • Blog‑post list (date · title · “X min read”), sorted by date

Investments
  I invest 10-25k EUR tickets into very early stage startups. Preferably vertical AI-enabled software companies, because that's what I know best. I only invest in founders I like and respect to the degree that I would love to stay in touch with them even if their startup fails.
  • Gitpod   https://www.gitpod.io/
  • Lumos    https://www.lumos.com/
  • Pluno    https://pluno.ai/
  • Dataleap https://www.dataleap.ai/
  • Sluicebox https://www.sluicebox.ai/
  • Tendos   https://www.tendos.ai/
  • Tendara  https://tendara.ai/
  • Kuro     https://kuro.technology/
  • Chipflow https://www.chipflow.io/

Say hi
  You can shoot me an email at timon@bimon.dev anytime.
  I try to respond to all messages, especially if you follow this cold‑email advice:
  https://sriramk.com/coldemail
```

---

## 3 · Information Architecture

```
/
 ├─ page.tsx                     (home · SSG)
 ├─ /posts/[slug]/page.tsx       (blog · SSG + client fetch /likes)
 ├─ /api/likes/[slug]            (Edge Function · Upstash KV)
 ├─ /api/contact                 (Edge Function · hCaptcha ➜ Resend)
 ├─ /analytics/script.js         (rewrite ⇢ Umami)
 └─ /analytics/api               (rewrite ⇢ Umami)
```

---

## 4 · Functional Requirements

### 4.1 Homepage

Component order: **Intro → Reading → Writing → Investments → Say hi**.  
Writing list is generated at build‑time from MDX files using `reading-time`.

### 4.2 Blog post page

- **MDX** lives in `/content/posts` with front‑matter `title`, `date`,
  `readingTime`, `canonical`.
- **Custom side‑notes**

  - Footnotes in MDX (`[^1]`) are converted at build‑time to
    right‑floating “sidenotes” that visually match the reference screenshots
    from [`rehype‑sidenotes`](https://github.com/jrsinclair/rehype-sidenotes).
  - Implementation: bespoke **remark plugin** (`plugins/remarkSidenotes.ts`)
    that transforms `footnoteDefinition` nodes and injects:
    `aside.sidenote[id="sn‑x"]` plus corresponding superscript references
    `<sup class="sidenote-ref">`.
  - **Responsive fallback** < `md:` → sidenotes collapse into
    bottom‑of‑article footnotes to keep mobile readability.
  - Accessibility: each footnote link has `aria-describedby`, return links use
    `role="doc-backlink"`.

- **Heart button** calls `/api/likes/[slug]` (Upstash Redis free tier).  
  Uses `useOptimistic` for instant feedback.

- **Comments/contact** handled by the same contact form as homepage –
  hCaptcha checkbox; server action sends email via Resend API.

### 4.3 Analytics

Umami Cloud _Hobby_ plan  
(100 k events/mo · 3 sites · 6‑month retention).  
Next.js rewrite masks the tracker under `/analytics/*`.

---

## 5 · Non‑Functional Requirements

| Category          | Target                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| **Performance**   | CLS < 0.1 · LCP ≤ 2.5 s                                                                                      |
| **SEO**           | `next/metadata`, `next-sitemap`, dynamic OG images via Vercel OG API                                         |
| **Accessibility** | Lighthouse a11y ≥ 95                                                                                         |
| **Branding**      | Pastel slate `#f8fafc` background, ink‑blue text `#0f1d2e`; `inter` (body) + `gentium-book-basic` (headings) |
| **Logging**       | `console.error` only                                                                                         |

---

## 6 · Tech Stack

| Layer        | Choice / Notes                                         |
| ------------ | ------------------------------------------------------ |
| Runtime      | **Node 22 LTS** (≥ 22.15.0)                            |
| Framework    | **Next.js 15.3** (React 19, Turbopack)                 |
| Package mgr  | **Yarn 1.22.22**                                       |
| Styling      | Tailwind CSS + `@tailwind/typography`                  |
| MDX pipeline | `@next/mdx`, `gray-matter`, _custom_ `remarkSidenotes` |
| State        | Upstash Redis KV                                       |
| Email        | Resend API                                             |
| Captcha      | hCaptcha v2                                            |
| Analytics    | Umami Cloud Hobby                                      |
| Deploy       | Vercel (PR previews → main)                            |

---

## 7 · Package manifest (`package.json` excerpt)

```jsonc
{
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "new:post": "node scripts/new_post.mjs"
  },
  "engines": {
    "node": ">=22"
  },
  "dependencies": {
    "next": "15.3.1",
    "react": "19.0.0-canary",
    "react-dom": "19.0.0-canary",
    "gray-matter": "^4",
    "reading-time": "^1",
    "@tailwindcss/typography": "^0.5"
  }
}
```

---

## 8 · Next Config (`next.config.mjs`)

```js
/** @type {import('next').NextConfig} */
export default {
  async rewrites() {
    return [
      {
        source: "/analytics/script.js",
        destination: "https://analytics.umami.is/script.js",
      },
      {
        source: "/analytics/api/:path*",
        destination: "https://analytics.umami.is/api/:path*",
      },
    ];
  },
};
```

---

## 9 · README Commands

```bash
# develop
yarn dev

# static build & preview
yarn build
yarn start

# lint / type‑check
yarn lint
yarn typecheck

# scaffold a new blog post
yarn new:post "My Article Title"

# deploy (Vercel CLI)
npx vercel --prod
```

Environment variables (set in Vercel or `.env.local`):

```
NEXT_PUBLIC_UMAMI_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
HCAPTCHA_SECRET=•••
RESEND_API_KEY=•••
UPSTASH_REDIS_REST_URL=•••
UPSTASH_REDIS_REST_TOKEN=•••
```

---

## 10 · Acceptance Checklist

- `yarn dev` hot‑reloads MDX & side‑notes.
- Fresh clone + `yarn build && yarn start` succeeds without network.
- Side‑notes float right on ≥ `md` and degrade to footnotes on mobile.
- Heart counts persist across redeploys.
- Contact form returns 200 ms success / 400 bad captcha.
- Lighthouse scores ≥ 90 in Perf, SEO, BP, A11y.

---
