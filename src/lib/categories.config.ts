export interface Subcategory {
  name: string;
  slug: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CategoryConfig {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  shortDesc: string;
  color: "teal" | "amber" | "purple" | "blue" | "coral" | "pink" | "green";
  iconName: string;
  subcategories: Subcategory[];
  aboutHtml: string;
  benefits: Benefit[];
  faqs: FAQ[];
}

export const CATEGORIES_CONFIG: Record<string, CategoryConfig> = {
  calculators: {
    slug: "calculators",
    name: "Calculators",
    title: "Online Calculators — Finance, Health & Grades",
    description: "Access our suite of free online calculators for health, finance, education, and mathematics. Get fast, accurate results without signup.",
    h1: "Calculators",
    shortDesc: "Compute values, estimate savings, and track health metrics with our collection of online calculators. Browse our categories below.",
    color: "teal",
    iconName: "Calculator",
    subcategories: [
      { name: "Finance", slug: "finance" },
      { name: "Health", slug: "health" },
      { name: "Education", slug: "education" },
      { name: "Math", slug: "math" },
      { name: "Date", slug: "date" },
    ],
    aboutHtml: `
      <p>Calculators are essential digital tools designed to simplify complex mathematical, financial, and scientific computations. Whether you are budgeting your monthly expenses, planning your retirement, tracking health metrics like BMI, or checking dates, online calculators offer instantaneous, error-free results that save you time and administrative effort.</p>
      <p>Our calculators run entirely inside your browser. This means your personal inputs, savings balances, or medical details are never sent to a remote server, ensuring complete confidentiality. Simply browse our specialized subcategories below to find the specific calculation tool you need.</p>
    `,
    benefits: [
      {
        title: "100% Free & Unlimited",
        description: "Calculate as many values as you need without encountering paywalls, credits, or registration requirements.",
      },
      {
        title: "Instant Processing",
        description: "Computations are executed instantly using your local browser engine, avoiding page refreshes or slow load times.",
      },
      {
        title: "Confidential & Local",
        description: "Your financial, education, and health data remains completely local to your device, ensuring maximum privacy.",
      },
    ],
    faqs: [
      {
        question: "Are these online calculators accurate?",
        answer: "Yes. All calculators are programmed using standard industry formulas (such as the WHO BMI formula or standard financial amortization formulas) and are double-checked for correctness.",
      },
      {
        question: "How do I filter calculators by category?",
        answer: "You can click on the subcategory filter tabs at the top of the calculators section to narrow your view to Finance, Health, Education, Math, or Date calculators.",
      },
      {
        question: "Is my personal data saved when using the calculators?",
        answer: "No. Your inputs are processed locally in real time. Certain calculators (like the Net Worth Calculator) may optionally save progress to your browser's localStorage for convenience, but no data is ever transmitted to our servers.",
      },
      {
        question: "Can I use these calculators on my mobile phone?",
        answer: "Yes, all calculators are fully responsive and optimized for mobile screens, tablet viewports, and desktop monitors.",
      },
      {
        question: "How is a financial calculator different from a standard calculator?",
        answer: "Financial calculators have pre-programmed formulas for interest compounding, inflation adjustments, and loan amortization, saving you from doing complex multi-step algebra manually.",
      },
    ],
  },
  "seo-tools": {
    slug: "seo-tools",
    name: "SEO Tools",
    title: "SEO Tools — Schema Markup & Meta Tags",
    description: "Boost your website search visibility with our free structured data schema generators, meta tag optimizers, and crawlability tools.",
    h1: "SEO Tools",
    shortDesc: "Optimize your site for search crawlers and generative engines. Create valid JSON-LD schemas and meta tag descriptions instantly.",
    color: "amber",
    iconName: "Search",
    subcategories: [],
    aboutHtml: `
      <p>Search Engine Optimization (SEO) tools are specialized web utilities that help website owners, developers, and marketers audit and improve their site's visibility on search results. In the era of Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO), having structured data and clear meta descriptions is vital for ensuring your pages are crawled, indexed, and cited by search engines like Google and AI systems like Gemini.</p>
      <p>Our SEO suite focuses on giving you exact, standard-compliant markup and metadata code. Generate nested FAQ schemas, format breadcrumb lists, check canonical tags, and simulate social media snippets in real time.</p>
    `,
    benefits: [
      {
        title: "Valid Schema Generation",
        description: "Generate structured data schemas in standard JSON-LD formats that pass the Google Rich Results Test.",
      },
      {
        title: "Google SERP Simulator",
        description: "Preview how your meta title and description will actually look on search result pages before publishing.",
      },
      {
        title: "Crawlability Protection",
        description: "Validate robots.txt, build sitemaps, and check canonical links to prevent duplicate indexing issues.",
      },
    ],
    faqs: [
      {
        question: "What is a JSON-LD schema?",
        answer: "JSON-LD (JavaScript Object Notation for Linked Data) is the schema format recommended by Google to provide structured information about a page's content, enabling rich search snippets.",
      },
      {
        question: "Do these SEO tools require registration?",
        answer: "No. All tools are completely free, open, and instantly usable without creating an account or paying fees.",
      },
      {
        question: "How do I add schema markup to my website?",
        answer: "Generate the schema using our tools, copy the JSON-LD script code block, and paste it directly into the HTML <head> section of your web page.",
      },
      {
        question: "Will these tools work for blogs, local businesses, and products?",
        answer: "Yes, our Schema Generator supports 14 different schema types including Article, Product, LocalBusiness, FAQPage, Event, and Organization.",
      },
      {
        question: "Why are meta tags important?",
        answer: "Meta tags (titles and descriptions) tell search engines what your page is about and serve as the clickable headings and snippets that draw users from search result pages.",
      },
    ],
  },
  "developer-tools": {
    slug: "developer-tools",
    name: "Developer Tools",
    title: "Developer Tools — Format, Decode & Convert",
    description: "Format raw JSON files, inspect JSON Web Tokens, parse complex cron schedules, and test regular expressions entirely in your browser.",
    h1: "Developer Tools",
    shortDesc: "An array of client-side developer utilities designed to make formatting, debugging, parsing, and testing strings hassle-free.",
    color: "purple",
    iconName: "Code",
    subcategories: [],
    aboutHtml: `
      <p>Developer tools are utility programs that aid software engineers in writing, debugging, formatting, and analyzing data and code. Instead of opening a heavy IDE or writing script snippets, developer utilities provide web-based playgrounds for testing regex patterns, decoding auth tokens (JWT), formatting JSON arrays, or inspecting cron expressions.</p>
      <p>To support a secure developer workflow, all processing is performed locally on the client-side. Your secrets, database keys, and JWT payloads are never sent over the network, keeping your credentials safe and isolated.</p>
    `,
    benefits: [
      {
        title: "Local Safe Parsing",
        description: "All formatters, decoders, and regex matchers process data locally. No server requests, no leaks.",
      },
      {
        title: "Syntax Highlighting",
        description: "View clean, colored syntax representations of code arrays that enhance readability.",
      },
      {
        title: "Time-saving Presets",
        description: "Quick-access templates and examples speed up debugging and expression composition.",
      },
    ],
    faqs: [
      {
        question: "Is it safe to paste JWT tokens or JSON keys into these tools?",
        answer: "Yes. Unlike other online utilities, all decoding, formatting, and string manipulation takes place entirely within your browser window. No data is sent over the internet.",
      },
      {
        question: "What is a JSON Web Token (JWT) decoder?",
        answer: "A JWT decoder splits a token into its three base components (Header, Payload, and Signature) and decodes the Base64URL encoding so you can view claims and expiry dates.",
      },
      {
        question: "How does the Cron Expression Parser work?",
        answer: "It parses standard 5- or 6-field cron expressions and translates them into plain-English schedules along with lists of upcoming execution times.",
      },
      {
        question: "Can I format minified JSON files?",
        answer: "Yes, our JSON formatter parses minified code, structures the indentation levels, checks syntax validity, and outputs a copyable, beautified layout.",
      },
      {
        question: "Is there a limit on input file sizes?",
        answer: "No hard limits, though very large text strings (above 5MB) may temporarily lag browser tabs depending on your local machine's memory capacity.",
      },
    ],
  },
  "text-tools": {
    slug: "text-tools",
    name: "Text Tools",
    title: "Text Tools — Count Words & Convert Cases Online",
    description: "Count words, sentences, and reading times, or convert string cases online. Fast, secure, browser-only text utility toolbox.",
    h1: "Text Tools",
    shortDesc: "Analyze word counts, check reading statistics, and format text layouts. Standard browser utilities for writers, editors, and students.",
    color: "blue",
    iconName: "FileText",
    subcategories: [],
    aboutHtml: `
      <p>Text tools help copywriters, students, and content creators edit, format, and audit string layouts. Common tasks like counting characters, tracking sentence structures, checking reading durations, or converting uppercase titles into camelCase require fast, dedicated editors.</p>
      <p>Our text utilities require no internet connectivity. Type, paste, or format copy completely offline while maintaining formatting structures.</p>
    `,
    benefits: [
      {
        title: "Exact Analytics",
        description: "Get detailed readouts of characters, words, sentences, spaces, and estimated reading speeds.",
      },
      {
        title: "1-Click Case Toggles",
        description: "Instantly convert copy between UPPERCASE, lowercase, Title Case, sentence case, and slugify formats.",
      },
      {
        title: "No Content Transmission",
        description: "Your copy, emails, draft articles, and notes remain inside your browser, ensuring secrecy.",
      },
    ],
    faqs: [
      {
        question: "How accurate is the reading time calculator?",
        answer: "Reading speed is calculated using the average adult reading rate of 200 words per minute (WPM). Actual reading speeds may vary based on complexity.",
      },
      {
        question: "Can I convert text cases in batch?",
        answer: "Yes. Paste any block of text and select your target case; the tool will format the entire block instantly.",
      },
      {
        question: "Does the word counter count punctuation?",
        answer: "No, standard punctuation is stripped before counting words, but it is factored into the total character counts.",
      },
      {
        question: "Are there shortcuts for copying text?",
        answer: "Yes, all text tools feature quick-access 'Copy' buttons that place the formatted text into your clipboard.",
      },
      {
        question: "Is there support for markdown strings?",
        answer: "Yes, you can paste raw markdown files. Punctuation characters are counted, and word totals are calculated normally.",
      },
    ],
  },
  "pdf-tools": {
    slug: "pdf-tools",
    name: "PDF Tools",
    title: "PDF Tools — Merge, Split & Compress",
    description: "Merge multiple PDFs, extract pages, compress sizes, and convert JPG to PDF online. Fully secure browser processing — no server uploads.",
    h1: "PDF Tools",
    shortDesc: "Organize, crop, scale, and compress your PDF document files. Fast processing performed entirely inside your browser.",
    color: "coral",
    iconName: "FileSpreadsheet",
    subcategories: [],
    aboutHtml: `
      <p>Portable Document Format (PDF) files are the standard for document sharing, but managing them often requires specialized editing tools. Tasks like compiling multiple invoices, extracting specific chapters, or optimizing sizes for email attachments can be tedious.</p>
      <p>Most online converters upload your sensitive contracts and bills to a cloud server to process them. Our PDF utilities are engineered to run completely on the client side using JavaScript libraries. Your documents never leave your computer, protecting your identity and privacy.</p>
    `,
    benefits: [
      {
        title: "Absolute Document Safety",
        description: "Processing is completed entirely in your browser using pdf-lib. Your confidential documents are never uploaded.",
      },
      {
        title: "Fast Local Merging & Splitting",
        description: "Combine files or extract page selections instantly without waiting for slow upload/download cycles.",
      },
      {
        title: "Image Converter Integrations",
        description: "Easily pack JPG/PNG images into clean, formatted multi-page PDFs, or extract pages as high-res JPGs.",
      },
    ],
    faqs: [
      {
        question: "Is it safe to merge my bank statements or contracts here?",
        answer: "Yes. Processing is completed entirely inside your browser's local sandbox memory. No file data is sent over the internet, making it 100% private.",
      },
      {
        question: "How do I merge multiple PDF files?",
        answer: "Upload your PDFs, drag cards to reorder pages as needed, and click the Merge button to compile and download the output.",
      },
      {
        question: "Can I convert images to PDF?",
        answer: "Yes, the JPG to PDF tool accepts multiple images, scales them to fit pages, and packs them into a single PDF document.",
      },
      {
        question: "Is there a file count limit for merging?",
        answer: "You can merge up to 20 files at once, though total memory is dependent on your browser window capacity.",
      },
      {
        question: "Why is the PDF compression step necessary?",
        answer: "Compression removes redundant metadata and optimizes image resolutions inside the PDF, making the file small enough to share via email or upload to online portals.",
      },
    ],
  },
  "image-tools": {
    slug: "image-tools",
    name: "Image Tools",
    title: "Image Tools — Compress, Resize & Convert",
    description: "Compress file sizes, resize dimensions, and convert images between JPG, PNG, WEBP, and GIF in your browser without uploading to any server.",
    h1: "Image Tools",
    shortDesc: "Optimize web images, convert file formats, and scale dimensions. Safe local processing using the HTML5 Canvas API.",
    color: "pink",
    iconName: "Image",
    subcategories: [],
    aboutHtml: `
      <p>Images represent the bulk of web bandwidth consumption. Optimizing them by compressing size, scaling pixel dimensions, or converting to modern formats like WEBP is crucial for maintaining fast page speeds and conserving disk space.</p>
      <p>Using the HTML5 Canvas API, our image suite handles conversions, crops, and compressions locally on your device. Easily process batches of up to 20 files, adjust quality factors, fill transparent PNG regions before JPG export, and download results as a consolidated ZIP file.</p>
    `,
    benefits: [
      {
        title: "Secure Client-Only Canvas",
        description: "Conversions are performed locally using HTML5 Canvas drawing, ensuring your private photos stay private.",
      },
      {
        title: "Batch Compression & ZIP Download",
        description: "Compress or convert multiple images simultaneously, then compile them into a single ZIP archive instantly.",
      },
      {
        title: "Modern Formats Support",
        description: "Easily export files to WEBP to cut file sizes by 75%+ while preserving transparent backgrounds.",
      },
    ],
    faqs: [
      {
        question: "How does local image compression work?",
        answer: "The browser loads the image and draws it onto a canvas. When exporting, it applies quality parameters to compress JPEG/WEBP data on the client side.",
      },
      {
        question: "Can I convert transparent PNGs to JPG?",
        answer: "Yes. Because JPG does not support transparency, our converter lets you choose a custom background color (white by default) to fill transparent areas.",
      },
      {
        question: "What is the benefit of WEBP conversion?",
        answer: "WEBP images are typically 25% to 35% smaller than PNGs and JPGs at identical visual quality, which improves website load speeds.",
      },
      {
        question: "Are my photos sent to any servers?",
        answer: "No. Your images never leave your local computer or phone. All processing is completed by your browser.",
      },
      {
        question: "Do the image tools handle animated GIFs?",
        answer: "Yes, but only the first frame is converted since canvas-based conversion does not compile multi-frame GIF animations.",
      },
    ],
  },
  "business-tools": {
    slug: "business-tools",
    name: "Business Tools",
    title: "Business Tools — Invoices, Quotes & Receipts",
    description: "Generate downloadable PDF invoices, price quotes, and payment receipts online. Free, professional document generators with client-side privacy.",
    h1: "Business Tools",
    shortDesc: "Create professional business documents, client quotes, invoices, and payment receipts with instant vector PDF downloads.",
    color: "purple",
    iconName: "Briefcase",
    subcategories: [],
    aboutHtml: `
      <p>Business tools streamline financial documentation and client management for freelancers, small business owners, and agencies. Standard business workflows require fast, professional tools to generate invoices, formal estimate quotes, and payment receipts.</p>
      <p>Our business document generators operate entirely inside your browser memory. Your client records, pricing models, line items, and company branding remain 100% confidential and local to your device.</p>
    `,
    benefits: [
      {
        title: "100% Client-Side Privacy",
        description: "Your invoices, billing figures, and customer details are stored locally in your browser and never uploaded.",
      },
      {
        title: "Instant Vector PDF Export",
        description: "Generate crisp, printable PDF documents directly without waiting for cloud rendering queues.",
      },
      {
        title: "Reusable Company Profiles",
        description: "Save your business logo, address, and tax information locally to reuse across invoices, quotes, and receipts.",
      },
    ],
    faqs: [
      {
        question: "Are these business document generators free?",
        answer: "Yes. Every generator is free with no account, no subscription and no watermark on the output. They run in your browser, so the invoices and quotes you produce are never uploaded or stored.",
      },
      {
        question: "Can I save my business info for future invoices?",
        answer: "Yes. Your business profile (name, logo, contact info, tax ID) is saved in your browser's local storage for automatic reuse.",
      },
      {
        question: "What currency formats are supported?",
        answer: "All generators support multiple global currency formats including USD ($), EUR (€), GBP (£), INR (₹), and AUD (A$).",
      },
      {
        question: "Are the documents I create legally valid?",
        answer: "The documents contain the fields a standard invoice or receipt needs, but requirements differ by country and tax regime. Check what your local tax authority requires — VAT or GST registration numbers in particular — before issuing them to clients.",
      },
      {
        question: "Is my customer and pricing data sent anywhere?",
        answer: "No. Every generator runs in your browser, and anything you save is stored in your own browser's local storage. Invoice amounts, client names and tax details never reach a server.",
      },
      {
        question: "Can I add my own logo and branding?",
        answer: "Yes. Upload a logo and it is embedded directly into the generated PDF. It is saved with your business profile so you only have to add it once.",
      },
      {
        question: "How do I edit a document after downloading it?",
        answer: "Reopen the generator and adjust the saved details, then download again. To annotate or correct a PDF you have already issued, use the Edit PDF tool.",
      },
    ],
  },
};
