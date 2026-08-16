import type { SeoToolConfig } from "./types";

/**
 * Every SEO tool page is generated from this file: metadata, schema, on-page
 * content and related-tool links.
 *
 * Rules enforced here rather than per page:
 *  - titles under 60 characters, descriptions under 160
 *  - FAQs unique to the tool, never shared boilerplate
 *  - `relatedSlugs` only reference routes that exist
 */
export const SEO_TOOLS: Record<string, SeoToolConfig> = {
  "schema-generator": {
    slug: "schema-generator",
    name: "Schema Generator",
    title: "Schema Markup Generator — Free JSON-LD Tool",
    description:
      "Generate valid JSON-LD schema markup for articles, products, local business, events and more. Copy the code and paste it into your page.",
    h1: "Schema Markup Generator",
    intro:
      "Schema markup is structured data that tells search engines what a page is about, using a vocabulary from schema.org. This generator builds valid JSON-LD for the most common types — article, product, local business, event, recipe, person and organisation — from a short form. Fill in the fields, copy the script tag, and paste it into your page's HTML.",
    iconName: "Braces",
    applicationCategory: "DeveloperApplication",
    features: [
      "Seven schema types",
      "Live JSON-LD output",
      "Required-field validation",
      "Copy or download the script tag",
    ],
    steps: [
      {
        name: "Choose a schema type",
        text: "Pick the type that matches the page: Article for a blog post, Product for a shop page, LocalBusiness for a physical location, and so on.",
      },
      {
        name: "Fill in the fields",
        text: "Required fields are marked. The generator warns you when one that Google needs for rich results is missing.",
      },
      {
        name: "Check the output",
        text: "The JSON-LD updates as you type. Empty fields are left out rather than written as blank values.",
      },
      {
        name: "Add it to your page",
        text: "Copy the script tag and paste it into the <head> of the page it describes, then confirm it with Google's Rich Results Test.",
      },
    ],
    examples: [
      {
        title: "Blog post",
        input: "Article · headline, author, publish date, image",
        output: '{"@type":"Article","headline":"…","author":{"@type":"Person"…}}',
        explanation:
          "Article markup makes a post eligible for rich results carrying the headline, date and author in search listings.",
      },
      {
        title: "Shop page",
        input: "Product · name, price, currency, availability, rating",
        output: '{"@type":"Product","offers":{"@type":"Offer","price":"29.99"…}}',
        explanation:
          "Price and availability can appear directly in the listing. Only mark up ratings you genuinely collect.",
      },
      {
        title: "Physical shop",
        input: "LocalBusiness · name, address, phone, opening hours",
        output: '{"@type":"LocalBusiness","address":{"@type":"PostalAddress"…}}',
        explanation:
          "LocalBusiness feeds the knowledge panel and map results. The address must match your Google Business Profile exactly.",
      },
    ],
    benefits: [
      {
        title: "Valid JSON-LD, not a template",
        description:
          "Output is built from a real object and serialised, so the result is always syntactically valid and correctly escaped.",
      },
      {
        title: "Only the fields you filled",
        description:
          "Blank inputs are omitted instead of written as empty strings, which is what causes most validator warnings.",
      },
      {
        title: "Tells you what Google needs",
        description:
          "Fields Google requires for rich results are flagged, so you find out before the validator does.",
      },
      {
        title: "The format Google recommends",
        description:
          "JSON-LD sits in one script tag and never touches your visible markup, unlike Microdata which is woven through the HTML.",
      },
      {
        title: "Runs in your browser",
        description:
          "Nothing you type is sent anywhere, which matters when a page is not published yet.",
      },
    ],
    limitations: [
      "Markup makes a page eligible for rich results; it does not guarantee them. Google decides what to show.",
      "The content you mark up must be visible on the page. Describing things a visitor cannot see breaks Google's guidelines and can earn a manual action.",
      "Seven common types are covered. Rarer types such as Course, JobPosting or SoftwareApplication are not in this generator.",
      "Schema markup is not a ranking factor on its own. It affects how a listing looks, not where it sits.",
    ],
    keyTakeaways: [
      "Schema markup is structured data that describes a page to search engines using schema.org vocabulary.",
      "JSON-LD is Google's recommended format and lives in a single script tag in the head.",
      "Marked-up content must be visible on the page, or the markup violates Google's guidelines.",
      "Valid markup makes rich results possible but never guaranteed.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is schema markup?",
        answer:
          "Schema markup is code that describes your page's content in a vocabulary search engines understand, defined at schema.org. It does not change what visitors see — it tells Google that a number is a price, a date is an event, or a name is an author.",
      },
      {
        id: "where-to-put",
        question: "Where do I put the generated code?",
        answer:
          "Paste the whole script tag into the <head> of the page it describes. It also works in the <body>, but the head is the convention. Each page needs its own markup describing that page.",
      },
      {
        id: "which-format",
        question: "Why JSON-LD rather than Microdata?",
        answer:
          "Google recommends JSON-LD. It sits in one self-contained block, so you can add or change it without touching your HTML structure — Microdata requires attributes scattered through the visible markup.",
      },
      {
        id: "ranking",
        question: "Will schema markup improve my rankings?",
        answer:
          "Not directly — Google has stated structured data is not a ranking factor. It affects how your listing is displayed, and richer listings often earn more clicks, which is where the practical benefit comes from.",
      },
      {
        id: "rich-results",
        question: "Why is my markup valid but no rich result appears?",
        answer:
          "Eligibility is not a guarantee. Google weighs page quality, query intent and its own confidence in the data. New markup can also take days or weeks to be recrawled and reflected.",
      },
      {
        id: "multiple",
        question: "Can one page have more than one schema type?",
        answer:
          "Yes, and it is common — a blog post might carry Article, BreadcrumbList and Organization together. Add each as its own script tag, or combine them in one array.",
      },
      {
        id: "fake-data",
        question: "Can I mark up content that is not on the page?",
        answer:
          "No. Google requires structured data to reflect visible page content. Inventing reviews or prices that do not appear is a guideline violation and can trigger a manual penalty.",
      },
      {
        id: "validate",
        question: "How do I check my markup works?",
        answer:
          "Run the URL through Google's Rich Results Test to see which rich results it qualifies for, and the Schema Markup Validator for general schema.org validity. Search Console reports issues across the whole site once it has crawled.",
      },
      {
        id: "reviews",
        question: "Why were my review stars removed?",
        answer:
          "Google restricted self-serving review markup: a business marking up reviews of itself is not eligible. Ratings must come from a genuine third-party review system to show stars.",
      },
    ],
    relatedSlugs: [
      "faq-schema-generator",
      "breadcrumb-schema-generator",
      "meta-title-generator",
      "meta-description-generator",
    ],
  },

  "faq-schema-generator": {
    slug: "faq-schema-generator",
    name: "FAQ Schema Generator",
    title: "FAQ Schema Generator — Free JSON-LD Tool",
    description:
      "Turn question and answer pairs into valid FAQPage JSON-LD. Add your FAQs, copy the script tag, and paste it into your page.",
    h1: "FAQ Schema Generator",
    intro:
      "FAQPage schema is structured data that marks a list of questions and their answers so search engines can read them as a set. This generator turns your question and answer pairs into valid FAQPage JSON-LD. Add each pair, copy the script tag, and paste it into the page where those FAQs already appear.",
    iconName: "MessageCircleQuestion",
    applicationCategory: "DeveloperApplication",
    features: [
      "Unlimited question and answer pairs",
      "Valid FAQPage JSON-LD output",
      "Correct escaping of quotes and symbols",
      "Copy or download the script tag",
    ],
    steps: [
      {
        name: "Add a question",
        text: "Type the question exactly as it appears on your page. Phrase it the way a visitor would ask it.",
      },
      {
        name: "Write the answer",
        text: "Paste the answer text. Keep it to the answer itself — no navigation links or calls to action.",
      },
      {
        name: "Add the rest",
        text: "Repeat for each pair. Two or three is enough to be useful; there is no upper limit.",
      },
      {
        name: "Copy and paste it in",
        text: "Copy the script tag into the head of the page holding those FAQs, then confirm with the Rich Results Test.",
      },
    ],
    examples: [
      {
        title: "Shipping question",
        input: 'Q: "How long does delivery take?" A: "Orders ship within 24 hours…"',
        output: '{"@type":"Question","name":"How long does delivery take?"…}',
        explanation:
          "Each pair becomes a Question object with an acceptedAnswer. The wording must match what is on the page.",
      },
      {
        title: "Answer containing quotes",
        input: 'A: He said "use the code SAVE10" at checkout.',
        output: 'acceptedAnswer.text: "He said \\"use the code SAVE10\\"…"',
        explanation:
          "Quotes, backslashes and newlines are escaped automatically. Hand-written JSON-LD usually breaks here.",
      },
      {
        title: "Several pairs",
        input: "5 question and answer pairs",
        output: '{"@type":"FAQPage","mainEntity":[ … 5 items … ]}',
        explanation:
          "All pairs belong in one FAQPage block. A page should carry a single FAQPage, not one per question.",
      },
    ],
    benefits: [
      {
        title: "Escaping handled for you",
        description:
          "Quotes, apostrophes, backslashes and line breaks are escaped correctly — the most common way hand-written FAQ markup breaks.",
      },
      {
        title: "Valid structure every time",
        description:
          "Output is serialised from a real object, so mainEntity, Question and acceptedAnswer nest the way the specification requires.",
      },
      {
        title: "No limit on pairs",
        description:
          "Add as many questions as your page genuinely has. Nothing is capped or gated.",
      },
      {
        title: "Answer-engine ready",
        description:
          "The same clean question-and-answer structure that search engines read is what AI answer engines quote from.",
      },
      {
        title: "Private",
        description:
          "Everything runs in your browser, so unpublished content stays on your machine.",
      },
    ],
    limitations: [
      "The FAQs must be visible on the page. Marking up questions a visitor cannot see violates Google's guidelines.",
      "Since 2023 Google shows FAQ rich results mainly for well-known government and health sites, so most pages will not get the expanded listing.",
      "FAQPage is for your own questions and answers. Pages where users submit competing answers should use QAPage instead.",
      "Only one FAQPage block belongs on a page, no matter how many questions it holds.",
    ],
    keyTakeaways: [
      "FAQPage markup groups question and answer pairs into structured data search engines can read.",
      "The questions and answers must already be visible on the page.",
      "Google now limits FAQ rich results to a narrow set of authoritative sites, though the markup still helps machines understand the page.",
      "Use FAQPage for your own answers, QAPage for user-submitted ones.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is FAQPage schema?",
        answer:
          "FAQPage schema is structured data marking a page as containing a list of questions with answers. It groups each pair into a Question object with an acceptedAnswer so search engines can read them as a set rather than as loose text.",
      },
      {
        id: "still-worth-it",
        question: "Is FAQ schema still worth adding in 2026?",
        answer:
          "Yes, though for different reasons than before. Google restricted FAQ rich results to authoritative government and health sites in 2023, so expect no expanded listing. The markup still helps search engines and AI answer engines parse the page reliably.",
      },
      {
        id: "must-be-visible",
        question: "Do the FAQs have to be on the page?",
        answer:
          "Yes. Google requires the questions and answers in your markup to be visible to visitors. Marking up FAQs that only exist in the code is a guideline violation.",
      },
      {
        id: "how-many",
        question: "How many questions should I include?",
        answer:
          "Include every FAQ genuinely on the page. There is no minimum or maximum, but do not invent questions to pad the markup — that hurts the page and risks a violation.",
      },
      {
        id: "vs-qapage",
        question: "What is the difference between FAQPage and QAPage?",
        answer:
          "FAQPage is for questions you wrote and answered yourself. QAPage is for pages where visitors post a question and others submit competing answers, like a forum thread. Using the wrong one is a common mistake.",
      },
      {
        id: "html-in-answers",
        question: "Can answers contain HTML?",
        answer:
          "Google accepts a small set of formatting tags such as <p>, <br>, <ul> and <a> inside an answer. Plain text is safer and more widely supported, so this generator keeps answers as text.",
      },
      {
        id: "accordion",
        question: "Does it work if my FAQs are in an accordion?",
        answer:
          "Yes, as long as the answers exist in the page's HTML rather than being fetched on click. Content hidden behind a toggle still counts as visible; content that does not exist until a request fires does not.",
      },
      {
        id: "duplicate",
        question: "Can I use the same FAQs on several pages?",
        answer:
          "You can, but it is better not to. Duplicate blocks across many pages add no value and dilute what each page is about. Mark up the FAQs that genuinely belong to each page.",
      },
      {
        id: "validate",
        question: "How do I check the markup is valid?",
        answer:
          "Paste the URL into Google's Rich Results Test to check eligibility, or the Schema Markup Validator for schema.org validity. Both report the exact line of any problem.",
      },
    ],
    relatedSlugs: [
      "schema-generator",
      "breadcrumb-schema-generator",
      "meta-description-generator",
      "meta-title-generator",
    ],
  },

  "breadcrumb-schema-generator": {
    slug: "breadcrumb-schema-generator",
    name: "Breadcrumb Schema Generator",
    title: "Breadcrumb Schema Generator — JSON-LD Tool",
    description:
      "Build valid BreadcrumbList JSON-LD from your page hierarchy. Add each level, copy the script tag, and paste it into your page.",
    h1: "Breadcrumb Schema Generator",
    intro:
      "BreadcrumbList schema tells search engines where a page sits in your site's hierarchy. Google uses it to replace the raw URL in search results with a readable trail such as Home › Guides › Typing. Add each level with its name and URL, then copy the generated JSON-LD.",
    iconName: "ChevronsRight",
    applicationCategory: "DeveloperApplication",
    features: [
      "Unlimited hierarchy levels",
      "Automatic position numbering",
      "URL validation on each level",
      "Copy or download the script tag",
    ],
    steps: [
      {
        name: "Start at the top",
        text: "Add your homepage as the first level, with its full URL.",
      },
      {
        name: "Add each level down",
        text: "Work down the hierarchy — category, then subcategory, then the page itself. Positions are numbered for you.",
      },
      {
        name: "Name them as users see them",
        text: "Use the label a visitor would recognise, not the URL slug. 'Running Shoes' rather than 'running-shoes'.",
      },
      {
        name: "Copy and paste it in",
        text: "Paste the script tag into the head of that page, then confirm with the Rich Results Test.",
      },
    ],
    examples: [
      {
        title: "Shop page",
        input: "Home → Shoes → Running Shoes → Trail Runner X",
        output: "4 ListItems, positions 1 to 4",
        explanation:
          "The search listing shows the readable trail instead of a long URL, which makes the result easier to scan.",
      },
      {
        title: "Blog post",
        input: "Home → Blog → SEO → Schema Guide",
        output: '{"@type":"BreadcrumbList","itemListElement":[ … ]}',
        explanation:
          "Each level needs a name and a working URL. Only the final item may omit its URL, since it is the current page.",
      },
      {
        title: "Two levels",
        input: "Home → Contact",
        output: "2 ListItems",
        explanation:
          "Shallow hierarchies are fine. A single item is pointless, so add breadcrumbs only where there is a real trail.",
      },
    ],
    benefits: [
      {
        title: "Positions numbered correctly",
        description:
          "Items are numbered from 1 in the order you add them — the detail most hand-written breadcrumb markup gets wrong.",
      },
      {
        title: "Catches broken URLs",
        description:
          "Each level's URL is checked as you type, so a malformed link is caught before the validator sees it.",
      },
      {
        title: "Better-looking listings",
        description:
          "A readable trail replaces the raw URL in search results, which makes the listing easier to scan.",
      },
      {
        title: "Reorder as you go",
        description:
          "Levels can be moved or removed and the positions renumber themselves.",
      },
      {
        title: "Runs locally",
        description:
          "Nothing is uploaded, so you can build markup for a site that is not live yet.",
      },
    ],
    limitations: [
      "The trail must reflect a real hierarchy. Inventing levels that do not exist as pages is a guideline violation.",
      "Google may still display its own breadcrumb based on the URL structure if it disagrees with your markup.",
      "URLs must be absolute and reachable. Relative paths are not valid in BreadcrumbList markup.",
      "Breadcrumbs affect how a listing is displayed, not where it ranks.",
    ],
    keyTakeaways: [
      "BreadcrumbList markup describes a page's position in the site hierarchy.",
      "Google uses it to replace the URL in search results with a readable trail.",
      "Items are numbered from 1, top level first, and URLs must be absolute.",
      "The hierarchy must match pages that genuinely exist.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is breadcrumb schema?",
        answer:
          "BreadcrumbList markup describes the path from your homepage down to the current page. Google reads it to show a readable trail in place of the URL in search results.",
      },
      {
        id: "which-pages",
        question: "Which pages should have breadcrumb markup?",
        answer:
          "Any page that sits below the homepage in a real hierarchy — categories, subcategories, product pages and posts. The homepage itself does not need it, since there is no trail above it.",
      },
      {
        id: "last-url",
        question: "Should the last item have a URL?",
        answer:
          "It is optional. The final item is the page being viewed, so its URL adds nothing, but including it is valid and some tools prefer it.",
      },
      {
        id: "match-visible",
        question: "Must the markup match the visible breadcrumbs?",
        answer:
          "It should. Google expects the structured data to reflect what is on the page. A mismatch between visible navigation and markup is a common cause of Search Console warnings.",
      },
      {
        id: "ignored",
        question: "Why is Google showing a different breadcrumb?",
        answer:
          "Google treats your markup as a strong hint rather than an instruction. If it believes the URL structure describes the hierarchy better, it may show that instead.",
      },
      {
        id: "multiple-paths",
        question: "What if a page belongs to more than one category?",
        answer:
          "You can supply several BreadcrumbList blocks, one per path, and Google picks the one it considers most relevant. In practice a single canonical path is simpler to maintain.",
      },
      {
        id: "relative-urls",
        question: "Can I use relative URLs?",
        answer:
          "No. Each item needs a full absolute URL including the protocol and domain. Relative paths are invalid here and are silently ignored.",
      },
      {
        id: "ranking",
        question: "Do breadcrumbs help rankings?",
        answer:
          "Not directly. They improve how the listing looks and how clearly your site structure is understood, which can lift click-through — but the markup itself is not a ranking signal.",
      },
      {
        id: "how-deep",
        question: "How many levels should a breadcrumb have?",
        answer:
          "As many as the real hierarchy has, usually two to five. Deep trails suggest content is buried too far from the homepage, which is a navigation problem rather than a markup one.",
      },
    ],
    relatedSlugs: [
      "schema-generator",
      "faq-schema-generator",
      "meta-title-generator",
      "meta-description-generator",
    ],
  },

  "meta-title-generator": {
    slug: "meta-title-generator",
    name: "Meta Title Generator",
    title: "Meta Title Generator — SEO Title Tag Tool",
    description:
      "Generate SEO title tags from your keyword and see exactly where Google truncates each one, measured in pixels rather than characters.",
    h1: "Meta Title Generator",
    intro:
      "A meta title, or title tag, is the clickable headline shown for your page in search results. This tool generates title options from your keyword and measures each one in pixels — which is how Google actually decides where to cut a title, not by counting characters. Titles that fit are marked; ones that will be truncated show where the cut falls.",
    iconName: "Heading",
    applicationCategory: "BusinessApplication",
    features: [
      "Ten title patterns from one keyword",
      "Pixel-width measurement, not character counts",
      "Live Google result preview",
      "Copy any title with one click",
    ],
    steps: [
      {
        name: "Enter your keyword",
        text: "Type the main phrase the page should rank for. Everything else is optional.",
      },
      {
        name: "Add brand and audience",
        text: "Supplying a brand name and target audience unlocks patterns that use them. Choosing a page type tailors the wording.",
      },
      {
        name: "Generate and compare",
        text: "Each title shows its pixel width against Google's limit, with a warning when it will be cut short.",
      },
      {
        name: "Preview and copy",
        text: "The preview shows how the title appears in a result. Copy the one that fits and reads naturally.",
      },
    ],
    examples: [
      {
        title: "Fits comfortably",
        input: '"Free Invoice Generator" (22 characters)',
        output: "≈ 210 px of 580 px — fits",
        explanation:
          "Well within the limit, leaving room for a brand suffix without risking truncation.",
      },
      {
        title: "Characters mislead",
        input: '"WWW Marketing Workshop Wisdom" (29 characters)',
        output: "≈ 340 px — far wider than 29 narrow characters",
        explanation:
          "Wide letters like W and M take roughly three times the space of i or l. This is exactly why character counts are unreliable.",
      },
      {
        title: "Gets truncated",
        input: '"The Complete Guide to Technical SEO Audits for Enterprise Websites"',
        output: "≈ 640 px — cut after 'Enterprise'",
        explanation:
          "Anything past 580 px is replaced with an ellipsis, so put the important words first.",
      },
    ],
    benefits: [
      {
        title: "Measured the way Google measures",
        description:
          "Titles are rendered and measured in pixels against a 580 px limit. Character counts treat 'WWWW' and 'iiii' as equal when one is three times wider.",
      },
      {
        title: "See the truncation point",
        description:
          "When a title is too wide, the preview shows exactly where the cut falls, so you can move the important words earlier.",
      },
      {
        title: "Ten patterns to compare",
        description:
          "Direct, listicle, how-to, question and guide formats side by side, so you can choose by search intent.",
      },
      {
        title: "A realistic preview",
        description:
          "Titles are shown in a mock search result rather than as raw text, which is where truncation actually matters.",
      },
      {
        title: "No account needed",
        description:
          "Generate as many as you like. Nothing is stored and nothing is sent anywhere.",
      },
    ],
    limitations: [
      "The 580 px limit is Google's typical desktop width. Mobile differs, and Google adjusts its layout periodically.",
      "Measurement uses Arial as the closest widely available match for Google's font, so widths are very close but not exact.",
      "Google rewrites titles it considers unhelpful — reportedly for a large share of results — regardless of what you set.",
      "Generated titles are starting points. A title written for your specific page will almost always beat a template.",
    ],
    keyTakeaways: [
      "Google truncates titles by pixel width, roughly 580 px on desktop, not by character count.",
      "Wide characters such as W and M consume far more space than narrow ones like i and l.",
      "Put the most important words first, since the end is what gets cut.",
      "Google may rewrite your title anyway, so write for the reader rather than the limit.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is a meta title?",
        answer:
          "The meta title, set with the HTML <title> tag, is the clickable headline shown for your page in search results and in the browser tab. It is one of the strongest on-page signals of what a page is about.",
      },
      {
        id: "length",
        question: "How long should a title tag be?",
        answer:
          "Aim to stay under about 580 pixels on desktop, which is roughly 55 to 60 characters depending on which letters you use. Measuring in pixels is the reliable way, because character counts ignore that W is three times wider than i.",
      },
      {
        id: "why-pixels",
        question: "Why measure pixels instead of characters?",
        answer:
          "Google renders titles in a proportional font and cuts them when they exceed the available width. 'Illinois' and 'WWWWWWWW' are both eight characters, but the second is more than twice as wide and truncates far sooner.",
      },
      {
        id: "google-rewrites",
        question: "Why did Google change my title?",
        answer:
          "Google rewrites titles when it judges its own version more useful for the query — often pulling from your H1 or on-page text. Titles that are too long, keyword-stuffed or too vague are the most likely to be replaced.",
      },
      {
        id: "brand",
        question: "Should I put my brand name in the title?",
        answer:
          "Usually at the end, separated by a dash or pipe, and only if there is room. On a page competing for a specific query the keyword matters more than the brand — though a well-known brand can raise click-through.",
      },
      {
        id: "keyword-placement",
        question: "Where should the keyword go?",
        answer:
          "Near the front. It is the first thing a searcher reads, and truncation always removes the end, so anything essential belongs early.",
      },
      {
        id: "duplicates",
        question: "Can two pages share a title?",
        answer:
          "They should not. Duplicate titles make it harder for search engines to tell the pages apart and for searchers to choose between them. Search Console reports duplicates under Pages.",
      },
      {
        id: "vs-h1",
        question: "Is the title tag the same as the H1?",
        answer:
          "No. The title appears in the search result and the browser tab; the H1 is the heading on the page itself. They should be closely related but do not need to be identical — the title can be tuned for search, the H1 for the reader.",
      },
      {
        id: "how-many",
        question: "How many titles should I try?",
        answer:
          "Generate several, then rewrite the best one in your own words. Templates are useful for breaking a blank page, but the strongest titles describe what makes that specific page worth clicking.",
      },
    ],
    relatedSlugs: [
      "meta-description-generator",
      "schema-generator",
      "faq-schema-generator",
      "breadcrumb-schema-generator",
    ],
  },

  "meta-description-generator": {
    slug: "meta-description-generator",
    name: "Meta Description Generator",
    title: "Meta Description Generator — Free SEO Tool",
    description:
      "Write meta descriptions that fit. Generate options from your keyword and see the pixel width Google actually truncates at.",
    h1: "Meta Description Generator",
    intro:
      "A meta description is the short summary shown under your title in search results. It does not affect rankings, but it is your pitch to the searcher, so a clear one earns more clicks. This tool generates descriptions from your keyword and measures each in pixels — the measure Google truncates by — rather than counting characters.",
    iconName: "AlignLeft",
    applicationCategory: "BusinessApplication",
    features: [
      "Several description patterns",
      "Pixel-width measurement against Google's limit",
      "Live search result preview",
      "Copy any option with one click",
    ],
    steps: [
      {
        name: "Enter your keyword",
        text: "Type the phrase the page targets. Add a brand and audience to unlock more specific patterns.",
      },
      {
        name: "Pick the page type",
        text: "The wording adapts to what the page is — a guide, a product, a tool or a category.",
      },
      {
        name: "Check the width",
        text: "Each option shows its pixel width against the roughly 920 px Google allows on desktop.",
      },
      {
        name: "Preview and copy",
        text: "See it under the title in a mock result, then copy the one that reads best.",
      },
    ],
    examples: [
      {
        title: "Fits well",
        input: '"Convert PDF to Word free. No sign-up, no watermark, files never uploaded." (73 characters)',
        output: "≈ 560 px of 920 px — fits",
        explanation:
          "Comfortably inside the limit. Short, specific descriptions often outperform ones padded to fill the space.",
      },
      {
        title: "Just over",
        input: "A 165-character description",
        output: "≈ 990 px — cut mid-sentence",
        explanation:
          "Past roughly 920 px the text ends in an ellipsis, so anything essential must come before the cut.",
      },
      {
        title: "Keyword stuffed",
        input: '"PDF converter, PDF tool, convert PDF, PDF online, free PDF…"',
        output: "Fits, but likely to be replaced",
        explanation:
          "Google discards descriptions that read as keyword lists and writes its own snippet from page content instead.",
      },
    ],
    benefits: [
      {
        title: "Pixel-accurate limits",
        description:
          "Measured against Google's roughly 920 px desktop width rather than a character count that ignores letter width.",
      },
      {
        title: "See it as a searcher would",
        description:
          "The preview places your description under the title exactly as it appears in a result.",
      },
      {
        title: "Patterns that suit the intent",
        description:
          "Benefit-led, question-led and direct-answer patterns, so you can match how people search.",
      },
      {
        title: "Honest about what it does",
        description:
          "Descriptions do not affect rankings. This tool optimises for the click, which is what they actually influence.",
      },
      {
        title: "Free and private",
        description:
          "No account, no limits, and nothing you type leaves your browser.",
      },
    ],
    limitations: [
      "Google replaces meta descriptions for most queries, generating a snippet from page content instead. Yours is a suggestion.",
      "The roughly 920 px desktop limit varies by device, and mobile shows considerably less.",
      "Widths are measured in Arial, the closest widely available match for Google's font, so they are very close but not exact.",
      "Meta descriptions have not been a ranking factor for many years. They influence click-through only.",
    ],
    keyTakeaways: [
      "A meta description is the summary under your search listing; it affects clicks, not rankings.",
      "Google truncates at roughly 920 px on desktop — about 150 to 160 characters, depending on the letters.",
      "Google often writes its own snippet instead, particularly when the query matches text elsewhere on the page.",
      "Write for the searcher: say what the page gives them and why it is worth the click.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is a meta description?",
        answer:
          "A meta description is a short summary in the page's HTML that search engines may show beneath the title in results. Its job is to persuade a searcher that your page answers their question.",
      },
      {
        id: "ranking-factor",
        question: "Do meta descriptions affect rankings?",
        answer:
          "No. Google confirmed years ago that meta descriptions are not a ranking factor. They influence whether people click your result, which matters, but they do not move your position directly.",
      },
      {
        id: "length",
        question: "How long should a meta description be?",
        answer:
          "Around 150 to 160 characters, or under roughly 920 pixels on desktop. Measuring width is more reliable than counting characters, since letter widths vary considerably.",
      },
      {
        id: "google-rewrites",
        question: "Why does Google show different text than I wrote?",
        answer:
          "Google rewrites the snippet for most queries, pulling the passage that best matches what was searched. That is usually helpful — one description cannot suit every query a page ranks for.",
      },
      {
        id: "should-i-bother",
        question: "Is it worth writing one if Google often ignores it?",
        answer:
          "Yes. Yours is used often enough to matter, particularly for brand and exact-match queries, and it is what appears when your page is shared on platforms that read meta tags.",
      },
      {
        id: "keywords",
        question: "Should I include my keyword?",
        answer:
          "Include it naturally, once. Google bolds terms matching the query, which draws the eye. Repeating keywords makes the description read as spam and increases the chance it is discarded.",
      },
      {
        id: "every-page",
        question: "Does every page need one?",
        answer:
          "Write them for pages that matter — the ones you want clicked. For thousands of near-identical pages, letting Google generate snippets is often better than templated descriptions that all read the same.",
      },
      {
        id: "duplicates",
        question: "What happens if two pages share a description?",
        answer:
          "Search Console flags duplicates. It is not a penalty, but identical summaries give searchers no reason to prefer one result over the other, and Google is more likely to write its own.",
      },
      {
        id: "mobile",
        question: "Does the limit differ on mobile?",
        answer:
          "Yes — mobile results show noticeably less text than desktop. If most of your traffic is on phones, front-load the important part into the first hundred characters or so.",
      },
    ],
    relatedSlugs: [
      "meta-title-generator",
      "schema-generator",
      "faq-schema-generator",
      "breadcrumb-schema-generator",
    ],
  },
  "open-graph-generator": {
    slug: "open-graph-generator",
    name: "Open Graph Generator",
    title: "Open Graph Generator — Free OG Meta Tags",
    description:
      "Generate Open Graph meta tags and preview how your link looks when shared on Facebook, LinkedIn and WhatsApp before you publish.",
    h1: "Open Graph Generator",
    intro:
      "Open Graph tags are meta tags that tell Facebook, LinkedIn, WhatsApp and Slack what title, description and image to show when someone shares your link. Without them, platforms guess — often picking the wrong image or no image at all. Fill in the fields, check the live preview, and copy the tags into your page's head.",
    iconName: "Share2",
    applicationCategory: "DeveloperApplication",
    features: [
      "All core Open Graph tags",
      "Live share preview",
      "Image size and ratio checks",
      "Copy or download the markup",
    ],
    steps: [
      {
        name: "Enter the page details",
        text: "Add the canonical URL, the title and the description you want shown when the link is shared.",
      },
      {
        name: "Add an image",
        text: "Paste an absolute image URL. 1200 × 630 pixels is the size every major platform crops cleanly.",
      },
      {
        name: "Check the preview",
        text: "The preview shows how the card appears and where each platform truncates your text.",
      },
      {
        name: "Copy the tags",
        text: "Paste them into the <head> of the page, then clear the cache with Facebook's Sharing Debugger.",
      },
    ],
    examples: [
      {
        title: "Blog post",
        input: "og:type article, title, description, 1200 × 630 image",
        output: '<meta property="og:image" content="https://…/cover.jpg" />',
        explanation:
          "A large image card is the most clicked format on Facebook and LinkedIn. Anything under 600 px wide falls back to a small thumbnail.",
      },
      {
        title: "Title with an ampersand",
        input: "Tom & Jerry <Best Moments>",
        output: 'content="Tom &amp; Jerry &lt;Best Moments&gt;"',
        explanation:
          "Ampersands and angle brackets must be escaped or the meta tag breaks the page's HTML. This is escaped for you.",
      },
      {
        title: "Missing image",
        input: "Title and description only",
        output: "Valid tags, but a text-only share card",
        explanation:
          "Platforms show a plain link without og:image, which draws far fewer clicks than a card with a picture.",
      },
    ],
    benefits: [
      {
        title: "See the card before you publish",
        description:
          "The preview shows the title, description and image as they appear in a feed, including where each platform cuts the text.",
      },
      {
        title: "Escaping handled properly",
        description:
          "Ampersands, angle brackets and quotes are escaped in the right order, so a title containing them cannot break your markup.",
      },
      {
        title: "Image checks built in",
        description:
          "The image is loaded and measured, so you find out it is the wrong size or unreachable here rather than after sharing.",
      },
      {
        title: "Covers every major platform",
        description:
          "Facebook, LinkedIn, WhatsApp, Slack, Discord and Pinterest all read Open Graph, so one set of tags serves all of them.",
      },
      {
        title: "Runs in your browser",
        description:
          "Nothing you type is uploaded, so you can prepare tags for a page that is not live yet.",
      },
    ],
    limitations: [
      "Platforms cache aggressively. After changing tags you must clear the cache in Facebook's Sharing Debugger or LinkedIn's Post Inspector, or the old card keeps appearing.",
      "The image URL must be absolute and publicly reachable. Images behind a login or on localhost will not load for the crawler.",
      "Each platform crops and truncates differently, so the preview is a close approximation rather than an exact copy.",
      "X reads Open Graph as a fallback, but a dedicated Twitter card gives you more control there.",
    ],
    keyTakeaways: [
      "Open Graph tags control the title, description and image shown when your link is shared.",
      "1200 × 630 pixels is the image size that crops cleanly on every major platform.",
      "og:title, og:description, og:image and og:url are the four tags that matter most.",
      "Platforms cache share cards, so clear the cache after changing tags.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What are Open Graph tags?",
        answer:
          "Open Graph is a set of meta tags, originally created by Facebook, that tell social platforms how to display your link. They set the headline, summary and image on the card people see in their feed.",
      },
      {
        id: "image-size",
        question: "What size should the Open Graph image be?",
        answer:
          "1200 × 630 pixels, a 1.91:1 ratio. That is what Facebook, LinkedIn and Slack crop cleanly. Below 600 px wide, platforms fall back to a small square thumbnail instead of a large card.",
      },
      {
        id: "not-updating",
        question: "Why is my old image still showing after I changed it?",
        answer:
          "Platforms cache share cards, sometimes for weeks. Run the URL through Facebook's Sharing Debugger and click Scrape Again, or use LinkedIn's Post Inspector, to force a refresh.",
      },
      {
        id: "required-tags",
        question: "Which Open Graph tags are actually required?",
        answer:
          "og:title, og:type, og:image and og:url are the four the specification lists as required. In practice og:description matters too, since it is the text under the headline on the card.",
      },
      {
        id: "vs-meta-description",
        question: "Is og:description the same as the meta description?",
        answer:
          "No. The meta description is for search results; og:description is for share cards. They can differ — a search description should answer a query, while a share description should make someone want to click in a feed.",
      },
      {
        id: "twitter",
        question: "Do I still need Twitter card tags?",
        answer:
          "X falls back to Open Graph when Twitter tags are absent, so a basic card works. Add Twitter tags when you want a different image or headline there, or to specify the card type.",
      },
      {
        id: "where",
        question: "Where do the tags go?",
        answer:
          "Inside the <head> element, ideally near the top. Tags placed in the body are ignored, and some crawlers only read the first portion of the document.",
      },
      {
        id: "relative-urls",
        question: "Can I use a relative image URL?",
        answer:
          "No. og:image and og:url must be absolute, including the protocol and domain. A crawler fetching your page from outside has no base to resolve a relative path against.",
      },
      {
        id: "ranking",
        question: "Do Open Graph tags help SEO?",
        answer:
          "Not directly — they are not a ranking factor. They improve how shared links look, which lifts click-through and referral traffic, and that indirect engagement is where the value sits.",
      },
    ],
    relatedSlugs: [
      "twitter-card-generator",
      "meta-title-generator",
      "meta-description-generator",
      "schema-generator",
    ],
  },

  "twitter-card-generator": {
    slug: "twitter-card-generator",
    name: "Twitter Card Generator",
    title: "Twitter Card Generator — X Meta Tags Free",
    description:
      "Generate Twitter card meta tags for X and preview the card before you post. Supports summary and large image cards.",
    h1: "Twitter Card Generator",
    intro:
      "Twitter card tags control how your link appears when shared on X. They set the card type, headline, description and image, overriding the Open Graph tags X would otherwise fall back to. Choose a card type, fill in the fields, check the preview, and copy the tags into your page's head.",
    iconName: "Twitter",
    applicationCategory: "DeveloperApplication",
    features: [
      "Summary and large image cards",
      "Live card preview",
      "Image ratio validation per card type",
      "Copy or download the markup",
    ],
    steps: [
      {
        name: "Choose the card type",
        text: "Summary shows a small square thumbnail. Summary large image shows a wide banner and earns noticeably more clicks.",
      },
      {
        name: "Add title and description",
        text: "X truncates the title around 70 characters and the description around 200, so front-load what matters.",
      },
      {
        name: "Add an image",
        text: "Use 1200 × 628 for a large image card, or a square image of at least 144 × 144 for a summary card.",
      },
      {
        name: "Copy the tags",
        text: "Paste them into the <head>. X caches cards, so changes can take time to appear.",
      },
    ],
    examples: [
      {
        title: "Large image card",
        input: "summary_large_image, 1200 × 628 banner",
        output: '<meta name="twitter:card" content="summary_large_image" />',
        explanation:
          "The wide banner takes far more space in the timeline than a summary card, which is why most publishers use it.",
      },
      {
        title: "Summary card",
        input: "summary, square 400 × 400 image",
        output: '<meta name="twitter:card" content="summary" />',
        explanation:
          "A compact card with a square thumbnail beside the text. Suits short updates where a banner would be overkill.",
      },
      {
        title: "Wrong ratio for the card type",
        input: "summary_large_image with a 400 × 400 square image",
        output: "Warning: large image cards expect roughly 1.91:1",
        explanation:
          "X crops a square image to fit the banner, cutting the top and bottom. The tool flags the mismatch before you publish.",
      },
    ],
    benefits: [
      {
        title: "Preview the card first",
        description:
          "See the headline, description and image as they appear in a timeline, with X's truncation applied.",
      },
      {
        title: "Ratio checked per card type",
        description:
          "The image is measured and compared against what your chosen card type expects, so bad crops are caught early.",
      },
      {
        title: "Correct escaping",
        description:
          "Ampersands, angle brackets and quotes are escaped in the right order, so a title containing them cannot break the page.",
      },
      {
        title: "Open Graph fallback included",
        description:
          "Optionally emit matching og: tags, so the same link also renders properly on Facebook, LinkedIn and Slack.",
      },
      {
        title: "Free and private",
        description:
          "No account, and nothing you type leaves your browser.",
      },
    ],
    limitations: [
      "X caches cards. A changed image or title can take time to appear, and there is no longer a public validator to force a refresh.",
      "The image must be absolute, publicly reachable and under 5 MB. Images behind a login will not load.",
      "twitter:site and twitter:creator must be real handles including the @ — an invalid handle is dropped rather than shown.",
      "X reads Open Graph when Twitter tags are missing, so these tags only matter when you want different content there.",
    ],
    keyTakeaways: [
      "Twitter card tags control how a link renders on X, overriding Open Graph.",
      "summary_large_image shows a wide banner and earns more clicks than the compact summary card.",
      "Use 1200 × 628 for large image cards and a square image for summary cards.",
      "Titles truncate around 70 characters and descriptions around 200.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is a Twitter card?",
        answer:
          "A Twitter card is the preview panel X shows when someone posts your link. Meta tags on your page decide whether it appears as a compact summary or a large banner, and what headline, text and image it uses.",
      },
      {
        id: "card-types",
        question: "Which card type should I use?",
        answer:
          "summary_large_image for almost everything — the wide banner occupies far more of the timeline and attracts more clicks. Use summary when the image is incidental or only a square logo is available.",
      },
      {
        id: "image-size",
        question: "What image size does X need?",
        answer:
          "1200 × 628 pixels for a large image card, roughly 1.91:1. Summary cards use a square image of at least 144 × 144. Files must be under 5 MB and in JPG, PNG, WebP or GIF.",
      },
      {
        id: "need-both",
        question: "Do I need both Twitter and Open Graph tags?",
        answer:
          "Not strictly — X falls back to Open Graph when Twitter tags are absent. Add Twitter tags when you want a different image or headline on X, or to force a specific card type.",
      },
      {
        id: "not-showing",
        question: "Why is my card not showing on X?",
        answer:
          "The usual causes are an unreachable image, a relative URL, a page blocked in robots.txt, or X's cache still holding an older version. Check that the image loads in a private window with no session.",
      },
      {
        id: "validator",
        question: "How do I test my card?",
        answer:
          "X retired its public Card Validator, so testing now means posting the link — a draft post is enough to see the preview. The preview here approximates the same layout and truncation.",
      },
      {
        id: "handles",
        question: "What do twitter:site and twitter:creator do?",
        answer:
          "twitter:site is the account behind the website; twitter:creator is the individual author. Both take a handle including the @. They attribute the card and can appear on it, but neither is required.",
      },
      {
        id: "truncation",
        question: "How long can the title and description be?",
        answer:
          "Titles are cut around 70 characters and descriptions around 200, though X adjusts by layout. Put the important words first, since truncation always removes the end.",
      },
      {
        id: "alt-text",
        question: "Should I set twitter:image:alt?",
        answer:
          "Yes. It describes the image for people using a screen reader, and it is the only accessibility attribute a card supports. Keep it under 420 characters.",
      },
    ],
    relatedSlugs: [
      "open-graph-generator",
      "meta-title-generator",
      "meta-description-generator",
      "schema-generator",
    ],
  },
  "canonical-tag-checker": {
    slug: "canonical-tag-checker",
    name: "Canonical Tag Checker",
    title: "Canonical Tag Checker — Free SEO Audit Tool",
    description:
      "Check any page's canonical tag, see whether it is self-referencing, and catch redirect and mismatch problems before Google does.",
    h1: "Canonical Tag Checker",
    intro:
      "A canonical tag tells search engines which URL is the preferred version of a page when the same content is reachable at several addresses. This checker fetches a live page, finds its canonical tag, follows any redirects, and reports whether the tag points back at the page itself. Paste a URL to see exactly what a crawler sees.",
    iconName: "Link2",
    applicationCategory: "DeveloperApplication",
    features: [
      "Live page fetch",
      "Self-referencing detection",
      "Redirect chain reporting",
      "Relative URL resolution",
    ],
    steps: [
      {
        name: "Paste the URL",
        text: "Enter the full address of a public page, including https://.",
      },
      {
        name: "Run the check",
        text: "The page is fetched server-side with a real user agent, following any redirects along the way.",
      },
      {
        name: "Read the result",
        text: "You get the canonical URL found, the final URL after redirects, the status code, and whether the two agree.",
      },
      {
        name: "Fix what it flags",
        text: "A missing, relative or mismatched canonical is reported with what to change.",
      },
    ],
    examples: [
      {
        title: "Healthy page",
        input: "https://example.com/blog/post",
        output: "Canonical matches the final URL — self-referencing",
        explanation:
          "This is what most pages should look like. The canonical points at itself, so there is no ambiguity about which URL to index.",
      },
      {
        title: "Redirect changes the URL",
        input: "http://example.com/page (redirects to https)",
        output: "Final URL https://example.com/page · canonical agrees",
        explanation:
          "The checker follows redirects and compares the canonical against the final URL, not the one you typed.",
      },
      {
        title: "Relative canonical",
        input: '<link rel="canonical" href="/page" />',
        output: "Resolved to https://example.com/page",
        explanation:
          "Relative canonicals are valid but easy to get wrong. The tool resolves them against the page URL so you can see what Google would.",
      },
    ],
    benefits: [
      {
        title: "Sees what a crawler sees",
        description:
          "The page is fetched server-side rather than read from your browser, so the result reflects what a search engine receives.",
      },
      {
        title: "Redirects followed and reported",
        description:
          "You find out when the URL you entered is not the URL that finally served the page, which is where most canonical confusion starts.",
      },
      {
        title: "Relative URLs resolved",
        description:
          "A canonical of /page is resolved to its absolute form, so comparisons are meaningful instead of always failing.",
      },
      {
        title: "Trailing slashes handled",
        description:
          "URLs are compared after normalising trailing slashes and default ports, so cosmetic differences are not reported as mismatches.",
      },
      {
        title: "Free with no account",
        description:
          "Check any public page. Requests are rate limited to keep the service available for everyone.",
      },
    ],
    limitations: [
      "Only public pages can be checked. Anything behind a login, a firewall or an aggressive bot filter will fail to fetch.",
      "Canonicals injected by JavaScript after load are not seen, because only the served HTML is read. Google may still process them.",
      "Only the first 100 KB of HTML is read, which covers the head on virtually every page but could miss a canonical placed unusually late.",
      "A canonical is a hint, not an instruction. Google can and does ignore one it disagrees with.",
    ],
    keyTakeaways: [
      "A canonical tag names the preferred URL when the same content sits at several addresses.",
      "Most pages should have a self-referencing canonical pointing at their own final URL.",
      "Canonicals are compared against the URL after redirects, not the one you typed.",
      "Google treats canonicals as a hint and may choose a different URL.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is a canonical tag?",
        answer:
          "A canonical tag is a link element in a page's head naming the preferred URL for that content. It exists so that when the same page is reachable at several addresses, search engines know which one to index and credit.",
      },
      {
        id: "self-referencing",
        question: "Should every page point at itself?",
        answer:
          "Yes, in almost all cases. A self-referencing canonical removes ambiguity and protects against duplicate URLs created by tracking parameters or trailing-slash variations. Point elsewhere only when the page really is a duplicate of another.",
      },
      {
        id: "missing",
        question: "What happens if a page has no canonical tag?",
        answer:
          "Google picks a canonical itself, based on internal links, sitemaps and redirects. It often chooses correctly, but you have no control — and on sites with parameters or pagination it frequently chooses wrong.",
      },
      {
        id: "relative",
        question: "Can a canonical URL be relative?",
        answer:
          "It is technically valid, but absolute URLs are strongly recommended. A relative canonical resolves against the page's base URL, and any confusion there points the canonical somewhere unintended.",
      },
      {
        id: "redirects",
        question: "Why does the final URL differ from the one I entered?",
        answer:
          "The page redirected — commonly http to https, or a non-www to www version. The canonical should match the final URL, since that is the one actually serving the content.",
      },
      {
        id: "ignored",
        question: "Why is Google indexing a different URL than my canonical?",
        answer:
          "Canonicals are a hint. If Google sees conflicting signals — internal links, sitemap entries or redirects pointing elsewhere — it may pick its own. Search Console's URL Inspection tool shows which URL it chose and why.",
      },
      {
        id: "vs-redirect",
        question: "Should I use a canonical or a 301 redirect?",
        answer:
          "Use a 301 when the old URL should no longer be reachable. Use a canonical when both URLs must stay available — a product in two categories, or a page with tracking parameters — but only one should be indexed.",
      },
      {
        id: "multiple",
        question: "What if a page has more than one canonical tag?",
        answer:
          "Google ignores all of them and picks a URL itself. Duplicate canonicals usually come from a theme and a plugin both adding one, so check for a second tag if results look wrong.",
      },
      {
        id: "javascript",
        question: "Does this detect canonicals added by JavaScript?",
        answer:
          "No. Only the HTML served by the server is read. Google renders JavaScript and may pick up such a canonical, but relying on that is risky — put the canonical in the initial HTML.",
      },
    ],
    relatedSlugs: [
      "robots-txt-generator",
      "sitemap-generator",
      "meta-title-generator",
      "schema-generator",
    ],
  },

  "robots-txt-generator": {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    title: "Robots.txt Generator — Free & Validated",
    description:
      "Build a valid robots.txt with allow and disallow rules, crawl delays and sitemap entries. Preview how each URL is treated.",
    h1: "Robots.txt Generator",
    intro:
      "A robots.txt file sits at the root of your domain and tells crawlers which parts of your site they may request. This generator builds one from simple rules, warns about the mistakes that accidentally block a whole site, and lets you test any path against the result before you publish.",
    iconName: "FileCode",
    applicationCategory: "DeveloperApplication",
    features: [
      "Per-user-agent rule groups",
      "Common presets for AI and SEO crawlers",
      "Live path tester",
      "Warnings for site-wide blocks",
    ],
    steps: [
      {
        name: "Choose which crawlers",
        text: "Start with a rule for all crawlers, then add groups for specific bots such as Googlebot or GPTBot.",
      },
      {
        name: "Add allow and disallow paths",
        text: "Disallow the paths crawlers should not request, such as /admin/ or /cart/. Paths are matched from the start of the URL.",
      },
      {
        name: "Add your sitemap",
        text: "Point crawlers at your sitemap with its full absolute URL. This is the single most useful line in the file.",
      },
      {
        name: "Test and publish",
        text: "Check a few paths in the tester, then save the file as robots.txt at the root of your domain.",
      },
    ],
    examples: [
      {
        title: "Typical site",
        input: "Disallow /admin/ and /cart/, allow everything else",
        output: "User-agent: *\\nDisallow: /admin/\\nDisallow: /cart/",
        explanation:
          "Private areas are kept out of the index while the rest of the site stays crawlable.",
      },
      {
        title: "Blocking the whole site by accident",
        input: "Disallow: /",
        output: "Warning: this blocks every crawler from the entire site",
        explanation:
          "A single slash blocks everything. It is the most common and most damaging robots.txt mistake, so the tool flags it.",
      },
      {
        title: "Blocking AI crawlers only",
        input: "GPTBot and CCBot disallowed, others allowed",
        output: "User-agent: GPTBot\\nDisallow: /",
        explanation:
          "Named groups let you keep search crawlers while excluding AI training bots. Each group applies only to the agent it names.",
      },
    ],
    benefits: [
      {
        title: "Catches the disaster cases",
        description:
          "A bare Disallow: / on all agents deindexes a site. The tool warns before you copy anything that would do that.",
      },
      {
        title: "Test paths before publishing",
        description:
          "Enter any URL path and see which rule matches and whether it is allowed, using the same longest-match logic crawlers use.",
      },
      {
        title: "Presets for real crawlers",
        description:
          "One click adds correctly spelled groups for Googlebot, Bingbot, GPTBot, ClaudeBot and others — misspelled agent names are silently ignored by crawlers.",
      },
      {
        title: "Correct group syntax",
        description:
          "Rules are grouped per user-agent with proper ordering, which is where hand-written files most often go wrong.",
      },
      {
        title: "Free and private",
        description:
          "Everything runs in your browser and no account is needed.",
      },
    ],
    limitations: [
      "Robots.txt controls crawling, not indexing. A blocked URL can still appear in results if other sites link to it — use a noindex meta tag to keep a page out of the index.",
      "It is advisory. Well-behaved crawlers obey it; scrapers and malicious bots ignore it entirely.",
      "The file must sit at the domain root, at /robots.txt. In a subdirectory it has no effect.",
      "Blocking a page with robots.txt stops Google reading its noindex tag, so the two must never be combined on the same URL.",
    ],
    keyTakeaways: [
      "Robots.txt tells crawlers which paths they may request; it must live at the domain root.",
      "It controls crawling, not indexing — blocked pages can still be listed if linked elsewhere.",
      "Disallow: / blocks an entire site and is the most common serious mistake.",
      "Never block a URL you also want to carry a noindex tag, as the crawler will never read it.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is a robots.txt file?",
        answer:
          "A plain text file at the root of your domain that tells crawlers which paths they may request. It is the first thing most crawlers fetch when they visit a site.",
      },
      {
        id: "where",
        question: "Where does the generated robots.txt go?",
        answer:
          "At the root of the domain, reachable at https://yourdomain.com/robots.txt. Crawlers look only there — a file in a subdirectory is ignored completely.",
      },
      {
        id: "crawl-vs-index",
        question: "Does blocking a page remove it from Google?",
        answer:
          "No. Robots.txt stops a page being crawled, not indexed. A blocked URL that other sites link to can still be listed, usually without a description. To remove a page, allow crawling and add a noindex meta tag.",
      },
      {
        id: "noindex-conflict",
        question: "Can I use Disallow and noindex together?",
        answer:
          "No, and combining them backfires. If robots.txt blocks the URL, the crawler never fetches the page and never sees the noindex tag, so the page can stay indexed indefinitely.",
      },
      {
        id: "wildcards",
        question: "Do wildcards work?",
        answer:
          "Google and Bing support * to match any sequence and $ to match the end of a URL, so Disallow: /*.pdf$ blocks PDF files. Support is not universal, so keep rules simple where you can.",
      },
      {
        id: "crawl-delay",
        question: "Is Crawl-delay respected?",
        answer:
          "Google ignores it entirely — crawl rate is managed in Search Console. Bing and Yandex do honour it. Include it only if those crawlers are overloading your server.",
      },
      {
        id: "ai-crawlers",
        question: "How do I block AI crawlers?",
        answer:
          "Add a group for each bot, such as GPTBot, ClaudeBot, CCBot or Google-Extended, with Disallow: /. The names must be exact — a typo means the rule silently does nothing.",
      },
      {
        id: "order",
        question: "Which rule wins when two match?",
        answer:
          "The most specific match wins, meaning the longest matching path, not the first one listed. Allow: /blog/public/ overrides Disallow: /blog/ because it is longer.",
      },
      {
        id: "empty",
        question: "What if I do not need to block anything?",
        answer:
          "Publish a file with User-agent: * and Disallow: left blank, plus your sitemap line. That allows everything explicitly and still gives crawlers the sitemap pointer.",
      },
    ],
    relatedSlugs: [
      "sitemap-generator",
      "canonical-tag-checker",
      "schema-generator",
      "meta-title-generator",
    ],
  },

  "sitemap-generator": {
    slug: "sitemap-generator",
    name: "Sitemap Generator",
    title: "XML Sitemap Generator — Free & Validated",
    description:
      "Turn a list of URLs into a valid XML sitemap with priority, change frequency and last-modified dates. Copy or download the file.",
    h1: "XML Sitemap Generator",
    intro:
      "An XML sitemap is a file listing the URLs on your site that you want search engines to crawl. This generator turns a plain list of addresses into a valid sitemap, escaping special characters and validating each URL as you paste it. Add your dates and priorities, then download the file and submit it in Search Console.",
    iconName: "Network",
    applicationCategory: "DeveloperApplication",
    features: [
      "Paste a list of URLs",
      "Per-URL priority and change frequency",
      "Automatic XML escaping",
      "Validation against the 50,000 URL limit",
    ],
    steps: [
      {
        name: "Paste your URLs",
        text: "One absolute URL per line. Invalid or duplicate entries are flagged as you paste.",
      },
      {
        name: "Set defaults",
        text: "Choose a last-modified date, change frequency and priority to apply to every URL.",
      },
      {
        name: "Adjust individual pages",
        text: "Give your most important pages a higher priority than the rest. Relative importance is all that matters.",
      },
      {
        name: "Download and submit",
        text: "Save sitemap.xml to your site root, reference it in robots.txt, and submit it in Search Console.",
      },
    ],
    examples: [
      {
        title: "Small site",
        input: "12 URLs, weekly, priority 0.8",
        output: "<urlset> with 12 <url> entries",
        explanation:
          "For a site this size one sitemap is plenty. The 50,000 URL limit only matters for large catalogues.",
      },
      {
        title: "URL with query parameters",
        input: "https://example.com/search?q=shoes&size=10",
        output: "…?q=shoes&amp;size=10",
        explanation:
          "Ampersands must be escaped or the XML is invalid. This is handled automatically and is a common cause of rejected sitemaps.",
      },
      {
        title: "Homepage priority",
        input: "Homepage 1.0, everything else 0.5",
        output: "<priority>1.0</priority>",
        explanation:
          "Priority is relative within your own sitemap. It tells Google which of your pages matter most, not how you rank against other sites.",
      },
    ],
    benefits: [
      {
        title: "Valid XML every time",
        description:
          "Ampersands, angle brackets and quotes in URLs are escaped correctly, which is the single most common reason a sitemap is rejected.",
      },
      {
        title: "URLs validated as you paste",
        description:
          "Malformed addresses, relative paths and duplicates are flagged before they reach the file.",
      },
      {
        title: "Limits enforced",
        description:
          "The 50,000 URL and 50 MB caps are checked, with guidance on splitting into a sitemap index when you exceed them.",
      },
      {
        title: "Per-page control",
        description:
          "Set a sensible default for everything, then raise the priority on the handful of pages that matter most.",
      },
      {
        title: "Runs in your browser",
        description:
          "Your URL list is never uploaded, which matters when a site is not public yet.",
      },
    ],
    limitations: [
      "A sitemap helps crawlers discover URLs; it does not guarantee they will be indexed. Google decides what is worth keeping.",
      "One file holds at most 50,000 URLs or 50 MB uncompressed. Beyond that you need several sitemaps and a sitemap index.",
      "Google ignores changefreq entirely and treats priority as a weak hint. Both are safe to include but neither does much.",
      "Only include canonical URLs that return 200. Listing redirects, 404s or non-canonical duplicates wastes crawl budget and can trigger warnings.",
    ],
    keyTakeaways: [
      "An XML sitemap lists the URLs you want crawled, and belongs at your site root.",
      "One file holds up to 50,000 URLs or 50 MB before you need a sitemap index.",
      "Ampersands and angle brackets in URLs must be XML-escaped or the file is invalid.",
      "Google ignores changefreq and treats priority as a weak hint at best.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is an XML sitemap?",
        answer:
          "A file listing the URLs on your site you want search engines to crawl, along with optional metadata such as when each page last changed. It helps crawlers find pages that internal linking alone might not surface.",
      },
      {
        id: "need-one",
        question: "Does my site need a sitemap?",
        answer:
          "Small, well-linked sites often manage without one. Sitemaps matter most for large sites, new sites with few external links, and sites with pages that are not reachable through normal navigation.",
      },
      {
        id: "where",
        question: "Where do I put it?",
        answer:
          "Usually at https://yourdomain.com/sitemap.xml. Reference it from robots.txt with a Sitemap: line and submit it in Google Search Console so it is picked up promptly.",
      },
      {
        id: "limits",
        question: "How many URLs can one sitemap hold?",
        answer:
          "50,000 URLs, or 50 MB uncompressed, whichever comes first. Past that, split into several files and list them in a sitemap index, which itself can reference up to 50,000 sitemaps.",
      },
      {
        id: "priority",
        question: "Does priority affect rankings?",
        answer:
          "No. Priority only expresses which of your own pages you consider most important, and Google has said it largely ignores the field. It never affects how you compare with other sites.",
      },
      {
        id: "changefreq",
        question: "Should I set changefreq?",
        answer:
          "It does no harm, but Google ignores it and relies on observed change patterns instead. Keeping lastmod accurate is far more useful than guessing at a frequency.",
      },
      {
        id: "lastmod",
        question: "What should lastmod be?",
        answer:
          "The date the page's content genuinely last changed. Google does use it, but only when it proves trustworthy — setting every page to today on every build teaches it to ignore the field.",
      },
      {
        id: "which-urls",
        question: "Which URLs should I include?",
        answer:
          "Only canonical URLs that return 200 and that you want indexed. Leave out redirects, error pages, noindex pages and non-canonical duplicates — including them wastes crawl budget and creates Search Console warnings.",
      },
      {
        id: "indexing",
        question: "Will submitting a sitemap get my pages indexed?",
        answer:
          "It helps them be discovered, which is a prerequisite, but not indexed. Google still judges whether each page is worth keeping, and thin or duplicate pages are commonly crawled and then dropped.",
      },
    ],
    relatedSlugs: [
      "robots-txt-generator",
      "canonical-tag-checker",
      "schema-generator",
      "meta-description-generator",
    ],
  },
};

export const SEO_TOOL_SLUGS = Object.keys(SEO_TOOLS);

export function getSeoTool(slug: string): SeoToolConfig {
  const tool = SEO_TOOLS[slug];
  if (!tool) {
    throw new Error(
      `Unknown SEO tool "${slug}". Add it to SEO_TOOLS in src/lib/seo-tools/tools.config.ts.`,
    );
  }
  return tool;
}

/** Resolves related slugs into configs, skipping any that are not defined yet. */
export function getRelatedSeoTools(slug: string): SeoToolConfig[] {
  return getSeoTool(slug)
    .relatedSlugs.map((related) => SEO_TOOLS[related])
    .filter((tool): tool is SeoToolConfig => Boolean(tool));
}
