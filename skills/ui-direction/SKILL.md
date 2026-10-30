---
name: ui-direction
description: Use when creating new frontend interfaces, pages, or components from scratch that require domain-anchored aesthetics, anti-cliché design intelligence, and 4-state ergonomic coverage.
---

# UI Direction & Design Intelligence (Stage 1: New UI Creation)

## Overview

**Core Principle:** Approach every net-new interface as an award-winning design director with a distinct point of view. Reject the generic, homogenized "AI SaaS look" that models default to. Make deliberate, opinionated choices about palette, typography, layout mode, and ergonomics grounded in the real physical vernacular of the subject.

```
ANCHOR IN SUBJECT MATTER ➔ BAN AI CLICHÉS ➔ QUERY PALETTE & STYLES ➔ DESIGN ALL 4 STATES ➔ HANDOFF TO UI-COMPONENTS
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

## 2. Searchable Design Intelligence (`search.py`)

Access 79 active design styles, 192 product palettes, 74 font pairings, and 119 UX guidelines directly via the bundled local search tool before writing code:

```bash
# Query complete design system for a product domain:
python3 <path-to-hyperpowers>/skills/ui-direction/scripts/search.py "fintech dashboard" --design-system

# Search specific palettes or styles:
python3 <path-to-hyperpowers>/skills/ui-direction/scripts/search.py "retro gaming"
python3 <path-to-hyperpowers>/skills/ui-direction/scripts/search.py "minimalist dark"
```

The output returns:
- **Semantic Palette**: Primary, Secondary, Background, Foreground, Card, Muted, Border, Ring.
- **Font Pairings**: Display and body typography Google Fonts links & CSS imports.
- **Tailored Effects**: Transition timings, shadows, and spacing rhythm.
- **Pre-Delivery Checklist**: Contrast standards and responsive breakpoints.

---

## 3. Surface Modes (Scale Ambition to the Surface)

Scale visual expression to the surface's operational purpose:

- **Persuade (Landing pages, marketing, campaigns, pricing)**: Design is the product. Earn attention and conversion with bold, high-contrast typography, distinct physical materials, and deep brand personality.
- **Operate (Dashboards, admin, tools, settings, data entry)**: Visitor completes a task. Scanability, dense typography, consistent native affordances, and zero wasted card padding outrank decorative expression.
- **Read (Documentation, articles, changelogs, knowledge base)**: Visitor seeks comprehension. Balanced line measure (65–75ch), proportional vertical rhythm ($1.5$), and structured typography.
- **Experience (Galleries, showcases, audio/video players)**: Visitor is inside the artifact itself. Interface recedes; content leads.

---

## 4. Semantic Color Architecture & Accessible Tokens

Define colors through semantic theme tokens (in `globals.css` or Tailwind config), never hardcoded hex codes:

1. **Token Hierarchy**:
   - Surface Tokens: `bg-background`, `bg-card`, `bg-popover`, `bg-muted`
   - Content Tokens: `text-foreground`, `text-muted-foreground`, `text-primary-foreground`
   - Border & Separator Tokens: `border-border`, `border-input`, `ring-ring`
   - Intent Tokens: `bg-primary`, `bg-secondary`, `bg-accent`, `bg-destructive`
2. **Accessible Contrast Ratios**:
   - Body copy to surface: $\ge 4.5:1$ (WCAG AA).
   - Large headings ($\ge 24\text{px}$) to surface: $\ge 3:1$.
   - Interactive boundaries/icons to surface: $\ge 3:1$.
   - **Tinted Neutrals**: On dark or colored surfaces, tint secondary text from that surface hue; never use washed-out generic gray (`text-slate-400` on white is strictly banned).

---

## 5. Mandatory 4-State Component Ergonomics

Never design only the "happy path". Every dynamic view and component must explicitly implement:

1. **Empty State**: Friendly graphic/illustration + clear descriptive copy + primary CTA button (e.g. *"No bookmarks yet. Browse catalog to add your first ROM."*).
2. **Loading State**: Dimension-accurate skeleton loader matching real component geometry (never a generic center spinner).
3. **Error State**: Plain-English explanation of failure + immediate retry action.
4. **Interaction States**:
   - `:hover`: Subtle optical elevation or contrast shift (150–250ms).
   - `:active`: Definite tactile press feedback (`transform: scale(0.98)`).
   - `:disabled`: Reduced opacity (0.5), `cursor: not-allowed`, no hover effects.
   - `:focus-visible`: High-visibility 2px focus ring with 2px offset (`focus-visible:ring-2 focus-visible:ring-offset-2`).

---

## 6. Execution Flow & Handoff

```
[1. Resolve Subject & Mode] ➔ [2. Query search.py for Palette & Fonts] ➔ [3. Wireframe 4 States] ➔ [4. Invoke ui-components for Scaffolding]
```

After finalizing aesthetic direction, invoke **`hyperpowers:ui-components`** to scaffold accessible component primitives (cards, dialogs, forms, chat).
