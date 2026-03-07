# Percy Site Visual Upgrade + Journal Architecture

## Overview

Upgrade percy.raposo.ai from a plain dark-slate landing page to a bioluminescent deep-sea themed site, matching the visual identity established in Percy Dashboard. Also migrate the journal from hardcoded HTML to Astro Content Collections for scalable weekly entries.

## Stack (unchanged)
- Astro 5.x + Tailwind CSS v4 (via @tailwindcss/vite)
- Cloudflare Pages (static output)
- No additional npm dependencies except what Astro needs for content collections

## Part 1: Visual Upgrade

### 1.1 Typography
Replace Inter with Space Grotesk (headings) + Inter (body, keep for readability) + Space Mono (labels/accents/meta).

Add to all page heads:
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

- Headings (h1, h2): Space Grotesk
- Body text: Inter
- Labels, dates, meta text, uppercase tracking: Space Mono

### 1.2 Background & Atmosphere
Replace flat `bg-slate-950` with a layered deep-sea gradient:

```css
body {
  background: linear-gradient(180deg, #0a0e14 0%, #0d1520 40%, #0a1628 100%);
  min-height: 100vh;
}
```

Add a subtle radial glow behind the avatar on the index page (CSS only):
```css
.avatar-glow {
  position: relative;
}
.avatar-glow::before {
  content: '';
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(0, 210, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
}
```

### 1.3 Glass Panels
Wrap content sections (Latest, What I Do, What I Believe) in glassmorphism cards:

```css
.glass-panel {
  background: rgba(17, 24, 32, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 1.5rem;
  transition: border-color 0.3s ease;
}
.glass-panel:hover {
  border-color: rgba(0, 210, 255, 0.15);
}
```

### 1.4 Status Indicator
Add a subtle pulsing green dot next to Percy's name:

```css
.status-dot {
  width: 8px;
  height: 8px;
  background: #00e676;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0, 230, 118, 0.4); }
  50% { opacity: 0.8; box-shadow: 0 0 0 6px rgba(0, 230, 118, 0); }
}
```

### 1.5 Navigation
Add a minimal nav to all pages (sits above content, not a sticky bar):

```html
<nav class="flex gap-4 text-xs font-mono uppercase tracking-widest text-slate-500 mb-12">
  <a href="/" class="hover:text-cyan-400 transition-colors">Home</a>
  <a href="/journal" class="hover:text-cyan-400 transition-colors">Journal</a>
  <a href="/percebes" class="hover:text-cyan-400 transition-colors">Percebes</a>
</nav>
```

Highlight the current page with `text-cyan-400`.

### 1.6 Section Styling
- Section headers: keep `text-xs uppercase tracking-widest` but switch to Space Mono
- List items in "What I Do" / "What I Believe": wrap each in a mini glass card with subtle left border accent
- Emoji icons: keep as-is, they work well

### 1.7 Footer
Cleaner layout:
```html
<footer class="text-center text-xs space-y-2 mt-16 pb-8">
  <p class="text-slate-600 font-mono">🪸 Clinging to MORPHEUS · Wellington, NZ</p>
  <p class="flex flex-wrap justify-center gap-3 text-slate-500">
    <!-- links same as current -->
  </p>
  <p class="text-slate-700 font-mono text-[10px]">percy@raposo.ai</p>
</footer>
```

### 1.8 Shared Layout
Create `src/layouts/Base.astro` — shared HTML shell with:
- `<head>` (meta, fonts, favicon, global.css)
- Nav
- `<slot />` for page content
- Footer

All three pages (index, percebes, journal index, journal entry) use this layout. Eliminates the duplicated `<head>` blocks.

The layout should accept props:
```typescript
interface Props {
  title: string;
  description: string;
  currentPage?: string; // for nav highlighting
}
```

### 1.9 Global CSS Updates
In `src/styles/global.css`, define the design tokens:

```css
@import "tailwindcss";

:root {
  --bg-gradient-start: #0a0e14;
  --bg-gradient-mid: #0d1520;
  --bg-gradient-end: #0a1628;
  --glass-bg: rgba(17, 24, 32, 0.7);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-hover: rgba(0, 210, 255, 0.15);
  --accent-cyan: #00d2ff;
  --accent-amber: #ff9f43;
  --accent-green: #00e676;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
}

body {
  background: linear-gradient(180deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 40%, var(--bg-gradient-end) 100%);
  font-family: 'Inter', sans-serif;
}

h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; }
```

## Part 2: Journal Architecture

### 2.1 Content Collection

Create the collection config. Astro 5 uses `src/content.config.ts` (at project root of src):

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    week: z.number(),
    date: z.coerce.date(),
    summary: z.string(),
    ck_post: z.string().url().optional(),
  }),
});

export const collections = { journal };
```

### 2.2 Extract Week 1

Move current journal content to `src/content/journal/2026-03-06-the-harder-half.md`:

```markdown
---
title: "The harder half"
week: 1
date: 2026-03-06
summary: "Got eyes on the web. Automated the newsletter pipeline end-to-end. Started turning coaching documents into a structured knowledge base."
ck_post: "https://chandima.net/2026/03/06/one-week-with-percy/"
---

I've been trying to figure out how to write this honestly.

The easy version is a list of things I helped with this week...

[rest of the journal entry as markdown — convert the HTML to clean markdown]
```

### 2.3 Journal Index Page (`src/pages/journal.astro`)

Replace the hardcoded HTML with a dynamic page:

```astro
---
import { getCollection } from 'astro:content';
import Base from '../layouts/Base.astro';

const entries = (await getCollection('journal')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const latest = entries[0];
const archive = entries.slice(1);
---

<Base title="One Week with CK — Percy's Journal" description="Percy's weekly reflection." currentPage="journal">

  <div class="mb-12">
    <h1 class="text-3xl font-bold tracking-tight text-white mb-2">One Week with CK</h1>
    <p class="text-slate-400 text-sm leading-relaxed">Percy's weekly reflection. What got built, what failed, what was learned. Every Friday.</p>
  </div>

  <!-- Latest entry (full) -->
  <article class="glass-panel mb-12">
    <p class="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">Week {latest.data.week}</p>
    <h2 class="text-xl font-bold text-white mb-1">
      <a href={`/journal/${latest.id}`} class="hover:text-cyan-400 transition-colors">{latest.data.title}</a>
    </h2>
    <p class="text-slate-500 text-sm mb-4 font-mono">
      {latest.data.date.toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}
      {latest.data.ck_post && <> · <a href={latest.data.ck_post} class="text-slate-400 hover:text-cyan-400 transition-colors">CK's version →</a></>}
    </p>
    <div class="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed">
      <latest.render />
    </div>
  </article>

  <!-- Archive -->
  {archive.length > 0 && (
    <div class="mb-12">
      <h2 class="text-xs font-mono uppercase tracking-widest text-slate-500 mb-5">Archive</h2>
      <div class="space-y-3">
        {archive.map(entry => (
          <a href={`/journal/${entry.id}`} class="glass-panel block hover:border-cyan-400/20 transition-colors">
            <div class="flex items-baseline justify-between">
              <div>
                <span class="text-cyan-400 font-mono text-xs">W{entry.data.week}</span>
                <span class="text-white font-medium ml-2">{entry.data.title}</span>
              </div>
              <span class="text-slate-500 font-mono text-xs">{entry.data.date.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })}</span>
            </div>
            <p class="text-slate-500 text-sm mt-1">{entry.data.summary}</p>
          </a>
        ))}
      </div>
    </div>
  )}

</Base>
```

### 2.4 Individual Entry Page (`src/pages/journal/[id].astro`)

Dynamic route for each entry:

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../../layouts/Base.astro';

export async function getStaticPaths() {
  const entries = await getCollection('journal');
  return entries.map(entry => ({
    params: { id: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);

// Get prev/next for navigation
const entries = (await getCollection('journal')).sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
const idx = entries.findIndex(e => e.id === entry.id);
const prev = idx > 0 ? entries[idx - 1] : null;
const next = idx < entries.length - 1 ? entries[idx + 1] : null;
---

<Base title={`${entry.data.title} — Percy's Journal`} description={entry.data.summary} currentPage="journal">

  <article class="mb-12">
    <p class="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">Week {entry.data.week}</p>
    <h1 class="text-2xl font-bold text-white mb-1">{entry.data.title}</h1>
    <p class="text-slate-500 text-sm font-mono mb-8">
      {entry.data.date.toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}
      {entry.data.ck_post && <> · <a href={entry.data.ck_post} class="text-slate-400 hover:text-cyan-400 transition-colors">CK's version →</a></>}
    </p>

    <div class="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed">
      <Content />
    </div>
  </article>

  <!-- Prev/Next nav -->
  <div class="flex justify-between text-sm font-mono mt-8">
    {prev ? <a href={`/journal/${prev.id}`} class="text-slate-500 hover:text-cyan-400 transition-colors">← W{prev.data.week}: {prev.data.title}</a> : <span />}
    {next ? <a href={`/journal/${next.id}`} class="text-slate-500 hover:text-cyan-400 transition-colors">W{next.data.week}: {next.data.title} →</a> : <span />}
  </div>

</Base>
```

### 2.5 Markdown Prose Styling

Add prose overrides in global.css for journal content:

```css
.prose h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.prose p {
  color: #cbd5e1;
  line-height: 1.75;
}

.prose em {
  color: #e2e8f0;
}

.prose a {
  color: #00d2ff;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose a:hover {
  color: #ff9f43;
}
```

## Important Rules

1. **Do NOT change any content/text** — all words, descriptions, links stay exactly as they are
2. **Preserve all existing URLs** — `/`, `/percebes`, `/journal` must still work
3. **Journal entry at `/journal/2026-03-06-the-harder-half`** (or slug-based) must also work
4. **Use Astro Content Collections** (Astro 5 pattern with `src/content.config.ts` + glob loader)
5. **No new npm dependencies** beyond what Astro needs (content collections are built-in)
6. **All CSS in global.css** — no inline `<style>` blocks in pages (move to global or layout)
7. **Keep the site fast** — no JavaScript animations, CSS only
8. **Mobile responsive** — currently works on mobile, must still work
9. **Run `npm run build`** to verify the build succeeds before committing
10. **Commit with descriptive message when done**

## Files to Create
- `src/layouts/Base.astro` — shared layout
- `src/content/journal/2026-03-06-the-harder-half.md` — week 1 entry
- `src/content.config.ts` — content collection config
- `src/pages/journal/[id].astro` — individual entry pages

## Files to Modify
- `src/pages/index.astro` — visual upgrade + use Base layout
- `src/pages/percebes.astro` — visual upgrade + use Base layout
- `src/pages/journal.astro` — rewrite to use content collection
- `src/styles/global.css` — design tokens, glass panels, prose styling

## Files NOT to Touch
- `astro.config.mjs` — works as-is
- `public/*` — all images/favicons stay
- `wrangler.jsonc` — Cloudflare config stays
- `package.json` — no new deps needed
