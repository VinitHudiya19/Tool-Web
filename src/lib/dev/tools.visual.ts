import type { SeoToolConfig } from "@/lib/seo-tools/types";

/** Layout builders and code generators. */
export const VISUAL_TOOLS: Record<string, SeoToolConfig> = {
  "css-grid-generator": {
    slug: "css-grid-generator",
    name: "CSS Grid Generator",
    title: "CSS Grid Generator — Visual Layout Builder",
    description:
      "Build a CSS Grid layout visually and copy the code. Adjust columns, rows, gaps and placement with a live preview.",
    h1: "CSS Grid Generator",
    intro:
      "CSS Grid lays out a page in two dimensions at once, which makes it far more capable than what came before and considerably harder to hold in your head. This builder lets you drag the layout into shape and reads back the CSS, so you learn which property produced which effect instead of guessing at fr units and line numbers.",
    iconName: "LayoutGrid",
    applicationCategory: "DeveloperApplication",
    features: [
      "Live preview updating as you change any value",
      "Column and row sizing with fr, px, auto and minmax",
      "Independent row and column gaps",
      "Item placement by grid line with span support",
      "Copyable CSS and HTML",
    ],
    steps: [
      {
        name: "Set your columns and rows",
        text: "Choose how many tracks you want and how each is sized. An fr unit takes a share of the leftover space, which is what makes a grid responsive without media queries.",
      },
      {
        name: "Adjust the gaps",
        text: "Row and column gaps can be set separately. Gap replaces the old margin approach and never adds space outside the grid itself.",
      },
      {
        name: "Place your items",
        text: "Click a cell to place an item, or give it a start line and a span. Items can overlap, which is something the older layout methods could not do.",
      },
      {
        name: "Copy the code",
        text: "The generated CSS and matching HTML update live. Copy both into your project and the result is exactly what the preview shows.",
      },
    ],
    examples: [
      {
        title: "A responsive three-column layout",
        input: "3 columns, 1fr each, 16px gap",
        output: "grid-template-columns: repeat(3, 1fr); gap: 16px;",
        explanation:
          "Each fr takes an equal share of the space left after the gaps, so the columns stay equal at any width without a single media query.",
      },
      {
        title: "A sidebar with fluid content",
        input: "240px sidebar, 1fr content",
        output: "grid-template-columns: 240px 1fr;",
        explanation:
          "The sidebar is fixed and the content takes whatever remains. Mixing fixed and fractional tracks is where Grid becomes genuinely easier than floats or flexbox.",
      },
      {
        title: "An item spanning two columns",
        input: "Item from line 1, span 2",
        output: "grid-column: 1 / span 2;",
        explanation:
          "Grid lines are numbered from 1, not 0 — the most common source of off-by-one confusion. Spanning is relative to the start line.",
      },
    ],
    benefits: [
      {
        title: "See the property and its effect together",
        description:
          "Every change updates both the preview and the CSS, which teaches the property names far faster than reading a reference.",
      },
      {
        title: "Real, copyable output",
        description:
          "The generated CSS is plain and standard — no framework, no custom class names, nothing to strip out before using it.",
      },
      {
        title: "Explains fr and minmax",
        description:
          "The sizing units that make Grid powerful are also the ones people avoid. Seeing them respond as you drag makes them concrete.",
      },
      {
        title: "Runs in your browser",
        description:
          "No account and no network. The preview is real CSS Grid rendered by your own browser, not a simulation.",
      },
    ],
    limitations: [
      "The preview shows one viewport at a time, so responsive behaviour across breakpoints still needs testing in a real page.",
      "Named grid areas are not generated, though they are often clearer than line numbers for a complex layout.",
      "Subgrid is not covered, since browser support is still uneven.",
      "The generated CSS is unopinionated and may need adapting to your project's conventions.",
    ],
    keyTakeaways: [
      "Grid lines are numbered from 1, which is the usual source of confusion.",
      "An fr unit distributes leftover space after fixed tracks and gaps are subtracted.",
      "Gap applies only between tracks, never around the outside of the grid.",
      "Grid works in two dimensions at once, unlike flexbox.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "grid-vs-flex",
        question: "When should I use Grid instead of flexbox?",
        answer:
          "Grid when you are arranging things in rows and columns simultaneously — a page layout, a card grid, a form with aligned labels. Flexbox when items flow in a single direction, such as a navigation bar or a row of buttons.",
      },
      {
        id: "fr-unit",
        question: "What does the fr unit actually do?",
        answer:
          "It takes a share of the space remaining after fixed tracks and gaps are accounted for. Three columns of 1fr each get a third of what is left, so they stay equal at any width without percentages that ignore the gaps.",
      },
      {
        id: "line-numbers",
        question: "Why does my item start in the wrong column?",
        answer:
          "Grid lines are numbered from 1, and they refer to the lines between tracks rather than the tracks themselves. The first column sits between line 1 and line 2, so grid-column: 1 / 2 is the first column, not the second.",
      },
      {
        id: "minmax",
        question: "What is minmax for?",
        answer:
          "It sets a floor and a ceiling for a track, so minmax(200px, 1fr) gives a column that grows with the space but never shrinks below 200 pixels. Combined with auto-fit it produces a responsive grid with no media queries at all.",
      },
      {
        id: "gap",
        question: "Is gap better than using margins?",
        answer:
          "Yes, and it fixes a long-standing annoyance. Gap applies only between tracks, so there is no stray space around the outside and no need for the negative-margin trick that grid systems used for years.",
      },
      {
        id: "overlap",
        question: "Can grid items overlap?",
        answer:
          "Yes. Place two items on the same lines and they occupy the same cells, layered by document order or z-index. That is something neither floats nor flexbox could do without absolute positioning.",
      },
      {
        id: "responsive",
        question: "How do I make the grid responsive?",
        answer:
          "Often you need nothing: repeat(auto-fit, minmax(200px, 1fr)) fits as many columns as will fit and wraps the rest. For layout changes at specific widths, wrap a different grid-template-columns in a media query.",
      },
      {
        id: "areas",
        question: "What about named grid areas?",
        answer:
          "They are frequently clearer than line numbers, since the template becomes an ASCII picture of the layout. This generator produces line-based placement, which is more flexible; converting to named areas afterwards is straightforward.",
      },
      {
        id: "browser-support",
        question: "Is CSS Grid safe to use now?",
        answer:
          "Yes. Every current browser has supported it since 2017, and it is the standard way to build page layouts. Only subgrid still has patchy support, which is why it is not covered here.",
      },
    ],
    relatedSlugs: ["flexbox-generator", "css-formatter", "html-formatter", "javascript-formatter"],
  },

  "flexbox-generator": {
    slug: "flexbox-generator",
    name: "Flexbox Generator",
    title: "Flexbox Generator — Visual CSS Builder",
    description:
      "Build flexbox layouts visually and copy the CSS. Shows how justify-content and align-items differ as you change them.",
    h1: "Flexbox Generator",
    intro:
      "Flexbox arranges items along a single axis and distributes the space around them. The part that trips everyone is that justify-content and align-items swap meaning when the direction changes to column — because they work on the main and cross axes rather than horizontal and vertical. Watching that happen live is considerably clearer than reading it.",
    iconName: "AlignHorizontalDistributeCenter",
    applicationCategory: "DeveloperApplication",
    features: [
      "Live preview of every flex property",
      "Main and cross axis labelled as you change direction",
      "Per-item grow, shrink and basis controls",
      "Wrapping and gap support",
      "Copyable CSS",
    ],
    steps: [
      {
        name: "Choose a direction",
        text: "Row or column. This decides which axis is the main one, and therefore which property controls horizontal alignment — the single most confusing thing about flexbox.",
      },
      {
        name: "Distribute along the main axis",
        text: "justify-content spreads items along the main axis. Try space-between and space-around to see how the leftover space is divided.",
      },
      {
        name: "Align across the cross axis",
        text: "align-items positions items on the perpendicular axis. Stretch is the default, which is why items are often taller than expected.",
      },
      {
        name: "Tune individual items",
        text: "Set grow, shrink and basis on any item to control how it takes or gives up space, then copy the generated CSS.",
      },
    ],
    examples: [
      {
        title: "Centring in both directions",
        input: "justify-content: center, align-items: center",
        output: "Item centred horizontally and vertically",
        explanation:
          "The three lines that solved a problem CSS made awkward for fifteen years. In a row, justify handles horizontal and align handles vertical.",
      },
      {
        title: "The same properties in a column",
        input: "flex-direction: column, justify-content: center",
        output: "Item centred vertically instead",
        explanation:
          "Changing direction swaps which axis is which, so justify-content now controls vertical position. This is the source of most flexbox confusion.",
      },
      {
        title: "A fluid item beside a fixed one",
        input: "flex: 1 on one item",
        output: "flex: 1 1 0%",
        explanation:
          "The item takes all the free space while its neighbour keeps its natural width — the standard pattern for a sidebar or a form field beside a button.",
      },
    ],
    benefits: [
      {
        title: "Makes the axes visible",
        description:
          "The main and cross axes are labelled and relabel themselves when the direction changes, which is the piece that makes flexbox finally click.",
      },
      {
        title: "Per-item control",
        description:
          "Grow, shrink and basis can be set on individual items, so you can see why one is refusing to shrink.",
      },
      {
        title: "Standard CSS out",
        description:
          "The generated code is plain flexbox with no framework or prefixes to strip.",
      },
      {
        title: "Runs in your browser",
        description:
          "The preview is real flexbox rendered by your own browser, so what you see is exactly what your page will do.",
      },
    ],
    limitations: [
      "Flexbox works in one dimension. A layout needing rows and columns aligned together wants Grid instead.",
      "The preview uses a fixed container size, so behaviour at other widths still needs checking in a real page.",
      "Older prefixed syntax is not generated, since no currently supported browser needs it.",
      "Item content here is placeholder, and real content with long words can change how items size themselves.",
    ],
    keyTakeaways: [
      "justify-content works on the main axis, align-items on the cross axis.",
      "Changing direction to column swaps which axis each one controls.",
      "align-items defaults to stretch, which is why items are often full height.",
      "flex: 1 is shorthand for grow 1, shrink 1, basis 0%.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "justify-vs-align",
        question: "What is the difference between justify-content and align-items?",
        answer:
          "justify-content distributes items along the main axis; align-items positions them on the cross axis. In a row the main axis is horizontal, so justify controls left-to-right. Switch to a column and they swap, which catches nearly everyone.",
      },
      {
        id: "centering",
        question: "How do I centre something both ways?",
        answer:
          "Set display: flex, then justify-content: center and align-items: center on the container. Those three lines replaced years of table hacks, absolute positioning and negative margins.",
      },
      {
        id: "flex-shorthand",
        question: "What does flex: 1 actually mean?",
        answer:
          "It is shorthand for flex-grow: 1, flex-shrink: 1, flex-basis: 0%. The zero basis is the important part — it makes items share space equally regardless of their content, whereas flex-grow: 1 alone starts from each item's natural size.",
      },
      {
        id: "not-shrinking",
        question: "Why will my flex item not shrink?",
        answer:
          "Usually its content has a minimum size. A flex item's min-width defaults to auto, so it will not shrink below its content — a long unbroken word or a wide image. Setting min-width: 0 releases it.",
      },
      {
        id: "stretch",
        question: "Why are my items all the same height?",
        answer:
          "align-items defaults to stretch, so every item fills the cross axis. Set it to flex-start, center or baseline if you want items to keep their natural height.",
      },
      {
        id: "gap",
        question: "Can I use gap with flexbox?",
        answer:
          "Yes, and it is now well supported. It is much cleaner than margins on children, which always required an awkward exception for the first or last item.",
      },
      {
        id: "wrap",
        question: "Why do my items overflow instead of wrapping?",
        answer:
          "flex-wrap defaults to nowrap, so items shrink rather than moving to a new line and eventually overflow. Set flex-wrap: wrap to let them break onto additional lines.",
      },
      {
        id: "flex-vs-grid",
        question: "Should I use flexbox or Grid?",
        answer:
          "Flexbox for one-dimensional arrangements — a toolbar, a row of cards, a form row. Grid when you need rows and columns to align with each other. They combine well: a Grid page layout with flexbox inside individual cells is very common.",
      },
      {
        id: "order",
        question: "Is it safe to reorder items with the order property?",
        answer:
          "Visually it works, but it does not change the DOM order, so keyboard and screen reader users still get the original sequence. A mismatch between visual and reading order is a genuine accessibility problem — reorder the markup where you can.",
      },
    ],
    relatedSlugs: ["css-grid-generator", "css-formatter", "html-formatter", "javascript-formatter"],
  },

  "qr-code-generator": {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    title: "QR Code Generator — PNG & SVG, No Tracking",
    description:
      "Generate QR codes for URLs, text, WiFi and contact details. Downloads as PNG or SVG, with no redirect or tracking.",
    h1: "QR Code Generator",
    intro:
      "This generator encodes your data directly into a QR code that your browser draws. That matters more than it sounds: many free QR services encode a link to their own domain that redirects to yours, so the code stops working if they shut down or start charging, and every scan is logged by someone else. A code made here points only where you point it.",
    iconName: "QrCode",
    applicationCategory: "DeveloperApplication",
    features: [
      "Direct encoding with no redirect or tracking",
      "URL, plain text, WiFi and contact card presets",
      "PNG and scalable SVG download",
      "Four error correction levels",
      "Custom colours with a contrast check",
    ],
    steps: [
      {
        name: "Choose what to encode",
        text: "A URL, plain text, WiFi credentials or a contact card. Each preset builds the correctly formatted string that scanners recognise.",
      },
      {
        name: "Enter your content",
        text: "The code regenerates as you type. Shorter content produces a simpler code that scans more reliably from a distance.",
      },
      {
        name: "Set error correction",
        text: "Higher levels survive damage and dirt but make the code denser. Level M suits most uses; go higher only for print that will be handled.",
      },
      {
        name: "Download",
        text: "PNG for screens and documents, SVG for print or anywhere it will be scaled. SVG stays sharp at any size.",
      },
    ],
    examples: [
      {
        title: "A link to your site",
        input: "https://example.com",
        output: "A QR code pointing directly at that URL",
        explanation:
          "The URL is encoded into the code itself. Nothing sits between the scanner and your site, so the code keeps working regardless of what happens to this website.",
      },
      {
        title: "WiFi credentials",
        input: "Network name and password",
        output: "WIFI:T:WPA;S:name;P:password;;",
        explanation:
          "Phones recognise this format and offer to join the network directly. It is the standard way to put guest WiFi on a card without anyone typing a password.",
      },
      {
        title: "Higher error correction",
        input: "Same URL at level H",
        output: "A denser code that survives about 30% damage",
        explanation:
          "Level H can be read with nearly a third obscured, which is what allows a logo in the middle. The cost is a busier code needing more space to scan reliably.",
      },
    ],
    benefits: [
      {
        title: "No redirect and no tracking",
        description:
          "The data is encoded directly, so scans are not counted by anyone and the code cannot be disabled by a third party later.",
      },
      {
        title: "Vector output for print",
        description:
          "SVG scales to any size without softening, which matters for a poster or packaging where a blurry code fails to scan.",
      },
      {
        title: "Formats that scanners understand",
        description:
          "WiFi and contact presets emit the exact syntax phones expect, rather than plain text that merely looks right.",
      },
      {
        title: "Runs in your browser",
        description:
          "WiFi passwords and personal contact details are encoded locally and never transmitted.",
      },
    ],
    limitations: [
      "A code made here is static. Its content cannot be changed later without generating and reprinting a new one.",
      "Very long content produces a dense code that needs to be printed larger to scan reliably.",
      "Inverted colours — light on dark — are rejected by many scanners regardless of contrast.",
      "There is no scan analytics, which is the direct consequence of there being no redirect.",
    ],
    keyTakeaways: [
      "The data is encoded directly, with no redirect and no scan tracking.",
      "Use SVG for print and PNG for screens.",
      "Higher error correction survives damage but produces a denser code.",
      "Shorter content scans more reliably from further away.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "expiry",
        question: "Will my QR code ever stop working?",
        answer:
          "Not one made here. The data is inside the code itself, so it works as long as the destination does. Codes from services that redirect through their own domain stop working if that service closes or moves the link behind a subscription.",
      },
      {
        id: "tracking",
        question: "Can anyone see how many times my code is scanned?",
        answer:
          "No, because nothing sits between the scanner and the destination. That is the trade-off for having no redirect — you get privacy and permanence, and give up scan analytics.",
      },
      {
        id: "error-correction",
        question: "Which error correction level should I pick?",
        answer:
          "Level M for most things — it tolerates about 15% damage at a reasonable density. Choose H for anything printed on something that will be handled, folded or exposed to weather, or if you plan to place a logo over the middle.",
      },
      {
        id: "png-vs-svg",
        question: "Should I download PNG or SVG?",
        answer:
          "SVG for anything printed or resized, since it is vector and stays perfectly sharp. PNG for screens, email and documents where a fixed-size image is simpler to place.",
      },
      {
        id: "size",
        question: "How large should a printed code be?",
        answer:
          "A rough rule is a tenth of the scanning distance, so a code read from a metre away wants to be about 10 cm across. Denser codes with more data need more, which is a good reason to keep the encoded content short.",
      },
      {
        id: "logo",
        question: "Can I put a logo in the middle?",
        answer:
          "Yes, if you use high error correction and keep the logo under roughly 30% of the area. Test the result with several phones before printing — the error correction is what makes it work, and it has a limit.",
      },
      {
        id: "colours",
        question: "Can I change the colours?",
        answer:
          "Yes, but keep strong contrast and keep the code darker than its background. Many scanners will not read an inverted code however good the contrast, so light-on-dark is a real risk.",
      },
      {
        id: "wifi",
        question: "How does a WiFi QR code work?",
        answer:
          "It encodes a specially formatted string naming the network, its security type and its password. Phone cameras recognise the format and offer to join directly, which is why it is the usual way to share guest WiFi.",
      },
      {
        id: "privacy",
        question: "Is my content sent to a server to generate the code?",
        answer:
          "No. The code is computed and drawn in your browser. This matters for the WiFi preset in particular, since the password is part of the encoded data.",
      },
    ],
    relatedSlugs: ["barcode-generator", "base64-encoder", "url-encoder", "uuid-generator"],
  },

  "barcode-generator": {
    slug: "barcode-generator",
    name: "Barcode Generator",
    title: "Barcode Generator — EAN, UPC, Code 128 & More",
    description:
      "Generate EAN-13, UPC-A, Code 128 and Code 39 barcodes as PNG or SVG, with check digits calculated automatically.",
    h1: "Barcode Generator",
    intro:
      "This tool draws standard retail and logistics barcodes in your browser. Each symbology has its own rules about what it can encode and how long the input must be, and most have a check digit computed from the other digits — get that wrong and the barcode scans as a different product entirely. Those rules are enforced here rather than left for a scanner to discover.",
    iconName: "ScanBarcode",
    applicationCategory: "DeveloperApplication",
    features: [
      "EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39 and ITF-14",
      "Check digits calculated and verified automatically",
      "Validation of length and character set per symbology",
      "PNG and SVG download",
      "Adjustable height, scale and human-readable text",
    ],
    steps: [
      {
        name: "Choose a symbology",
        text: "EAN-13 for retail products outside North America, UPC-A within it, and Code 128 for internal or logistics use where you need letters as well as digits.",
      },
      {
        name: "Enter your data",
        text: "The required length and allowed characters are shown for the format you picked, and the input is checked as you type.",
      },
      {
        name: "Let the check digit be calculated",
        text: "For EAN and UPC the final digit is derived from the others. Enter the shorter number and it is computed, or enter the full code and it is verified.",
      },
      {
        name: "Download",
        text: "SVG for print, since a barcode must be crisp to scan. PNG for screens and documents.",
      },
    ],
    examples: [
      {
        title: "An EAN-13 check digit",
        input: "590123412345",
        output: "5901234123457",
        explanation:
          "The thirteenth digit is derived from the first twelve by a weighted sum. A wrong check digit means scanners either reject the code or read a different product.",
      },
      {
        title: "Code 128 with letters",
        input: "ABC-12345",
        output: "A Code 128 barcode",
        explanation:
          "Code 128 encodes the full ASCII set and has no fixed length, which is why it is the usual choice for internal part numbers and shipping labels.",
      },
      {
        title: "A length that will not encode",
        input: "12345 as EAN-13",
        output: "Error: EAN-13 needs 12 or 13 digits",
        explanation:
          "Fixed-length symbologies cannot encode arbitrary input. Reporting this immediately is better than producing an image that no scanner will read.",
      },
    ],
    benefits: [
      {
        title: "Check digits handled correctly",
        description:
          "The digit is calculated from your data or verified against it, which removes the most common cause of a barcode that scans as the wrong product.",
      },
      {
        title: "Format rules enforced",
        description:
          "Length and character set are validated per symbology, so you find out about a problem here rather than after printing a thousand labels.",
      },
      {
        title: "Vector output",
        description:
          "SVG keeps the bars perfectly crisp at any size, which matters because a slightly soft barcode is a barcode that fails to scan.",
      },
      {
        title: "Runs in your browser",
        description:
          "Product codes and shipping references are drawn locally and never uploaded.",
      },
    ],
    limitations: [
      "Generating an EAN or UPC does not register it. Real retail codes must be bought from GS1, and an invented one may collide with an existing product.",
      "Print quality decides whether a barcode scans, so a low-resolution print or an unsuitable material will fail regardless of the image.",
      "The quiet zone — the clear margin either side — must be preserved in your layout or scanning becomes unreliable.",
      "Two-dimensional formats such as Data Matrix are not covered; use the QR generator for those.",
    ],
    keyTakeaways: [
      "EAN and UPC check digits are computed from the other digits and cannot be arbitrary.",
      "Code 128 handles letters and any length; EAN and UPC are digits at a fixed length.",
      "Download SVG for print, since crispness determines whether it scans.",
      "Generating a retail barcode does not register it — those must be bought from GS1.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "check-digit",
        question: "What is a check digit and why does it matter?",
        answer:
          "It is the final digit, calculated from all the others by a weighted sum. Scanners recompute it and reject the code if it does not match, which catches most misreads. Choosing it arbitrarily produces a code that either fails to scan or reads as a different product.",
      },
      {
        id: "which-format",
        question: "Which barcode format should I use?",
        answer:
          "EAN-13 for retail products outside North America and UPC-A within it. Code 128 for anything internal — part numbers, asset tags, shipping references — since it takes letters and any length. Code 39 only where older hardware requires it.",
      },
      {
        id: "ean-vs-upc",
        question: "What is the difference between EAN-13 and UPC-A?",
        answer:
          "UPC-A is twelve digits and used mainly in North America; EAN-13 is thirteen and used globally. A UPC-A is effectively an EAN-13 with a leading zero, and modern scanners read both.",
      },
      {
        id: "registration",
        question: "Can I invent my own retail barcode?",
        answer:
          "Not for sale through retailers. EAN and UPC numbers are allocated by GS1 and the prefix identifies your company, so an invented number may already belong to somebody else's product. For internal use, any format you like is fine.",
      },
      {
        id: "quiet-zone",
        question: "Why does my printed barcode not scan?",
        answer:
          "Most often the quiet zone has been lost — the clear margin either side of the bars, which must be about ten times the width of the narrowest bar. Other common causes are printing too small, low resolution, or poor contrast on a coloured background.",
      },
      {
        id: "png-vs-svg",
        question: "Should I use PNG or SVG for printing?",
        answer:
          "SVG. The bars stay mathematically exact at any size, whereas a PNG scaled up gets soft edges that scanners struggle with. Barcode reliability depends almost entirely on edge sharpness.",
      },
      {
        id: "code128",
        question: "Why does Code 128 have no fixed length?",
        answer:
          "It encodes characters individually rather than in a fixed pattern, so it takes any length and the full ASCII set. That flexibility is why it dominates logistics, where references vary in shape between systems.",
      },
      {
        id: "human-readable",
        question: "Should I show the digits under the barcode?",
        answer:
          "Almost always yes. If the scan fails, someone can key the number in manually — and for retail codes the human-readable line is required by the GS1 specification rather than optional.",
      },
      {
        id: "privacy",
        question: "Is my product data sent anywhere?",
        answer:
          "No. The barcode is drawn in your browser. Product codes and shipping references are commercially sensitive, and none of it is transmitted or logged.",
      },
    ],
    relatedSlugs: ["qr-code-generator", "uuid-generator", "hash-generator", "base64-encoder"],
  },
};
