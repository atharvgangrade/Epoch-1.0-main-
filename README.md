# EPOCH 1.0 — Landing Page

> **"Ideas Outlive Apocalypses"**
> An 8-hour hackathon by **CodeAI Club × K. J. Somaiya Institute of Technology**, happening **03 October 2026** at the Ayurvihar Campus, Mumbai.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Design System](#design-system)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Pages & Sections](#pages--sections)
7. [Key Components](#key-components)
8. [Scroll-to-Play Video Engine](#scroll-to-play-video-engine)
9. [Animation Architecture](#animation-architecture)
10. [Typography](#typography)
11. [Getting Started](#getting-started)
12. [Available Scripts](#available-scripts)
13. [Environment Variables](#environment-variables)
14. [Build & Deployment](#build--deployment)
15. [Configuration](#configuration)
16. [Browser Support](#browser-support)
17. [Accessibility](#accessibility)

---

## Project Overview

Epoch 1.0 is a **cinematic, single-page hackathon landing page** built with React 19, Vite 7, and a custom vanilla CSS design system. The page immerses visitors in a prestige sci-fi "TVA Casefile Noir" aesthetic — near-black substrate, radioactive-green activity traces, and scarce amber highlights — to reflect the high-stakes, mission-critical tone of the event.

The centrepiece of the experience is a **fullscreen scroll-driven video hero**: scrolling down plays the video forward at a constant speed; scrolling up plays it in reverse; stopping scroll gently pauses it. This is followed by a rich set of page sections covering the event overview, tracks, timeline, prizes, rules, venue, FAQ, and a footer CTA.

---

## Design System

### Theme — TVA Casefile Noir

Inspired by prestige science-fiction title design crossed with archival interface minimalism. The page behaves like a classified timeline record.

| Token | Value | Purpose |
|---|---|---|
| `--c-bg` | `#050705` | Near-black substrate |
| `--c-green` | `#39FF6A` / `#3dff8a` | Radioactive green — active paths, primary actions |
| `--c-amber` | `#F59E0B` | Scarce amber — mentorship, warnings, transitions |
| `--c-text` | `#E8EDE9` | Primary text |
| `--c-muted` | `#6B7A6D` | Muted labels and metadata |
| `--c-surface` | `#0D110D` | Card/panel surface |
| `--c-border` | `#1E2620` | Hairline borders |

### Core Design Principles

1. **Calm first, reveal second** — default state is sparse; hover/focus/scroll disclose depth progressively.
2. **One flagship motion per viewport** — hero owns the video/eclipse moment; timeline owns the trace animation.
3. **Light behaves like information** — green = active/primary; amber = human intervention/mentorship.
4. **Asymmetry creates authority** — offset rails, split compositions, uneven card weights.

---

## Features

- Scroll-to-play video hero — constant-speed forward/reverse playback driven by scroll direction, with smooth playbackRate ramping (no abrupt start/stop).
- Cinematic preloader — animated progress bar with live status messages before the experience starts.
- GSAP ScrollTrigger settle zone — logo reveal, background darkening, and title card animation triggered after the video completes.
- Scroll reveal animations — IntersectionObserver-based staggered reveals on every section.
- Interactive embedded map — Google Maps venue section.
- Fully responsive — mobile-first layout with a hamburger nav on small screens.
- Reduced-motion support — all animations and video scrub respect prefers-reduced-motion.
- Live countdown timer — counts down to the event date.
- Glassmorphism cards — frosted-glass surfaces with backdrop-filter blur.
- Parallax cursor tracking — hero eclipse art follows the mouse.
- Scanline / grain textures — subtle CSS noise overlays for the cinematic feel.

---

## Tech Stack

### Frontend

| Package | Version | Role |
|---|---|---|
| React | 19.2 | UI framework |
| TypeScript | 5.6.3 | Type safety |
| Vite | 7.1 | Build tool & dev server |
| Wouter | 3.3 | Client-side routing |
| Framer Motion | 12.x | Supplemental animations |
| Lucide React | 0.453 | Icon set |
| Tailwind CSS | 4.x | Utility classes |
| Radix UI | various | Accessible headless UI primitives |
| React Hook Form | 7.x | Form handling |
| Zod | 4.x | Schema validation |
| Recharts | 2.x | Data visualisation |
| Embla Carousel | 8.x | Carousel component |
| Sonner | 2.x | Toast notifications |
| clsx + tailwind-merge | latest | Class merging utilities |

### Animation / Scroll (CDN-loaded via index.html)

| Library | Version | Role |
|---|---|---|
| GSAP | 3.12.5 | Core animation engine |
| GSAP ScrollTrigger | 3.12.5 | Scroll-position-driven timeline animations |
| Lenis | 1.1.20 | Smooth scroll momentum |

### Backend (Production server)

| Package | Version | Role |
|---|---|---|
| Express | 4.x | Static file server & SPA fallback |
| esbuild | 0.25 | Bundles server/index.ts for production |

### Dev Tools

| Tool | Role |
|---|---|
| pnpm 10 | Package manager |
| Prettier | Code formatting |
| Vitest | Unit testing |

---

## Project Structure

```
epoch1.0-main/
+-- client/                        # Frontend application root
¦   +-- index.html                 # HTML shell (loads GSAP, Lenis, Google Fonts via CDN)
¦   +-- public/                    # Static assets served at /
¦   ¦   +-- video-intro.mp4        # Fullscreen hero video (~23 MB)
¦   ¦   +-- assets/
¦   ¦   ¦   +-- epoch-1/
¦   ¦   ¦       +-- epoch-logo.png             # Epoch 1.0 wordmark (settle zone)
¦   ¦   ¦       +-- epoch-mark-v2.png          # Small eclipse mark
¦   ¦   ¦       +-- epoch-hero-eclipse.png     # Hero background eclipse art
¦   ¦   ¦       +-- epoch-track-atmosphere-v2.png
¦   ¦   ¦       +-- epoch-timeline-dusk-v2.png
¦   ¦   ¦       +-- epoch-footer-eclipse-v2.png
¦   ¦   +-- images/
¦   ¦       +-- codeai-logo-white.png
¦   ¦       +-- somaiya-logo.png
¦   +-- src/
¦       +-- main.tsx               # React entry point
¦       +-- App.tsx                # Router setup (Wouter)
¦       +-- index.css              # Full design system (~75 KB, vanilla CSS)
¦       +-- const.ts               # Shared frontend constants
¦       +-- components/
¦       ¦   +-- VideoHero.tsx      # Scroll-to-play video engine + preloader
¦       ¦   +-- Header.tsx         # Sticky nav with active-section tracking
¦       ¦   +-- Footer.tsx         # Footer CTA + social links
¦       ¦   +-- Map.tsx            # Google Maps venue embed
¦       ¦   +-- ErrorBoundary.tsx  # React error boundary
¦       ¦   +-- ManusDialog.tsx    # Internal debug dialog
¦       ¦   +-- CustomSocialIcons.tsx
¦       ¦   +-- ui/                # Radix UI-based primitive components
¦       +-- pages/
¦       ¦   +-- Home.tsx           # Full page composition (all sections)
¦       ¦   +-- NotFound.tsx       # 404 page
¦       +-- contexts/
¦       ¦   +-- ThemeContext.tsx   # Dark/light theme context
¦       +-- hooks/
¦       ¦   +-- useComposition.ts  # Composition utilities
¦       ¦   +-- useMobile.tsx      # Mobile breakpoint detection
¦       ¦   +-- usePersistFn.ts    # Stable function reference hook
¦       +-- lib/
¦           +-- utils.ts           # cn() class merge helper
+-- server/
¦   +-- index.ts                   # Express production server
+-- shared/
¦   +-- const.ts                   # Constants shared between client and server
+-- vite.config.ts                 # Vite config (aliases, plugins, build output)
+-- tsconfig.json                  # TypeScript config
+-- package.json                   # Dependencies & npm scripts
+-- pnpm-lock.yaml                 # pnpm lockfile
+-- .prettierrc                    # Prettier config
+-- ideas.md                       # Original design direction document
```

---

## Pages & Sections

The site is a single page (`Home.tsx`) with these sections in order:

| # | Section ID | Description |
|---|---|---|
| — | *(fullscreen)* | VideoHero — scroll-driven video intro + preloader + GSAP settle zone |
| — | `#top` | Hero — eclipse art, event facts, CTA buttons |
| 01 | `#vision` | Vision / Overview — event overview and format stepper |
| 02 | `#tracks` | Tracks — 6 hackathon tracks with icons |
| — | *(between)* | Mentors — mentor profiles and mentorship format |
| 03 | `#timeline` | Timeline — event-day schedule with trace animation |
| 04 | `#prizes` | Prizes — prize pool breakdown (?30,000) |
| 05 | `#rules` | Rules — eligibility, rules, evaluation criteria |
| 06 | `#venue` | Venue — location details, Google Maps embed, countdown |
| — | `#apply` | Apply — abstract submission CTA |
| 07 | `#faq` | FAQ — accordion |
| — | — | Footer — social links, credits |

### Nav items

```
01 OVERVIEW   ?  #vision
02 TRACKS     ?  #tracks
03 TIMELINE   ?  #timeline
04 PRIZES     ?  #prizes
05 RULES      ?  #rules
06 VENUE      ?  #venue
07 FAQ        ?  #faq
```

---

## Key Components

### VideoHero.tsx

The most complex component. Handles:

1. **Preloader** — animated 0–100% progress bar with five status messages.
2. **Scroll-to-play video engine** — constant-speed forward/reverse playback via wheel events.
3. **GSAP ScrollTrigger animations** — pins the section for 405 virtual-scroll units (320 video + 85 settle zone), drives overlay fades and logo reveal.

### Header.tsx

- Sticky header with glassmorphism blur on scroll.
- Active-section tracking via scroll position.
- Responsive hamburger menu on mobile.
- Dual branding: CodeAI logo + K J Somaiya logo.

### Footer.tsx

Social links (Instagram, GitHub, LinkedIn, Linktree), back-to-top, and credit line.

### Map.tsx

Google Maps iframe embed for the Ayurvihar Campus.

### ErrorBoundary.tsx

React class-based error boundary wrapping the entire app.

---

## Scroll-to-Play Video Engine

The video hero uses a **constant-speed play/pause/reverse** model. Scroll position drives overlay animations via GSAP, but the video itself is driven by `playbackRate` and a `requestAnimationFrame` loop.

### Flow

```
User scrolls DOWN  ?  video.play() + playbackRate ramps 0 ? 1 in 80ms
User scrolls UP    ?  video.pause() + rAF loop decrements currentTime at rate 1
User stops scroll  ?  debounce fires (120ms) ? playbackRate ramps 1 ? 0 ? video.pause()
```

### Tuning Constants

All feel parameters live at the top of `VideoHero.tsx` for easy adjustment:

```ts
const SCROLL_STOP_DEBOUNCE_MS = 120; // ms of silence ? "stopped"
const PLAYBACK_RATE_TARGET    = 1.0; // constant forward/reverse speed
const DELTA_THRESHOLD         = 2.5; // ignore deltaY < this (trackpad noise)
const RAMP_UP_MS              = 80;  // 0 ? 1 ease on scroll start
const RAMP_DOWN_MS            = 120; // 1 ? 0 ease on scroll stop
```

| Constant | Raise if... | Lower if... |
|---|---|---|
| `SCROLL_STOP_DEBOUNCE_MS` | Pause feels too quick / flickery | Pause feels laggy after stopping |
| `RAMP_UP_MS` | Start feels too sudden | Start feels sluggish |
| `RAMP_DOWN_MS` | Stop feels abrupt | Stop feels too slow |
| `DELTA_THRESHOLD` | Trackpad still causes jitter | Direction feels unresponsive |

### Six Refinements Applied

| # | Refinement | Implementation |
|---|---|---|
| 1 | Smooth pause & start | GSAP tweens `video.playbackRate` — `power1.out` ramp-up, `power1.in` ramp-down |
| 2 | Debounce tuning | 120ms `setTimeout`, reset on every valid wheel event |
| 3 | Rapid direction changes | `killRateTween()` called before any new direction tween; no conflicting tweens |
| 4 | Delta normalization | `if (|deltaY| < 2.5) return` — filters trackpad momentum noise before any logic |
| 5 | Frame-accurate reverse | `currentTime -= (deltaTime / 1000) * reverseRate` — real timestamps, not fixed 60fps |
| 6 | Edge cases | Reverse at `currentTime=0` clamps and stops; at `duration` hands off to settle zone |

### GSAP Settle Zone

After the video completes, a GSAP ScrollTrigger timeline drives (all positional — driven by scroll progress):

- Overlay scrim darkens.
- `presentsCard` fades in.
- `presentsTitleWrap` (logo) rises and scales from `y:70, scale:0.94` to resting position.
- Horizon arc + glow animate to `autoAlpha: 0.85`.
- The card group exits (fade up + scale) at the end of the settle zone.

---

## Animation Architecture

Three independent animation layers work in parallel:

```
Layer 1: GSAP ScrollTrigger  (scroll-position-driven)
  Drives: overlay fades, scrim, logo reveal, scroll-prompt opacity
  Scrub: 0.5 (smooth lag behind scroll)
  Pin: section is pinned for 405vh of scroll

Layer 2: playbackRate wheel engine  (real-time-driven)
  Drives: video.currentTime via play/pause/rAF loop
  Triggered by: wheel events on window

Layer 3: IntersectionObserver reveals  (viewport-driven)
  Drives: .reveal ? .is-visible CSS class on all page sections
  Threshold: 16%
```

### Lenis Smooth Scroll

Lenis intercepts wheel events for smooth momentum. It integrates with GSAP by calling `ScrollTrigger.update` on every scroll event, keeping positional animations in sync.

---

## Typography

Three typefaces loaded from Google Fonts:

| Typeface | Weights | Role |
|---|---|---|
| **Space Grotesk** | 400, 500, 600, 700 | Headings, metadata, labels, nav |
| **IBM Plex Sans** | 400, 500, 600 | Body copy, descriptions |
| **JetBrains Mono** | 400, 500, 600, 700 | Code-style labels, case numbers |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 10 (recommended) or npm/yarn

### Installation

```bash
git clone <repo-url>
cd epoch1.0-main

pnpm install
# or: npm install
```

### Run the development server

```bash
pnpm dev
# or: npm run dev
```

Opens at **http://localhost:3000** (auto-increments port if busy).  
The `video-intro.mp4` (~23 MB) is fetched on first load; the preloader waits for metadata before completing.

---

## Available Scripts

```bash
pnpm dev        # Vite dev server with HMR (--host for network access)
pnpm build      # Build client (Vite) + bundle server (esbuild) ? dist/
pnpm start      # Run Express production server (NODE_ENV=production)
pnpm preview    # Preview the production build locally
pnpm check      # TypeScript type-check (tsc --noEmit)
pnpm format     # Format all files with Prettier
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Analytics — Umami (optional, safe to omit locally)
VITE_ANALYTICS_ENDPOINT=https://your-umami-instance.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Storage proxy — internal tooling, not required locally
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
```

> `VITE_` prefixed variables are inlined into the client bundle at build time. Never store secrets in `VITE_` variables.

---

## Build & Deployment

### Production build

```bash
pnpm build
```

Runs two steps:
1. **Vite** builds the client ? `dist/public/`
2. **esbuild** bundles `server/index.ts` ? `dist/index.js`

### Run in production

```bash
NODE_ENV=production node dist/index.js
```

The Express server:
- Serves static files from `dist/public/`
- Falls back to `index.html` for all routes (SPA routing)
- Listens on `process.env.PORT` (default `3000`)

### Base path

In production the Vite base is `/epoch1.0/` (see `vite.config.ts`). Adjust if deploying to a different sub-path.

---

## Configuration

### `vite.config.ts`

| Setting | Value | Note |
|---|---|---|
| `root` | `client/` | Vite project root |
| `build.outDir` | `dist/public` | Output directory |
| `base` | `/epoch1.0/` (prod) / `/` (dev) | Public URL base |
| `server.port` | `3000` | Dev port (auto-increments) |
| `server.host` | `true` | Bind to all interfaces |

Path aliases:

| Alias | Resolves to |
|---|---|
| `@` | `client/src/` |
| `@shared` | `shared/` |
| `@assets` | `attached_assets/` |

### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## Browser Support

| Browser | Status |
|---|---|
| Chrome / Edge (Chromium) | Full support |
| Firefox | Full support |
| Safari (macOS / iOS) | Full support (video uses `muted` + `playsInline` for autoplay) |
| Mobile browsers | Responsive layout; scroll-to-play works via touch |

---

## Accessibility

- Semantic HTML5 elements (`<header>`, `<section>`, `<nav>`, `<footer>`)
- `aria-label` on interactive and decorative elements
- `aria-hidden="true"` on decorative SVG/video elements
- `aria-live="polite"` on the preloader
- Visible keyboard focus styles
- All interactive elements have unique, descriptive IDs
- Colour contrast meets WCAG AA for body text on dark backgrounds
- Radix UI primitives provide accessible keyboard handling for accordions, dialogs, and dropdowns
- All motion disabled under `prefers-reduced-motion: reduce`

---

## Event Details

| | |
|---|---|
| **Event** | Epoch 1.0 |
| **Tagline** | Ideas Outlive Apocalypses |
| **Organiser** | CodeAI Club × K. J. Somaiya Institute of Technology |
| **Date** | 03 October 2026 |
| **Venue** | Ayurvihar Campus, Mumbai |
| **Duration** | 8 hours |
| **Prize pool** | ?30,000 |
| **Format** | Coding Round 1 (4h) ? Mentorship (30min) ? Coding Round 2 (3h) ? Demo |
| **Tracks** | AI/ML, Web3, Sustainability, HealthTech, EdTech, Open Innovation |

---

## License

MIT © CodeAI Club, K. J. Somaiya Institute of Technology
