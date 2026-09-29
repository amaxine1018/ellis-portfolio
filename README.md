# Ellis Aguilar — Portfolio

Personal portfolio for Ellis Aguilar (Designer / product builder). Content-driven Next.js app: case study copy and media live under `content/case-studies/` so projects can be added without editing layout components.

Visual system and layouts map from Figma file **el-portfolio** (`b7pAyutl687lo5886wooVp`).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- shadcn/ui primitives
- Framer Motion (installed; animations only where the design needs them)
- Case studies as JSON under `content/case-studies/`

## Run locally

```bash
npm install
npm run dev
```

Dev server: port **43123** → [http://127.0.0.1:43123](http://127.0.0.1:43123)

```bash
npm run build
npm run start
npm run lint
```

## Project structure

| Path | Role |
|------|------|
| `app/page.tsx` | Landing (Figma `37:13`) |
| `app/work/[slug]/page.tsx` | Case study route (Figma `59:87`) |
| `content/case-studies/*.json` | Case study content |
| `lib/case-studies/` | Types + loaders |
| `components/case-study/` | Layout, sticky nav, sections |
| `components/site-header.tsx` | Shared header / logo / nav |
| `hooks/use-scroll-spy.ts` | Section highlight on scroll |
| `app/globals.css` | Figma Semantics + primitives as CSS variables |
| `public/assets/` | Local copies of Figma assets |

## Design tokens

Tokens are CSS variables in `app/globals.css`, sourced from Figma Semantics / primitives. Components use Tailwind theme aliases (`bg-bg-base`, `text-text-primary`, `bg-purple-50`, …) or `var(--…)` — **no hardcoded brand hex in components**.

Key mappings:

| Figma | CSS |
|-------|-----|
| `background-base` / `cream-50` | `--bg-base` |
| `text-primary` / `brown-800` | `--text-primary` |
| `text-secondary` / `navy-800` | `--text-secondary` |
| `text-accent` / `orange-200` | `--text-accent` |
| `text-inverse` | `--text-inverse` |
| Pill / card tones | `--pink-50`, `--orange-100`, `--green-200`, `--blue-100`, `--purple-50`, `--mint-50`, `--gold-200`, … |

Typography: **Averia Sans Libre** (display) + **Azeret Mono** (UI / body), loaded via `next/font/google`.

## Adding a case study

1. Add `content/case-studies/<slug>.json` matching `lib/case-studies/types.ts`.
2. Include `sections` with `id`, `label`, `title`, and optional `body` / `quote` / `mediaBlocks`. Set `nav: false` to hide a section from the sticky sidebar (e.g. Process).
3. Place images under `public/assets/` and reference paths in JSON.
4. Visit `/work/<slug>`.

## Figma sync

If Ellis updates Figma, provide the frame link → re-extract with design-to-code → update tokens/components to match.
