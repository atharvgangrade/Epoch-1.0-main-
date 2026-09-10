# Epoch 1.0 — Design Direction

## Three possible directions

### Theme Name: TVA Casefile Noir
Very dark, cinematic, and procedural: the landing page behaves like a classified timeline record from a prestige science-fiction title. Radioactive green traces the information path while amber appears only for intervention moments.

**Probability:** 0.03

### Theme Name: Signal Afterlight
A more atmospheric direction built around a glowing eclipse horizon, sparse particles, and editorial typography. The experience feels like a broadcast from a future archive: quieter, more poetic, and more image-led.

**Probability:** 0.08

### Theme Name: Reactor Floor
An industrial control-room language with harder grids, measurement ticks, and sharper amber/green status indicators. It is more technical and operational, emphasizing the hackathon as a controlled build sprint.

**Probability:** 0.06

## Chosen direction: TVA Casefile Noir

### Design Movement
Prestige science-fiction title design crossed with archival interface minimalism: a cinematic poster composition, restrained glass surfaces, and a procedural timeline that makes the page feel like a living case file.

### Core Principles
1. **Calm first, reveal second.** The default state is sparse and legible; hover, focus, and scroll progressively disclose depth.
2. **One flagship motion per viewport.** The hero owns the particle/eclipse moment, the timeline owns the trace animation, and the rest remains composed.
3. **Light behaves like information.** Green is reserved for active paths and primary action; amber marks mentorship, warnings, and transition.
4. **Asymmetry creates authority.** Sections use offset rails, split compositions, and uneven card weights rather than a repeated centered template.

### Color Philosophy
Near-black is the substrate: it gives the eclipse and text room to carry emotional weight. Radioactive green signals possibility, focus, and active computation, used as a line or glow rather than a flat fill. TVA amber is deliberately scarce; it indicates human intervention, mentorship, and decision points. Pale gold is a quiet reward color for the prize and outcome states.

### Layout Paradigm
A vertical case-file journey with a persistent left-side index rail on large screens. Content alternates between wide cinematic fields, offset two-column frames, and irregular bento clusters. The page reads as one continuous mission rather than a stack of isolated cards.

### Signature Elements
- A recurring eclipse ring with a fine green trace line.
- Small uppercase case labels, index numbers, and measurement-like metadata.
- Hairline borders, scanline/noise texture, and amber intervention marks.

### Interaction Philosophy
Interactions should feel like a system responding, not a toy performing. Hover states add a local glow and reveal the next layer of information. Clickable timeline nodes open precise detail drawers in place. Accordions remain collapsed until requested. Keyboard focus is visible and calm.

### Animation
Use low-amplitude drift for atmospheric layers, 180–260ms ease-out transitions for controls, and staggered scroll reveals for grouped content. The hero uses a restrained particle-like shimmer and slow eclipse breathing; tracks use cursor-following radial light; the timeline uses a single trace that progresses with scroll. All non-essential motion is disabled under `prefers-reduced-motion`.

### Typography System
Headings use **Space Grotesk** in heavy weights with tight tracking for a confident, engineered voice. Body copy uses **IBM Plex Sans** for readable technical prose. Metadata uses Space Grotesk with wide uppercase tracking. The hierarchy relies on scale and spacing rather than excessive weight changes.

### Brand Essence
**Epoch 1.0 is an 8-hour build mission for ambitious student teams turning real-world problems into working prototypes before the clock runs out.**

Personality: **cinematic, exacting, inventive**.

### Brand Voice
Headlines are declarative and compact. CTAs are verbs with consequence. Microcopy sounds like a mission control log, never like generic event marketing.

Example lines:
- “Build what survives the reset.”
- “A design review, not a break.”

### Wordmark & Logo
The wordmark is set in a custom-feeling compressed display treatment with a deliberate split through the “0”, echoing an eclipse crossing a temporal axis. The mark is a geometric green eclipse ring cut by a vertical line, paired with small amber orbital ticks.

### Signature Brand Color
**Radioactive Green — `#39FF6A`**. It is the active-state color of the brand: unmistakable against the near-black field, bright enough to feel energized, and disciplined enough to remain premium when used sparingly.

## Content and build decisions

The first delivery will prioritize the most important narrative beats from the specification: hero, vision, format stepper, tracks, mentorship, timeline, apply, prizes, evaluation, rules/FAQ, venue/countdown, and footer CTA. All factual numbers and dates will follow the supplied document exactly. The application remains frontend-only; the “Submit Your Abstract” CTA will be represented as an intentional external-action placeholder until the club supplies a submission URL.
