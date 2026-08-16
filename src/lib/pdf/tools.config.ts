import type { PdfToolConfig } from "./types";

/**
 * Every PDF tool page is generated from this file: metadata, schema, on-page
 * content and the related-tool links. One tool = one entry.
 *
 * Rules enforced here rather than per page:
 *  - titles stay under 60 characters, descriptions under 160
 *  - FAQs are unique to the tool (no shared boilerplate)
 *  - `relatedSlugs` only reference tools that actually exist
 *  - `processingNote` matches how the tool really works
 */
export const PDF_TOOLS: Record<string, PdfToolConfig> = {
  "merge-pdf": {
    slug: "merge-pdf",
    name: "Merge PDF",
    title: "Merge PDF — Combine PDF Files Online Free",
    description:
      "Combine multiple PDFs into one file. Drag to set the page order, then download. Runs in your browser — no upload, no sign-up.",
    h1: "Merge PDF",
    intro:
      "Merging a PDF means joining two or more PDF files into a single document, one after another. Add your files, drag them into the order you want, and download the combined PDF. Pages are copied at full quality, so text stays selectable and images keep their original resolution.",
    iconName: "Merge",
    applicationCategory: "BusinessApplication",
    processing: "browser",
    processingNote:
      "Merging runs entirely in your browser. Your files are never uploaded.",
    features: [
      "Combine unlimited PDF files",
      "Drag to reorder before merging",
      "Lossless page copying",
      "Works offline once loaded",
    ],
    steps: [
      {
        name: "Add your PDFs",
        text: "Drop two or more PDF files onto the upload area, or click it to browse your device.",
      },
      {
        name: "Set the page order",
        text: "Drag rows to reorder, or use the up and down buttons. The file at the top contributes its pages first.",
      },
      {
        name: "Merge the files",
        text: "Click Merge PDFs. The combined document is assembled in your browser.",
      },
      {
        name: "Download the result",
        text: "Save the merged PDF to your device. The page count is shown so you can confirm nothing is missing.",
      },
    ],
    examples: [
      {
        title: "Cover page in front of a report",
        input: "cover.pdf (1 page), then report.pdf (24 pages)",
        output: "merged.pdf — 25 pages, cover first",
        explanation:
          "List order becomes page order. Drag the cover to the top before merging and it lands on page 1.",
      },
      {
        title: "A quarter of invoices in one file",
        input: "january.pdf (2), february.pdf (3), march.pdf (2)",
        output: "merged.pdf — 7 pages in calendar order",
        explanation:
          "One file is easier to email and archive than three, and the text stays searchable afterwards.",
      },
      {
        title: "Scanned pages that arrived separately",
        input: "scan-front.pdf (1 page), scan-back.pdf (1 page)",
        output: "merged.pdf — 2 pages",
        explanation:
          "Scanner output often splits into single pages. Merging restores the original two-sided document.",
      },
    ],
    benefits: [
      {
        title: "Nothing is uploaded",
        description:
          "Files are read and combined by your own browser, so confidential documents never travel over the network.",
      },
      {
        title: "Quality is untouched",
        description:
          "Pages are copied, not re-encoded. Fonts stay embedded, images keep their resolution, and text stays selectable.",
      },
      {
        title: "You control the order",
        description:
          "Reorder files before merging by dragging, or with the up and down buttons on touch devices.",
      },
      {
        title: "No file count limit",
        description:
          "Merge as many PDFs as you need in one pass, up to 50 MB combined.",
      },
      {
        title: "Free with no watermark",
        description:
          "No account, no trial, and nothing is stamped onto the output.",
      },
    ],
    limitations: [
      "Password-protected PDFs must be unlocked first — encrypted files cannot be read.",
      "The combined size limit is 50 MB, because everything is held in browser memory.",
      "Bookmarks and outlines from the source files are not carried over. Page content, links and form fields are.",
    ],
    keyTakeaways: [
      "Merging joins whole PDFs end to end; the list order decides the page order.",
      "Pages are copied without re-compression, so nothing loses quality.",
      "Processing is local to your browser, with a 50 MB combined limit.",
      "Encrypted PDFs need their password removed before merging.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What does merging a PDF actually do?",
        answer:
          "It creates a new PDF containing every page from the files you added, in the order you set. The originals on your device are left untouched.",
      },
      {
        id: "how-many",
        question: "How many PDFs can I merge at once?",
        answer:
          "There is no limit on the number of files. The practical limit is 50 MB combined, since the merge happens in browser memory.",
      },
      {
        id: "quality",
        question: "Does merging reduce quality?",
        answer:
          "No. Pages are copied byte for byte rather than re-rendered. Images keep their original resolution and text remains selectable and searchable.",
      },
      {
        id: "order",
        question: "How do I control which pages come first?",
        answer:
          "Drag a row up or down in the file list, or use the arrow buttons. The topmost file contributes its pages first, then the next, and so on.",
      },
      {
        id: "encrypted",
        question: "Can I merge password-protected PDFs?",
        answer:
          "Not directly — an encrypted file cannot be read until it is decrypted. Run it through the Unlock PDF tool first, then merge the unlocked copy.",
      },
      {
        id: "bookmarks",
        question: "Are bookmarks and links preserved?",
        answer:
          "Links inside pages are preserved. Document-level bookmarks (the outline sidebar) are not copied into the merged file.",
      },
      {
        id: "mobile",
        question: "Does this work on a phone?",
        answer:
          "Yes. Tap the upload area to pick files, and use the up and down buttons to reorder, since dragging is awkward on small screens.",
      },
      {
        id: "different-sizes",
        question: "What if my PDFs use different page sizes?",
        answer:
          "Each page keeps its own size and orientation. A merged file can legitimately contain both A4 and Letter pages; nothing is stretched or cropped.",
      },
      {
        id: "time",
        question: "How long does merging take?",
        answer:
          "Usually one to five seconds. Files close to the 50 MB limit can take around twenty seconds on an older phone.",
      },
      {
        id: "cost",
        question: "Is there a catch — watermarks or limits?",
        answer:
          "No. The tool is free, adds no watermark, needs no account, and does not cap how many times you use it.",
      },
    ],
    relatedSlugs: [
      "split-pdf",
      "compress-pdf",
      "extract-pdf-pages",
      "delete-pdf-pages",
      "jpg-to-pdf",
      "pdf-to-jpg",
      "protect-pdf",
      "edit-pdf",
    ],
  },

  "split-pdf": {
    slug: "split-pdf",
    name: "Split PDF",
    title: "Split PDF — Separate Pages Online Free",
    description:
      "Split a PDF into single pages or custom ranges and download them individually or as a ZIP. Runs in your browser, no sign-up.",
    h1: "Split PDF",
    intro:
      "Splitting a PDF means breaking one document into several smaller PDFs. You can split every page into its own file, or cut the document into custom ranges such as 1-5 and 6-20. Each output keeps the original page quality.",
    iconName: "Scissors",
    applicationCategory: "BusinessApplication",
    processing: "browser",
    processingNote:
      "Splitting runs entirely in your browser. Your file is never uploaded.",
    features: [
      "Split into single pages",
      "Split by custom page ranges",
      "Download individually or as a ZIP",
      "Lossless page extraction",
    ],
    steps: [
      {
        name: "Upload the PDF",
        text: "Drop a PDF onto the upload area, or click it to browse. The page count appears once the file is read.",
      },
      {
        name: "Choose how to split",
        text: "Pick every page as its own file, or enter custom ranges like 1-3, 4-8 to control where the cuts happen.",
      },
      {
        name: "Split the document",
        text: "Click Split PDF. Each output file is built in your browser.",
      },
      {
        name: "Download the parts",
        text: "Save files one at a time, or download everything at once as a ZIP archive.",
      },
    ],
    examples: [
      {
        title: "One file per page",
        input: "contract.pdf (8 pages), mode: every page",
        output: "8 files — contract-page-1.pdf through contract-page-8.pdf",
        explanation:
          "Useful when each page needs to be signed, filed or sent to a different person.",
      },
      {
        title: "Chapters as separate files",
        input: "handbook.pdf (60 pages), ranges: 1-12, 13-40, 41-60",
        output: "3 files of 12, 28 and 20 pages",
        explanation:
          "Ranges are inclusive on both ends, so 1-12 and 13-40 sit next to each other with no gap or overlap.",
      },
      {
        title: "Pulling out one section",
        input: "report.pdf (30 pages), range: 5-9",
        output: "1 file containing pages 5 to 9",
        explanation:
          "A single range produces a single file — a quick way to share one section without the rest of the report.",
      },
    ],
    benefits: [
      {
        title: "Two ways to split",
        description:
          "Break out every page separately, or define exactly where the document should be cut.",
      },
      {
        title: "Original quality kept",
        description:
          "Pages are copied rather than re-rendered, so text stays selectable and images keep their resolution.",
      },
      {
        title: "One-click ZIP download",
        description:
          "Splitting into many files produces a single ZIP so you are not clicking through dozens of downloads.",
      },
      {
        title: "Runs locally",
        description:
          "The document is read by your browser and never sent anywhere, which matters for contracts and records.",
      },
      {
        title: "Predictable naming",
        description:
          "Output files are named after the source document and their page numbers, so they stay sorted.",
      },
    ],
    limitations: [
      "Encrypted PDFs must be unlocked before they can be split.",
      "Files are limited to 50 MB because splitting happens in browser memory.",
      "Splitting cannot divide a single page into halves — the page is the smallest unit.",
    ],
    keyTakeaways: [
      "Split by single pages, or by custom inclusive ranges such as 1-5, 6-20.",
      "Every output file keeps the original page quality and selectable text.",
      "Multiple outputs can be downloaded together as one ZIP.",
      "Everything happens in your browser, up to a 50 MB file.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is splitting a PDF?",
        answer:
          "It is producing several smaller PDFs from one larger document. The source file on your device is not modified.",
      },
      {
        id: "ranges",
        question: "How do I write page ranges?",
        answer:
          "Separate ranges with commas and use a hyphen for a span, for example 1-3, 7, 10-12. Both ends of a range are included.",
      },
      {
        id: "vs-extract",
        question: "How is splitting different from extracting pages?",
        answer:
          "Splitting produces multiple output files. Extracting produces one file containing just the pages you picked. Use Extract PDF Pages when you only want a single result.",
      },
      {
        id: "zip",
        question: "Can I download everything at once?",
        answer:
          "Yes. When a split produces more than one file, a Download all as ZIP button appears and packages them together.",
      },
      {
        id: "overlap",
        question: "What if my ranges overlap?",
        answer:
          "Overlapping ranges are allowed and the same page will appear in more than one output file. The tool flags the overlap so it is not accidental.",
      },
      {
        id: "quality",
        question: "Do the split files lose quality?",
        answer:
          "No. Pages are copied at full fidelity. A split page is byte-identical in content to the same page in the original.",
      },
      {
        id: "large",
        question: "What is the largest file I can split?",
        answer:
          "50 MB. Beyond that the browser can run out of memory, so the tool stops you before it fails halfway.",
      },
      {
        id: "encrypted",
        question: "Can I split a password-protected PDF?",
        answer:
          "Not until the password is removed. Use the Unlock PDF tool first, then split the unlocked copy.",
      },
      {
        id: "size",
        question: "Why do the split files add up to more than the original?",
        answer:
          "Each output carries its own copy of any shared resources, such as embedded fonts. Splitting a 10 MB file into ten parts can total more than 10 MB.",
      },
    ],
    relatedSlugs: [
      "merge-pdf",
      "extract-pdf-pages",
      "delete-pdf-pages",
      "compress-pdf",
      "pdf-to-jpg",
      "jpg-to-pdf",
      "protect-pdf",
      "edit-pdf",
    ],
  },

  "compress-pdf": {
    slug: "compress-pdf",
    name: "Compress PDF",
    title: "Compress PDF — Reduce PDF File Size Free",
    description:
      "Shrink a PDF so it fits an email or upload limit. Choose a quality level and see the exact size saved before you download.",
    h1: "Compress PDF",
    intro:
      "Compressing a PDF reduces its file size, usually by re-encoding the images inside it at a lower resolution. Pick a level, and the tool reports the original size, the new size and the percentage saved so you can judge the trade-off. Text and vector graphics stay sharp at every level.",
    iconName: "FileArchive",
    applicationCategory: "BusinessApplication",
    processing: "browser",
    processingNote:
      "Compression runs entirely in your browser. Your file is never uploaded.",
    features: [
      "Four compression levels",
      "Lossless mode that keeps text selectable",
      "Before and after size comparison",
      "Text stays selectable",
    ],
    steps: [
      {
        name: "Upload the PDF",
        text: "Drop a PDF onto the upload area or click to browse. The current file size is shown immediately.",
      },
      {
        name: "Pick a level",
        text: "Lossless rebuilds the file and keeps text selectable. Balanced, Strong and Maximum re-encode each page as an image, trading searchable text for a much smaller file.",
      },
      {
        name: "Compress",
        text: "Click Compress PDF and wait for the result. Larger scanned documents take longer.",
      },
      {
        name: "Check the saving, then download",
        text: "Compare the before and after sizes. If the saving is too small, try a stronger level; if the pages look soft, step back down.",
      },
    ],
    examples: [
      {
        title: "Scanned document that will not attach",
        input: "scan.pdf, 18.4 MB, Balanced",
        output: "About 2-4 MB, comfortably under a 10 MB mail limit",
        explanation:
          "Scans are photographs of paper. Lowering image resolution is where nearly all the saving comes from.",
      },
      {
        title: "Text-only document",
        input: "invoice.pdf, 240 KB, Maximum",
        output: "Roughly 230 KB — very little change",
        explanation:
          "There are no photos to shrink. A PDF that is mostly text is already small, and compression has little left to remove.",
      },
      {
        title: "Keeping print quality",
        input: "brochure.pdf, 12 MB, Lossless",
        output: "Around 11 MB with images untouched",
        explanation:
          "Lossless rebuilds the document from its parsed objects, dropping orphaned data and old revisions. Choose it when the PDF is going to a printer.",
      },
    ],
    benefits: [
      {
        title: "Real, measurable levels",
        description:
          "Each level maps to a specific image resolution, so the difference between them is visible in the output size.",
      },
      {
        title: "You see the result first",
        description:
          "Original size, compressed size and percentage saved are shown before you commit to the download.",
      },
      {
        title: "Text never gets blurry",
        description:
          "Only raster images are re-encoded. Text and vector graphics are left as they are and stay crisp at any zoom.",
      },
      {
        title: "A private option",
        description:
          "Every level runs in your browser and nothing is sent anywhere, so even a sensitive contract can be compressed safely.",
      },
      {
        title: "No watermark",
        description:
          "Nothing is stamped onto the compressed file and there is no daily cap.",
      },
    ],
    limitations: [
      "Levels other than Lossless re-encode each page as an image, so text stops being selectable and searchable in the result.",
      "Strong compression can occasionally produce a larger file on an already-optimised PDF. When that happens the tool tells you and hands back your original.",
      "A PDF that is mostly text will barely shrink — there are no large images to re-encode.",
      "Maximum renders pages at 80% of natural size. Printed output at that level will look soft.",
      "Compression cannot be undone. Keep your original if you may need the full-resolution version.",
    ],
    keyTakeaways: [
      "Compression saves space mainly by lowering the resolution of embedded images.",
      "Balanced, Strong and Maximum render pages at roughly 150%, 110% and 80% of natural size before re-encoding them as JPEG.",
      "Scanned documents shrink dramatically; text-only PDFs barely change.",
      "Text and vector graphics stay sharp at every level.",
    ],
    faqs: [
      {
        id: "how-works",
        question: "How does PDF compression actually work?",
        answer:
          "Most of a large PDF is embedded images. Compression decodes those images, resamples them to a lower resolution and re-encodes them. Text and vector art are stored as instructions, not pixels, so they are left alone.",
      },
      {
        id: "levels",
        question: "Which level should I choose?",
        answer:
          "Balanced for documents you will print, Strong for email and sharing, Maximum for screen-only reading. Use Lossless whenever the text must stay selectable.",
      },
      {
        id: "no-change",
        question: "Why did my PDF barely get smaller?",
        answer:
          "It is probably already efficient. Text-only PDFs contain no large images, so there is very little to remove. Compression helps most with scans and image-heavy documents.",
      },
      {
        id: "quality-loss",
        question: "Will my text become blurry?",
        answer:
          "No. Text is stored as font instructions rather than pixels, so it renders sharply at any zoom regardless of the level you pick. Only photographs and scans lose detail.",
      },
      {
        id: "privacy",
        question: "Is my PDF uploaded when compressing?",
        answer:
          "No. Every level runs in your browser using its own PDF engine. Nothing is transmitted, so a contract or a scanned passport stays on your machine — there is no server to hold it and nothing to delete afterwards.",
      },
      {
        id: "reverse",
        question: "Can I undo compression?",
        answer:
          "No. Detail removed from an image cannot be restored. Keep the original file if you might need the full-quality version later.",
      },
      {
        id: "limit",
        question: "What is the file size limit?",
        answer:
          "50 MB per file. If your document is larger, split it first, compress the parts, then merge them back together.",
      },
      {
        id: "scanned",
        question: "Why are scanned PDFs so large?",
        answer:
          "A scanner stores each page as a full-page photograph, often at 300 DPI or higher. Ten scanned pages can easily exceed 20 MB, while ten pages of typed text might be 100 KB.",
      },
      {
        id: "email",
        question: "What size do I need for email?",
        answer:
          "Most mail providers cap attachments at 20-25 MB, and many corporate systems at 10 MB. The Balanced level usually brings a large scan under 10 MB.",
      },
    ],
    relatedSlugs: [
      "merge-pdf",
      "split-pdf",
      "pdf-to-jpg",
      "jpg-to-pdf",
      "delete-pdf-pages",
      "extract-pdf-pages",
      "protect-pdf",
      "edit-pdf",
    ],
  },

  "pdf-to-jpg": {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    title: "PDF to JPG — Convert PDF Pages to Images",
    description:
      "Turn PDF pages into JPG or PNG images at your chosen resolution. Preview each page, then download singly or as a ZIP.",
    h1: "PDF to JPG",
    intro:
      "Converting a PDF to JPG renders each page as a flat image file. Choose which pages to convert, pick a resolution, and download the results as JPG or PNG. Use it when you need to paste a page into a slide deck, a document or a social post.",
    iconName: "Image",
    applicationCategory: "MultimediaApplication",
    processing: "browser",
    processingNote:
      "Pages are rendered by your browser. Your file is never uploaded.",
    features: [
      "JPG or PNG output",
      "Three resolution presets",
      "Convert selected pages only",
      "ZIP download for multiple pages",
    ],
    steps: [
      {
        name: "Upload the PDF",
        text: "Drop a PDF onto the upload area or click to browse. The page count is read straight away.",
      },
      {
        name: "Choose pages and format",
        text: "Convert every page or enter ranges like 1-4, 9. Pick JPG for photos and screenshots, PNG when you need a transparent or lossless image.",
      },
      {
        name: "Set the resolution",
        text: "Screen is fastest, Print is the middle ground, and High is best for zooming or re-printing.",
      },
      {
        name: "Download the images",
        text: "Preview each result, then save individual images or take them all as a ZIP.",
      },
    ],
    examples: [
      {
        title: "One page for a slide",
        input: "report.pdf, page 3 only, JPG, Print quality",
        output: "page-3.jpg at roughly 1700 x 2200 pixels",
        explanation:
          "A single high-resolution image drops straight into a slide without the whole PDF coming with it.",
      },
      {
        title: "A whole document as images",
        input: "menu.pdf (4 pages), all pages, PNG, Screen quality",
        output: "4 PNG files, downloaded together as a ZIP",
        explanation:
          "PNG keeps flat colours and sharp edges clean, which suits menus, diagrams and screenshots better than JPG.",
      },
      {
        title: "A page to post online",
        input: "flyer.pdf, page 1, JPG, Screen quality",
        output: "page-1.jpg at about 850 x 1100 pixels",
        explanation:
          "Screen quality keeps the file small enough to upload quickly while staying readable on a phone.",
      },
    ],
    benefits: [
      {
        title: "Pick your resolution",
        description:
          "Three presets from screen viewing to high-detail printing, so you are not stuck with one fixed size.",
      },
      {
        title: "JPG or PNG",
        description:
          "JPG for smaller files on photographic pages, PNG for lossless output on text, diagrams and line art.",
      },
      {
        title: "Convert only what you need",
        description:
          "Page ranges mean a 200-page document does not have to become 200 images.",
      },
      {
        title: "Preview before saving",
        description:
          "Each rendered page is shown with its pixel dimensions so you can check the result first.",
      },
      {
        title: "Nothing leaves your device",
        description:
          "Rendering uses your browser's own PDF engine, so the document is never uploaded.",
      },
    ],
    limitations: [
      "Images are flat pictures — the text in them is no longer selectable or searchable.",
      "High quality on many pages uses a lot of memory; the tool warns you before starting a large job.",
      "Files are limited to 30 MB, lower than the other tools, because rendering pages to bitmaps is memory-heavy.",
      "Encrypted PDFs must be unlocked first.",
    ],
    keyTakeaways: [
      "Each page becomes a separate flat image; text in it is no longer selectable.",
      "JPG suits photographic pages, PNG suits text, diagrams and line art.",
      "Resolution presets range from screen viewing to high-detail printing.",
      "Rendering happens in your browser, with a 30 MB file limit.",
    ],
    faqs: [
      {
        id: "which-format",
        question: "Should I choose JPG or PNG?",
        answer:
          "Choose JPG for pages that are mostly photographs — the files are much smaller. Choose PNG for text, charts and line art, where JPG compression can leave visible fuzz around sharp edges.",
      },
      {
        id: "resolution",
        question: "What resolution should I pick?",
        answer:
          "Screen is fine for viewing and sharing online. Print gives roughly twice the detail and suits documents you will print. High is for zooming in or reprinting at full size, and produces the largest files.",
      },
      {
        id: "searchable",
        question: "Can I still search the text after converting?",
        answer:
          "No. A JPG or PNG is a picture of the page, so the text becomes pixels. Keep the original PDF if you need to search or copy from it.",
      },
      {
        id: "quality-loss",
        question: "Why does my image look soft?",
        answer:
          "Screen quality renders at a lower pixel density. Re-run the conversion at Print or High quality and the same page will come out noticeably sharper.",
      },
      {
        id: "all-pages",
        question: "Can I convert only some pages?",
        answer:
          "Yes. Switch to custom pages and enter ranges such as 1-4, 9, 15-18. Only those pages are rendered.",
      },
      {
        id: "zip",
        question: "How do I download lots of pages at once?",
        answer:
          "When more than one page is converted, a Download all as ZIP button packages every image into a single archive.",
      },
      {
        id: "memory",
        question: "Why was I warned about memory?",
        answer:
          "Rendering many pages at high resolution can exceed what a browser tab can hold. The warning appears before a large job so you can lower the quality or convert fewer pages rather than have the tab crash.",
      },
      {
        id: "reverse",
        question: "How do I turn the images back into a PDF?",
        answer:
          "Use the JPG to PDF tool. Note that the round trip is lossy — text converted to images and back will no longer be selectable.",
      },
      {
        id: "size-limit",
        question: "Why is the limit 30 MB and not 50 MB?",
        answer:
          "Rendering a page to a bitmap uses far more memory than copying it. A single high-resolution page can occupy tens of megabytes while being drawn, so the input limit is lower to keep the tool stable.",
      },
    ],
    relatedSlugs: [
      "jpg-to-pdf",
      "compress-pdf",
      "split-pdf",
      "merge-pdf",
      "extract-pdf-pages",
      "delete-pdf-pages",
      "edit-pdf",
      "protect-pdf",
    ],
  },

  "jpg-to-pdf": {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    title: "JPG to PDF — Convert Images to PDF Free",
    description:
      "Turn JPG, PNG or WebP images into one PDF. Set page size, orientation and margins, reorder pages, then download.",
    h1: "JPG to PDF",
    intro:
      "Converting JPG to PDF places your images into a PDF document, one image per page. Add photos or scans, drag them into order, choose the page size and margins, and download a single PDF. It is the usual way to turn phone photos of paperwork into something you can email or file.",
    iconName: "Images",
    applicationCategory: "MultimediaApplication",
    processing: "browser",
    processingNote:
      "Images are assembled into a PDF by your browser. Nothing is uploaded.",
    features: [
      "JPG, PNG and WebP input",
      "A4, Letter or fit-to-image pages",
      "Portrait or landscape with margin control",
      "Drag to reorder before converting",
    ],
    steps: [
      {
        name: "Add your images",
        text: "Drop JPG, PNG or WebP files onto the upload area, or click to browse. Thumbnails appear as each one loads.",
      },
      {
        name: "Put them in order",
        text: "Drag thumbnails to rearrange. The first image becomes page 1.",
      },
      {
        name: "Set the page layout",
        text: "Choose A4, Letter or a page that matches each image, then set orientation and margin size.",
      },
      {
        name: "Convert and download",
        text: "Click Convert to PDF and save the finished document.",
      },
    ],
    examples: [
      {
        title: "Phone photos of a signed form",
        input: "3 JPG photos, A4, portrait, small margin",
        output: "One 3-page A4 PDF",
        explanation:
          "Each photo is scaled to fit inside the margins with its proportions kept, so nothing is stretched or cropped.",
      },
      {
        title: "A receipt archive",
        input: "12 receipt photos, fit-to-image, no margin",
        output: "A 12-page PDF where each page matches its receipt",
        explanation:
          "Fit-to-image avoids the large white borders you get from forcing a tall receipt onto an A4 page.",
      },
      {
        title: "A landscape photo set",
        input: "5 wide photos, Letter, landscape, medium margin",
        output: "A 5-page landscape PDF",
        explanation:
          "Matching the orientation to the images uses the page properly instead of leaving big empty bands.",
      },
    ],
    benefits: [
      {
        title: "Layout you control",
        description:
          "Page size, orientation and margins are all adjustable rather than fixed to one preset.",
      },
      {
        title: "Proportions kept",
        description:
          "Images are scaled to fit, never stretched. A photo keeps its shape whatever page size you choose.",
      },
      {
        title: "Reorder before converting",
        description:
          "Drag thumbnails until the order is right. What you see is the order you get.",
      },
      {
        title: "Handles common formats",
        description:
          "JPG, PNG and WebP all work. PNG transparency is flattened onto white so it prints predictably.",
      },
      {
        title: "Private by default",
        description:
          "Photos of documents often contain personal details. These never leave your browser.",
      },
    ],
    limitations: [
      "Text inside a photo stays a picture — this tool does not run OCR, so the result is not searchable.",
      "Total image size is limited to 50 MB.",
      "Transparent PNG areas are filled with white, since PDF pages have no transparency behind them.",
      "Very large photos are downscaled to keep the PDF a sensible size.",
    ],
    keyTakeaways: [
      "Each image becomes one PDF page, in the order shown on screen.",
      "Choose A4, Letter, or a page sized to each image; proportions are always preserved.",
      "JPG, PNG and WebP are supported, up to 50 MB in total.",
      "The output is not searchable — there is no OCR step.",
    ],
    faqs: [
      {
        id: "formats",
        question: "Which image formats can I use?",
        answer:
          "JPG, PNG and WebP. Mixing formats in one document is fine — the tool converts each image as needed while building the PDF.",
      },
      {
        id: "page-size",
        question: "Should I use A4, Letter or fit-to-image?",
        answer:
          "Use A4 or Letter when the PDF will be printed, so pages match real paper. Use fit-to-image for screen-only documents such as receipts, where you want no wasted white space.",
      },
      {
        id: "order",
        question: "How do I change the page order?",
        answer:
          "Drag the thumbnails into the order you want before converting. The first thumbnail becomes page 1.",
      },
      {
        id: "stretch",
        question: "Will my photos be stretched to fill the page?",
        answer:
          "No. Each image is scaled to fit within the page and margins while keeping its proportions, then centred. Any leftover space stays white.",
      },
      {
        id: "ocr",
        question: "Can I search the text in my scanned photos?",
        answer:
          "No. This tool places the image on the page as-is and does not perform OCR, so text inside the photo stays part of the picture.",
      },
      {
        id: "transparency",
        question: "What happens to transparent PNGs?",
        answer:
          "Transparent areas are filled with white. PDF pages have no transparent background, so flattening keeps the result consistent on screen and in print.",
      },
      {
        id: "quality",
        question: "Will my images lose quality?",
        answer:
          "JPGs are embedded as they are with no re-compression. Very large images are downscaled to keep the PDF a reasonable size, which is rarely visible at normal viewing sizes.",
      },
      {
        id: "margins",
        question: "What do the margin options do?",
        answer:
          "They set the white border around each image. No margin fills the page edge to edge; larger margins leave room for binding, hole-punching or annotation.",
      },
      {
        id: "one-file",
        question: "Can I make separate PDFs instead of one?",
        answer:
          "This tool always produces a single PDF. To get separate files, convert them together and then run the result through the Split PDF tool.",
      },
    ],
    relatedSlugs: [
      "pdf-to-jpg",
      "merge-pdf",
      "compress-pdf",
      "split-pdf",
      "edit-pdf",
      "protect-pdf",
      "extract-pdf-pages",
      "delete-pdf-pages",
    ],
  },

  "extract-pdf-pages": {
    slug: "extract-pdf-pages",
    name: "Extract PDF Pages",
    title: "Extract PDF Pages — Save Selected Pages",
    description:
      "Pick the pages you want and save them as a new PDF. Click thumbnails or type ranges. Runs in your browser, no sign-up.",
    h1: "Extract PDF Pages",
    intro:
      "Extracting pages copies the pages you choose into a new PDF and leaves the original untouched. Select pages by clicking their thumbnails or by typing ranges such as 2-5, 9. The result is one file containing only those pages, in their original order and quality.",
    iconName: "FileOutput",
    applicationCategory: "BusinessApplication",
    processing: "browser",
    processingNote:
      "Pages are copied in your browser. Your file is never uploaded.",
    features: [
      "Visual page thumbnails",
      "Select by clicking or by typing ranges",
      "Single combined output file",
      "Lossless page copying",
    ],
    steps: [
      {
        name: "Upload the PDF",
        text: "Drop a PDF onto the upload area or click to browse. Thumbnails render as the document loads.",
      },
      {
        name: "Select the pages you want",
        text: "Click thumbnails to toggle them, or type ranges like 2-5, 9 into the range box. The two stay in sync.",
      },
      {
        name: "Extract",
        text: "Click Extract Pages. A new PDF is built from your selection.",
      },
      {
        name: "Download",
        text: "Save the new file. The original document on your device is unchanged.",
      },
    ],
    examples: [
      {
        title: "Just the summary section",
        input: "annual-report.pdf (48 pages), selection: 3-6",
        output: "A 4-page PDF containing pages 3, 4, 5 and 6",
        explanation:
          "Share a section without sending the whole report or revealing the rest of it.",
      },
      {
        title: "Scattered pages in one file",
        input: "bundle.pdf (30 pages), selection: 1, 7, 12-14",
        output: "A 5-page PDF in that order",
        explanation:
          "Selections do not need to be next to each other. Pages always come out in ascending order.",
      },
      {
        title: "A single page to sign",
        input: "agreement.pdf (11 pages), selection: 9",
        output: "A 1-page PDF",
        explanation:
          "Extracting one page is the quickest way to send only the signature page to someone.",
      },
    ],
    benefits: [
      {
        title: "See the pages you are choosing",
        description:
          "Thumbnails mean you select by looking at the page rather than guessing from a page number.",
      },
      {
        title: "Two selection methods",
        description:
          "Click thumbnails for a few pages, or type ranges when you already know exactly which ones you need.",
      },
      {
        title: "Original stays intact",
        description:
          "Extracting reads the source document and writes a new one. Nothing is removed from your original.",
      },
      {
        title: "No quality change",
        description:
          "Pages are copied rather than re-rendered, so text stays selectable and images keep their resolution.",
      },
      {
        title: "Processed locally",
        description:
          "The document never leaves your browser, which matters for contracts, records and medical documents.",
      },
    ],
    limitations: [
      "Extracted pages keep their original order — you cannot reorder them here. Use Merge PDF for that.",
      "Encrypted PDFs must be unlocked first.",
      "Files are limited to 50 MB.",
      "Form fields and annotations on extracted pages are preserved, but document-level bookmarks are not.",
    ],
    keyTakeaways: [
      "Extracting copies chosen pages into a new PDF and leaves the original alone.",
      "Select visually by thumbnail or by typing ranges such as 2-5, 9.",
      "All selected pages land in a single output file, in ascending order.",
      "Pages are copied losslessly and everything runs in your browser.",
    ],
    faqs: [
      {
        id: "vs-split",
        question: "How is this different from Split PDF?",
        answer:
          "Extracting gives you one file containing your selected pages. Splitting gives you several files. Choose extraction when the result should be a single document.",
      },
      {
        id: "vs-delete",
        question: "Should I extract or delete pages?",
        answer:
          "Extract when you want a few pages out of many. Delete when you want to keep most of the document and drop a handful of pages. The outcome is the same, but one is far less clicking.",
      },
      {
        id: "select",
        question: "How do I select pages?",
        answer:
          "Click any thumbnail to include or exclude it, or type ranges such as 1-3, 8 into the range box. Both methods update each other as you go.",
      },
      {
        id: "order",
        question: "Can I reorder the extracted pages?",
        answer:
          "No. Pages always come out in their original ascending order. To reorder, extract them first and then use Merge PDF to assemble them the way you want.",
      },
      {
        id: "original",
        question: "Does extracting change my original file?",
        answer:
          "No. The original PDF on your device is never modified. Extraction produces a separate new file.",
      },
      {
        id: "quality",
        question: "Do extracted pages lose any quality?",
        answer:
          "No. The page content is copied as-is, so an extracted page is identical to the same page in the source document.",
      },
      {
        id: "forms",
        question: "Are form fields and comments kept?",
        answer:
          "Fields and annotations attached to the pages you extract are carried over. Bookmarks that belong to the document as a whole are not.",
      },
      {
        id: "encrypted",
        question: "What if my PDF is password-protected?",
        answer:
          "It has to be unlocked before its pages can be read. Run it through Unlock PDF, then extract from the unlocked copy.",
      },
      {
        id: "thumbnails",
        question: "Why are the thumbnails slow to appear on a big document?",
        answer:
          "Every thumbnail is a real render of that page, done in your browser. Pages appear progressively, and you can start selecting before the last one finishes.",
      },
    ],
    relatedSlugs: [
      "delete-pdf-pages",
      "split-pdf",
      "merge-pdf",
      "compress-pdf",
      "pdf-to-jpg",
      "jpg-to-pdf",
      "protect-pdf",
      "edit-pdf",
    ],
  },

  "delete-pdf-pages": {
    slug: "delete-pdf-pages",
    name: "Delete PDF Pages",
    title: "Delete PDF Pages — Remove Pages Online",
    description:
      "Remove blank or unwanted pages from a PDF. Click thumbnails to mark pages for deletion, then save the trimmed file.",
    h1: "Delete PDF Pages",
    intro:
      "Deleting PDF pages produces a new PDF with the pages you marked removed. Click the thumbnails you do not want, or type their numbers, and download the trimmed document. The original file on your device stays as it was.",
    iconName: "Trash2",
    applicationCategory: "BusinessApplication",
    processing: "browser",
    processingNote:
      "Pages are removed in your browser. Your file is never uploaded.",
    features: [
      "Visual page thumbnails",
      "Mark pages by click or by number",
      "Live preview of the remaining page count",
      "Lossless output",
    ],
    steps: [
      {
        name: "Upload the PDF",
        text: "Drop a PDF onto the upload area or click to browse. Every page renders as a thumbnail.",
      },
      {
        name: "Mark pages for removal",
        text: "Click any thumbnail to mark it, or type numbers like 2, 5-7. Marked pages are clearly flagged.",
      },
      {
        name: "Check what is left",
        text: "The tool shows how many pages will remain, so you can confirm before committing.",
      },
      {
        name: "Delete and download",
        text: "Click Delete Pages and save the trimmed PDF.",
      },
    ],
    examples: [
      {
        title: "Blank pages from a scanner",
        input: "scan.pdf (20 pages), marked: 4, 11, 17",
        output: "A 17-page PDF",
        explanation:
          "Duplex scanners often insert a blank page for a one-sided sheet. Thumbnails make those easy to spot.",
      },
      {
        title: "Dropping the cover and back page",
        input: "guide.pdf (32 pages), marked: 1, 32",
        output: "A 30-page PDF",
        explanation:
          "Marking the first and last page trims a document down to its content before you send it on.",
      },
      {
        title: "Removing a confidential section",
        input: "report.pdf (25 pages), marked: 8-12",
        output: "A 20-page PDF",
        explanation:
          "Deleted pages are absent from the output entirely, not hidden — their content is not recoverable from the new file.",
      },
    ],
    benefits: [
      {
        title: "Spot pages visually",
        description:
          "Blank and duplicate pages are obvious in a thumbnail grid and hard to identify from numbers alone.",
      },
      {
        title: "Confirm before you commit",
        description:
          "The remaining page count updates as you mark pages, so there is no guessing about the result.",
      },
      {
        title: "Content is genuinely removed",
        description:
          "Deleted pages are not carried into the new file, so nothing hidden is left behind for someone to recover.",
      },
      {
        title: "Kept pages are untouched",
        description:
          "Everything you keep is copied at full quality with selectable text and original images.",
      },
      {
        title: "Runs on your device",
        description:
          "Documents you are trimming are often sensitive. This one never leaves your browser.",
      },
    ],
    limitations: [
      "You cannot delete every page — a PDF must keep at least one.",
      "Deletion cannot be undone in the tool; keep your original if you may need those pages.",
      "Encrypted PDFs must be unlocked first.",
      "Files are limited to 50 MB.",
    ],
    keyTakeaways: [
      "Marked pages are removed and a new PDF is written; the original is untouched.",
      "Pages can be marked by clicking thumbnails or typing numbers and ranges.",
      "Removed content is not carried into the output, so it cannot be recovered from it.",
      "At least one page must remain, and files run up to 50 MB in your browser.",
    ],
    faqs: [
      {
        id: "recoverable",
        question: "Is deleted content really gone from the new file?",
        answer:
          "Yes. The output is built from the pages you kept, so deleted pages are never written into it. This is different from covering content with a black box, which leaves the original text underneath.",
      },
      {
        id: "undo",
        question: "Can I undo a deletion?",
        answer:
          "Not from inside the tool. The download is a new file, so your original PDF still has every page — reopen it and start again if you marked the wrong pages.",
      },
      {
        id: "all-pages",
        question: "Can I delete every page?",
        answer:
          "No. A PDF must contain at least one page to remain a valid file, so the tool stops you selecting every page and explains why rather than producing a document no reader could open.",
      },
      {
        id: "blank",
        question: "How do I find blank pages quickly?",
        answer:
          "Scan the thumbnail grid for pages that render as plain white. Duplex scanners commonly produce these when a sheet is only printed on one side.",
      },
      {
        id: "vs-extract",
        question: "Should I delete pages or extract them instead?",
        answer:
          "Delete when you are keeping most of the document. Extract when you only want a few pages out of many. Deleting 3 pages from 50 is far quicker than selecting the other 47.",
      },
      {
        id: "renumber",
        question: "Do the remaining pages get renumbered?",
        answer:
          "The PDF page positions close up, so a 20-page file with 3 removed becomes 17 sequential pages. Page numbers printed onto the page artwork itself do not change.",
      },
      {
        id: "quality",
        question: "Do the pages I keep change at all?",
        answer:
          "No. Kept pages are copied without re-encoding, so text stays selectable and images keep their original resolution.",
      },
      {
        id: "size",
        question: "Why is the file barely smaller after deleting pages?",
        answer:
          "Resources such as embedded fonts are shared across the document and are still needed by the remaining pages. Removing a few text pages saves little space; removing image-heavy pages saves much more.",
      },
      {
        id: "encrypted",
        question: "Can I delete pages from a protected PDF?",
        answer:
          "Not while it is encrypted. Remove the password with Unlock PDF first, then delete pages from the unlocked copy.",
      },
    ],
    relatedSlugs: [
      "extract-pdf-pages",
      "split-pdf",
      "merge-pdf",
      "compress-pdf",
      "edit-pdf",
      "pdf-to-jpg",
      "jpg-to-pdf",
      "protect-pdf",
    ],
  },

  "protect-pdf": {
    slug: "protect-pdf",
    name: "Protect PDF",
    title: "Protect PDF — Add a Password Free",
    description:
      "Encrypt a PDF with AES-256 and a password. Set printing and copying permissions, then download the protected file.",
    h1: "Protect PDF",
    intro:
      "Protecting a PDF encrypts its contents so it cannot be opened without the password. This tool applies AES-256 encryption, the strongest option in the PDF specification, and can also restrict printing, copying and editing. Encryption happens in your browser, so neither the file nor the password is ever sent anywhere.",
    iconName: "Lock",
    applicationCategory: "SecurityApplication",
    processing: "browser",
    processingNote:
      "Encryption runs in your browser. Neither your file nor your password is uploaded.",
    features: [
      "AES-256 encryption",
      "Separate owner password",
      "Printing and copying permissions",
      "Password strength feedback",
    ],
    steps: [
      {
        name: "Upload the PDF",
        text: "Drop a PDF onto the upload area or click to browse.",
      },
      {
        name: "Set a password",
        text: "Type the password needed to open the document, then confirm it. A strength indicator shows how solid it is.",
      },
      {
        name: "Choose permissions",
        text: "Optionally allow or block printing, copying, editing and annotating, and set a separate owner password to control them.",
      },
      {
        name: "Encrypt and download",
        text: "Click Protect PDF and save the encrypted file. Test it opens with your password before sending it on.",
      },
    ],
    examples: [
      {
        title: "A contract sent by email",
        input: "contract.pdf, password set, copying blocked",
        output: "An encrypted PDF that prompts for a password on open",
        explanation:
          "Send the password separately — by phone or message — rather than in the same email as the file.",
      },
      {
        title: "A read-only handout",
        input: "handout.pdf, owner password set, printing allowed, editing blocked",
        output: "A PDF that opens freely but refuses edits in compliant readers",
        explanation:
          "With only an owner password set, anyone can open the file, but permissions restrict what they can do with it.",
      },
      {
        title: "Payroll records for storage",
        input: "payroll.pdf, strong password, printing and copying blocked",
        output: "An AES-256 encrypted PDF",
        explanation:
          "Encryption strength depends on the password. A long, unusual passphrase is what makes AES-256 worth having.",
      },
    ],
    benefits: [
      {
        title: "AES-256 encryption",
        description:
          "The strongest algorithm the PDF format supports, and the same standard used for encrypted disks and archives.",
      },
      {
        title: "Password never transmitted",
        description:
          "Encryption happens on your device, so your password is never sent to or stored on any server.",
      },
      {
        title: "Permissions as well as passwords",
        description:
          "Block printing, copying, editing or annotating independently of whether a password is needed to open the file.",
      },
      {
        title: "Strength feedback while typing",
        description:
          "The strength meter shows immediately whether your password is long and varied enough to be worth using.",
      },
      {
        title: "Works in every standard reader",
        description:
          "Standard PDF encryption is understood by Acrobat, Preview, Chrome, Edge and mobile readers alike.",
      },
    ],
    limitations: [
      "There is no password recovery. If you forget the password, the file cannot be opened — keep a copy somewhere safe.",
      "Permission settings are honoured by well-behaved readers but are not a hard technical barrier; the open password is the real protection.",
      "Encrypting an already-encrypted PDF is not supported. Unlock it first.",
      "Files are limited to 50 MB.",
    ],
    keyTakeaways: [
      "AES-256 encryption is applied in your browser; the password is never transmitted.",
      "An open password controls who can read the file; permissions control what they can do with it.",
      "A forgotten password cannot be recovered by anyone, including us.",
      "Encryption is only as strong as the password you choose.",
    ],
    faqs: [
      {
        id: "strength",
        question: "How strong is AES-256 encryption on a PDF?",
        answer:
          "The algorithm itself is not practically breakable by brute force. In real terms the weak point is the password — a short or common one can be guessed regardless of the algorithm behind it.",
      },
      {
        id: "forgot",
        question: "What if I forget the password?",
        answer:
          "The file cannot be opened. There is no backdoor and no recovery process, including for us, because the password is never sent to or stored on any server.",
      },
      {
        id: "user-vs-owner",
        question: "What is the difference between the user and owner password?",
        answer:
          "The user password is required to open the document. The owner password governs permissions such as printing and editing. Setting only an owner password lets anyone open the file while still restricting what they can do.",
      },
      {
        id: "permissions-real",
        question: "Do the permission settings actually stop people?",
        answer:
          "They are instructions that compliant readers follow. Acrobat and mainstream browsers respect them, but some tools ignore them. Use an open password when the content genuinely must stay private.",
      },
      {
        id: "good-password",
        question: "What makes a good PDF password?",
        answer:
          "Length matters most. Four unrelated words are stronger and easier to remember than a short string of symbols. Avoid names, dates and anything reused from another account.",
      },
      {
        id: "sharing",
        question: "How should I send the password to someone?",
        answer:
          "Through a different channel from the file. Emailing the PDF and its password together means one compromised inbox exposes both.",
      },
      {
        id: "already-encrypted",
        question: "Can I add a password to an already-protected PDF?",
        answer:
          "No. The existing encryption has to be removed first with the Unlock PDF tool, after which you can apply a new password and permissions.",
      },
      {
        id: "readers",
        question: "Will the protected file open everywhere?",
        answer:
          "Yes. This uses standard PDF encryption, so Acrobat, macOS Preview, Chrome, Edge and mobile readers all prompt for the password normally.",
      },
      {
        id: "content-change",
        question: "Does encrypting change the document itself?",
        answer:
          "No. Pages, text, images and formatting are unchanged. Only a security layer is added, so the file size grows very slightly.",
      },
    ],
    relatedSlugs: [
      "unlock-pdf",
      "merge-pdf",
      "compress-pdf",
      "split-pdf",
      "edit-pdf",
      "extract-pdf-pages",
      "delete-pdf-pages",
      "jpg-to-pdf",
    ],
  },

  "unlock-pdf": {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    title: "Unlock PDF — Remove PDF Password Free",
    description:
      "Remove the password from a PDF you own. Text stays selectable and quality is unchanged. Enter the password to decrypt.",
    h1: "Unlock PDF",
    intro:
      "Unlocking a PDF removes its encryption so it opens without a password and can be edited, merged or printed normally. You need the current password — this tool decrypts a file you can already open, it does not guess or crack passwords. Decryption is lossless, so text stays selectable and pages keep their original quality.",
    iconName: "Unlock",
    applicationCategory: "SecurityApplication",
    processing: "browser",
    processingNote:
      "Unlocking runs in your browser. Neither your file nor your password is uploaded.",
    features: [
      "Lossless decryption",
      "Removes printing and copying restrictions",
      "Text stays selectable",
      "Handles AES-256 and older RC4 encryption",
    ],
    steps: [
      {
        name: "Upload the locked PDF",
        text: "Drop the file onto the upload area. The tool checks whether it is encrypted and what kind of password it needs.",
      },
      {
        name: "Enter the password",
        text: "Type the password you normally use to open the document. Files with only printing or copying restrictions need no password at all.",
      },
      {
        name: "Unlock",
        text: "Click Unlock PDF. The encryption is removed and a clean copy is produced.",
      },
      {
        name: "Download",
        text: "Save the unlocked PDF. It now opens without prompting and can be used with any other tool.",
      },
    ],
    examples: [
      {
        title: "A bank statement you keep re-typing the password for",
        input: "statement.pdf with an open password, correct password entered",
        output: "An identical PDF that opens with no prompt",
        explanation:
          "Pages, text and layout are unchanged. Only the encryption layer is removed.",
      },
      {
        title: "A file that will not let you print",
        input: "report.pdf, opens freely but printing is blocked, no password entered",
        output: "The same PDF with printing and copying allowed",
        explanation:
          "Permission-only restrictions use an owner password. The document can be decrypted without you typing anything.",
      },
      {
        title: "A protected file you need to merge",
        input: "appendix.pdf with a password, unlocked first",
        output: "A PDF that other tools can read",
        explanation:
          "Merge, split and compress cannot read encrypted files. Unlocking first is what makes them work.",
      },
    ],
    benefits: [
      {
        title: "Nothing is lost",
        description:
          "Decryption rewrites the security layer only. Text stays selectable, images keep their resolution and the layout is identical.",
      },
      {
        title: "Clears restrictions too",
        description:
          "Blocks on printing, copying and editing are removed alongside the open password.",
      },
      {
        title: "Handles old and new encryption",
        description:
          "Works with modern AES-256 files and with older RC4-encrypted documents that some tools refuse.",
      },
      {
        title: "Unblocks the other tools",
        description:
          "Encrypted PDFs cannot be merged, split or compressed. Unlocking is the step that makes those work.",
      },
      {
        title: "Deleted right after",
        description:
          "The file and password exist only for the length of the request and are not written to disk or logged.",
      },
    ],
    limitations: [
      "You must know the password. This tool decrypts documents you can already open; it does not recover or crack unknown passwords.",
      "A document using an unusual or damaged structure may fail to rebuild. When that happens the file is left untouched rather than a partial result being returned.",
      "Only remove protection from documents you own or are authorised to modify.",
      "Files are limited to 50 MB.",
    ],
    keyTakeaways: [
      "Unlocking removes encryption from a PDF whose password you already know.",
      "Decryption is lossless: text stays selectable and quality is unchanged.",
      "Permission-only restrictions can be removed without entering any password.",
      "This tool cannot recover or guess a forgotten password.",
    ],
    faqs: [
      {
        id: "forgot",
        question: "Can I unlock a PDF if I do not know the password?",
        answer:
          "No. This tool decrypts a document using the password you provide — it does not guess, crack or recover unknown passwords. A file with a forgotten open password cannot be opened.",
      },
      {
        id: "no-password",
        question: "Why did it unlock without asking for a password?",
        answer:
          "Your file had permission restrictions rather than an open password. Those use an owner password, which readers do not require to display the document, so it can be removed directly.",
      },
      {
        id: "quality",
        question: "Does unlocking reduce quality?",
        answer:
          "No. Only the encryption layer is rewritten. Text stays selectable and searchable, images keep their resolution and the page layout is identical to the original.",
      },
      {
        id: "how-lossless",
        question: "Does unlocking turn my text into an image?",
        answer:
          "No. The document is rebuilt from its decrypted objects rather than re-rendered, so text stays selectable, links keep working and the file size stays close to the original. Nothing is rasterised.",
      },
      {
        id: "legal",
        question: "Is it legal to remove a PDF password?",
        answer:
          "It is your own document, so removing protection you applied or were given access to is normal. Removing protection from a document you have no right to modify is not. Use it on files you own or are authorised to change.",
      },
      {
        id: "restrictions",
        question: "Will it remove printing and copying blocks?",
        answer:
          "Yes. Decryption clears the whole security layer, so restrictions on printing, copying, editing and annotating are lifted along with the password.",
      },
      {
        id: "encryption-types",
        question: "Which types of encryption are supported?",
        answer:
          "Both modern AES-128 and AES-256 files and older RC4-encrypted documents. Older files that some current tools reject are usually handled without trouble.",
      },
      {
        id: "certificate",
        question: "What about certificate or DRM-protected files?",
        answer:
          "Those are not supported. Documents secured with a digital certificate or a rights-management system such as Adobe LiveCycle use a different mechanism that a password cannot open.",
      },
      {
        id: "re-protect",
        question: "Can I add a new password afterwards?",
        answer:
          "Yes. Unlock the file, make your changes, then run it through Protect PDF to apply a fresh password and permission set.",
      },
    ],
    relatedSlugs: [
      "protect-pdf",
      "merge-pdf",
      "split-pdf",
      "compress-pdf",
      "edit-pdf",
      "extract-pdf-pages",
      "delete-pdf-pages",
      "pdf-to-jpg",
    ],
  },

  "edit-pdf": {
    slug: "edit-pdf",
    name: "Edit PDF",
    title: "Edit PDF — Change Text in a PDF Free",
    description:
      "Edit the text already in your PDF, add new text, sign, highlight and place images. Runs in your browser — no upload, no sign-up.",
    h1: "Edit PDF",
    intro:
      "A PDF editor lets you change the text already inside a PDF, add new text, draw, highlight, white out content and place images. Click any line on the page to edit it directly — the tool reads that line's font, size and colour so your replacement matches the text around it. Everything runs in your browser, so the document is never uploaded.",
    iconName: "PenLine",
    applicationCategory: "BusinessApplication",
    processing: "browser",
    processingNote:
      "Editing runs entirely in your browser. Your file is never uploaded.",
    features: [
      "Edit existing PDF text in place",
      "Add text, images and signatures",
      "Draw, highlight and white out",
      "Undo, redo and page zoom",
    ],
    steps: [
      {
        name: "Open your PDF",
        text: "Drop a PDF onto the upload area. The first page renders and its text becomes clickable straight away.",
      },
      {
        name: "Click the text you want to change",
        text: "Hover any line to outline it, click to edit, and type your replacement. The original font, size and colour are matched automatically.",
      },
      {
        name: "Add anything else you need",
        text: "Switch tools to add new text, draw a signature, highlight a passage, white out content or place a PNG or JPG.",
      },
      {
        name: "Save and download",
        text: "Click Save changes to write every edit into the pages, then download the finished PDF.",
      },
    ],
    examples: [
      {
        title: "Fixing a wrong date in a contract",
        input: "Click the line reading '14 March 2025', type '18 March 2025'",
        output: "The line is replaced in the same font, size and colour",
        explanation:
          "The tool covers the original text with the page's own background colour, then redraws your version on top, so the correction blends in.",
      },
      {
        title: "Signing an agreement",
        input: "Draw tool, signature drawn on page 5",
        output: "A signed PDF, no printing or scanning",
        explanation:
          "The signature is written into the page content, so it shows in every reader rather than only ones that display annotations.",
      },
      {
        title: "Filling a scanned form",
        input: "Add text tool, text placed in each blank",
        output: "A completed PDF ready to send",
        explanation:
          "Scanned forms have no interactive fields. Placing text over the blanks is how you complete them without reprinting.",
      },
    ],
    benefits: [
      {
        title: "Change text that is already there",
        description:
          "Most free tools only let you stick a text box on top. This one reads the existing line and replaces it, matching the font, size and colour.",
      },
      {
        title: "Colours are sampled, not assumed",
        description:
          "The page background and ink colour are read from the rendered page, so edits on coloured or shaded backgrounds do not leave white boxes.",
      },
      {
        title: "Full undo and redo",
        description:
          "Every change is reversible with Ctrl+Z until you save, so experimenting costs nothing.",
      },
      {
        title: "Edits become part of the page",
        description:
          "Saving writes your changes into the page content, so they display and print identically in every PDF reader.",
      },
      {
        title: "Private by design",
        description:
          "Contracts and forms usually hold personal data. Nothing here is uploaded — the document stays on your device.",
      },
    ],
    limitations: [
      "Replacement text is drawn in the closest built-in font (Helvetica, Times or Courier). On a document using an unusual typeface the substitution may be visible.",
      "Text does not reflow. A longer replacement is shrunk to fit the original line rather than pushing the following text along.",
      "Rotated and vertical text is not editable, and stays read-only.",
      "Text supports Latin characters only. Cyrillic, Greek, Arabic, Hebrew and CJK scripts cannot be drawn by the built-in fonts.",
      "Saved edits are permanent — keep your original if you may need to go back.",
      "Files are limited to 50 MB, and encrypted PDFs must be unlocked first.",
    ],
    keyTakeaways: [
      "Existing PDF text can be edited in place; the font, size and colour are matched automatically.",
      "New text, drawings, highlights, whiteout and images can all be added on any page.",
      "Undo and redo work until you save, after which edits are permanent.",
      "Everything runs in your browser — the file is never uploaded.",
    ],
    faqs: [
      {
        id: "edit-existing",
        question: "Can I actually change the text that is already in my PDF?",
        answer:
          "Yes. Choose the Edit text tool and click any line — it becomes an input holding the original wording. The tool reads that line's font, size and colour, covers the original glyphs with the page's own background colour and redraws your replacement in their place.",
      },
      {
        id: "how-matching",
        question: "How does it match the original formatting?",
        answer:
          "It reads the font name, size and position that the PDF records for that line, then picks the closest built-in font and matches weight and slant. The ink and background colours are sampled from the rendered page rather than assumed.",
      },
      {
        id: "reflow",
        question: "What happens if my replacement text is longer?",
        answer:
          "It is scaled down to fit the width the original occupied. PDFs have no concept of reflowing paragraphs, so pushing the following text along is not possible — shrinking keeps the line from running into its neighbour.",
      },
      {
        id: "font-exact",
        question: "Will the replacement look exactly like the original?",
        answer:
          "On documents using common fonts it is usually indistinguishable. A document set in an unusual typeface will show a slight difference, because new text has to be drawn in one of the standard PDF fonts.",
      },
      {
        id: "vs-word",
        question: "How is this different from converting to Word and back?",
        answer:
          "A Word round trip rebuilds the whole document and typically shifts the layout. Editing here changes only the line you click and leaves every other element exactly where it was.",
      },
      {
        id: "signature",
        question: "How do I sign a document?",
        answer:
          "Select the Draw tool and sign with your mouse, trackpad or finger. On a touchscreen a finger or stylus gives a far more natural result than a mouse.",
      },
      {
        id: "undo",
        question: "Can I undo a change?",
        answer:
          "Yes, with the undo button or Ctrl+Z, at any point before you save. Once saved, edits are written into the page content and cannot be removed from that file.",
      },
      {
        id: "images",
        question: "Can I add a logo or a photo?",
        answer:
          "Yes. Use the Image tool to place a PNG or JPG, then switch to Select and drag it into position.",
      },
      {
        id: "redaction",
        question: "Can I use whiteout to hide sensitive information?",
        answer:
          "Whiteout covers content visually but the text underneath remains in the file and can still be copied out. To remove information properly, delete the whole page with the Delete PDF Pages tool.",
      },
      {
        id: "scripts",
        question: "Why will my language not type correctly?",
        answer:
          "New and replacement text is drawn using the standard PDF fonts, which cover Latin characters only. Cyrillic, Greek, Arabic, Hebrew, Chinese, Japanese and Korean characters cannot be rendered, and the tool tells you rather than saving a broken file.",
      },
      {
        id: "forms",
        question: "Should I use this for an interactive form?",
        answer:
          "If the PDF has real fillable fields, fill them in your normal PDF reader so the fields stay intact. Use this tool for flat forms and scans that have no fields to click into.",
      },
      {
        id: "cost",
        question: "Is the PDF editor really free?",
        answer:
          "Yes. There is no account, no page limit, no watermark and no trial. The editor runs in your browser, so there are no per-file processing costs to pass on.",
      },
    ],
    relatedSlugs: [
      "merge-pdf",
      "split-pdf",
      "delete-pdf-pages",
      "extract-pdf-pages",
      "compress-pdf",
      "protect-pdf",
      "jpg-to-pdf",
      "pdf-to-jpg",
    ],
  },
};

export const PDF_TOOL_SLUGS = Object.keys(PDF_TOOLS);

export function getPdfTool(slug: string): PdfToolConfig {
  const tool = PDF_TOOLS[slug];
  if (!tool) {
    throw new Error(
      `Unknown PDF tool "${slug}". Add it to PDF_TOOLS in src/lib/pdf/tools.config.ts.`,
    );
  }
  return tool;
}

/** Resolves a tool's related slugs into full configs, skipping anything missing. */
export function getRelatedPdfTools(slug: string): PdfToolConfig[] {
  return getPdfTool(slug)
    .relatedSlugs.map((related) => PDF_TOOLS[related])
    .filter((tool): tool is PdfToolConfig => Boolean(tool));
}
