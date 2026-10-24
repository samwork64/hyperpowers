---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Enforces anti-cliché design intelligence, tailored typography, multi-state ergonomics, and domain-anchored aesthetics.
---

# Frontend Design: Anti-Cliché Design Intelligence

## Overview

**Core Principle:** Approach every interface as an award-winning design director with a distinct point of view. Reject the generic, homogenized "AI look" that models default to. Make deliberate, opinionated choices about palette, typography, layout, and ergonomics grounded in the real physical vernacular of the subject.

```
ANCHOR IN SUBJECT MATTER ➔ BAN AI CLICHÉS ➔ CURATE INTENTIONAL PALETTE ➔ DESIGN ALL 4 STATES ➔ VERIFY MULTI-VIEWPORT
```

---

## 1. Absolute Bans on AI Visual Clichés

Do not spend design freedom on generic AI template habits. Unless the user explicitly mandates one of these in their prompt, the following are banned:

| Cliché / Anti-Pattern | Why It Fails | What to Do Instead |
| :--- | :--- | :--- |
| **❌ The Purple/Indigo "SaaS Gradient"** (`from-indigo-500 to-teal-400`, text-clipped gradient titles) | Instant giveaway of generic AI code. Dilutes brand identity. | Use high-contrast solid typography with deliberate optical weight. Pick colors from the physical subject matter. |
| **❌ The "Icon-in-a-Box" Card Monoculture** (3-4 identical rounded-xl cards with Lucide icons in gray boxes) | Lazy container habit. Eliminates visual hierarchy and flattens content. | Use asymmetric editorial layouts, clean data tables, interactive lists, or direct-manipulation canvases. |
| **❌ The "Trust-Me" Pastel Pill** (*✨ v2.0 is live* or *AI-Powered* floating badges) | Decorative noise that adds zero informational value. | Let the product headline and interface deliver the value directly. |
| **❌ Predictable 3-Tier Pricing Table** (center tier scaled up with primary border & "Most Popular" tag) | High-school marketing template that ignores actual product packaging. | Design pricing around actual feature differentiation and volume metrics. |
| **❌ Tracked-out Eyebrow Labels** (ALL-CAPS tiny label stacked above every heading) | Clutters reading rhythm and acts as visual crutch for weak headings. | Craft a strong, clear headline that carries its own weight. Delete the eyebrow. |
| **❌ Robotic Buzz-Copy** (*"Streamline your workflow," "Empower your team," "Unleash synergy"*) | Vacuous corporate filler that alienates real users. | Write concrete, active-voice microcopy: *"Deploy with one click,"* *"Browse 540 SNES cartridges."* |

---

## 2. The 5-Stage Design Reasoning Pathway

```
[1. Subject Anchor] ➔ [2. Anti-Cliché Palette] ➔ [3. Typographic Scale] ➔ [4. Multi-State Ergonomics] ➔ [5. Multi-Viewport Gate]
```

### Stage 1: Subject-Matter Anchor & Mood Archetype
Ground aesthetic choices in the physical vernacular of the product domain:
* **Retro Gaming / Consoles**: CRT scanlines, pixel accents, nostalgic warm-gray/slate plastics, cartridge label typography, physical tactile buttons.
* **Financial / Analytical**: Dense layout, monospace figures (`font-mono`, tabular numbers), zero wasted card padding, muted slate/graphite neutrals with sharp semantic green/red indicators.
* **Editorial / Publishing**: Expressive serif headlines, generous line heights, balanced measure (<75ch), classic hairline column dividers.
* **Developer Tools / CLI**: High contrast, terminal darks, clean syntax tokens, compact keyboard shortcut badges (`kbd`).

### Stage 2: Anti-Cliché Palette & Material System
* Curate a deliberate **4–6 color palette** derived from the physical subject (e.g. warm paper `#F8F6F0`, deep olive `#3D4A3E`, terracotta `#D97757`, slate charcoal `#1E2022`, muted cobalt `#2B4C7E`, burnt amber `#C07D38`).
* **Semantic Tokens First**: Use semantic theme tokens (`bg-background`, `text-foreground`, `border-border`, `bg-primary`) rather than hardcoded Tailwind colors (`bg-indigo-600`).
* **Tint Secondary Text**: On colored surfaces, tint secondary text from that surface hue or foreground; never use plain washed-out gray (`text-slate-400` on white is an accessibility failure).

### Stage 3: Typographic Character & Hierarchy
* Pair an expressive display typeface with a clean, highly legible text face.
* **Reading Measure**: Keep body text line lengths strictly between 65–75 characters (`max-w-prose`).
* **Vertical Rhythm**: Set proportional line-heights ($1.5$ for body text, $1.1$ for large display headings).
* **Ban Typographic Gimmicks**: No single-word colored highlights, no random italics for emphasis.

### Stage 4: Mandatory 4-State Component Ergonomics
Never design only the "happy path". Every dynamic view must explicitly design:
1. **Empty State**: Friendly graphic/illustration + clear descriptive copy + primary CTA button (e.g. *"No bookmarks yet. Browse catalog to add your first ROM."*).
2. **Loading State**: Dimension-accurate skeleton loader matching real component geometry (never a generic center spinner).
3. **Error State**: Plain-English explanation of failure + immediate retry action.
4. **Interaction States**: Explicit hover, active, disabled, and high-visibility `:focus-visible` outline rings for keyboard accessibility.

### Stage 5: Multi-Viewport & Contrast Verification Gate
Verify the built interface in real viewports using `ui-shot`:
* **Mobile (375px)**: Zero horizontal overflow (`overflow-x: hidden`), touch targets $\ge 44\times 44\text{px}$, clean vertical stacking.
* **Tablet (768px)**: Flexible grid/flex wrapping.
* **Desktop (1280px+)**: Controlled max-widths, optical balance.
* **WCAG AA Compliance**: Body text contrast $\ge 4.5:1$, large text $\ge 3:1$. Zero console errors or warnings.
