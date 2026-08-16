# LAUNCH_CHECKLIST.md
## Pre-Publish QA Gate — Every Tool Page

Run this before publishing any page. Every box must be checked.

> Sources: `DESIGN_SYSTEM.md` · `BUILD_STANDARDS.md` · `SEO_SYSTEM.md` · `CONTENT_STANDARDS.md`

---

## 1. SEO & METADATA

- [ ] **Title** — unique, under 60 chars, matches page intent
- [ ] **Meta description** — unique, under 160 chars, benefit-driven, no keyword stuffing
- [ ] **H1** — exactly one, matches title intent
- [ ] **Canonical tag** — present, points to correct URL
- [ ] **URL** — lowercase, hyphen-separated, no params, no random IDs
- [ ] **Breadcrumb** — present, clickable, correct hierarchy
- [ ] **No duplicate title or description** across any other page on the site

---

## 2. SCHEMA (JSON-LD)

- [ ] **WebPage** schema — present and valid
- [ ] **BreadcrumbList** schema — present and valid
- [ ] **FAQPage** schema — present, min 5 Q&As, valid JSON-LD
- [ ] **SoftwareApplication** schema — present on tool pages
- [ ] **HowTo** schema — present if page has step-by-step instructions
- [ ] **Article** schema — present on blog/guide pages
- [ ] Validated with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] All schema in `<head>` as `<script type="application/ld+json">`

---

## 3. CONTENT

- [ ] **Opening line** — answers the query directly (no fluff intro)
- [ ] **Definition** — what the tool does in 1–2 sentences
- [ ] **No forbidden AI phrases** — (revolutionary, cutting-edge, seamlessly, game-changing, etc.)
- [ ] **No filler** — every sentence earns its place
- [ ] **Examples** — min 2, format: Input → Output → Explanation
- [ ] **How to use** — 3–5 clear steps
- [ ] **Benefits** — 3–5 user-focused points, no marketing language
- [ ] **FAQs** — min 5, preferred 8–12, tool-specific (not copy-pasted)
- [ ] **FAQ answers** — direct answer in first sentence, under 3–4 sentences each
- [ ] **Factually accurate** — no invented stats, studies, or claims
- [ ] **Sounds human** — would pass as written by an experienced professional
- [ ] **Reading level** — Grade 6–9, clear and scannable

---

## 4. TOOL INTERFACE

- [ ] **Tool is above the fold** — user can interact without scrolling
- [ ] **All inputs have explicit `<label>`** — not just placeholders
- [ ] **Primary action button** — visible, correctly labeled (Calculate / Convert / Generate etc.)
- [ ] **Loading state** — spinner or skeleton shown while processing
- [ ] **Success state** — result clearly displayed with Copy button
- [ ] **Error state** — meaningful error message shown (never silent failure)
- [ ] **Empty state** — prompt shown before first use
- [ ] **Invalid input** — inline validation error shown
- [ ] **Tool calculation** — deterministic (same input = same output, always)
- [ ] **No floating point bugs** — results rounded appropriately

---

## 5. PAGE STRUCTURE

Sections must appear in this exact order:

- [ ] Header (consistent, sticky, lightweight)
- [ ] Breadcrumb
- [ ] H1 + Short Description (2–4 sentences)
- [ ] Tool Interface + Action Button
- [ ] Results Section
- [ ] How To Use
- [ ] Examples
- [ ] Benefits
- [ ] FAQ Section
- [ ] Related Tools (6–12, genuinely related)
- [ ] Related Categories
- [ ] Footer (identical to rest of site)

---

## 6. DESIGN & VISUAL CONSISTENCY

- [ ] **Colors** — from design token system only, no custom per-page colors
- [ ] **Typography** — Inter (or approved alternative), correct size scale only
- [ ] **Spacing** — from approved scale only (4/8/12/16/24/32/48/64/80/96px)
- [ ] **Border radius** — buttons 8px · inputs 8px · cards 12px · modals 16px
- [ ] **Buttons** — 48px height, consistent across site, hover + focus states visible
- [ ] **Inputs** — 48px height, explicit labels, validation states present
- [ ] **Cards** — 12px radius · 1px border · subtle shadow · 24px padding
- [ ] **Icons** — Lucide only, no mixed libraries
- [ ] **No page-specific design** — everything reuses global components
- [ ] **No heavy gradients, no neon, no neumorphism**

---

## 7. ACCESSIBILITY

- [ ] **Keyboard navigation** — full tab flow works correctly
- [ ] **Focus ring** — visible on all interactive elements
- [ ] **ARIA labels** — on all icon-only buttons
- [ ] **Error messages** — linked to inputs via `aria-describedby`
- [ ] **Color contrast** — minimum WCAG AA on all text
- [ ] **Semantic HTML** — correct heading hierarchy, no skipped levels
- [ ] **Screen reader** — all inputs, buttons, and outputs are announced correctly

---

## 8. PERFORMANCE

- [ ] **LCP** — under 2.5s
- [ ] **CLS** — under 0.1
- [ ] **INP** — under 200ms
- [ ] **Tool interface loads first** — FAQs and Related Tools lazy-loaded
- [ ] **No layout shift** on load or after interaction
- [ ] **JS bundle** — no unnecessary libraries added
- [ ] **Images** — WebP/AVIF, with `width`/`height` set, lazy loaded, descriptive `alt` text

---

## 9. MOBILE

- [ ] **Tested on 375px viewport** — tool fully usable
- [ ] **No horizontal scrolling**
- [ ] **Tap targets minimum 44px** — all buttons and links
- [ ] **No overlapping elements**
- [ ] **Same section order as desktop** — nothing removed, layout only adapts

---

## 10. SECURITY & TECHNICAL

- [ ] **Input sanitized** — all user input sanitized server-side
- [ ] **No API keys hardcoded** — env vars used
- [ ] **No internal errors exposed** to user
- [ ] **HTTPS** — confirmed
- [ ] **No console errors** in production build
- [ ] **TypeScript** — no `any` types, strict mode passing

---

## 11. INTERNAL LINKING & DISCOVERY

- [ ] **Parent category** — linked in breadcrumb and body
- [ ] **Related tools** — 6–12 shown, from same/similar category
- [ ] **Related categories** — section present at bottom of page
- [ ] **Popular tools** — at least 3 site-wide popular tools linked
- [ ] **Not an orphan** — this page is linked from at least one other page
- [ ] **Sitemap updated** — page included in `sitemap.xml`

---

## 12. FINAL CHECKS

- [ ] **No broken links** on the page
- [ ] **No placeholder text** left (Lorem ipsum, "TODO", "FIXME")
- [ ] **No test/debug code** in production
- [ ] **Page title in browser tab** — correct
- [ ] **OG tags** — title, description, image set for social sharing
- [ ] **Robots** — page is not blocked in `robots.txt`
- [ ] **Indexable** — no `noindex` meta tag

---

## QUICK FAIL CHECK

If any of these are true → **do not publish:**

```
Tool not above the fold
No FAQs
No examples
Duplicate title or meta description
Schema invalid
Silent error states (no message shown to user)
No H1 or multiple H1s
Broken keyboard navigation
LCP > 4s
Console errors present
Placeholder text remaining
```

---

## SIGN-OFF

```
Page URL:        ___________________________
Tool Category:   ___________________________
Checked by:      ___________________________
Date:            ___________________________
Schema tested:   Yes / No
Mobile tested:   Yes / No
Ready to ship:   Yes / No
```
