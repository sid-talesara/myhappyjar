# My Happy Jar — Design Principles

> Binding document for all design agents. Non-negotiable rules are at the bottom. Read everything before touching a frame.

---

## 1. Anti-Patterns — What "Generic AI Design" Looks Like

Avoid every item below. Each one signals "made by a prompt, not a person."

1. **Pastel purple-to-pink gradient hero** — the default palette of every AI-generated landing page since 2022. Instantly signals template.
2. **Glassmorphism panels everywhere** — frosted-glass cards stacked on frosted-glass backgrounds. Looks cool for 10 minutes, reads as Figma plugin abuse.
3. **Emoji as UI chrome** — using 🌟 or ✨ as navigation icons or status indicators. Emoji belong in user content, never in product chrome.
4. **40px+ border-radius on everything** — pill buttons, pill cards, pill modals. Over-rounding destroys hierarchy and reads as infantile.
5. **Centered hero + large "Get Started" CTA** — the single most copied layout in SaaS. We are a ritual app, not a sign-up funnel.
6. **Inter + system dark mode as the default aesthetic** — Inter is a neutral tool, not a design choice. Dark mode paired with Inter and gray backgrounds is the Notion-clone fingerprint.
7. **Floating 3D blobs / abstract morphing shapes** — the screensaver-as-branding era is over. These communicate nothing.
8. **Lavender + mint pastel pairing** — AI-generated color palettes default here. It reads as spa menu, not personal memory.
9. **Generic Tailwind UI / shadcn component clones** — border, rounded-lg, shadow-sm card components with no visual personality. Interchangeable with 10,000 other apps.
10. **Excessive drop shadows creating fake depth** — shadows that are too dark, too spread, or too numerous flatten the visual hierarchy rather than support it.
11. **Skeleton loaders on everything** — overused as a substitute for fast rendering. Looks like placeholder design left in production.
12. **Notification badges and streaks that feel punitive** — red dot on every icon, shame-based streak counters. Antithetical to our warmth principle.
13. **Motion that springs and overshoots for no reason** — bouncy spring physics on every interaction signals toy, not craft.
14. **"Your privacy matters to us" boilerplate copy** — hollow legal-speak in emotional contexts. Our privacy story is built into the product architecture, not a banner.
15. **Rounded, colorful icon sets that look AI-generated** — the bubbly, thick-stroked icon style flooding app stores. We use Phosphor at a specific weight.
16. **Full-bleed hero illustrations with characters** — generic illustrated people pointing at phones. Illustrative mood here is texture and object, not character art.
17. **Tabbed navigation with equal visual weight on every tab** — all five tabs loud simultaneously. The jar is the primary surface; chrome should recede.
18. **Sans-serif-only type at a single weight** — every body, label, and header in the same font weight looks undesigned. Editorial hierarchy requires contrast.

---

## 2. Positive References — Channel These, Don't Copy

These are sensibility targets, not mood board clips to trace.

1. **Muji packaging** — restraint, negative space, warm neutrals, functional materials shown honestly.
2. **Vintage Japanese stationery (Midori, Hobonichi)** — ruled paper, cloth covers, brass clips. Craft that respects the user's time.
3. **Pressed flower / herbarium aesthetics** — delicate, intentional placement on paper; muted warmth; the feeling that something real was preserved.
4. **Letterpress cards** — ink pressed into thick cotton paper. Texture you can feel through the screen.
5. **Anthropologie catalog editorial** — warm photography, handwritten price tags, layered paper goods. Cozy but never kitsch.
6. **Studio Ghibli domestic interiors** — soft afternoon light through a window, objects that carry personal history, warmth without sentimentality.
7. **Early-2000s photo albums and scrapbooks** — ticket stubs, handwritten captions, photo corners, layered paper. Analog memory-keeping as a model for digital ritual.
8. **Field Notes notebooks** — utilitarian but designed with love. Typography that trusts the reader. No decorative noise.

---

## 3. Color Palette

Eight colors maximum. Every color has a named role. No additions without justification.

| Role | Name | Hex | Use |
|---|---|---|---|
| `bg` | Linen | `#F5F0E8` | App background, page base |
| `paper` | Cream | `#EDE6D6` | Note cards, sheets, drawer surfaces |
| `paper-alt` | Manila | `#E2D5BF` | Alternate note color, subtle differentiation |
| `ink` | Sepia Dark | `#2C231A` | Primary text, headings |
| `ink-muted` | Warm Gray | `#7A6E64` | Captions, metadata, secondary text |
| `accent-warm` | Terracotta | `#C4673A` | Primary CTA, active state, streak highlights |
| `accent-soft` | Honey | `#D4965A` | Hover states, supporting warmth, progress fill |
| `accent-cool` | Dusk Blue | `#5A7A8C` | Muted contrast accent, accessibility pairing with warm tones |

No neons. No pure white (`#FFFFFF`). No pure black (`#000000`). Jar glass: use `paper` at 60% opacity over `bg` with a 1px `ink-muted` stroke, no glow effects.

---

## 4. Typography

Two typefaces maximum in the product. A third (handwritten) is permitted sparingly for emotional accent only — one location per screen, never in UI chrome.

### Chosen Fonts

**Display / Emotional weight: Lora (Google Fonts, Expo-compatible)**
- Serif with warmth and editorial character.
- Use for: jar label, onboarding headlines, year-end screen, memory card dates.
- Weights: Regular (400) and Medium (500) only.

**Body / UI: DM Sans (Google Fonts, Expo-compatible)**
- Humanist geometric sans. Warmer than Inter, more legible than Nunito.
- Use for: body text, navigation labels, form inputs, settings, buttons.
- Weights: Regular (400) and Medium (500) only.

**Accent / Handwritten: Caveat (Google Fonts, Expo-compatible)**
- Use only for: prompt-of-the-day label, "add your memory" composer hint text.
- Never use for navigation, buttons, or readable body content.
- Weight: Regular (400) only.

### Type Hierarchy

| Level | Font | Size | Weight | Use |
|---|---|---|---|---|
| Display | Lora | 28–32pt | 500 | Jar title, year label, onboarding headline |
| Heading | DM Sans | 20–22pt | 500 | Section headers, sheet titles |
| Body | DM Sans | 16pt | 400 | Note text, descriptions |
| Caption | DM Sans | 13pt | 400 | Dates, tags, metadata |
| Accent | Caveat | 16pt | 400 | Prompt hint, composer watermark |

Max 2 type weights visible simultaneously on any single screen.

---

## 5. Motion Principles

Motion communicates ritual. It should feel like paper and glass, not a game.

### Timing Curves

- **Default easing:** `cubic-bezier(0.4, 0.0, 0.2, 1)` — material standard ease. Feels physical and settled.
- **Sheet open:** ease-out, 280ms. The drawer rises and lands, it does not bounce.
- **Sheet close:** ease-in, 220ms. Faster close than open — physically accurate.
- **Fold animation:** staged, ease-in-out, 400ms total across 3 phases (flatten → crease → complete fold).
- **Drop into jar:** ease-in to ease-out, 500ms. Note falls, decelerates, settles. No bounce overshoot.
- **Jar fill:** ease-out, 600ms. Organic accumulation, not a progress bar.

### What to Avoid

- Spring physics with visible overshoot. This is not a rubber toy.
- Simultaneous motion on more than two elements.
- Loops or auto-playing animations on the home screen — the jar is still until touched.
- Sub-100ms transitions that feel like jank rather than speed.
- Reduced-motion mode must replace staged animations with simple opacity fades at 150ms.

---

## 6. Iconography

**Phosphor Icons — Light weight (`Ph*` at `weight="light"`, `size=24`).**

Light weight reads as refined and quiet. Regular weight is acceptable for interactive states (active tab, pressed button). Bold weight is prohibited except for critical alerts. Duotone is prohibited — too decorative for our aesthetic.

No emoji in navigation, buttons, headers, or any UI chrome. Emoji are user-generated content only, inside note cards.

---

## 7. Copy Voice

Gentle. Reflective. Treats the user as someone with an interior life.

### Do

- "What made you smile today?" — invites without demanding.
- "Your jar is filling." — simple observation, lets the user feel it.
- "This memory is waiting for you." — warm anticipation.
- "You've been keeping this jar for 47 days." — factual, quietly celebratory.
- "Open a little of your jar — just enough." — honors the constraint with care.

### Don't

- "Start your streak! Don't break the chain!" — gamification language, shame-adjacent.
- "Tap to unlock your memories 🔓✨" — emoji in UI copy, hollow excitement.
- "You haven't journaled today. Don't forget!" — punitive, productivity-app framing.
- "Congratulations! You completed your daily challenge!" — this is not a fitness app.
- "No entries yet. Add your first memory to get started!" — generic onboarding blurb, could be any app.

---

## 8. Non-Negotiable Rules

Every design agent must comply. No exceptions without explicit product lead override.

- **No gradients** except a maximum 3% noise/paper texture overlay on `bg` and `paper` surfaces.
- **No drop shadows with blur > 8px.** Preferred: `0 2px 6px rgba(44,35,26,0.08)`.
- **No more than 2 font weights per screen.**
- **No emoji in UI chrome** — navigation, buttons, headers, system messages.
- **No pure white or pure black** anywhere in the color system.
- **No border-radius above 16px** on card components. Buttons: max 10px. The jar itself is a custom shape — not a rounded rect.
- **No spring-overshoot physics** on any transition.
- **No floating 3D elements, blobs, or abstract shape decorations.**
- **Phosphor Light weight only**, except active/pressed states (Regular).
- **The jar must always be the dominant visual element on the Home screen.** Navigation chrome must not compete.
- **Sheet composer must preserve visibility of the jar behind it** — partial screen only, never full-screen modal.
- **Reduced-motion mode is required**, not optional. All staged animations must have a simplified fallback.
- **Every tap target minimum 44x44pt** — paper-texture and jar interactions are primary; never let visual delicacy compromise reachability.
- **Accent-warm (`#C4673A`) is the only CTA color.** No secondary CTA in a different accent color on the same screen.
- **Caveat (handwritten font) maximum one usage per screen**, never in interactive elements.
