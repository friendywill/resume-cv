# Claude History

Record of prompts and responses per CLAUDE.md policy.

---

## 2026-04-24

### Prompt

> Have a look at all the files that I have added. After this, take a look at
> RESUME.md, and try to build a full-stack website based on this RESUME.md.
> Make sure to strictly follow CLAUDE.md, and ensure you take a read through
> all of the git commit history to get some more context. For some more
> context, I already have a website located at will.friendy.dev, or on
> github.com/friendywill/web, please ensure you look through both of these
> website for some more context. This website will eventually have the domain
> will.friendy.dev, so do not point to files by doing will.friendy.dev, just
> use local routes.

### Response summary

Explored all source files, git history, existing website (will.friendy.dev —
vanilla HTML/CSS static site), and GitHub repo (friendywill/web). Built the
following:

- Fixed `RESUME.md`: proper heading structure, local-route links, removed
  placeholder contact section.
- Updated `index.html`: title "William Friend — CV", meta description.
- Updated `src/styles.css`: Tailwind v4 + Typography plugin, CSS custom
  property design tokens, dark mode via `prefers-color-scheme`, print styles.
- Created `src/lib/resume.ts`: typed contact data (email, GitHub, PDF link)
  with `lucide-react` icons.
- Created `src/components/cv/CvHeader.tsx`: header with name, title, and
  contact icon links.
- Updated `src/routes/__root.tsx`: removed devtools from React tree (Vite
  plugin handles devtools in dev).
- Updated `src/routes/index.tsx`: imports `RESUME.md?raw`, parses with
  `marked`, renders via Tailwind Typography `prose` class.
- Added `marked@18` dependency.
