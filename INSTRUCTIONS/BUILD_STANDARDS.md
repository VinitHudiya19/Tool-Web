# BUILD_STANDARDS.md
## Development Standards + Tool Page Blueprint
### Vibe Coding Reference — Utility / Calculator / Tool Platform

---

## TECH STACK

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict mode — no `any`)
- **Styling:** Tailwind CSS
- **Icons:** Lucide (only this library)
- **Rendering:** Server Components where possible

---

## FOLDER STRUCTURE

```
src/
├── app/                  # Pages and layouts (Next.js App Router)
├── components/
│   ├── ui/               # Button, Input, Card, Modal, etc.
│   └── features/         # Tool-specific components
├── lib/                  # Shared logic
├── utils/                # formatDate.ts, calculateBMI.ts etc.
├── hooks/                # Custom React hooks
├── types/                # Global TypeScript types
├── constants/            # Config values, design tokens
└── services/             # API calls, external integrations
```

---

## FILE NAMING CONVENTIONS

| Type | Example |
|---|---|
| Components | `ToolCard.tsx`, `Header.tsx` |
| Utilities | `formatDate.ts`, `calculateBMI.ts` |
| Pages | `page.tsx`, `layout.tsx` |

---

## COMPONENT RULES

- One component = one responsibility
- Reuse before creating new
- Split if component grows too large
- Every interactive element must support: keyboard nav, focus state, ARIA labels
- **Never duplicate UI** — extract to shared component

```tsx
// Good
function calculateBMI(weight: number, height: number): number {}

// Bad
function calculateBMIAndGenerateUIAndStoreData() {}
```

---

## STATE MANAGEMENT

- Keep state as local as possible
- Use Context only when truly global
- Avoid state duplication
- Do not over-engineer

---

## FORMS & VALIDATION

Every form must have:
- Client-side validation
- Server-side validation
- Loading state (button disabled while processing)
- Error messages (never silent failures)
- Success state

**Never trust raw user input. Always sanitize.**

---

## ERROR & EMPTY STATES

Every feature must handle:

| State | Required |
|---|---|
| Loading | Yes — visual feedback |
| Success | Yes — clear output |
| Error | Yes — meaningful message |
| Empty | Yes — guidance for first-time users |
| Invalid Input | Yes — inline error |

---

## TOOL CALCULATION RULES

- Must be accurate and deterministic
- Same input → always same output
- Must be unit-tested
- No floating point bugs — round appropriately

---

## API RESPONSE FORMAT

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

---

## SECURITY

- Input sanitization on every field
- Rate limiting on all endpoints
- CSRF + XSS protection
- Never hardcode API keys — use `.env`
- Never expose internal errors to users

---

## PERFORMANCE TARGETS

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

Rules:
- Minimize JS bundle
- Lazy load non-critical sections (FAQs, Related Tools)
- Code split by route
- Tool interface must load first — always above the fold

---

## SEO IMPLEMENTATION (per page)

Every page auto-generates:

```
Title (unique)
Meta Description (unique)
Canonical URL
H1 (one only)
Breadcrumb + BreadcrumbList schema
FAQPage schema
WebPage schema
```

Conditionally:
- `SoftwareApplication` — for tool pages
- `Article` — for blog pages
- `HowTo` — where steps are present

---

## URL STRUCTURE

```
/calculators/bmi-calculator
/calculators/age-calculator
/tools/json-formatter
/tools/password-generator
```

Rules: lowercase, hyphen-separated, no query params, no random IDs.

---

## SITEMAP + ROBOTS

- `sitemap.xml` — auto-generated, includes all tools, categories, articles
- `robots.txt` — allow useful pages, block admin/internal routes

---

---

# TOOL PAGE BLUEPRINT
## Universal Structure — Never Change This Order

---

## PAGE SECTION ORDER

```
1.  Header (sticky, lightweight, consistent)
2.  Breadcrumb
3.  H1 — Page Title
4.  Short Description (2–4 sentences)
5.  Tool Interface          ← ABOVE THE FOLD, always
6.  Primary Action Button
7.  Results Section
8.  How To Use (step-by-step)
9.  Examples (2–5, with input/output/explanation)
10. Benefits (3–5 points, user-focused)
11. FAQ Section (min 5, preferred 8–12)
12. Related Tools (6–12)
13. Related Categories
14. Footer
```

**Never reorder. Never skip sections.**

---

## HEADER

- Consistent across entire site
- Contains: Logo, Primary Nav, optional Search, optional Theme Toggle
- No large hero banners or marketing copy in header

---

## BREADCRUMB

```
Home > Calculators > Health > BMI Calculator
```

- Visually subtle
- Clickable
- Structured data enabled (`BreadcrumbList`)

---

## H1 — PAGE TITLE

- One H1 only
- Clear, descriptive, keyword-natural
- Examples: `BMI Calculator`, `JSON Formatter`, `Age Calculator`

---

## SHORT DESCRIPTION

- Directly below H1
- 2–4 sentences
- Answers: What does it do? Who is it for? What result will I get?
- No marketing copy, no buzzwords

---

## TOOL INTERFACE

- **Must appear above the fold** — no scrolling before use
- Contains: Inputs, Options, Controls, Calculate/Submit Button
- All inputs must have explicit labels (not just placeholders)
- Mobile-friendly tap targets (min 44px)

**Primary Action Button Examples:**
`Calculate` / `Convert` / `Generate` / `Format` / `Validate`

---

## RESULTS SECTION

Must handle all states:

| State | What to show |
|---|---|
| Empty | Placeholder / prompt |
| Loading | Spinner or skeleton |
| Success | Result heading + primary output + optional breakdown |
| Error | Clear error message |

Include: **Copy Button** + **Download Button** (where relevant)

---

## HOW TO USE

```
Step 1: [action]
Step 2: [action]
Step 3: [action]
Step 4: [action]
```

Keep concise. First-time users should understand in 30 seconds.

---

## EXAMPLES SECTION

```
Input:    [value]
Output:   [result]
Explain:  [why / how]
```

2–5 realistic examples per tool.

---

## FAQ SECTION

- Minimum 5 FAQs, preferred 8–12
- Tool-specific questions only (never copy-paste across pages)
- Answers: direct, accurate, under 3 sentences each
- Always add `FAQPage` JSON-LD schema

---

## RELATED TOOLS

- 6–12 tools from same/similar category
- Never random — must be genuinely related
- Card layout with name + short description + link

---

## SPACING REFERENCE (Tailwind)

| Token | Value | Tailwind Class |
|---|---|---|
| Input Gap | 16px | `gap-4` |
| Card Gap | 24px | `gap-6` |
| Section Gap | 64px | `py-16` |
| Large Section Gap | 96px | `py-24` |

---

## BORDER RADIUS REFERENCE

| Element | Radius | Tailwind |
|---|---|---|
| Buttons | 8px | `rounded-lg` |
| Inputs | 8px | `rounded-lg` |
| Cards | 12px | `rounded-xl` |
| Modals | 16px | `rounded-2xl` |

---

## AD PLACEMENT RULES

✅ Allowed:
- Below header
- After tool results
- Between content sections
- Sidebar (desktop only)
- Footer area

❌ Never:
- Inside tool form
- Above tool interface
- Full-screen / interstitial
- Auto-redirect or forced click

**User Experience always wins over ad revenue.**

---

## MOBILE RULES

- Same section order as desktop
- No horizontal scroll
- Tap targets minimum 44px
- No overlapping elements
- Tool must be usable on 375px viewport

---

## ACCESSIBILITY CHECKLIST (per tool page)

- [ ] Keyboard navigable
- [ ] All inputs have `<label>`
- [ ] ARIA labels on icon-only buttons
- [ ] Focus ring visible
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Color contrast AA minimum

---

## TOOL PAGE LAUNCH CHECKLIST

- [ ] Single H1
- [ ] Unique title + meta description
- [ ] Canonical URL set
- [ ] Tool above the fold
- [ ] All input states handled
- [ ] All result states handled
- [ ] How-To section present
- [ ] Examples present
- [ ] 5+ FAQs present
- [ ] FAQ schema valid
- [ ] Related tools present
- [ ] Breadcrumb + schema present
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] LCP < 2.5s
- [ ] No console errors
- [ ] Internal links added
- [ ] Sitemap updated

---

## GOLDEN RULE

> A user should be able to: understand the tool in 5 seconds → use it immediately → get results instantly → learn more if they want → discover related tools naturally.
>
> The tool is always the hero. Everything else exists to support it.
>
> Code should still be clean and maintainable when this grows from 10 tools to 1000 tools.
