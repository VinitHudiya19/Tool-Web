# SEO_SYSTEM.md
## Programmatic SEO + GEO + AEO + Schema + Crawlability
### For Utility Platforms, Tool Websites, Calculator Websites, SaaS

> **Note:** Writing style, content rules, and forbidden phrases → see `CONTENT_STANDARDS.md`

---

## PRIMARY OBJECTIVE

Build a scalable SEO system that supports 100 to 50,000 pages without manual SEO work per page.

Every page must:
- Provide genuine value to a real user
- Be crawlable, indexable, and internally linked
- Be citable by AI systems (GEO/AEO ready)
- Have all technical assets auto-generated

Never generate pages solely for keywords. Never create thin, duplicate, or doorway pages.

---

## PAGE EXISTENCE RULE

A page should only be created if it offers at least one of:
- Useful Tool / Calculator / Converter / Utility
- Useful Resource / Information

**Before generating any page, verify:**

| Check | Must be Yes |
|---|---|
| Useful? | ✓ |
| Unique? | ✓ |
| Helpful? | ✓ |
| Search-worthy? | ✓ |
| Human-friendly? | ✓ |
| AI-friendly? | ✓ |

If any answer is No → Do not generate the page.

---

## URL STRUCTURE

```
/calculators/bmi-calculator
/calculators/age-calculator
/tools/json-formatter
/tools/password-generator
/blog/how-to-calculate-bmi
```

Rules:
- Lowercase only
- Hyphen-separated words
- Human-readable and descriptive
- No query parameters (`?id=123`)
- No random IDs or version suffixes (`-v2-final`)

---

## UNIVERSAL PAGE ASSETS

Every page must auto-generate ALL of the following — no exceptions:

```
Unique Title
Unique Meta Description
Unique Canonical URL
Unique H1
Breadcrumb Navigation + BreadcrumbList Schema
FAQ Section (min 5, preferred 8–12)
Related Tools Section (6–12)
Internal Links (parent category + siblings + popular tools)
WebPage Schema
FAQPage Schema
Tool/Page-Type Schema (see Schema section below)
```

---

## TITLE RULES

**Structure:** `Primary Keyword — Benefit`

```
BMI Calculator
Age Calculator — Find Your Exact Age
JSON Formatter — Format & Validate JSON Online
Percentage Calculator — Fast & Free
```

- Never duplicate titles across pages
- Never auto-append unnecessary branding to every title
- Keep under 60 characters where possible

---

## META DESCRIPTION RULES

**Structure:** `What it does + Who it helps + Benefit`

```
Calculate body mass index using height and weight. Get your BMI 
category instantly — free, accurate, no signup required.
```

Rules:
- Under 160 characters
- Human-readable, benefit-driven
- Unique per page
- No keyword stuffing

---

## H1 RULES

- One H1 per page — no exceptions
- Must match page intent exactly
- Should align closely with the title tag
- Examples: `BMI Calculator` · `JSON Formatter` · `Age Calculator`

---

## CANONICAL TAG

Every page must include:

```html
<link rel="canonical" href="https://yourdomain.com/tools/page-slug" />
```

- Always points to the primary version of the page
- Prevents duplicate indexing from URL variations
- Required even when there's no duplicate risk

---

## BREADCRUMB SYSTEM

**Format:**
```
Home > Calculators > Health > BMI Calculator
```

Requirements:
- Present on every page
- All segments are clickable links
- Visually subtle (not a design focal point)
- `BreadcrumbList` JSON-LD schema always enabled

---

## FAQ SYSTEM

Every page must contain:
- **Minimum:** 5 FAQs
- **Preferred:** 8–12 FAQs

Rules:
- Questions must be specific to THIS tool/page — never copy-paste across pages
- Answers: direct, accurate, under 3 sentences each
- Always wrap in `FAQPage` JSON-LD schema
- Questions should reflect real user search intent

**FAQ format:**
```
Q: How accurate is this BMI calculator?
A: This calculator uses the standard WHO formula (weight ÷ height²). 
   Results are accurate for adults 18+ but do not account for muscle 
   mass or body composition.
```

---

## SCHEMA GENERATION

### Always Required (every page)
```json
WebPage
BreadcrumbList
FAQPage
```

### Conditional by Page Type

| Page Type | Schema |
|---|---|
| Tool page | `SoftwareApplication` |
| How-to / tutorial | `HowTo` |
| Blog / guide | `Article` |
| Homepage / About | `Organization` + `WebSite` |
| Premium tool | `Product` |

**Rules:**
- All schema must be valid JSON-LD
- Use `<script type="application/ld+json">` placement in `<head>`
- Validate with Google Rich Results Test before publishing
- Never use Microdata or RDFa — JSON-LD only

### SoftwareApplication Schema (Tool Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "BMI Calculator",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

---

## INTERNAL LINKING SYSTEM

Every page must automatically link to:

| Link Target | Purpose |
|---|---|
| Parent category page | Hierarchy + crawlability |
| Related category page | Topic clustering |
| 6–12 sibling tools | Discoverability |
| 3–5 popular tools (site-wide) | Authority flow |
| Relevant articles/guides | Topical depth |

Rules:
- Links must be genuinely relevant — never artificial
- Anchor text must be descriptive (not "click here")
- No orphan pages — every page must be linked from at least one other page

---

## CATEGORY ARCHITECTURE

Every tool must belong to a category. No orphan tools.

```
Calculators
├── Finance       → /calculators/finance/
├── Health        → /calculators/health/
├── Education     → /calculators/education/
├── Math          → /calculators/math/
└── Business      → /calculators/business/

Developer Tools
├── JSON Tools    → /tools/json/
├── Encoding      → /tools/encoding/
├── Formatting    → /tools/formatting/
└── API Tools     → /tools/api/
```

Every category must have:
- Its own SEO-optimized landing page
- List of all tools in that category
- Category-level `BreadcrumbList` schema

---

## RELATED TOOLS SYSTEM

Every tool page auto-generates 6–12 related tools.

Rules:
- Same category or closely related category only
- Display: tool name + 1-line description + link
- Never show random recommendations
- Cards must use consistent design (see `DESIGN_SYSTEM.md`)

---

## SITEMAP SYSTEM

Auto-generate `sitemap.xml` including:
- All tool pages
- All category pages
- All articles and guides
- All resource pages

Rules:
- Update automatically when new pages are added
- Include `lastmod` date
- Exclude: admin routes, staging paths, search result pages, noindex pages
- Submit to Google Search Console after every major batch update

---

## ROBOTS.TXT

```
User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /staging/
Disallow: /*?*        # Block duplicate parameter URLs

Sitemap: https://yourdomain.com/sitemap.xml
```

---

## DUPLICATE CONTENT PROTECTION

Never generate:
- Duplicate titles across any two pages
- Duplicate meta descriptions
- Identical FAQ blocks copy-pasted across pages
- Near-identical content with only the tool name changed

Every page must provide unique, tool-specific value.

---

## GEO — GENERATIVE ENGINE OPTIMIZATION

Make every page easy for AI systems (ChatGPT, Perplexity, Gemini, Claude) to understand and cite.

**Required on every page:**

| Element | Format |
|---|---|
| Definition | "X is Y that does Z" — 1–2 sentences |
| How-To | Numbered steps |
| Examples | Input → Output → Explanation |
| FAQ | Direct Q&A format |
| Summary | Key takeaways at the end |

- Use Question + Answer format wherever possible
- Provide concrete, extractable facts — not vague paragraphs
- Tables and lists are more citable than prose blocks

---

## AEO — ANSWER ENGINE OPTIMIZATION

Every tool page must directly answer these questions somewhere on the page:

```
What is it?
How does it work?
Who should use it?
Is it accurate?
Is it free?
How is it different from [manual method / alternative]?
```

**Format rule:**
```
❌ "There are many factors to consider when calculating BMI..."
✅ "A BMI between 18.5 and 24.9 is considered a healthy weight range for adults."
```

Be specific. Be direct. First sentence must contain the answer.

---

## E-E-A-T SIGNALS

| Signal | How to show it |
|---|---|
| Experience | Real examples, practical use cases |
| Expertise | Accurate formulas, correct methodology |
| Authority | Internal links to related tools, category depth |
| Trust | About page, Contact page, Privacy Policy, Terms |

Never invent facts, statistics, studies, or reviews.

---

## INDEXABILITY RULES

Every page must be:
- Crawlable — not blocked in `robots.txt`
- Indexable — no `<meta name="robots" content="noindex">`
- Internally linked — not an orphan
- Listed in `sitemap.xml`
- Fast loading — LCP < 2.5s

---

## SCALABILITY

Architecture must support 100 → 10,000+ tools without restructuring.

- URL patterns must be template-driven
- Schema must be auto-generated from tool metadata
- FAQs must be generated per tool (not manually written for each)
- Related tools must be algorithm-driven (by category/tags)
- Sitemap must update on deploy

---

## PROGRAMMATIC SEO CHECKLIST

Before publishing any page:

- [ ] Unique URL (lowercase, hyphenated)
- [ ] Unique title (under 60 chars)
- [ ] Unique meta description (under 160 chars)
- [ ] Single H1 matching page intent
- [ ] Canonical tag present
- [ ] Breadcrumb present + BreadcrumbList schema
- [ ] WebPage schema valid
- [ ] FAQPage schema valid (min 5 FAQs)
- [ ] Tool schema added (SoftwareApplication / HowTo / Article)
- [ ] Related tools section (6–12)
- [ ] Internal links to parent + siblings
- [ ] Examples included (Input → Output → Explanation)
- [ ] GEO elements: definition, steps, examples, FAQ, summary
- [ ] AEO: direct answers to What/How/Who/Free/Accurate
- [ ] Mobile responsive
- [ ] LCP < 2.5s
- [ ] Crawlable (not in robots.txt disallow)
- [ ] Indexable (no noindex)
- [ ] Sitemap updated
- [ ] No duplicate title/description/content
- [ ] Schema validated (Rich Results Test)

---

## GOLDEN RULE

> Programmatic SEO is not about generating thousands of pages.
> **It is about generating thousands of useful pages.**
>
> A useful page ranks.
> A duplicate page does not.
> An AI-friendly page gets cited.
> A thin page gets ignored.
>
> **Usefulness → Uniqueness → Crawlability → Topical Authority → Scale**
