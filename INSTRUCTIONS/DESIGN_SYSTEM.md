# DESIGN_SYSTEM.md
## Single Source of Truth — Visual + UX Standards
### QuickToolz.tech — v2.0

> **Rule:** Every visual decision must come from this file.
> No component-level design decisions. No page-specific styles.
> If a value isn't in this file — it does not exist in the UI.

---

# PHILOSOPHY

The website must feel: **Professional · Clean · Fast · Trustworthy · Minimal · Human-made**

Never: AI-generated · Template-like · Over-designed · Cluttered · Trend-chasing

**One-sentence identity:**
A reliable multi-tool platform — neutral gray foundation, purposeful category colors,
zero visual noise, immediately usable.

**What changed in v2.0:**
- Category color system added (semantic, not decorative)
- Tool card anatomy fully specified
- Hero section standardized with gradient + stats + search
- Navigation updated with blur, dark toggle, CTA
- Micro-interactions defined explicitly
- Dark mode token system added
- Section spacing increased 25% across the board
- Fake trust signals explicitly banned

---

# COLOR SYSTEM

## Strategy
- **Foundation (80–90% of UI):** Neutral grays — backgrounds, borders, muted text
- **Brand Primary (1 color):** Purple — buttons, links, focus rings, active states, eyebrow labels
- **Category Colors (semantic, not decorative):** One color per tool category — chips, icon wrappers, tiles ONLY
- **Semantic:** Green / Amber / Red — status communication only, never decoration

## Brand Primary — Purple
```
brand-900: #26215C   ← Darkest — hero gradient start
brand-700: #3C3489   ← Dark
brand-600: #534AB7   ← PRIMARY — buttons, links, focus, active states
brand-500: #7F77DD   ← Hover on primary elements, dark mode primary
brand-200: #AFA9EC   ← Dark mode borders, subtle accents
brand-100: #CECBF6   ← Subtle tinted backgrounds
brand-50:  #EEEDFE   ← Very light tint
```

## Category Color System
Each tool category has exactly one assigned color.
These colors are used ONLY in:
  → Category chip (pill label on tool card)
  → Icon wrapper background (36×36px block behind the Lucide icon)
  → Category tile background (Browse by Category section)
  → Section eyebrow label background (optional highlight)

NEVER use category colors on: headings · body text · buttons · borders ·
backgrounds outside these four contexts.

| Category        | Color   | Chip BG  | Chip Text | Hover Border | Dark Chip BG            |
|-----------------|---------|----------|-----------|--------------|-------------------------|
| Calculators     | Teal    | #E1F5EE  | #0F6E56   | #5DCAA5      | rgba(29,158,117,0.15)   |
| Developer Tools | Purple  | #EEEDFE  | #3C3489   | #AFA9EC      | rgba(127,119,221,0.15)  |
| SEO Tools       | Amber   | #FAEEDA  | #854F0B   | #EF9F27      | rgba(186,117,23,0.15)   |
| Text Tools      | Blue    | #E6F1FB  | #185FA5   | #85B7EB      | rgba(55,138,221,0.15)   |
| PDF Tools       | Coral   | #FAECE7  | #993C1D   | #F0997B      | rgba(216,90,48,0.15)    |
| Image Tools     | Pink    | #FBEAF0  | #993556   | #ED93B1      | rgba(212,83,126,0.15)   |
| Date Tools      | Green   | #EAF3DE  | #3B6D11   | #97C459      | rgba(99,153,34,0.15)    |
| Finance         | Teal    | #E1F5EE  | #0F6E56   | #5DCAA5      | rgba(29,158,117,0.15)   |
| Health / Fitness| Green   | #EAF3DE  | #3B6D11   | #97C459      | rgba(99,153,34,0.15)    |
| Math            | Purple  | #EEEDFE  | #3C3489   | #AFA9EC      | rgba(127,119,221,0.15)  |

## Neutral Grays — Foundation
```
gray-50:  #F9FAFB   ← Page background (light mode)
gray-100: #F3F4F6   ← Secondary surface, hover background
gray-200: #E5E7EB   ← Default border (light mode)
gray-300: #D1D5DB   ← Emphasis border, dividers
gray-500: #6B7280   ← Secondary text, placeholder, icon color
gray-700: #374151   ← Body text (light mode)
gray-900: #111827   ← Primary text, headings (light mode)
```

## Semantic Colors
Used for status communication only. Never decorative.
```
success: #059669   (green-600) — correct result, valid state
warning: #D97706   (amber-600) — non-critical alert
error:   #DC2626   (red-600)   — invalid input, failure state
info:    #2563EB   (blue-600)  — neutral information
```

## Tailwind v4 — @theme Config Block
Add this to your global CSS file (e.g. `globals.css`):

```css
@theme {
  /* Brand */
  --color-brand-50:  #EEEDFE;
  --color-brand-100: #CECBF6;
  --color-brand-200: #AFA9EC;
  --color-brand-500: #7F77DD;
  --color-brand-600: #534AB7;
  --color-brand-700: #3C3489;
  --color-brand-900: #26215C;

  /* Category — Calculators / Finance (Teal) */
  --color-cat-calc-bg:     #E1F5EE;
  --color-cat-calc-text:   #0F6E56;
  --color-cat-calc-border: #5DCAA5;

  /* Category — Dev Tools / Math (Purple) */
  --color-cat-dev-bg:     #EEEDFE;
  --color-cat-dev-text:   #3C3489;
  --color-cat-dev-border: #AFA9EC;

  /* Category — SEO (Amber) */
  --color-cat-seo-bg:     #FAEEDA;
  --color-cat-seo-text:   #854F0B;
  --color-cat-seo-border: #EF9F27;

  /* Category — Text (Blue) */
  --color-cat-text-bg:     #E6F1FB;
  --color-cat-text-text:   #185FA5;
  --color-cat-text-border: #85B7EB;

  /* Category — PDF (Coral) */
  --color-cat-pdf-bg:     #FAECE7;
  --color-cat-pdf-text:   #993C1D;
  --color-cat-pdf-border: #F0997B;

  /* Category — Image (Pink) */
  --color-cat-img-bg:     #FBEAF0;
  --color-cat-img-text:   #993556;
  --color-cat-img-border: #ED93B1;

  /* Category — Date / Health (Green) */
  --color-cat-date-bg:     #EAF3DE;
  --color-cat-date-text:   #3B6D11;
  --color-cat-date-border: #97C459;
}
```

Alternatively, for Tailwind v3 add inside `tailwind.config.ts > extend > colors`.

---

# DARK MODE TOKEN SYSTEM

## Implementation
- Use CSS custom properties on `<html>` element
- Toggle via `data-theme="dark"` attribute on `<html>`
- Persist in `localStorage('theme')`
- On first visit: respect `prefers-color-scheme: dark`

```css
/* globals.css — add after @theme block */

:root {
  --bg-primary:       #FFFFFF;
  --bg-secondary:     #F9FAFB;
  --bg-tertiary:      #F3F4F6;
  --bg-hover:         #F1F0FF;      /* brand-tinted hover */
  --border-default:   #E5E7EB;
  --border-emphasis:  #D1D5DB;
  --text-primary:     #111827;
  --text-secondary:   #374151;
  --text-muted:       #6B7280;
  --brand-primary:    #534AB7;
  --brand-hover:      #7F77DD;
  --brand-ring:       rgba(83, 74, 183, 0.20);
}

[data-theme="dark"] {
  --bg-primary:       #0A0A0B;
  --bg-secondary:     #111113;
  --bg-tertiary:      #18181B;
  --bg-hover:         #1C1A2E;      /* brand-tinted hover in dark */
  --border-default:   #27272A;
  --border-emphasis:  #3F3F46;
  --text-primary:     #FAFAFA;
  --text-secondary:   #D4D4D8;
  --text-muted:       #71717A;
  --brand-primary:    #7F77DD;      /* lighter in dark for contrast */
  --brand-hover:      #9B93E8;
  --brand-ring:       rgba(127, 119, 221, 0.25);
}
```

## Rules
- Every component uses these CSS variables — never hardcoded colors
- Category chips in dark mode: `background: [dark chip bg from table above]`, text slightly lighter
- Shadows in dark mode: reduce opacity 50% (shadows less visible on dark surfaces)
- Nav in dark mode: `rgba(10,10,11,0.85)` + blur

---

# TYPOGRAPHY

## Font Family
**Primary:** Inter (from Google Fonts / next/font)
**Fallback:** system-ui, -apple-system, BlinkMacSystemFont, sans-serif

Use ONE font family only. No decorative fonts. No Google Fonts beyond Inter.

### Loading (Next.js — preferred)
```tsx
// layout.tsx
import { Inter } from 'next/font/google'
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})
```

## Weights in Use
```
400 — Regular   → body text, descriptions
500 — Medium    → secondary labels, chip text, nav links (inactive)
600 — SemiBold  → card titles, active nav, section sub-labels
700 — Bold      → headings (H1–H3), primary CTAs, stat numbers
```

## Type Scale — USE ONLY THESE VALUES
`11px · 12px · 13px · 14px · 15px · 16px · 18px · 20px · 24px · 30px · 36px · 48px · 60px`

## Heading Scale
| Tag | Desktop Size | Mobile Size | Weight | Letter-spacing | Line-height |
|-----|-------------|-------------|--------|----------------|-------------|
| H1  | 48–60px     | 32–40px     | 700    | **-0.02em**    | 1.1         |
| H2  | 30–36px     | 24–28px     | 700    | **-0.01em**    | 1.15        |
| H3  | 24px        | 20px        | 600    | 0              | 1.25        |
| H4  | 20px        | 18px        | 600    | 0              | 1.3         |
| H5  | 16px        | 16px        | 500    | 0              | 1.4         |

**Letter-spacing on H1 and H2 is non-negotiable.**
Negative letter-spacing on large type is what separates premium from template.

## Body Text
```
Default:  16px / weight: 400 / line-height: 1.6
Body lg:  18px / weight: 400 / line-height: 1.6
Small:    14px / weight: 400 / line-height: 1.5
Caption:  12px / weight: 400 / line-height: 1.4
Meta:     11px / weight: 500 / line-height: 1.4 / letter-spacing: 0.04em
```

---

# SPACING SYSTEM

**Allowed values only (in px):**
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 96 · 128`

Never use arbitrary values (no `mt-[37px]`, no `gap-[11px]`).

## Component Spacing Reference
| Context                 | Value  | Tailwind         |
|-------------------------|--------|------------------|
| Chip internal padding   | 3px 8px| `px-2 py-0.5`    |
| Icon wrapper            | 36×36px| `w-9 h-9`        |
| Card padding            | 16px   | `p-4`            |
| Card gap (grid)         | 16px   | `gap-4`          |
| Input height            | 48px   | `h-12`           |
| Input padding           | 0 14px | `px-3.5`         |
| Section vertical gap    | 80px   | `py-20`          |
| Large section gap       | 96px   | `py-24`          |
| Section label → title   | 6px    | `mb-1.5`         |
| Card title → description| 4px    | `mt-1`           |
| Card divider → footer   | 8px    | `pt-2`           |

## Section Spacing Breakpoints
| Device   | Section Padding |
|----------|----------------|
| Mobile   | 64px (py-16)   |
| Tablet   | 80px (py-20)   |
| Desktop  | 96px (py-24)   |

**Sections must breathe.** Tight sections feel template-made.

---

# LAYOUT

## Max Content Width: 1200px
```tsx
// wrapper class (apply to every section's inner container)
className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
```

## Grid Definitions
```css
/* Tool cards */
grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
gap: 16px;

/* Category tiles */
grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
gap: 12px;

/* Related tools */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
gap: 16px;
```

## Breakpoints
| Name     | Value  |
|----------|--------|
| Mobile   | 0px    |
| sm       | 640px  |
| md       | 768px  |
| lg       | 1024px |
| xl       | 1280px |
| 2xl      | 1536px |

Never invent new breakpoints. Never use arbitrary values.

---

# BORDER RADIUS

| Element            | Radius | Tailwind      |
|--------------------|--------|---------------|
| Buttons            | 8px    | rounded-lg    |
| Inputs, Selects    | 8px    | rounded-lg    |
| Tool Cards         | 12px   | rounded-xl    |
| Category Tiles     | 12px   | rounded-xl    |
| Search Bar         | 12px   | rounded-xl    |
| Icon Wrappers      | 8px    | rounded-lg    |
| Modals             | 16px   | rounded-2xl   |
| Category Chips     | 9999px | rounded-full  |
| "New" Badges       | 9999px | rounded-full  |
| Keyboard shortcut badge | 6px | rounded-md   |
| Nav CTA Button     | 8px    | rounded-lg    |

Avoid pill-shaped UI on cards, tiles, or inputs. Pill shape = chips and badges only.

---

# SHADOWS

```
none:   box-shadow: none                              ← Inputs (use border instead)
xs:     box-shadow: 0 1px 2px rgba(0,0,0,0.05)       ← Default card (light mode)
sm:     box-shadow: 0 2px 8px rgba(0,0,0,0.06)       ← Default card (slightly elevated)
md:     box-shadow: 0 4px 16px rgba(0,0,0,0.08)      ← Card hover state
lg:     box-shadow: 0 8px 32px rgba(0,0,0,0.12)      ← Search bar, nav sticky, modals
brand:  box-shadow: 0 0 0 3px var(--brand-ring)      ← Focus ring for brand inputs
```

**Dark mode:** Divide all rgba opacity values by 2 — shadows are subtle on dark surfaces.
**Never:** Neumorphism · Heavy drop shadows · Colored glows

---

# BORDERS

```
default:  1px solid var(--border-default)       ← Cards, inputs at rest
emphasis: 1px solid var(--border-emphasis)      ← Inputs on hover
active:   1px solid var(--brand-primary)        ← Inputs on focus, active tabs
error:    1px solid #DC2626                     ← Invalid input state
```

Never use 2px borders except for CTA button emphasis (rare, single instance at most).

---

# COMPONENT SPECS

---

## HERO SECTION

### Structure (top to bottom)
```
[gradient background block]
  → [eyebrow label]          ← "180+ Free Online Tools"
  → [H1 headline]            ← Opinionated, memorable, short
  → [subtitle]               ← 1–2 lines max
  → [stats row]              ← 3 real numbers only

[white / bg-primary block, overlapping bottom of gradient]
  → [search bar]             ← Full-width, centered, 52px tall
  → [quick-access chips]     ← 6 most-used tools as pill links
```

### Gradient (always this exact gradient — do not change)
```css
background: linear-gradient(135deg, #26215C 0%, #534AB7 55%, #7F77DD 100%);
```

### Eyebrow Label
```
font-size: 11px
font-weight: 500
color: rgba(255,255,255,0.55)
text-transform: uppercase
letter-spacing: 0.10em
margin-bottom: 12px
```

### H1 in Hero
```
font-size: 52px desktop / 34px mobile
font-weight: 700
color: #FFFFFF
line-height: 1.1
letter-spacing: -0.02em
max-width: 640px
margin: 0 auto 12px
text-align: center
```

**Headline must be opinionated:**
✓ "The only tool site you need to bookmark."
✓ "Every tool. Free. No sign-up. Ever."
✗ "Free Online Tools for Work, Development & Productivity" ← generic, never use

### Subtitle in Hero
```
font-size: 16–18px
font-weight: 400
color: rgba(255,255,255,0.70)
max-width: 480px
margin: 0 auto 28px
text-align: center
line-height: 1.5
```

### Stats Row
3 stats only. Horizontal. Separated by vertical dividers.
```
[number]     |     [number]     |     [number]
[label]              [label]           [label]
```

**Stats must be REAL. See Trust Signals section.**

```
Number: font-size: 24px / font-weight: 600 / color: #FFFFFF
Label:  font-size: 12px / font-weight: 400 / color: rgba(255,255,255,0.55)
Dividers: width: 1px / height: 36px / background: rgba(255,255,255,0.20)
Gap between stats: 32–40px
```

### Safe default stats to use (always true):
- `[X]+ Free Tools` — use real count from your tool registry
- `No Sign-up` — always true
- `100% Free` — always true

Do NOT show: fake user counts, fake monthly visits, fake ratings.

---

## SEARCH BAR (Hero)

```
width: 100%
max-width: 640px
height: 52px
background: var(--bg-primary)
border: 1px solid transparent
border-radius: 12px
box-shadow: 0 8px 32px rgba(0,0,0,0.20)
display: flex
align-items: center
padding: 0 16px
gap: 10px
margin: -20px auto 0     ← overlaps gradient bottom edge, white on dark
position: relative
z-index: 10
```

Left: `<Search>` Lucide icon, 18px, color: var(--text-muted)

Placeholder (cycle with JS every 3s):
```
"Search JSON Formatter…"
"Search Age Calculator…"
"Search Regex Tester…"
"Search Word Counter…"
```

Right: Keyboard shortcut badge
```
content: ⌘K (Mac) / Ctrl+K (Windows — detect via navigator.platform)
font-size: 11px / font-weight: 500
background: var(--bg-tertiary)
border: 1px solid var(--border-default)
border-radius: 6px
padding: 1px 6px
color: var(--text-muted)
```

### Global Keyboard Shortcut
Pressing `⌘K` / `Ctrl+K` anywhere on site: focus the search bar and open dropdown.

---

## QUICK-ACCESS CHIPS (Below Search)

Row of 6 pill chips. Show top 6 tools by usage count.

```
Layout: flex, flex-wrap: wrap, gap: 8px, justify-content: center
Margin-top: 12px

Each chip:
  font-size: 12px / font-weight: 500
  padding: 5px 12px
  border-radius: 9999px
  background: var(--bg-secondary)
  border: 1px solid var(--border-default)
  color: var(--text-secondary)
  cursor: pointer
  transition: all 150ms

Chip hover:
  background: var(--bg-tertiary)
  border-color: var(--border-emphasis)
  color: var(--text-primary)
```

Prefix with a small Lucide icon (12px) matching the tool's category color.

---

## NAVIGATION

### Layout
```
[Logo] [Nav links (center or left)] [Controls (right): dark toggle + CTA]
Height: 60px
Position: sticky, top: 0
z-index: 50
```

### Background (sticky behavior)
```css
/* At top of page */
background: transparent;

/* On scroll (add .scrolled class via JS) */
background: rgba(255,255,255,0.85);        /* light mode */
background: rgba(10,10,11,0.85);           /* dark mode */
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border-bottom: 1px solid var(--border-default);
transition: background 250ms ease;
```

### Logo
```
Logo mark: 20×20px square / background: #534AB7 / border-radius: 5px
           → contains a small white icon or letter
Wordmark: font-size: 16px / font-weight: 700 / color: var(--text-primary)
Gap: 8px
```

### Nav Links
```
Max 6 items
font-size: 14px / font-weight: 400
color: var(--text-secondary)

Active / current page:
  font-weight: 600
  color: var(--text-primary)

Hover:
  color: var(--text-primary)
  transition: 150ms

NO underlines. NO background on hover. Color change only.
Gap between links: 24px
```

### Dark Mode Toggle (nav right)
```
Lucide <Sun> icon — shown when currently in dark mode (click = go light)
Lucide <Moon> icon — shown when currently in light mode (click = go dark)
Icon size: 18px
color: var(--text-muted)
hover: color: var(--text-primary)
cursor: pointer
padding: 6px (touch-friendly)
transition: 150ms
```

### Nav CTA Button
```
text: "Submit a Tool" (or relevant CTA for your platform)
height: 36px
padding: 0 16px
border-radius: 8px
background: var(--brand-primary)
color: #FFFFFF
font-size: 13px / font-weight: 600
border: none
cursor: pointer
transition: background 150ms

hover: background: var(--brand-hover)
```

---

## TOOL CARDS

### Grid
```
grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
gap: 16px;
```

Responsive columns:
- 375px:  1 column
- 640px:  2 columns
- 1024px: 3 columns
- 1280px: 4 columns (4 is the default for desktop)

### Card Base Styles
```
background: var(--bg-primary)
border: 1px solid var(--border-default)
border-radius: 12px
padding: 16px
cursor: pointer
position: relative
transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease
```

### Card Hover State
```
border-color: [category-border from table above]   ← category accent
box-shadow: 0 4px 16px rgba(0,0,0,0.08)
transform: translateY(-2px)
```

Example: Hovering a Calculator card → `border-color: #5DCAA5`

### Card Anatomy — Exact Element Order
```
① Category chip pill                (top, flex-start)
② Icon wrapper (36×36px)            (below chip, margin-bottom: 10px)
③ Tool name (title)                 (15px, semibold 600)
④ Description                       (13px, text-muted, max 2 lines)
⑤ Horizontal divider               (1px, border-default, margin: 10px 0)
⑥ Card footer                      (usage count left, arrow right)
```

Never rearrange this order. Never skip elements.

### ① Category Chip
```tsx
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: 'var(--cat-bg)', color: 'var(--cat-text)' }}>
  <CategoryIcon size={11} />
  {category.label}
</span>
```

Category-specific CSS vars set on each card via `data-category="calc"` + a CSS rule:
```css
[data-category="calc"] { --cat-bg: #E1F5EE; --cat-text: #0F6E56; }
[data-category="dev"]  { --cat-bg: #EEEDFE; --cat-text: #3C3489; }
[data-category="seo"]  { --cat-bg: #FAEEDA; --cat-text: #854F0B; }
[data-category="text"] { --cat-bg: #E6F1FB; --cat-text: #185FA5; }
[data-category="pdf"]  { --cat-bg: #FAECE7; --cat-text: #993C1D; }
[data-category="img"]  { --cat-bg: #FBEAF0; --cat-text: #993556; }
[data-category="date"] { --cat-bg: #EAF3DE; --cat-text: #3B6D11; }
```

Dark mode overrides (inside `[data-theme="dark"]`):
```css
[data-theme="dark"] [data-category="calc"] { --cat-bg: rgba(29,158,117,0.15); --cat-text: #5DCAA5; }
[data-theme="dark"] [data-category="dev"]  { --cat-bg: rgba(127,119,221,0.15); --cat-text: #AFA9EC; }
[data-theme="dark"] [data-category="seo"]  { --cat-bg: rgba(186,117,23,0.15);  --cat-text: #FAC775; }
[data-theme="dark"] [data-category="text"] { --cat-bg: rgba(55,138,221,0.15);  --cat-text: #85B7EB; }
[data-theme="dark"] [data-category="pdf"]  { --cat-bg: rgba(216,90,48,0.15);   --cat-text: #F0997B; }
[data-theme="dark"] [data-category="img"]  { --cat-bg: rgba(212,83,126,0.15);  --cat-text: #ED93B1; }
[data-theme="dark"] [data-category="date"] { --cat-bg: rgba(99,153,34,0.15);   --cat-text: #C0DD97; }
```

### ② Icon Wrapper
```
width: 36px / height: 36px / border-radius: 8px
background: var(--cat-bg)    ← same as chip background
display: flex / align-items: center / justify-content: center
margin-bottom: 10px

Icon inside: Lucide, size: 18px, color: var(--cat-text)
```

### ③ Tool Name
```
font-size: 15px
font-weight: 600
color: var(--text-primary)
margin-bottom: 4px
```

### ④ Description
```
font-size: 13px
font-weight: 400
color: var(--text-muted)
line-height: 1.45
display: -webkit-box
-webkit-line-clamp: 2
-webkit-box-orient: vertical
overflow: hidden
```

Max 2 lines. Clamp overflow. No "..." added manually — CSS handles it.

### ⑤ Divider
```
border: none
border-top: 1px solid var(--border-default)
margin: 10px 0
```

### ⑥ Card Footer
```
display: flex
justify-content: space-between
align-items: center
font-size: 12px
color: var(--text-muted)
```

Left: `<TrendingUp size={11} color="var(--cat-text)">` + usage count
  → Show real usage count if available (e.g. "12.4K uses/mo")
  → If no real data: OMIT this element, don't fake numbers

Right: `<ArrowRight size={12} color="var(--border-emphasis)" />`

### "New" Badge (recently added tools, first 30 days)
```
position: absolute / top: 12px / right: 12px
background: var(--brand-primary) / color: #FFFFFF
font-size: 10px / font-weight: 600 / letter-spacing: 0.04em
padding: 2px 7px / border-radius: 9999px
text-transform: uppercase
```

---

## CATEGORY TILES (Browse by Category Section)

### Grid
```
grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
gap: 12px;
```

### Tile Anatomy
```
background: var(--cat-bg)          ← category light background
border: 1px solid [category-100]   ← very subtle border
border-radius: 12px
padding: 20px 16px
cursor: pointer
transition: all 150ms

Content (top to bottom):
  ① Lucide icon, 26px, color: var(--cat-text)
  ② Category name, 14px, font-weight: 600, color: var(--cat-text)
  ③ Tool count, 12px, font-weight: 400, color: [category text at 70% opacity]
```

### Tile Hover
```
background: [slightly darker category background]
transform: translateY(-2px)
box-shadow: 0 4px 12px rgba(0,0,0,0.06)
```

---

## SECTION HEADERS

Every content section uses this exact header pattern. No exceptions.

### Structure
```tsx
<div className="flex items-end justify-between mb-6">
  <div>
    <p className="eyebrow">{eyebrow}</p>       {/* e.g. "POPULAR" */}
    <h2 className="section-title">{title}</h2>  {/* e.g. "Most Used Tools" */}
  </div>
  <a href={href} className="view-all-link">
    View all <ArrowRight size={14} />
  </a>
</div>
```

### Eyebrow
```
font-size: 11px
font-weight: 600
text-transform: uppercase
letter-spacing: 0.08em
color: var(--brand-primary)        ← ONLY place outside buttons/links where brand color appears
margin-bottom: 4px
```

### Section H2
```
font-size: 28–30px (desktop) / 22px (mobile)
font-weight: 700
color: var(--text-primary)
letter-spacing: -0.01em
line-height: 1.2
```

### View All Link
```
font-size: 14px / font-weight: 500
color: var(--brand-primary)
display: inline-flex / align-items: center / gap: 4px
text-decoration: none
transition: gap 150ms    ← arrow shifts right on hover (gap: 8px)

hover: gap: 8px (arrow slides right)
```

---

## TRUST SIGNALS / STATS

### Rules — Non-negotiable
```
NEVER show: fake user counts, invented monthly visitors, fabricated ratings
NEVER show: "50,000+ happy users" unless you have verified analytics
NEVER show: fake star ratings or review counts

ALWAYS OK to show:
  → Total tool count (from your actual data)
  → "No Sign-up Required" (always true)
  → "100% Free" (always true)
  → "No Data Stored" (if verified true for your architecture)
  → "Updated Weekly" (if true)
```

### "Why Use" Feature Grid (5 features)
```
Free         → Lucide <Heart>           → "Every tool, always free"
Fast         → Lucide <Zap>            → "Instant results, no waiting"
Secure       → Lucide <ShieldCheck>    → "Nothing leaves your browser"
No Sign-up   → Lucide <UserX>          → "Use immediately, no account"
Mobile-ready → Lucide <Smartphone>     → "Works perfectly on any device"
```

Layout: 5-column on desktop, 2–3 on mobile.

Each feature block:
```
Icon: 24px, brand-600 color, centered
Title: 14px, font-weight: 600, centered
Body: 13px, text-muted, centered, line-height: 1.5
```

---

## BUTTONS

### Primary Button
```
height: 48px
padding: 0 24px
background: var(--brand-primary)    → #534AB7
color: #FFFFFF
border-radius: 8px
font-size: 15px / font-weight: 600
border: none / cursor: pointer
transition: background 150ms, transform 100ms

hover:  background: var(--brand-hover)
active: transform: scale(0.98)
focus:  outline: 2px solid var(--brand-primary); outline-offset: 2px
disabled: opacity: 0.5; cursor: not-allowed; pointer-events: none
```

### Secondary Button (outlined)
```
height: 48px / padding: 0 24px
background: transparent
color: var(--text-primary)
border: 1px solid var(--border-emphasis)
border-radius: 8px
font-size: 15px / font-weight: 500

hover:  background: var(--bg-secondary); border-color: var(--brand-primary)
focus:  outline: 2px solid var(--brand-primary); outline-offset: 2px
```

### Ghost / Text Button
```
background: transparent / border: none
color: var(--brand-primary)
padding: 0 / font-size: 14px / font-weight: 500

hover: color: var(--brand-hover); text-decoration: underline
```

### Tool Action Button (Calculate / Convert / Generate / Format)
```
Same as Primary.
Width: 100% on mobile / auto on desktop
Minimum width: 160px
Icon left (optional): Lucide icon 16px
Label: one clear verb only — "Calculate", "Convert", "Format", "Generate", "Validate"
```

---

## INPUTS

### Text Input
```
height: 48px
padding: 0 14px
background: var(--bg-primary)
border: 1px solid var(--border-default)
border-radius: 8px
font-size: 15px / font-weight: 400
color: var(--text-primary)
width: 100%
transition: border-color 150ms

hover:  border-color: var(--border-emphasis)
focus:  border-color: var(--brand-primary);
        box-shadow: 0 0 0 3px var(--brand-ring);
        outline: none
error:  border-color: #DC2626;
        box-shadow: 0 0 0 3px rgba(220,38,38,0.15)
```

### Textarea
```
min-height: 120px / padding: 12px 14px
resize: vertical (allow height resizing, not horizontal)
Same border/focus/error states as text input.
```

### Select / Dropdown
Same height and border. Custom appearance (no native browser styling). Chevron: Lucide `<ChevronDown>` 16px.

### Input Label
```
font-size: 14px / font-weight: 500
color: var(--text-secondary)
margin-bottom: 6px
display: block
```

Always use explicit `<label>` with `htmlFor`. Never placeholder-only.

### Validation Error Message
```
font-size: 13px / color: #DC2626
margin-top: 6px / display: flex / align-items: center / gap: 4px
Lucide <AlertCircle> icon at 14px
aria-live: "polite"
```

---

## CARDS (Generic)

For content that isn't a tool card (e.g. feature cards, blog cards, info cards):

```
background: var(--bg-primary)
border: 1px solid var(--border-default)
border-radius: 12px
padding: 24px
box-shadow: 0 1px 2px rgba(0,0,0,0.05)
```

Never redesign cards per page. Always use this base.

---

# ICONS

**Library:** Lucide React — the ONLY icon library used on this platform.

**Never:** Font Awesome · Heroicons · Tabler · Bootstrap Icons · React Icons · Emojis as UI icons

## Size Reference
| Context                        | Size  |
|--------------------------------|-------|
| Inside category chip           | 11px  |
| Inside card footer             | 12px  |
| Nav links, inline text         | 14–16px |
| Card icon wrapper              | 18px  |
| Feature section icons          | 24px  |
| Empty state icons              | 40px  |
| Hero illustration (if used)    | 48px  |

## Color
Icons inherit color from parent or receive an explicit `color` prop.
Never hardcode hex on icons — use CSS variables or category vars.

---

# MICRO-INTERACTIONS

These are required. They transform a tool site from template to product.

## Card Hover
```css
.tool-card {
  transition: border-color 150ms ease,
              box-shadow 150ms ease,
              transform 150ms ease;
}
.tool-card:hover {
  border-color: var(--card-border-hover);   /* set via data-category */
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
```

## Button Press
```css
button:active { transform: scale(0.98); transition: transform 100ms ease; }
```

## Input Focus
```css
input:focus, textarea:focus, select:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px var(--brand-ring);
  outline: none;
  transition: border-color 150ms, box-shadow 150ms;
}
```

## Nav Link Hover
```css
nav a { transition: color 150ms ease; }
nav a:hover { color: var(--text-primary); }
```

## Category Tile Hover
```css
.category-tile {
  transition: transform 150ms ease, background 150ms ease;
}
.category-tile:hover {
  transform: translateY(-2px);
}
```

## View All Link (arrow slides right on hover)
```css
.view-all-link { transition: gap 150ms ease; }
.view-all-link:hover { gap: 8px; }
```

## Card Entrance Animation (first visible batch only)
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.tool-card { animation: fadeInUp 280ms ease forwards; }
.tool-card:nth-child(1) { animation-delay: 0ms;   }
.tool-card:nth-child(2) { animation-delay: 50ms;  }
.tool-card:nth-child(3) { animation-delay: 100ms; }
.tool-card:nth-child(4) { animation-delay: 150ms; }
/* No delay/animation on cards beyond position 4 */
```

## Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

This is REQUIRED. Not optional.

## What NOT to animate
```
❌ Infinite spinning/pulsing elements
❌ Bouncing or elastic effects
❌ Full-page transitions that delay content
❌ Parallax scroll effects
❌ Attention-seeking movement anywhere
```

---

# NAVIGATION RULES

- Sticky always — users navigate between tools frequently
- Max 6 primary nav items: category names + "New" or "Popular" tag if needed
- No mega menus unless tool count exceeds 8 categories
- Active page: highlight with font-weight 600 + text-primary color
- Mobile: hamburger menu `<Menu>` Lucide icon, 22px

---

# REMOVED SECTIONS

The following sections are explicitly banned from the homepage:

### ~~Collections Section~~
Reason: Redundant with "Most Popular" and "Recently Added". Adds scroll length,
reduces focus. Replaced by nothing, or by a "Trending Today" horizontal strip
(if you have real usage data to populate it with).

---

# FOOTER

## Structure
```
Row 1: [Logo + tagline]   [Category columns]   [Newsletter CTA]
Row 2: [Copyright © YEAR] [Legal links: Privacy · Terms · Contact]
```

## Category Columns (show real counts)
```tsx
// Only show categories with tools actually built
Calculators (14)
Developer Tools (18)
SEO Tools (12)
Text Tools (22)
PDF Tools (8)
```

Never show a category column for categories with 0 or 1 tool.

## Newsletter Block
```
Headline: "New tools every week" (12–14px, semibold)
Subtitle: "No spam. Unsubscribe anytime." (12px, muted)
Input: email / height: 40px / rounded-lg
Button: "Subscribe" / height: 40px / brand primary
```

---

# ACCESSIBILITY

Every interactive component must pass before shipping:

| Requirement              | Implementation                                                    |
|--------------------------|-------------------------------------------------------------------|
| Focus ring               | `outline: 2px solid var(--brand-primary); outline-offset: 2px`   |
|                          | NEVER `outline: none` without a replacement focus indicator       |
| Hover state              | Every anchor, button, clickable card                             |
| Disabled state           | `opacity: 0.5; cursor: not-allowed; pointer-events: none`        |
| Keyboard navigation      | Full tab flow; Enter/Space activates cards and buttons           |
| ARIA labels              | Required on all icon-only buttons                                |
| Error linking            | `aria-describedby` linking input → error message                 |
| Color contrast           | Minimum WCAG AA: 4.5:1 body, 3:1 large text (18px+)            |
| Semantic HTML            | Correct heading hierarchy — no skipped levels (H1→H2→H3)        |
| Screen reader output     | Tool results announced via `aria-live="polite"` after calculation|
| Image alt text           | All `<img>` have descriptive alt text                            |

---

# RESPONSIVENESS

Mobile-first. Always design Mobile → Tablet → Desktop.

## Tool Cards Breakpoints
| Viewport | Columns |
|----------|---------|
| 0–639px  | 1       |
| 640–1023px | 2     |
| 1024–1279px | 3    |
| 1280px+  | 4       |

## Category Tiles Breakpoints
| Viewport | Columns |
|----------|---------|
| 0–639px  | 2       |
| 640–1023px | 3–4   |
| 1024px+  | 5+      |

## Typography Breakpoints
All heading sizes have mobile variants — see Typography section.

## Minimum tap target: 44×44px on all interactive elements.
This applies to: nav links · card click areas · buttons · chips.

## No horizontal scroll on any page at any breakpoint.

---

# FINAL VALIDATION CHECKLIST

Before committing or shipping any UI change, verify ALL of these:

## Colors
- [ ] Every color value comes from this file's token system
- [ ] No hardcoded hex values in component files
- [ ] Category colors appear ONLY in: chip, icon wrapper, tile, section eyebrow
- [ ] Dark mode renders correctly (all tokens resolve correctly)

## Typography
- [ ] Inter font is loaded via next/font (not a CDN link)
- [ ] H1 has `letter-spacing: -0.02em`
- [ ] H2 has `letter-spacing: -0.01em`
- [ ] No font sizes outside the approved scale

## Layout & Spacing
- [ ] Section padding is minimum 80px desktop / 64px mobile
- [ ] Tool card grid uses `repeat(auto-fill, minmax(240px, 1fr))`
- [ ] Max content width is 1200px with proper horizontal padding
- [ ] No arbitrary spacing values (no `mt-[37px]`)

## Components
- [ ] Tool card has: chip → icon wrapper → title → description → divider → footer (in this order)
- [ ] Card hover: translateY(-2px) + category border color + shadow-md
- [ ] No fake or placeholder numbers anywhere on the page
- [ ] No "Collections" section on homepage
- [ ] Nav is sticky with blur effect
- [ ] Nav has: logo mark + wordmark + links + dark toggle + CTA button
- [ ] Hero has: gradient bg + eyebrow + H1 + subtitle + stats + search + chips
- [ ] Search bar is visually prominent (52px, full-width, centered)

## Interactions
- [ ] Card hover micro-interaction works (transform + border + shadow)
- [ ] Input focus ring visible (brand color, 3px ring)
- [ ] Button active state: scale(0.98)
- [ ] View all link: arrow shifts right on hover
- [ ] `prefers-reduced-motion` disables all animations and transitions
- [ ] Dark mode toggle works and persists in localStorage

## Accessibility
- [ ] All inputs have explicit `<label>` — no placeholder-only labels
- [ ] All icon-only buttons have `aria-label`
- [ ] Focus ring visible on every interactive element
- [ ] Color contrast passes WCAG AA
- [ ] Heading hierarchy is correct (H1 → H2 → H3, no skipping)
- [ ] Tool results use `aria-live="polite"`

## Performance
- [ ] No unused animation running at page load
- [ ] Entrance animation on first 4 cards only
- [ ] Images: WebP format, width+height set, lazy loaded, alt text present
- [ ] No layout shift from font loading (next/font handles this)

---

# GOLDEN RULE

> No visual decision should be made inside a component.
> Every visual decision must come from this token system.
> If it's not in this file, it doesn't exist in the UI.
>
> When in doubt, choose: simpler · smaller · quieter.
>
> The user should feel: *"This site is fast, clean, and built by people who care."*
> Not: *"This is a template someone filled in."*