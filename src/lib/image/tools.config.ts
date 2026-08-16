import type { SeoToolConfig } from "@/lib/seo-tools/types";

/**
 * Content for the image tool pages.
 *
 * Shares the SeoToolConfig shape so the same page shell and schema builders
 * serve every category.
 */
export const IMAGE_TOOLS: Record<string, SeoToolConfig> = {
  "image-compressor": {
    slug: "image-compressor",
    name: "Image Compressor",
    title: "Image Compressor — Reduce Image Size Free",
    description:
      "Compress JPG, PNG and WebP images in your browser. Set a quality level or a target size and see exactly how much you saved.",
    h1: "Image Compressor",
    intro:
      "Compressing an image reduces its file size by storing the picture less precisely, usually with no difference you can see at normal viewing size. Drop images in, choose how hard to compress, and download the results. Everything runs in your browser, so nothing is uploaded.",
    iconName: "Minimize2",
    applicationCategory: "MultimediaApplication",
    features: [
      "Batch compression",
      "Quality slider with live preview",
      "Before and after size comparison",
      "Optional resizing",
    ],
    steps: [
      {
        name: "Add your images",
        text: "Drop in one or many. JPG, PNG, WebP, AVIF, GIF and BMP are all accepted.",
      },
      {
        name: "Choose a quality level",
        text: "80% is the usual sweet spot for photos. Lower it further if the file still needs to be smaller.",
      },
      {
        name: "Compare the result",
        text: "Each image shows its original and compressed size with the percentage saved, so you can judge the trade-off.",
      },
      {
        name: "Download",
        text: "Save images one at a time, or take the whole batch as a ZIP.",
      },
    ],
    examples: [
      {
        title: "Photo for a web page",
        input: "3.8 MB JPG at 4000 × 3000, quality 80%",
        output: "About 400–600 KB, no visible difference",
        explanation:
          "Camera JPEGs are saved at near-maximum quality. Dropping to 80% typically removes most of the file size and none of the visible detail.",
      },
      {
        title: "Screenshot",
        input: "PNG screenshot, converted to WebP",
        output: "Often 60–80% smaller",
        explanation:
          "PNG is lossless and poor at photographic content. For screenshots with gradients, WebP is dramatically smaller at the same visual quality.",
      },
      {
        title: "Already-compressed file",
        input: "180 KB JPG at quality 75%, compressed again",
        output: "Little saving, slightly worse quality",
        explanation:
          "Re-compressing a lossy file discards more detail without much size benefit. Compress from the original whenever you can.",
      },
    ],
    benefits: [
      {
        title: "See the saving before you commit",
        description:
          "Every image reports its original size, new size and the percentage saved, so you are not guessing.",
      },
      {
        title: "Warns when compression backfires",
        description:
          "If the output would be larger than the input — which happens with already-optimised files — you are told rather than handed a bigger file.",
      },
      {
        title: "Batch processing",
        description:
          "Compress a whole folder of images in one pass and download them as a ZIP.",
      },
      {
        title: "Photos stay the right way up",
        description:
          "EXIF orientation is applied when decoding, so portrait phone photos do not come out sideways.",
      },
      {
        title: "Nothing is uploaded",
        description:
          "Images are decoded and re-encoded by your own browser. They never leave your device.",
      },
    ],
    limitations: [
      "Compression is lossy and cannot be undone. Keep your originals.",
      "Re-compressing an already-compressed file loses quality for very little size benefit.",
      "Images are limited to 25 MB each, since decoding happens in browser memory.",
      "Animated GIFs are flattened to a single frame. Use a dedicated GIF tool to keep animation.",
    ],
    keyTakeaways: [
      "Compression trades a little image detail for a much smaller file.",
      "Around 80% quality is the usual sweet spot for photographs.",
      "Converting a PNG screenshot to WebP usually saves far more than compressing the PNG.",
      "Everything runs locally and images are never uploaded.",
    ],
    faqs: [
      {
        id: "how-works",
        question: "How does image compression work?",
        answer:
          "Lossy compression stores the picture approximately, discarding detail the eye is least sensitive to — mostly fine colour variation. At moderate settings the result is visually identical to the original but a fraction of the size.",
      },
      {
        id: "quality-setting",
        question: "What quality should I choose?",
        answer:
          "Start at 80%. For photos on a web page that is usually indistinguishable from the original at a fraction of the size. Go to 60–70% when size matters more than fine detail, and above 90% only when the image will be examined closely.",
      },
      {
        id: "lossy-lossless",
        question: "What is the difference between lossy and lossless?",
        answer:
          "Lossy formats such as JPEG, WebP and AVIF discard detail permanently to save space. Lossless formats such as PNG keep every pixel exactly but produce much larger files for photographic content.",
      },
      {
        id: "quality-loss",
        question: "Will my image look worse?",
        answer:
          "At 80% and above, rarely in any way you would notice at normal viewing size. Below about 60% you start to see blocking around sharp edges and banding in smooth gradients.",
      },
      {
        id: "no-saving",
        question: "Why did my file barely get smaller?",
        answer:
          "It was probably already compressed. A JPEG saved at 75% has little left to remove, and compressing it again mostly costs quality. Always compress from the highest-quality original you have.",
      },
      {
        id: "bigger",
        question: "Why did my file get bigger?",
        answer:
          "This happens when the input is already more efficiently compressed than the settings you chose — common with small PNGs and optimised JPEGs. The tool flags it so you can keep the original instead.",
      },
      {
        id: "png-vs-jpg",
        question: "Should I keep PNG or switch to JPEG?",
        answer:
          "Keep PNG for logos, icons, screenshots of text and anything needing transparency. Use JPEG or WebP for photographs, where PNG produces files several times larger for no visible benefit.",
      },
      {
        id: "batch",
        question: "Can I compress many images at once?",
        answer:
          "Yes. Add as many as you like, up to 25 MB each, and download the finished batch as a single ZIP.",
      },
      {
        id: "privacy",
        question: "Does compressing send my photos anywhere?",
        answer:
          "No. Decoding and re-encoding happen in your browser using the canvas API, so the images never leave your device and no account is needed.",
      },
    ],
    relatedSlugs: ["image-converter", "image-resizer", "webp-converter", "avif-converter"],
  },

  "image-converter": {
    slug: "image-converter",
    name: "Image Converter",
    title: "Image Converter — JPG, PNG, WebP & AVIF",
    description:
      "Convert images between JPG, PNG, WebP and AVIF in your browser. Batch convert, control quality, and download as a ZIP.",
    h1: "Image Converter",
    intro:
      "Converting an image changes the format it is stored in — JPEG, PNG, WebP or AVIF — without changing what the picture shows. Each format has different strengths: JPEG for photos, PNG for transparency, WebP and AVIF for the smallest files. Drop images in, pick a target format, and download.",
    iconName: "Repeat",
    applicationCategory: "MultimediaApplication",
    features: [
      "JPG, PNG, WebP and AVIF output",
      "Batch conversion",
      "Transparency handled correctly",
      "Browser support detection",
    ],
    steps: [
      {
        name: "Add images",
        text: "Drop in any mix of JPG, PNG, WebP, AVIF, GIF or BMP files.",
      },
      {
        name: "Pick the output format",
        text: "Formats your browser cannot encode are disabled rather than silently producing the wrong file.",
      },
      {
        name: "Set the quality",
        text: "Applies to the lossy formats. PNG ignores it, being lossless.",
      },
      {
        name: "Download",
        text: "Save individually or take everything as a ZIP.",
      },
    ],
    examples: [
      {
        title: "PNG photo to JPEG",
        input: "4.2 MB PNG photograph, JPEG at 85%",
        output: "About 500 KB",
        explanation:
          "PNG stores photographs very inefficiently. Converting to JPEG usually cuts the size by 80% or more with no visible change.",
      },
      {
        title: "PNG with transparency to JPEG",
        input: "Logo with a transparent background",
        output: "Transparent areas become white",
        explanation:
          "JPEG has no alpha channel. Transparency has to be flattened to a colour — white here, rather than the black most tools produce by accident.",
      },
      {
        title: "Anything to WebP",
        input: "JPEG at 85%, WebP at 85%",
        output: "Typically 25–35% smaller",
        explanation:
          "WebP compresses better than JPEG at the same visual quality and is supported by every current browser.",
      },
    ],
    benefits: [
      {
        title: "Transparency flattened to white",
        description:
          "Converting a transparent PNG to JPEG paints white behind it. Most converters leave it black, which ruins logos.",
      },
      {
        title: "Honest format support",
        description:
          "The browser is tested for each format before it is offered. A canvas silently returns PNG when it cannot encode what you asked for.",
      },
      {
        title: "Batch conversion",
        description:
          "Convert a whole folder in one pass and download the results as a ZIP.",
      },
      {
        title: "Correct orientation",
        description:
          "EXIF rotation is applied on decode, so portrait photos stay portrait.",
      },
      {
        title: "Private and free",
        description:
          "Conversion happens in your browser. No upload, no account, no watermark.",
      },
    ],
    limitations: [
      "Converting between lossy formats re-compresses the image, so quality drops slightly each time.",
      "AVIF encoding is not available in every browser and is much slower than the others.",
      "Animated GIF and WebP are flattened to their first frame.",
      "Images are limited to 25 MB each.",
    ],
    keyTakeaways: [
      "JPEG suits photos, PNG suits transparency and flat graphics, WebP and AVIF are smaller than both.",
      "Converting to JPEG flattens transparency; this tool fills it with white rather than black.",
      "Each lossy-to-lossy conversion loses a little quality, so convert from the original.",
      "Conversion runs in your browser and images are never uploaded.",
    ],
    faqs: [
      {
        id: "which-format",
        question: "Which image format should I use?",
        answer:
          "WebP for almost everything on the web — it is smaller than JPEG and PNG and universally supported. JPEG for maximum compatibility with older software, PNG when you need transparency or pixel-exact graphics, AVIF when you want the smallest possible file.",
      },
      {
        id: "transparency",
        question: "What happens to transparency when I convert to JPEG?",
        answer:
          "JPEG has no alpha channel, so transparent areas must be filled with a solid colour. This tool fills them with white. Many converters default to black, which is why logos sometimes come out with a dark box behind them.",
      },
      {
        id: "webp-support",
        question: "Is WebP supported everywhere?",
        answer:
          "Yes, in every current browser — Chrome, Firefox, Safari and Edge have all supported it for years. Some older desktop software still does not, which is the main reason to keep JPEG around.",
      },
      {
        id: "avif",
        question: "Should I use AVIF?",
        answer:
          "AVIF produces the smallest files, often 20–30% below WebP at the same quality. Encoding is much slower and not every browser can create AVIF, though most can display it. Use it when file size matters more than encode time.",
      },
      {
        id: "quality-loss",
        question: "Does converting lose quality?",
        answer:
          "Converting to a lossless format such as PNG does not. Converting to a lossy format re-encodes the image and loses a little. Converting a JPEG to another JPEG loses quality twice over, so always work from the original.",
      },
      {
        id: "png-to-jpg-size",
        question: "Why is my PNG so much bigger than the JPEG?",
        answer:
          "PNG is lossless and designed for flat colour and sharp edges. Photographs have millions of subtly different pixels, which PNG has to record exactly — often five to ten times the size of an equivalent JPEG.",
      },
      {
        id: "batch",
        question: "Can I convert several images at once?",
        answer:
          "Yes. Add as many as you like and they are processed one after another, then offered as a single ZIP. Each keeps its original name with the new extension, so a folder of files stays recognisable.",
      },
      {
        id: "animation",
        question: "Can I convert animated GIFs?",
        answer:
          "Only the first frame. Canvas-based conversion cannot preserve animation — a dedicated GIF or video tool is needed for that.",
      },
      {
        id: "privacy",
        question: "Where does the conversion actually happen?",
        answer:
          "No. Everything is decoded and re-encoded in your browser, so images never leave your device.",
      },
    ],
    relatedSlugs: ["image-compressor", "webp-converter", "avif-converter", "image-resizer"],
  },

  "image-resizer": {
    slug: "image-resizer",
    name: "Image Resizer",
    title: "Image Resizer — Resize Images Online Free",
    description:
      "Resize images by pixels or percentage, with the aspect ratio locked. Batch resize and download as a ZIP. Runs in your browser.",
    h1: "Image Resizer",
    intro:
      "Resizing changes an image's pixel dimensions — useful when a photo is far larger than the space it will be shown in. Enter a width, a height or a percentage and the aspect ratio is kept for you. Resizing down also makes the file dramatically smaller, which is usually the real goal.",
    iconName: "Scaling",
    applicationCategory: "MultimediaApplication",
    features: [
      "Resize by pixels or percentage",
      "Aspect ratio lock",
      "Preset sizes for common uses",
      "High-quality downscaling",
    ],
    steps: [
      {
        name: "Add your images",
        text: "Drop in one or many. Each image's current dimensions are shown.",
      },
      {
        name: "Set the new size",
        text: "Type a width or height and the other follows automatically, or switch to percentage to scale everything proportionally.",
      },
      {
        name: "Choose the output format",
        text: "Keep the original format or convert while resizing — often worth doing, since WebP is smaller.",
      },
      {
        name: "Download",
        text: "Save individually or as a ZIP.",
      },
    ],
    examples: [
      {
        title: "Phone photo for a website",
        input: "4032 × 3024 photo, width set to 1600",
        output: "1600 × 1200, roughly 85% smaller",
        explanation:
          "A 4000-pixel-wide photo is far larger than any web layout needs. Resizing to 1600 saves most of the file size with no visible loss on screen.",
      },
      {
        title: "Scaling by percentage",
        input: "Mixed batch at 50%",
        output: "Each image halved in both dimensions",
        explanation:
          "Percentage mode suits batches of different sizes, where one fixed width would distort the relationship between them.",
      },
      {
        title: "Enlarging a small image",
        input: "300 × 200 upscaled to 1200 × 800",
        output: "Blurry, four times the pixels",
        explanation:
          "Enlarging cannot invent detail that was never captured. The tool warns before upscaling, since the result is almost always worse.",
      },
    ],
    benefits: [
      {
        title: "Aspect ratio kept by default",
        description:
          "Change one dimension and the other follows, so images are never stretched unless you deliberately unlock the ratio.",
      },
      {
        title: "High-quality downscaling",
        description:
          "Resampling uses the browser's high-quality mode, which is noticeably cleaner than the default on large reductions.",
      },
      {
        title: "Warns before upscaling",
        description:
          "Enlarging past the original resolution only adds blur and bytes. You are told before it happens.",
      },
      {
        title: "Presets for common targets",
        description:
          "Sizes for social posts, web headers and thumbnails, so you do not have to remember them.",
      },
      {
        title: "Runs locally",
        description:
          "Resizing happens in your browser, so nothing is uploaded.",
      },
    ],
    limitations: [
      "Enlarging cannot add detail that was not in the original. Any upscale will look softer.",
      "Resizing a lossy image re-encodes it, so a little quality is lost each time.",
      "Animated images are flattened to their first frame.",
      "Images are limited to 25 MB each.",
    ],
    keyTakeaways: [
      "Resizing changes pixel dimensions; downscaling also shrinks the file substantially.",
      "Keep the aspect ratio locked unless you specifically want a distorted image.",
      "Most web layouts need no more than about 1600 pixels wide.",
      "Enlarging cannot recover detail and always looks softer.",
    ],
    faqs: [
      {
        id: "what-size",
        question: "What size should my images be for a website?",
        answer:
          "Around 1600 pixels wide covers full-width images on most layouts, including high-density screens. Content images usually need 800–1200, and thumbnails 300–400. Anything larger is bytes the visitor downloads and never sees.",
      },
      {
        id: "aspect-ratio",
        question: "What is the aspect ratio and why lock it?",
        answer:
          "It is the relationship between width and height. Locking it means changing one dimension adjusts the other automatically, so the image keeps its proportions. Unlocking lets you set both independently, which stretches the picture.",
      },
      {
        id: "upscale",
        question: "Can I make a small image bigger without losing quality?",
        answer:
          "No. The detail simply is not there to recover — enlarging spreads existing pixels over a larger area and interpolates between them, which always looks softer. AI upscalers guess at detail, which is a different thing from recovering it.",
      },
      {
        id: "resize-vs-compress",
        question: "Should I resize or compress?",
        answer:
          "Resize first, then compress. Reducing dimensions removes pixels entirely and usually saves far more than compression alone, and compressing afterwards has less work to do.",
      },
      {
        id: "quality-loss",
        question: "Does resizing lose quality?",
        answer:
          "Downscaling discards pixels but generally looks clean, often sharper than the original at the smaller size. The re-encode that follows costs a little quality if the output is lossy.",
      },
      {
        id: "batch-different-sizes",
        question: "How do I resize images of different sizes together?",
        answer:
          "Use percentage mode, which scales each image relative to itself. A fixed width would force very different images to the same dimension regardless of their shape.",
      },
      {
        id: "crop-vs-resize",
        question: "What is the difference between resizing and cropping?",
        answer:
          "Resizing scales the whole image to new dimensions and keeps everything in frame. Cropping cuts parts away to change the framing or the aspect ratio. Use the Image Cropper when you need a specific shape.",
      },
      {
        id: "dpi",
        question: "What about DPI or PPI?",
        answer:
          "DPI only matters for printing. On screen, only the pixel dimensions count — a 1600-pixel-wide image is identical at 72 or 300 DPI. Set the physical size in your print software instead.",
      },
      {
        id: "privacy",
        question: "Do my images leave my computer when resizing?",
        answer:
          "No. The image is decoded and redrawn at the new size by your own browser. Nothing is uploaded, which matters for screenshots of internal dashboards or anything under an NDA.",
      },
    ],
    relatedSlugs: ["image-compressor", "image-cropper", "image-converter", "webp-converter"],
  },

  "webp-converter": {
    slug: "webp-converter",
    name: "WebP Converter",
    title: "WebP Converter — Convert Images to WebP Free",
    description:
      "Convert JPG and PNG images to WebP, or WebP back to JPG and PNG. Batch convert with quality control, all in your browser.",
    h1: "WebP Converter",
    intro:
      "WebP is an image format that produces smaller files than JPEG and PNG at the same visual quality, typically 25–35% smaller. Every current browser supports it. Convert images to WebP to speed up a website, or convert WebP back to JPG or PNG when older software cannot open it.",
    iconName: "FileImage",
    applicationCategory: "MultimediaApplication",
    features: [
      "To and from WebP",
      "Batch conversion",
      "Transparency preserved",
      "Quality control",
    ],
    steps: [
      {
        name: "Add images",
        text: "Drop in JPG, PNG or WebP files — the direction is set by the output format you choose.",
      },
      {
        name: "Choose the direction",
        text: "Convert to WebP to save space, or from WebP to JPG or PNG for compatibility.",
      },
      {
        name: "Set the quality",
        text: "80–85% is usually indistinguishable from the original at a much smaller size.",
      },
      {
        name: "Download",
        text: "Save individually or as a ZIP.",
      },
    ],
    examples: [
      {
        title: "JPEG to WebP",
        input: "820 KB JPEG at quality 85%",
        output: "About 550 KB",
        explanation:
          "WebP's compression is more efficient than JPEG's, so the same visual quality needs fewer bytes.",
      },
      {
        title: "Transparent PNG to WebP",
        input: "PNG logo with transparency",
        output: "Much smaller, transparency intact",
        explanation:
          "Unlike JPEG, WebP has an alpha channel, so it can replace PNG for transparent graphics as well as photos.",
      },
      {
        title: "WebP back to PNG",
        input: "WebP file, output PNG",
        output: "Larger file that older software can open",
        explanation:
          "Some desktop applications still cannot read WebP. Converting back restores compatibility at the cost of size.",
      },
    ],
    benefits: [
      {
        title: "Works in both directions",
        description:
          "Convert to WebP for the web, or back to JPG and PNG when a program cannot open a WebP file.",
      },
      {
        title: "Transparency survives",
        description:
          "WebP keeps the alpha channel, so transparent PNGs convert without a background being forced behind them.",
      },
      {
        title: "Real size comparison",
        description:
          "Every file shows its before and after size, so the benefit is visible rather than assumed.",
      },
      {
        title: "Batch processing",
        description:
          "Convert a whole folder at once and download the results as a ZIP.",
      },
      {
        title: "Nothing uploaded",
        description:
          "Conversion happens in your browser with no server involved.",
      },
    ],
    limitations: [
      "Converting a JPEG to WebP re-encodes it, so a little quality is lost. Convert from the original where possible.",
      "Animated WebP is flattened to its first frame.",
      "A few older desktop applications still cannot open WebP files.",
      "Images are limited to 25 MB each.",
    ],
    keyTakeaways: [
      "WebP files are typically 25–35% smaller than equivalent JPEGs.",
      "WebP supports transparency, so it can replace PNG as well as JPEG.",
      "Every current browser displays WebP; some older desktop software does not.",
      "Conversion runs entirely in your browser.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is WebP?",
        answer:
          "An image format developed by Google that compresses more efficiently than JPEG and PNG. It supports both lossy and lossless compression plus transparency, which no single older format did.",
      },
      {
        id: "how-much-smaller",
        question: "How much smaller are WebP files?",
        answer:
          "Usually 25–35% smaller than a JPEG of the same visual quality, and often far smaller than PNG for photographic content. The exact saving depends on the image.",
      },
      {
        id: "support",
        question: "Do all browsers support WebP?",
        answer:
          "Yes. Chrome, Firefox, Safari and Edge have all supported WebP for years, including on mobile. The remaining gap is older desktop applications rather than browsers.",
      },
      {
        id: "transparency",
        question: "Does WebP support transparency?",
        answer:
          "Yes, it has a full alpha channel like PNG. That is why it can replace both JPEG and PNG rather than only one of them.",
      },
      {
        id: "why-convert-back",
        question: "Why would I convert WebP back to JPG?",
        answer:
          "Compatibility. Some older photo editors, print services and content systems still reject WebP uploads. Converting back to JPEG or PNG solves it at the cost of a larger file.",
      },
      {
        id: "seo",
        question: "Does using WebP help SEO?",
        answer:
          "Indirectly. Smaller images load faster, and page speed is a ranking signal and a Core Web Vitals factor. The format itself is not a ranking factor.",
      },
      {
        id: "quality",
        question: "What quality setting should I use?",
        answer:
          "80–85% for photographs is usually indistinguishable from the original. Lossless WebP exists for graphics needing pixel accuracy, though it produces much larger files.",
      },
      {
        id: "vs-avif",
        question: "Is AVIF better than WebP?",
        answer:
          "AVIF compresses better still, often 20–30% below WebP. It encodes much more slowly and fewer browsers can create it, so WebP remains the more practical default today.",
      },
      {
        id: "privacy",
        question: "Is my image sent to a server to make WebP?",
        answer:
          "No. Your browser decodes the image and re-encodes it as WebP on a canvas. No upload happens, so there is no queue, no size cap beyond your own memory, and no copy on anyone else's server.",
      },
    ],
    relatedSlugs: ["avif-converter", "image-converter", "image-compressor", "image-resizer"],
  },

  "avif-converter": {
    slug: "avif-converter",
    name: "AVIF Converter",
    title: "AVIF Converter — Convert Images to AVIF Free",
    description:
      "Convert JPG, PNG and WebP images to AVIF, the smallest modern image format, or convert AVIF back for compatibility.",
    h1: "AVIF Converter",
    intro:
      "AVIF is currently the most efficient widely-supported image format, producing files roughly 20–30% smaller than WebP and around half the size of JPEG at the same quality. It supports transparency and high dynamic range. The trade-off is slower encoding and patchier support for creating files.",
    iconName: "ImageDown",
    applicationCategory: "MultimediaApplication",
    features: [
      "To and from AVIF",
      "Transparency preserved",
      "Quality control",
      "Support detection with fallback",
    ],
    steps: [
      {
        name: "Add images",
        text: "Drop in JPG, PNG, WebP or AVIF files.",
      },
      {
        name: "Choose the direction",
        text: "Convert to AVIF for the smallest files, or from AVIF to JPG, PNG or WebP for compatibility.",
      },
      {
        name: "Set the quality",
        text: "AVIF holds up better at low settings than JPEG, so 60–70% often still looks clean.",
      },
      {
        name: "Download",
        text: "Save individually or as a ZIP.",
      },
    ],
    examples: [
      {
        title: "JPEG to AVIF",
        input: "820 KB JPEG, AVIF at quality 65%",
        output: "About 300 KB",
        explanation:
          "AVIF's compression is substantially more efficient, so large photographs benefit the most.",
      },
      {
        title: "AVIF back to JPEG",
        input: "AVIF file, output JPEG",
        output: "Larger file that any software can open",
        explanation:
          "AVIF support is still uneven outside browsers. Converting back restores compatibility.",
      },
      {
        title: "Low quality comparison",
        input: "Same photo at 50% in JPEG and AVIF",
        output: "JPEG shows blocking; AVIF stays smooth",
        explanation:
          "AVIF degrades far more gracefully than JPEG, which is why lower quality settings are usable with it.",
      },
    ],
    benefits: [
      {
        title: "The smallest files available",
        description:
          "Typically 20–30% below WebP and around half the size of JPEG at matched visual quality.",
      },
      {
        title: "Degrades gracefully",
        description:
          "At aggressive settings AVIF stays smooth where JPEG breaks into visible blocks, so lower quality values remain usable.",
      },
      {
        title: "Support checked first",
        description:
          "Your browser is tested for AVIF encoding before it is offered, rather than silently handing back a PNG.",
      },
      {
        title: "Transparency and wide colour",
        description:
          "AVIF carries an alpha channel and supports high dynamic range, which JPEG cannot.",
      },
      {
        title: "Runs in your browser",
        description:
          "No upload and no account.",
      },
    ],
    limitations: [
      "Not every browser can create AVIF files, though most can display them. The tool checks and tells you.",
      "Encoding is noticeably slower than JPEG or WebP, especially on large images.",
      "Support outside browsers — desktop editors, older phones, some content systems — is still incomplete.",
      "Images are limited to 25 MB each.",
    ],
    keyTakeaways: [
      "AVIF produces the smallest files of any widely-supported image format.",
      "It handles low quality settings far better than JPEG, so more aggressive compression is usable.",
      "Encoding is slow and not every browser can create AVIF, though most display it.",
      "Serve AVIF with a WebP or JPEG fallback for maximum compatibility.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is AVIF?",
        answer:
          "An image format derived from the AV1 video codec. It compresses far more efficiently than JPEG or WebP and supports transparency, animation and high dynamic range.",
      },
      {
        id: "how-much-smaller",
        question: "How much smaller is AVIF?",
        answer:
          "Roughly 20–30% smaller than WebP and around half the size of JPEG at comparable visual quality. Photographs with smooth gradients benefit most.",
      },
      {
        id: "support",
        question: "Which browsers support AVIF?",
        answer:
          "Chrome, Firefox, Safari and Edge all display AVIF. Creating AVIF in the browser is less universal, which is why this tool tests your browser before offering it as an output.",
      },
      {
        id: "why-slow",
        question: "Why does AVIF take so long to encode?",
        answer:
          "It uses the AV1 codec's compression, which explores far more possibilities than JPEG to find a smaller result. That work is what buys the size reduction, and it can take seconds per image.",
      },
      {
        id: "vs-webp",
        question: "Should I use AVIF or WebP?",
        answer:
          "WebP is the safer default — nearly as small, much faster, and universally supported for both display and creation. Choose AVIF when file size is the priority and slower encoding is acceptable.",
      },
      {
        id: "fallback",
        question: "How do I use AVIF on a website safely?",
        answer:
          "Serve it through a <picture> element with WebP and JPEG sources listed after it. The browser picks the first format it understands, so nobody sees a broken image.",
      },
      {
        id: "quality",
        question: "How low can I push AVIF quality?",
        answer:
          "60–70% is usually enough for photographs, lower than you would accept in JPEG. AVIF's artefacts are far less objectionable, so the usable range extends further down.",
      },
      {
        id: "transparency",
        question: "Does AVIF support transparency?",
        answer:
          "Yes, with a full alpha channel, so it can replace transparent PNGs as well as photographic JPEGs.",
      },
      {
        id: "privacy",
        question: "Does AVIF encoding happen on a server?",
        answer:
          "No. AVIF encoding is done by your browser's own image pipeline. Nothing is uploaded, so the only limit is your machine's memory rather than an upload quota.",
      },
    ],
    relatedSlugs: ["webp-converter", "image-converter", "image-compressor", "image-resizer"],
  },

  "image-cropper": {
    slug: "image-cropper",
    name: "Image Cropper",
    title: "Image Cropper — Crop Images Online Free",
    description:
      "Crop images to any aspect ratio with a drag handle and live preview. Presets for square, 16:9 and social sizes. Runs in your browser.",
    h1: "Image Cropper",
    intro:
      "Cropping cuts away part of an image to change its framing or its shape. Drag the crop box over the area you want, or pick a preset ratio such as square or 16:9, and download the result. Unlike resizing, cropping removes content rather than scaling everything down.",
    iconName: "Crop",
    applicationCategory: "MultimediaApplication",
    features: [
      "Drag and resize crop box",
      "Aspect ratio presets",
      "Live preview",
      "Exact pixel readout",
    ],
    steps: [
      {
        name: "Add an image",
        text: "Drop in a JPG, PNG, WebP or AVIF file. It appears with a crop box over it.",
      },
      {
        name: "Choose a ratio",
        text: "Pick free-form, square, 16:9, 4:3 or a social preset. The box locks to that shape as you drag.",
      },
      {
        name: "Position the crop",
        text: "Drag the box to move it and pull the corners to resize. The pixel dimensions update as you go.",
      },
      {
        name: "Download",
        text: "Save the cropped image in your chosen format.",
      },
    ],
    examples: [
      {
        title: "Square profile picture",
        input: "4000 × 3000 photo, 1:1 preset",
        output: "3000 × 3000 square",
        explanation:
          "The square preset locks the box so both sides stay equal however you drag it, which is what most profile pictures require.",
      },
      {
        title: "Widescreen banner",
        input: "Portrait photo, 16:9 preset",
        output: "A wide strip from the middle",
        explanation:
          "Cropping a tall photo to a wide ratio discards most of the height. Position the box carefully over the part that matters.",
      },
      {
        title: "Trimming empty space",
        input: "Screenshot with margins, free-form crop",
        output: "Just the content",
        explanation:
          "Free-form mode lets you cut to any shape, which suits trimming whitespace off screenshots.",
      },
    ],
    benefits: [
      {
        title: "See the exact pixels",
        description:
          "The crop dimensions are shown live, so you can hit a specific size rather than eyeballing it.",
      },
      {
        title: "Ratio presets that lock",
        description:
          "Choosing a ratio constrains the box, so a square really is square rather than nearly square.",
      },
      {
        title: "No quality loss from cropping",
        description:
          "Cropping copies the pixels you kept at their original resolution. Only the re-encode costs anything.",
      },
      {
        title: "Correct orientation",
        description:
          "EXIF rotation is applied first, so a portrait phone photo crops the way you see it.",
      },
      {
        title: "Runs locally",
        description: "Your image is never uploaded.",
      },
    ],
    limitations: [
      "Cropping permanently removes the area outside the box. Keep your original if you may want it back.",
      "Rotation and straightening are not included — this crops only.",
      "Animated images are flattened to their first frame.",
      "Images are limited to 25 MB.",
    ],
    keyTakeaways: [
      "Cropping removes content; resizing scales everything down instead.",
      "Ratio presets lock the crop box so the result is exactly the shape you need.",
      "Cropped pixels keep their original resolution — only re-encoding costs quality.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "crop-vs-resize",
        question: "What is the difference between cropping and resizing?",
        answer:
          "Cropping cuts parts of the image away, changing what is in frame. Resizing scales the whole image to different dimensions and keeps everything visible. Use cropping to change composition or shape, resizing to change file size.",
      },
      {
        id: "quality",
        question: "Does cropping reduce quality?",
        answer:
          "The pixels you keep stay at their original resolution, so cropping itself loses nothing. If the output is a lossy format, the re-encode costs a small amount, exactly as with any other edit.",
      },
      {
        id: "aspect-ratios",
        question: "Which aspect ratio should I use?",
        answer:
          "1:1 for profile pictures and most feed posts, 16:9 for video thumbnails and banners, 4:5 for portrait social posts, and 4:3 for traditional photo prints. Free-form when none of those apply.",
      },
      {
        id: "small-crop",
        question: "Why does my cropped image look pixelated?",
        answer:
          "Cropping a small area leaves few pixels. A 200 × 200 crop displayed at 800 × 800 has to be stretched four times, which looks soft. Crop from the highest-resolution original you have.",
      },
      {
        id: "undo",
        question: "Can I get the cropped-away part back?",
        answer:
          "Not from the downloaded file — the data is gone. Your original is untouched, so re-upload it and crop again if you cut too much.",
      },
      {
        id: "rotate",
        question: "Can I rotate or straighten the image?",
        answer:
          "Not in this tool. It crops only. EXIF orientation is applied automatically so photos appear the right way up, but manual rotation is not offered.",
      },
      {
        id: "exact-size",
        question: "How do I crop to an exact pixel size?",
        answer:
          "The crop box reports its dimensions live as you drag. For an exact target, crop close then use the Image Resizer to hit the precise number.",
      },
      {
        id: "batch",
        question: "Can I crop several images at once?",
        answer:
          "No — cropping is a per-image decision about framing, so each one is handled individually. Resizing and compressing do support batches.",
      },
      {
        id: "privacy",
        question: "Is my image uploaded?",
        answer:
          "No. The crop is drawn to a canvas inside your browser and saved straight to your downloads folder. Nothing is transmitted, so passport photos and screenshots of private documents stay on your machine.",
      },
    ],
    relatedSlugs: ["image-resizer", "image-compressor", "image-converter", "image-watermark"],
  },

  "image-watermark": {
    slug: "image-watermark",
    name: "Image Watermark",
    title: "Add Watermark to Image — Free Online Tool",
    description:
      "Add a text watermark to your images with control over position, size, colour and opacity. Batch apply and download as a ZIP.",
    h1: "Image Watermark",
    intro:
      "A watermark is text or a mark placed over an image to identify its owner or mark it as a draft. This tool overlays text you choose, with control over position, size, colour, opacity and rotation, then writes it permanently into the downloaded file.",
    iconName: "Stamp",
    applicationCategory: "MultimediaApplication",
    features: [
      "Text watermark with live preview",
      "Nine position presets",
      "Opacity, size and rotation control",
      "Batch apply across images",
    ],
    steps: [
      {
        name: "Add your images",
        text: "Drop in one or many — the same watermark is applied to all of them.",
      },
      {
        name: "Type the watermark",
        text: "Your name, a website, or something like DRAFT or CONFIDENTIAL.",
      },
      {
        name: "Position and style it",
        text: "Choose a corner or the centre, then set size, colour, opacity and rotation. The preview updates live.",
      },
      {
        name: "Download",
        text: "Save individually or take the whole batch as a ZIP.",
      },
    ],
    examples: [
      {
        title: "Photographer's credit",
        input: "© Jane Doe, bottom right, 40% opacity",
        output: "A discreet credit that does not distract",
        explanation:
          "Low opacity in a corner marks ownership without spoiling the photograph.",
      },
      {
        title: "Draft marking",
        input: "DRAFT, centred, 25% opacity, rotated 30°",
        output: "A large diagonal overlay across the image",
        explanation:
          "A big rotated watermark across the middle is hard to crop out, which is the point when marking proofs.",
      },
      {
        title: "Batch branding",
        input: "20 product photos, same watermark",
        output: "20 watermarked images in one ZIP",
        explanation:
          "The same settings apply to every image, scaled relative to each one so it looks consistent across different sizes.",
      },
    ],
    benefits: [
      {
        title: "Scales with the image",
        description:
          "Watermark size is relative to the image, so it looks the same on a small thumbnail and a large photo in the same batch.",
      },
      {
        title: "Live preview",
        description:
          "Position, opacity and rotation update immediately, so you are not downloading repeatedly to check.",
      },
      {
        title: "Written into the pixels",
        description:
          "The watermark becomes part of the image rather than metadata, so it survives being copied or re-saved.",
      },
      {
        title: "Batch application",
        description:
          "Apply one watermark across a whole folder and download the results together.",
      },
      {
        title: "Private",
        description: "Images are watermarked in your browser and never uploaded.",
      },
    ],
    limitations: [
      "Text watermarks only — image and logo watermarks are not supported.",
      "A watermark deters casual copying but can be removed by someone determined, especially a small corner mark.",
      "The watermark is permanent in the download. Keep your originals.",
      "Images are limited to 25 MB each.",
    ],
    keyTakeaways: [
      "A watermark marks ownership or status by overlaying text into the image itself.",
      "Corner marks at low opacity are discreet; large rotated centre marks are harder to remove.",
      "Watermark size scales relative to each image, so batches stay consistent.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is a watermark?",
        answer:
          "Text or a mark placed over an image to identify its owner or its status. It is written into the pixels, so it stays visible wherever the image is copied.",
      },
      {
        id: "position",
        question: "Where should I put it?",
        answer:
          "A bottom corner at low opacity is standard for photo credits — visible but unobtrusive. For proofs or drafts, a large rotated mark across the centre is far harder to crop away.",
      },
      {
        id: "opacity",
        question: "What opacity works best?",
        answer:
          "30–50% for a discreet credit, which reads without competing with the picture. 15–25% for a large centre watermark, since it covers much more area and would otherwise dominate.",
      },
      {
        id: "removable",
        question: "Can a watermark be removed?",
        answer:
          "A determined person can crop out a corner mark or clone it away, and AI tools make that easier. Watermarks deter casual reuse rather than making theft impossible — a large centre mark is much harder to erase than a small corner one.",
      },
      {
        id: "logo",
        question: "Can I use my logo instead of text?",
        answer:
          "Not in this version — text only. For a logo watermark, place the image manually in an editor, or export your logo as text-like initials.",
      },
      {
        id: "batch",
        question: "Can I watermark many images at once?",
        answer:
          "Yes. Add as many as you like and the same settings apply to all of them, scaled relative to each image so the result looks consistent.",
      },
      {
        id: "quality",
        question: "Does watermarking reduce quality?",
        answer:
          "The re-encode costs a small amount if the output is lossy, the same as any edit. Save as PNG if you need the rest of the image untouched.",
      },
      {
        id: "undo",
        question: "Can I remove the watermark later?",
        answer:
          "Not from the downloaded file — it is part of the pixels. Your original is untouched, so keep it and re-watermark if you want different settings.",
      },
      {
        id: "privacy",
        question: "Are my images uploaded?",
        answer:
          "No. Each image is drawn to a canvas in your browser with the text painted over it. Unwatermarked originals are exactly what you want to keep private, and they never leave your computer.",
      },
    ],
    relatedSlugs: ["image-cropper", "image-resizer", "image-compressor", "metadata-remover"],
  },

  "metadata-remover": {
    slug: "metadata-remover",
    name: "Image Metadata Remover",
    title: "Remove Image Metadata — Strip EXIF Free",
    description:
      "Strip EXIF and location data from photos before sharing them. See exactly what your image reveals, then remove it in your browser.",
    h1: "Image Metadata Remover",
    intro:
      "Photos carry hidden metadata called EXIF: the camera and phone model, the exact date and time, camera settings, and often the GPS coordinates where the photo was taken. This tool shows you what is there and produces a clean copy with it removed, without changing how the picture looks.",
    iconName: "ShieldOff",
    applicationCategory: "SecurityApplication",
    features: [
      "Reads and displays existing EXIF",
      "Highlights GPS location data",
      "Strips all metadata",
      "Orientation preserved",
    ],
    steps: [
      {
        name: "Add a photo",
        text: "Drop in a JPG or other photo. Its metadata is read and listed immediately.",
      },
      {
        name: "Review what it reveals",
        text: "Camera, date, settings and any GPS coordinates are shown. Location data is flagged in red.",
      },
      {
        name: "Strip it",
        text: "The image is re-encoded from its pixels alone, which leaves no metadata behind.",
      },
      {
        name: "Download the clean copy",
        text: "The picture looks identical; the hidden data is gone.",
      },
    ],
    examples: [
      {
        title: "Photo with GPS",
        input: "Phone photo with location enabled",
        output: "Coordinates shown, then removed",
        explanation:
          "GPS coordinates in a photo pinpoint where it was taken to within a few metres — often someone's home.",
      },
      {
        title: "Camera details",
        input: "DSLR photo",
        output: "Camera model, lens, shutter, ISO listed then stripped",
        explanation:
          "Harmless for most people, but it identifies your equipment and can link photos across accounts.",
      },
      {
        title: "Portrait photo",
        input: "Phone photo with EXIF orientation 6",
        output: "Clean copy still the right way up",
        explanation:
          "Orientation lives in EXIF, so it is applied to the pixels before stripping. Naive tools leave the photo sideways.",
      },
    ],
    benefits: [
      {
        title: "Shows you what is there first",
        description:
          "You see the camera, date and GPS coordinates before removing anything, rather than trusting a tool blindly.",
      },
      {
        title: "Location data flagged",
        description:
          "GPS coordinates are highlighted as the field that matters most for privacy, with a link to where the photo was taken.",
      },
      {
        title: "Photos stay the right way up",
        description:
          "Orientation is baked into the pixels before the metadata goes, so stripped photos are not left sideways — the classic bug in this kind of tool.",
      },
      {
        title: "The picture is unchanged",
        description:
          "Only the hidden data is removed. Dimensions and appearance stay the same.",
      },
      {
        title: "Nothing is uploaded",
        description:
          "Uploading a photo to strip its location data would defeat the purpose. This runs entirely in your browser.",
      },
    ],
    limitations: [
      "Re-encoding is required to strip metadata, so a lossy format loses a small amount of quality. Save as PNG to avoid it.",
      "Metadata added later by a social platform or messaging app is outside this tool's control.",
      "Only visible-image metadata is removed; a file's creation date on your disk is separate.",
      "Images are limited to 25 MB each.",
    ],
    keyTakeaways: [
      "EXIF metadata can include GPS coordinates identifying exactly where a photo was taken.",
      "Stripping metadata re-encodes the image but does not change how it looks.",
      "Orientation lives in EXIF, so it must be applied to the pixels before stripping.",
      "This runs in your browser — uploading a photo to remove its location data would defeat the point.",
    ],
    faqs: [
      {
        id: "what-is-exif",
        question: "What is EXIF data?",
        answer:
          "Information cameras and phones embed in a photo file: model, date and time, exposure settings, and often GPS coordinates. It is invisible when viewing the picture but readable by anyone with the file.",
      },
      {
        id: "why-remove",
        question: "Why should I remove it?",
        answer:
          "Mostly location. A photo taken at home carries coordinates accurate to a few metres, and sharing it publicly shares your address. Timestamps and camera models can also link separate accounts to the same person.",
      },
      {
        id: "social-media",
        question: "Do social networks strip it for me?",
        answer:
          "Most major platforms strip EXIF on upload, but not all, and not always for every size they generate. Direct file sharing — email, messaging apps sending as a document, cloud links — usually preserves it entirely.",
      },
      {
        id: "quality",
        question: "Does removing metadata change the image?",
        answer:
          "Not visually. Stripping requires re-encoding from the pixels, which costs a small amount of quality in a lossy format. Choose PNG output if you want no loss at all.",
      },
      {
        id: "orientation",
        question: "Will my photo end up sideways?",
        answer:
          "No. Orientation is stored in EXIF, so removing it naively leaves portrait photos rotated. This tool applies the rotation to the pixels first, then strips the data.",
      },
      {
        id: "what-removed",
        question: "What exactly gets removed?",
        answer:
          "Everything outside the pixels — EXIF, GPS, IPTC and XMP blocks, including camera model, timestamps, settings, copyright fields and any editing history.",
      },
      {
        id: "keep-some",
        question: "Can I keep the copyright but remove the location?",
        answer:
          "Not selectively — re-encoding removes all of it at once. To assert ownership, use the Image Watermark tool, which is visible and survives copying.",
      },
      {
        id: "check",
        question: "How do I verify it worked?",
        answer:
          "Re-upload the cleaned file to this tool. It should report no metadata found. You can also check file properties in your operating system.",
      },
      {
        id: "privacy",
        question: "Is my photo uploaded?",
        answer:
          "No, and that matters here more than anywhere. Sending a photo to a server to strip its location data would expose exactly what you are trying to remove.",
      },
    ],
    relatedSlugs: ["image-compressor", "image-converter", "image-watermark", "image-resizer"],
  },

  "ico-generator": {
    slug: "ico-generator",
    name: "ICO Generator",
    title: "ICO Generator — Create Favicon Files Free",
    description:
      "Turn any image into a multi-size .ico favicon. Generates 16, 32, 48 and 64 pixel versions in one file, in your browser.",
    h1: "ICO Generator",
    intro:
      "An ICO file is the format browsers expect for a favicon, and it can hold several sizes in one file so the browser picks the right one. Upload a square image and this generator produces a multi-size .ico containing 16, 32, 48 and 64 pixel versions, ready to drop at your site root.",
    iconName: "AppWindow",
    applicationCategory: "DeveloperApplication",
    features: [
      "Multi-size ICO output",
      "16, 32, 48 and 64 pixel variants",
      "Transparency preserved",
      "Live size preview",
    ],
    steps: [
      {
        name: "Upload a square image",
        text: "A PNG with transparency works best. Non-square images are padded rather than stretched.",
      },
      {
        name: "Check the sizes",
        text: "Previews show how it looks at each size — a detailed logo often becomes unreadable at 16 pixels.",
      },
      {
        name: "Generate",
        text: "All sizes are packed into a single .ico file.",
      },
      {
        name: "Add it to your site",
        text: "Place favicon.ico at your site root. Browsers find it automatically.",
      },
    ],
    examples: [
      {
        title: "Simple logo mark",
        input: "512 × 512 PNG of a single letter",
        output: "Multi-size .ico, clear at every size",
        explanation:
          "Simple, high-contrast shapes survive being scaled to 16 pixels. That is the whole trick to a good favicon.",
      },
      {
        title: "Detailed logo",
        input: "Full wordmark with fine text",
        output: "Unreadable smudge at 16 pixels",
        explanation:
          "The preview shows this before you publish. Use a simplified mark for the favicon and keep the wordmark elsewhere.",
      },
      {
        title: "Transparent background",
        input: "PNG with alpha",
        output: "ICO keeps the transparency",
        explanation:
          "ICO supports transparency, so the favicon sits cleanly on light and dark browser chrome alike.",
      },
    ],
    benefits: [
      {
        title: "One file, every size",
        description:
          "Browsers and operating systems request different sizes. A multi-size ICO satisfies all of them without extra files.",
      },
      {
        title: "See it at 16 pixels first",
        description:
          "The preview shows the smallest size honestly, which is where most logos fall apart.",
      },
      {
        title: "Transparency kept",
        description:
          "The alpha channel survives, so the icon works against any browser theme.",
      },
      {
        title: "Non-square handled properly",
        description:
          "A rectangular image is padded to square rather than squashed, which is what most generators do to it.",
      },
      {
        title: "Runs locally",
        description: "Your logo is never uploaded.",
      },
    ],
    limitations: [
      "Favicons are tiny. Detailed logos and text will not be legible at 16 or 32 pixels regardless of the source quality.",
      "Modern sites often also want PNG icons and an apple-touch-icon; ICO alone covers browsers but not every platform.",
      "Very large source images are downscaled before packing, which is normal for this format.",
      "Images are limited to 25 MB.",
    ],
    keyTakeaways: [
      "An ICO file holds several icon sizes in one file, which is why browsers prefer it for favicons.",
      "Place favicon.ico at your site root and browsers find it without any HTML.",
      "Simple high-contrast marks work; detailed logos and text do not survive 16 pixels.",
      "ICO supports transparency, so the icon suits light and dark browser chrome.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What is an ICO file?",
        answer:
          "A Windows icon format that can store several images at different sizes in a single file. Browsers use it for favicons because one file then serves every context that needs a different size.",
      },
      {
        id: "sizes",
        question: "Which sizes do I need?",
        answer:
          "16 and 32 pixels cover browser tabs and bookmarks, 48 covers Windows shortcuts, and 64 covers higher-density displays. This generator includes all four.",
      },
      {
        id: "where",
        question: "Where does the file go?",
        answer:
          "At the root of your site, as favicon.ico. Browsers request that path automatically, so no HTML is strictly required — though a <link rel=\"icon\"> tag makes it explicit.",
      },
      {
        id: "design",
        question: "What makes a good favicon?",
        answer:
          "One simple shape, strong contrast and no fine detail. At 16 pixels you have roughly 256 pixels in total, so a single letter or symbol reads and a full wordmark does not.",
      },
      {
        id: "png-instead",
        question: "Can I just use a PNG?",
        answer:
          "Modern browsers accept PNG favicons, and many sites use both. ICO remains the most broadly compatible single file, particularly for older browsers and Windows shortcuts.",
      },
      {
        id: "not-showing",
        question: "Why is my new favicon not appearing?",
        answer:
          "Browsers cache favicons aggressively, sometimes for weeks. Hard-refresh, try a private window, or append a query string to the link tag to force a re-fetch.",
      },
      {
        id: "transparency",
        question: "Does ICO support transparency?",
        answer:
          "Yes. Keeping the background transparent is recommended so the icon looks right against both light and dark browser themes.",
      },
      {
        id: "non-square",
        question: "What if my image is not square?",
        answer:
          "It is padded to a square rather than stretched, so proportions are preserved. For best results, supply a square image with the mark already centred.",
      },
      {
        id: "privacy",
        question: "Does making a favicon involve a server?",
        answer:
          "No. Your logo is drawn to a canvas at each size and the .ico file is assembled byte by byte in your browser. Nothing is transmitted, so an unreleased brand mark stays private.",
      },
    ],
    relatedSlugs: ["image-converter", "image-resizer", "svg-to-png", "image-cropper"],
  },

  "svg-optimizer": {
    slug: "svg-optimizer",
    name: "SVG Optimizer",
    title: "SVG Optimizer — Minify SVG Files Free",
    description:
      "Clean and minify SVG files. Removes editor cruft, comments and hidden metadata while keeping the graphic identical.",
    h1: "SVG Optimizer",
    intro:
      "SVG files exported from design tools carry a great deal of invisible overhead: editor metadata, comments, unused definitions and needlessly precise numbers. Optimising strips all of it while leaving the graphic pixel-identical, commonly cutting file size by half or more.",
    iconName: "FileCode2",
    applicationCategory: "DeveloperApplication",
    features: [
      "Removes editor metadata and comments",
      "Side-by-side visual comparison",
      "Before and after size",
      "Copy or download the result",
    ],
    steps: [
      {
        name: "Add your SVG",
        text: "Upload a file or paste the markup directly.",
      },
      {
        name: "Optimise",
        text: "Metadata, comments, unused definitions and excess decimal places are removed.",
      },
      {
        name: "Compare",
        text: "The original and optimised versions render side by side so you can confirm nothing changed visually.",
      },
      {
        name: "Copy or download",
        text: "Take the cleaned markup or save it as a file.",
      },
    ],
    examples: [
      {
        title: "Illustrator export",
        input: "24 KB SVG straight from the editor",
        output: "Around 6–10 KB",
        explanation:
          "Design tools embed generator comments, layer names and document metadata that browsers ignore entirely.",
      },
      {
        title: "Excessive precision",
        input: 'd="M 12.000000001 8.999999998 …"',
        output: 'd="M12 9…"',
        explanation:
          "Coordinates carrying ten decimal places are meaningless on screen and can be a large share of the file.",
      },
      {
        title: "Icon set",
        input: "40 icons exported from a design tool",
        output: "Each roughly 60% smaller",
        explanation:
          "Icons are small, so the fixed metadata overhead is proportionally huge. Optimising matters most here.",
      },
    ],
    benefits: [
      {
        title: "Visual comparison",
        description:
          "Both versions render side by side, so you can confirm the optimisation changed nothing you can see.",
      },
      {
        title: "Removes hidden metadata",
        description:
          "Editor exports can carry document titles, layer names and file paths. Optimising strips information you may not want published.",
      },
      {
        title: "Substantial savings",
        description:
          "Half the file size is typical for editor exports, and more for small icons where metadata dominates.",
      },
      {
        title: "Paste or upload",
        description:
          "Works from a file or from markup pasted straight out of your editor.",
      },
      {
        title: "Runs locally",
        description: "Your graphics are never uploaded.",
      },
    ],
    limitations: [
      "Optimisation is aimed at safety, so it will not always match the smallest possible output from an aggressive command-line configuration.",
      "SVGs relying on external stylesheets or scripts may behave differently once cleaned — always check the comparison.",
      "IDs referenced by your own CSS or JavaScript are preserved, which limits how much can be removed.",
      "Very large SVGs may take a moment to process.",
    ],
    keyTakeaways: [
      "Editor-exported SVGs are typically half metadata that browsers ignore.",
      "Optimising removes it without changing the rendered graphic.",
      "Small icons benefit most, since fixed overhead is a larger share of the file.",
      "Always check the side-by-side comparison before publishing.",
    ],
    faqs: [
      {
        id: "what-is",
        question: "What does optimising an SVG do?",
        answer:
          "It removes everything the browser does not need to draw the graphic: editor metadata, comments, empty groups, unused definitions and excessive decimal precision. The rendered result is unchanged.",
      },
      {
        id: "how-much",
        question: "How much smaller will my file be?",
        answer:
          "Half is typical for a design-tool export, and small icons often shrink by 60–70% because fixed metadata is a larger share of a small file. Hand-written SVG that is already lean may barely change.",
      },
      {
        id: "safe",
        question: "Will it break my graphic?",
        answer:
          "The defaults are conservative and preserve IDs and structure that scripts or CSS might reference. The side-by-side comparison exists so you can confirm before publishing.",
      },
      {
        id: "why-large",
        question: "Why are exported SVGs so large?",
        answer:
          "Design tools record their own document structure — layer names, generator comments, colour profiles, sometimes file paths — none of which a browser reads. Coordinates are also written with far more precision than a screen can show.",
      },
      {
        id: "privacy-metadata",
        question: "Does it remove hidden information?",
        answer:
          "Yes. Exports can embed document titles, layer names and occasionally local file paths. Optimising strips them, which is worth doing before publishing a file publicly.",
      },
      {
        id: "vs-gzip",
        question: "Is optimising still worth it if my server gzips?",
        answer:
          "Yes. Compression shrinks the transfer, but the browser still parses the full markup. Optimising reduces both, and the two combine well.",
      },
      {
        id: "inline",
        question: "Should I inline SVG or link it?",
        answer:
          "Inline for icons you style with CSS or animate, since it avoids a request and allows styling. Link larger illustrations so they can be cached separately.",
      },
      {
        id: "animation",
        question: "Are animations preserved?",
        answer:
          "SMIL animations and CSS inside the SVG are kept. As with any optimisation, check the comparison — animations that depend on specific IDs are worth verifying.",
      },
      {
        id: "privacy",
        question: "Is my file uploaded?",
        answer:
          "No. SVGO's browser build runs as JavaScript inside this page, so your graphics are never uploaded. An icon set you have not shipped yet stays entirely on your machine.",
      },
    ],
    relatedSlugs: ["svg-to-png", "image-converter", "ico-generator", "image-compressor"],
  },

  "svg-to-png": {
    slug: "svg-to-png",
    name: "SVG to PNG",
    title: "SVG to PNG Converter — Free & High Quality",
    description:
      "Convert SVG files to PNG at any resolution. Set an exact size or scale factor, keep or flatten transparency, all in your browser.",
    h1: "SVG to PNG",
    intro:
      "SVG is a vector format that scales to any size without losing sharpness, but many places — email, older software, social platforms — accept only bitmaps. Converting to PNG rasterises the vector at a resolution you choose. Because SVG has no fixed pixel size, you decide how large the output should be.",
    iconName: "ImagePlus",
    applicationCategory: "MultimediaApplication",
    features: [
      "Any output resolution",
      "Scale factor or exact pixels",
      "Transparency preserved",
      "Live preview",
    ],
    steps: [
      {
        name: "Add your SVG",
        text: "Upload a file or paste the markup. Its intrinsic size is read from the width, height or viewBox.",
      },
      {
        name: "Choose a resolution",
        text: "Set an exact pixel width or a scale multiplier. Because SVG is vector, any size renders perfectly sharp.",
      },
      {
        name: "Decide on the background",
        text: "Keep transparency, or flatten onto a colour where transparency is not wanted.",
      },
      {
        name: "Download",
        text: "Save the PNG at your chosen size.",
      },
    ],
    examples: [
      {
        title: "Logo for a presentation",
        input: "SVG logo at 3× scale",
        output: "Sharp PNG at three times the intrinsic size",
        explanation:
          "Rendering above the intended display size keeps it crisp on high-density screens.",
      },
      {
        title: "Exact dimensions",
        input: "Icon SVG, width set to 512",
        output: "512 pixel PNG, height scaled proportionally",
        explanation:
          "Setting one dimension keeps the aspect ratio, which matters when a platform requires a specific size.",
      },
      {
        title: "Flattened background",
        input: "Transparent SVG, white background",
        output: "PNG with a solid white background",
        explanation:
          "Useful where transparency renders as black or as a checkerboard in the destination software.",
      },
    ],
    benefits: [
      {
        title: "Any resolution, always sharp",
        description:
          "Vectors have no fixed resolution, so the PNG is rendered fresh at whatever size you pick rather than scaled from a bitmap.",
      },
      {
        title: "Transparency your choice",
        description:
          "Keep the alpha channel or flatten onto a colour, depending on where the PNG is going.",
      },
      {
        title: "Reads the real intrinsic size",
        description:
          "Width, height and viewBox are all handled, so an SVG without explicit dimensions still converts at the right proportions.",
      },
      {
        title: "Paste or upload",
        description: "Works from a file or from markup pasted directly.",
      },
      {
        title: "Runs locally",
        description: "Your graphics are never uploaded.",
      },
    ],
    limitations: [
      "PNG is a bitmap, so the result no longer scales freely. Render at the largest size you will need.",
      "SVGs referencing external fonts or images may not render those parts, since the browser cannot always fetch them during conversion.",
      "Scripted or interactive SVG becomes a static picture.",
      "Very large output sizes can exhaust browser memory.",
    ],
    keyTakeaways: [
      "SVG is vector and resolution-independent; PNG is a bitmap fixed at the size you render.",
      "Choose the output size deliberately — render at 2× or 3× for high-density screens.",
      "Transparency can be kept or flattened onto a colour.",
      "Conversion runs in your browser.",
    ],
    faqs: [
      {
        id: "why-convert",
        question: "Why convert SVG to PNG at all?",
        answer:
          "Because many destinations do not accept SVG: email clients, most social platforms, older office software and some content systems. PNG is universally supported.",
      },
      {
        id: "what-size",
        question: "What size should I export?",
        answer:
          "At least twice the size it will display at, so it stays sharp on high-density screens. For a 200-pixel logo, export 400 or 600 pixels wide.",
      },
      {
        id: "no-dimensions",
        question: "My SVG has no width or height — what happens?",
        answer:
          "The viewBox is used instead, which defines the coordinate system and therefore the proportions. If neither is present, a sensible square default is used.",
      },
      {
        id: "quality",
        question: "Will the PNG look as good as the SVG?",
        answer:
          "At the size you render it, yes — identical. The difference is that the PNG cannot be scaled up afterwards without softening, while the SVG could be re-rendered at any size.",
      },
      {
        id: "transparency",
        question: "Is transparency preserved?",
        answer:
          "Yes, PNG supports an alpha channel. You can also flatten onto a solid colour if the destination handles transparency badly.",
      },
      {
        id: "fonts",
        question: "Why is my text missing or wrong?",
        answer:
          "The SVG references a font the browser cannot load during conversion. Convert text to outlines in your design tool before exporting, which is good practice for SVG generally.",
      },
      {
        id: "back",
        question: "Can I convert PNG back to SVG?",
        answer:
          "Not meaningfully. Going from vector to bitmap discards the shape information. Tracing tools approximate it, but the result is not your original vector.",
      },
      {
        id: "jpg",
        question: "Should I export PNG or JPEG?",
        answer:
          "PNG for logos, icons and anything with flat colour or transparency — which is most SVG content. JPEG would blur the sharp edges and cannot hold transparency.",
      },
      {
        id: "privacy",
        question: "Does the PNG render on my machine?",
        answer:
          "Yes. The SVG is drawn to a canvas by your own browser and read straight back as a PNG. No server sees the file, which matters when the graphic is an unpublished logo.",
      },
    ],
    relatedSlugs: ["svg-optimizer", "image-converter", "ico-generator", "image-resizer"],
  },

  "color-picker": {
    slug: "color-picker",
    name: "Color Picker",
    title: "Image Color Picker — Extract Colors & Palette",
    description:
      "Pick colours from any image and extract its dominant palette. Get HEX, RGB and HSL values with one-click copying.",
    h1: "Image Color Picker",
    intro:
      "An image colour picker reads the exact colour of any pixel you click and extracts the palette that dominates the picture. Upload an image, click anywhere to sample a colour, and copy it as HEX, RGB or HSL — useful for matching a design to a photograph or pulling a palette from a reference.",
    iconName: "Pipette",
    applicationCategory: "DesignApplication",
    features: [
      "Click to sample any pixel",
      "Automatic dominant palette",
      "HEX, RGB and HSL output",
      "Magnified pixel preview",
    ],
    steps: [
      {
        name: "Add an image",
        text: "Drop in any photo or graphic. It appears on a canvas ready to sample.",
      },
      {
        name: "Click to pick a colour",
        text: "A magnifier shows the exact pixel under the cursor so you can hit the colour you meant.",
      },
      {
        name: "Read the values",
        text: "Each sample is shown as HEX, RGB and HSL, with a swatch and one-click copying.",
      },
      {
        name: "Use the palette",
        text: "The dominant colours in the image are extracted automatically alongside your own samples.",
      },
    ],
    examples: [
      {
        title: "Matching a brand colour",
        input: "Click the logo in a screenshot",
        output: "#1D4ED8 · rgb(29, 78, 216)",
        explanation:
          "Sampling directly from an image is the reliable way to match a colour you have no specification for.",
      },
      {
        title: "Palette from a photograph",
        input: "Landscape photo",
        output: "Six dominant colours with proportions",
        explanation:
          "The palette is built by clustering the image's colours, so it reflects what actually dominates rather than what stands out.",
      },
      {
        title: "Same colour, three notations",
        input: "One sampled pixel",
        output: "#E11D48 · rgb(225, 29, 72) · hsl(347, 77%, 50%)",
        explanation:
          "HEX suits CSS, RGB suits most design tools, and HSL makes it easy to derive lighter or darker variants.",
      },
    ],
    benefits: [
      {
        title: "Magnified sampling",
        description:
          "A zoomed view of the pixels under the cursor means you pick the colour you intended, not its neighbour.",
      },
      {
        title: "Palette extracted automatically",
        description:
          "Dominant colours are clustered from the whole image, giving a usable palette rather than a handful of random samples.",
      },
      {
        title: "Three notations at once",
        description:
          "HEX, RGB and HSL for every colour, so it drops straight into CSS or a design tool.",
      },
      {
        title: "Sample history",
        description:
          "Colours you pick are kept in a list, so you can build a palette by hand and copy any of them later.",
      },
      {
        title: "Private",
        description: "The image is read in your browser and never uploaded.",
      },
    ],
    limitations: [
      "Colours are read as displayed. An image with an embedded colour profile may sample slightly differently from how a colour-managed application shows it.",
      "JPEG compression shifts colours slightly, especially at edges, so a sampled value may differ a little from the original design.",
      "The palette is an approximation based on clustering; it is a starting point rather than a definitive answer.",
      "Images are limited to 25 MB.",
    ],
    keyTakeaways: [
      "Sampling reads the exact pixel colour and reports it as HEX, RGB and HSL.",
      "The palette is clustered from the whole image, so it reflects genuine dominance.",
      "JPEG compression can shift colours slightly from the original design.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "how-works",
        question: "How does picking a colour from an image work?",
        answer:
          "The image is drawn to a canvas and the pixel under your cursor is read directly, giving its exact red, green and blue values. Those are then expressed as HEX, RGB and HSL.",
      },
      {
        id: "hex-rgb-hsl",
        question: "What is the difference between HEX, RGB and HSL?",
        answer:
          "All three describe the same colour. HEX is compact and standard in CSS. RGB states the red, green and blue components directly. HSL uses hue, saturation and lightness, which makes creating lighter or darker variants far easier.",
      },
      {
        id: "palette",
        question: "How is the palette chosen?",
        answer:
          "By grouping the image's pixels into clusters of similar colour and taking the centre of each cluster. That surfaces what genuinely dominates rather than the brightest or most unusual colours.",
      },
      {
        id: "accuracy",
        question: "Why does the colour look slightly different from the original?",
        answer:
          "JPEG compression alters colours slightly, most visibly near sharp edges. Embedded colour profiles can also shift how a colour is displayed. Sample from a PNG where exactness matters.",
      },
      {
        id: "screen",
        question: "Can I pick a colour from anywhere on my screen?",
        answer:
          "Not from a web page — browsers cannot read pixels outside their own content for security reasons. Take a screenshot and sample that instead. Your operating system may also include a system-wide picker.",
      },
      {
        id: "accessibility",
        question: "How do I check a colour is accessible?",
        answer:
          "Contrast is what matters: WCAG asks for at least 4.5:1 between body text and its background. Sample both colours here, then check the pair in a contrast checker.",
      },
      {
        id: "how-many",
        question: "How many colours should a palette have?",
        answer:
          "Most designs use one dominant colour, one accent and a few neutrals. Six extracted colours give plenty to choose from — using all of them usually looks incoherent.",
      },
      {
        id: "transparent",
        question: "What happens with transparent pixels?",
        answer:
          "They are sampled against the canvas background, so a fully transparent area reads as that background rather than as a colour of its own.",
      },
      {
        id: "privacy",
        question: "Is my photo sent anywhere to read its colours?",
        answer:
          "No. The image is drawn to a canvas and the pixel values are read directly in your browser. Client work and unreleased designs never leave your machine.",
      },
    ],
    relatedSlugs: ["image-converter", "image-compressor", "svg-optimizer", "image-cropper"],
  },
};

export function getImageTool(slug: string): SeoToolConfig {
  const tool = IMAGE_TOOLS[slug];
  if (!tool) {
    throw new Error(
      `Unknown image tool "${slug}". Add it to IMAGE_TOOLS in src/lib/image/tools.config.ts.`,
    );
  }
  return tool;
}

export function getRelatedImageTools(slug: string): SeoToolConfig[] {
  return getImageTool(slug)
    .relatedSlugs.map((related) => IMAGE_TOOLS[related])
    .filter((tool): tool is SeoToolConfig => Boolean(tool));
}
