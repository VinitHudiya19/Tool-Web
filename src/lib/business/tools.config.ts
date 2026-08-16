import type { SeoToolConfig } from "@/lib/seo-tools/types";

/**
 * Content for the business tool pages.
 *
 * Shares the SeoToolConfig shape so the same page shell and schema builders
 * serve both categories.
 */
export const BUSINESS_TOOLS: Record<string, SeoToolConfig> = {
  "invoice-generator": {
    slug: "invoice-generator",
    name: "Invoice Generator",
    title: "Free Invoice Generator — Download PDF Invoices",
    description:
      "Create a professional invoice and download it as a PDF. Add line items, tax and discounts, with totals calculated for you. No sign-up.",
    h1: "Invoice Generator",
    intro:
      "An invoice is the document you send a client to request payment for work delivered. This generator builds one from a short form — your details, the client's, the line items — and produces a clean PDF you can email straight away. Totals, tax and discounts are calculated as you type, and nothing you enter leaves your browser.",
    iconName: "FileText",
    applicationCategory: "BusinessApplication",
    features: [
      "Unlimited line items",
      "Tax and discount handling",
      "Live document preview",
      "PDF download and print",
    ],
    steps: [
      {
        name: "Add your details",
        text: "Enter your business name and address, then the client's. Save your own details once and they are filled in next time.",
      },
      {
        name: "List the work",
        text: "Add a line for each item with a quantity and rate. Amounts and the subtotal update as you type.",
      },
      {
        name: "Set tax and terms",
        text: "Add a tax rate, a discount if any, and payment terms in the notes. The preview shows exactly what the client receives.",
      },
      {
        name: "Download the PDF",
        text: "Download it as a PDF or print it. The file is named after the invoice number and client.",
      },
    ],
    examples: [
      {
        title: "Freelance project",
        input: "3 line items totalling 5,860, 5% discount, 20% VAT",
        output: "Discount 293.00 · VAT 1,113.40 · total 6,680.40",
        explanation:
          "The discount is applied before tax, so tax is charged on what the client actually pays — which is what most tax authorities require.",
      },
      {
        title: "Hourly work",
        input: "24 hours at 85.00 per hour",
        output: "Line amount 2,040.00",
        explanation:
          "Quantity multiplied by rate. Use hours as the quantity for time-based work and units for products.",
      },
      {
        title: "No tax registered",
        input: "Tax rate left blank",
        output: "Totals show subtotal and total only",
        explanation:
          "Zero-value rows are hidden, so a sole trader below the VAT threshold gets a clean invoice with no empty tax line.",
      },
    ],
    benefits: [
      {
        title: "Totals you can trust",
        description:
          "Amounts are rounded to cents at each step, so the line items always add up to the total shown — no drifting final figure.",
      },
      {
        title: "Handles long descriptions",
        description:
          "Text wraps within its column and a second page starts when one fills, so detailed line items do not overlap the price column.",
      },
      {
        title: "See it before you send it",
        description:
          "A live preview shows the finished document as you type, so there is no download-check-fix loop.",
      },
      {
        title: "Your details remembered",
        description:
          "Save your business name, address and tax rate once and they are filled in on every later invoice, stored only in your browser.",
      },
      {
        title: "Nothing is uploaded",
        description:
          "Invoices carry client names, addresses and amounts. All of it stays on your device.",
      },
    ],
    limitations: [
      "This creates and downloads invoices; it does not track whether they have been paid or send reminders.",
      "The PDF uses a standard Latin font. Text in Cyrillic, Greek, Arabic, Hebrew or CJK scripts cannot be rendered and is dropped.",
      "The rupee symbol has no glyph in the PDF font, so INR amounts print as the ISO code instead. On-screen they show as ₹.",
      "Tax is a single percentage applied to the whole document. Per-line or compound tax rates are not supported.",
      "An invoice generated here is not legal or tax advice. Check what your jurisdiction requires on an invoice.",
    ],
    keyTakeaways: [
      "An invoice requests payment and should carry a unique number, both parties' details, the work, and the amount due.",
      "Discount is applied before tax, so tax is charged on the discounted amount.",
      "Everything runs in your browser — client details and amounts are never uploaded.",
      "Save your business details once and they are reused on every later invoice.",
    ],
    faqs: [
      {
        id: "what-include",
        question: "What has to be on an invoice?",
        answer:
          "At minimum: a unique invoice number, the issue date, your business name and address, the client's details, a description of what is being charged, the amount due, and payment terms. If you are registered for sales tax or VAT you must also show your registration number and the tax charged.",
      },
      {
        id: "numbering",
        question: "How should I number my invoices?",
        answer:
          "Sequentially, with no gaps — most tax authorities require it. A date-based prefix such as INV-20260803-1 works well because it sorts correctly and makes duplicates obvious.",
      },
      {
        id: "tax-discount-order",
        question: "Is tax calculated before or after the discount?",
        answer:
          "After. Tax is owed on the amount the customer actually pays, so the discount comes off the subtotal first and tax applies to what remains. This tool does it in that order.",
      },
      {
        id: "free",
        question: "Is it really free?",
        answer:
          "Yes. No account, no watermark on the PDF, and no limit on how many invoices you create. There is no paid tier.",
      },
      {
        id: "logo",
        question: "Can I add my logo?",
        answer:
          "Not in this version — the PDF is text-only. If you need a logo, download the PDF and add it in a PDF editor, or print to PDF from the browser preview where you can apply your own styling.",
      },
      {
        id: "privacy",
        question: "Where is my data stored?",
        answer:
          "In your browser only. The invoice is built and the PDF generated locally, so client names and amounts are never sent anywhere. Your business details are saved to local storage only if you choose to save them.",
      },
      {
        id: "currency",
        question: "Which currencies are supported?",
        answer:
          "Twelve, including USD, EUR, GBP, INR, JPY and AUD. Amounts are formatted using each currency's own conventions for grouping and decimals.",
      },
      {
        id: "vs-invoice-software",
        question: "How is this different from invoicing software?",
        answer:
          "Invoicing software tracks payment status, sends reminders and syncs to your accounts. This creates the document. It suits occasional invoicing; if you bill regularly, dedicated software will save you more time.",
      },
      {
        id: "editable",
        question: "Can I edit an invoice after downloading it?",
        answer:
          "Not the PDF itself. Keep the tab open and re-download after making changes, or re-enter the details. For a small correction, the Edit PDF tool can change text in the downloaded file.",
      },
    ],
    relatedSlugs: ["quote-generator", "receipt-generator"],
  },

  "quote-generator": {
    slug: "quote-generator",
    name: "Quote Generator",
    title: "Free Quote Generator — Create PDF Quotes",
    description:
      "Create a professional price quote and download it as a PDF. Add line items, tax and a validity date, with totals calculated for you.",
    h1: "Quote Generator",
    intro:
      "A quote is a fixed price you offer a client for work before it starts. This generator builds one from your details, the client's and the work involved, then produces a PDF you can send. It differs from an invoice in that no payment is due yet — a quote carries a validity date instead.",
    iconName: "FileSignature",
    applicationCategory: "BusinessApplication",
    features: [
      "Unlimited line items",
      "Validity date",
      "Tax and discount handling",
      "PDF download and print",
    ],
    steps: [
      {
        name: "Add both parties",
        text: "Enter your business details and the prospective client's. Save yours once and they are reused later.",
      },
      {
        name: "Break down the work",
        text: "Add a line per deliverable. An itemised quote is far easier for a client to approve than a single lump sum.",
      },
      {
        name: "Set a validity date",
        text: "Quotes should expire. Thirty days is standard and protects you when costs change.",
      },
      {
        name: "Download and send",
        text: "Download the PDF and email it. Note any assumptions or exclusions in the notes.",
      },
    ],
    examples: [
      {
        title: "Project quote",
        input: "4 deliverables, 20% VAT, valid 30 days",
        output: "Itemised quote with a total and a valid-until date",
        explanation:
          "Breaking work into deliverables lets a client approve or trim scope line by line rather than rejecting the whole price.",
      },
      {
        title: "Quote with a discount",
        input: "10% introductory discount",
        output: "Discount shown as its own line before tax",
        explanation:
          "Showing the discount explicitly makes the concession visible, which is more persuasive than quietly lowering the rate.",
      },
      {
        title: "Quote to invoice",
        input: "Accepted quote",
        output: "Same line items re-entered as an invoice",
        explanation:
          "Once a quote is accepted, the Invoice Generator produces the matching invoice with the same figures.",
      },
    ],
    benefits: [
      {
        title: "Built for approval",
        description:
          "An itemised layout with a clear total is what a client needs to say yes, or to ask for one line to be removed.",
      },
      {
        title: "Validity date included",
        description:
          "Quotes without an expiry can be accepted months later at a price that no longer works. The date field is built in.",
      },
      {
        title: "Accurate arithmetic",
        description:
          "Discount before tax, rounded at each step, so the figures on the quote match the invoice that follows.",
      },
      {
        title: "Live preview",
        description:
          "See the finished quote as you type rather than downloading repeatedly to check the layout.",
      },
      {
        title: "Private",
        description:
          "Pricing is commercially sensitive. Nothing you enter is uploaded.",
      },
    ],
    limitations: [
      "A quote created here is not a contract on its own. Acceptance terms and scope should be agreed separately.",
      "The PDF uses a standard Latin font, so non-Latin scripts cannot be rendered and are dropped.",
      "Indian rupee amounts print as the ISO code in the PDF, because the ₹ symbol has no glyph in the built-in font.",
      "There is no approval or e-signature workflow — the tool produces the document only.",
      "Tax is one percentage across the document; per-line rates are not supported.",
    ],
    keyTakeaways: [
      "A quote is a fixed price offered before work starts; an invoice requests payment after.",
      "Always set a validity date so an old price cannot be accepted later.",
      "Itemising deliverables makes a quote easier to approve or adjust.",
      "Everything runs in your browser and nothing is uploaded.",
    ],
    faqs: [
      {
        id: "quote-vs-estimate",
        question: "What is the difference between a quote and an estimate?",
        answer:
          "A quote is a fixed price you commit to. An estimate is an informed guess that may change as work progresses. If you label something a quote, expect to be held to the figure.",
      },
      {
        id: "quote-vs-invoice",
        question: "How does a quote differ from an invoice?",
        answer:
          "A quote is sent before work to propose a price, and nothing is owed. An invoice is sent after delivery to request payment, and carries a due date. The layout is similar but the meaning is entirely different.",
      },
      {
        id: "validity",
        question: "How long should a quote stay valid?",
        answer:
          "Thirty days is the common default. Shorter if your costs move quickly — materials or contractor rates — and longer for stable work where clients need time to get approval.",
      },
      {
        id: "binding",
        question: "Is a quote legally binding?",
        answer:
          "In many jurisdictions a quote becomes binding once the client accepts it within its validity period, which is exactly why the expiry date and any exclusions matter. Take local advice if the amounts are significant.",
      },
      {
        id: "itemise",
        question: "Should I itemise or give one total?",
        answer:
          "Itemise. A single figure invites a yes-or-no decision, while a breakdown lets a client remove one line instead of rejecting the whole quote, and shows what they are actually paying for.",
      },
      {
        id: "exclusions",
        question: "What should go in the notes?",
        answer:
          "Anything not included — third-party costs, licences, travel, revision limits — plus your payment terms and what happens if scope changes. Most quote disputes come from unstated assumptions.",
      },
      {
        id: "convert",
        question: "How do I turn an accepted quote into an invoice?",
        answer:
          "Use the Invoice Generator with the same line items and figures. Keeping the numbers identical avoids the queries that come from a total that does not match what was agreed.",
      },
      {
        id: "tax",
        question: "Should a quote show tax?",
        answer:
          "Yes, if you are registered. Clients need the full amount payable. Quoting a figure excluding tax and then invoicing a larger total is the most common cause of payment disputes.",
      },
      {
        id: "free",
        question: "Is the quotation generator free to use?",
        answer:
          "Yes, with no account, no watermark and no limit on how many quotes you produce. The document is built in your browser, so client names and pricing are never uploaded to anyone.",
      },
    ],
    relatedSlugs: ["invoice-generator", "receipt-generator"],
  },

  "receipt-generator": {
    slug: "receipt-generator",
    name: "Receipt Generator",
    title: "Free Receipt Generator — Create PDF Receipts",
    description:
      "Create a payment receipt and download it as a PDF. Record what was paid, how and when, with totals calculated for you.",
    h1: "Receipt Generator",
    intro:
      "A receipt is proof that a payment has been made. It records what was bought, how much was paid, the method of payment and the date. This generator produces one as a PDF you can hand over or email — useful for cash payments, deposits, and any transaction where the customer needs written proof.",
    iconName: "ReceiptText",
    applicationCategory: "BusinessApplication",
    features: [
      "Payment method recorded",
      "Unlimited line items",
      "Tax and discount handling",
      "PDF download and print",
    ],
    steps: [
      {
        name: "Add your details",
        text: "Enter your business name and address, then who paid. Save yours once for reuse.",
      },
      {
        name: "List what was paid for",
        text: "Add a line per item or service with quantity and price.",
      },
      {
        name: "Record the payment",
        text: "Set the date paid and the method — cash, card, bank transfer. This is what makes it a receipt rather than an invoice.",
      },
      {
        name: "Download and hand over",
        text: "Download the PDF or print it directly for the customer.",
      },
    ],
    examples: [
      {
        title: "Cash payment",
        input: "2 items, paid by cash",
        output: "Receipt showing the total paid and 'Paid by: Cash'",
        explanation:
          "Cash leaves no bank record, so a written receipt is the only proof either side has that payment happened.",
      },
      {
        title: "Deposit received",
        input: "One line: 'Deposit — kitchen fitting', 500.00",
        output: "Receipt for 500.00",
        explanation:
          "Receipt the deposit when it is taken, then invoice the balance later. Describe clearly what the deposit is against.",
      },
      {
        title: "Rent payment",
        input: "Monthly rent, paid by bank transfer",
        output: "Dated receipt with the payment method",
        explanation:
          "A tenant needs a dated receipt as proof. The reference number gives both sides something to quote later.",
      },
    ],
    benefits: [
      {
        title: "Records how it was paid",
        description:
          "The payment method is part of the document, which is what separates a receipt from an invoice and what matters most for cash.",
      },
      {
        title: "Correct totals",
        description:
          "Tax and discounts are handled the same way as on an invoice, so a receipt matches the invoice it settles.",
      },
      {
        title: "Print straight away",
        description:
          "The preview is print-styled, so you can hand a customer a paper receipt without downloading anything.",
      },
      {
        title: "Details remembered",
        description:
          "Your business details are saved locally, so issuing repeat receipts takes seconds.",
      },
      {
        title: "Fully private",
        description:
          "Customer names and amounts stay on your device.",
      },
    ],
    limitations: [
      "This produces a receipt document; it does not process payments or connect to a card terminal.",
      "The PDF uses a standard Latin font, so non-Latin scripts cannot be rendered and are dropped.",
      "Indian rupee amounts print as the ISO code in the PDF, since the ₹ symbol has no glyph in the built-in font.",
      "Where a formal tax receipt or fiscal invoice is legally required, check what your jurisdiction mandates — requirements vary considerably.",
      "No record of issued receipts is kept, so keep your own copy of each PDF.",
    ],
    keyTakeaways: [
      "A receipt proves payment was made; an invoice requests it.",
      "Always record the payment method and date — that is what makes it a receipt.",
      "Receipts matter most for cash, where no bank record exists.",
      "Everything runs in your browser and nothing is uploaded.",
    ],
    faqs: [
      {
        id: "receipt-vs-invoice",
        question: "What is the difference between a receipt and an invoice?",
        answer:
          "An invoice requests payment and is sent before it is made. A receipt confirms payment was received and is issued after. The same transaction often produces both.",
      },
      {
        id: "what-include",
        question: "What should a receipt show?",
        answer:
          "The date of payment, your business details, who paid, what was paid for, the amount, and the payment method. A unique receipt number helps both sides reference it later.",
      },
      {
        id: "legally-required",
        question: "Am I legally required to give a receipt?",
        answer:
          "It varies. Many jurisdictions require one on request, and some require it for every transaction above a threshold or in specific trades. Check your local rules — this tool does not give legal advice.",
      },
      {
        id: "cash",
        question: "Do I need a receipt for cash payments?",
        answer:
          "It is strongly advisable. Cash leaves no bank trail, so a written receipt is the only evidence either party has. Keep a copy for your own records too.",
      },
      {
        id: "deposit",
        question: "Can I issue a receipt for a deposit?",
        answer:
          "Yes. Describe the line clearly as a deposit and state what it applies to, so it is obvious the full amount is not yet paid. Invoice the balance separately.",
      },
      {
        id: "tax-receipt",
        question: "Is this a valid tax receipt?",
        answer:
          "It contains the elements a receipt normally needs, but formal tax receipts and fiscal invoices carry jurisdiction-specific requirements such as registration numbers or sequential fiscal codes. Confirm what applies to you.",
      },
      {
        id: "numbering",
        question: "Should receipts be numbered?",
        answer:
          "Yes. Sequential numbering makes your records auditable and lets a customer quote a reference if they query the payment. The tool generates a date-based number you can edit.",
      },
      {
        id: "refund",
        question: "How do I record a refund?",
        answer:
          "Issue a separate receipt with a negative rate on the line, or describe the line as a refund and note the original receipt number. Keep both documents so the pair explains itself.",
      },
      {
        id: "free",
        question: "Does the receipt generator cost anything?",
        answer:
          "Yes — no account, no watermark and no cap on how many receipts you create. Everything is generated in your browser, so customer details and amounts stay on your own machine.",
      },
    ],
    relatedSlugs: ["invoice-generator", "quote-generator"],
  },
};

export function getBusinessTool(slug: string): SeoToolConfig {
  const tool = BUSINESS_TOOLS[slug];
  if (!tool) {
    throw new Error(
      `Unknown business tool "${slug}". Add it to BUSINESS_TOOLS in src/lib/business/tools.config.ts.`,
    );
  }
  return tool;
}

export function getRelatedBusinessTools(slug: string): SeoToolConfig[] {
  return getBusinessTool(slug)
    .relatedSlugs.map((related) => BUSINESS_TOOLS[related])
    .filter((tool): tool is SeoToolConfig => Boolean(tool));
}
