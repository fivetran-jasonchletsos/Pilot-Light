# Pilot Light

**TV Series curated by Jason Chletsos.**

> The pilot is the spark; everything that follows is the burn.

Pilot Light is a curated rail of television worth your time — procedural to prestige, broadcast to streaming. Each entry is a one-line editorial note, an "essential season" or "essential episode" where it applies, and the metadata that lets you find a show by mood, era, network, or runtime.

Live: https://fivetran-jasonchletsos.github.io/Pilot-Light/

## Stack

- Next.js 14 (App Router, static export to GitHub Pages)
- Tailwind CSS with a late-night-broadcast palette (near-black ink, low-saturation amber, JetBrains Mono headings + Fraunces body)
- TypeScript

## Layout

- `/` — The Rail (the full catalog with sort + filter)
- `/series/[slug]` — show detail page
- `/showrunners` — career arcs across multiple series *(in progress)*
- `/seasons` — season heatmap *(in progress)*
- `/eras` — three theses on the last 25 years of TV *(in progress)*
- `/tonight` — three-question matcher for what to watch *(in progress)*
- `/weekend` — six-hour curated short binge *(in progress)*
- `/pilots` — first-episode wall *(in progress)*
- `/stats` — the rail counted *(in progress)*

## Local dev

```bash
cd pilot-light-app
npm install
npm run dev
```

## Build for GitHub Pages

```bash
NEXT_PUBLIC_BASE_PATH=/Pilot-Light npm run build
# out/ is ready to push to a gh-pages branch
```
