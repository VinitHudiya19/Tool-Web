import type { SeoToolConfig } from "@/lib/seo-tools/types";

/** Encoding, hashing and identifier tools. */
export const ENCODING_TOOLS: Record<string, SeoToolConfig> = {
  "base64-encoder": {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    title: "Base64 Encoder & Decoder — Unicode Safe",
    description:
      "Encode and decode Base64 in your browser. Handles emoji and accented text correctly, with URL-safe output and clear errors.",
    h1: "Base64 Encoder and Decoder",
    intro:
      "Base64 represents binary data using 64 printable characters, so it can travel through systems that only accept text — email bodies, JSON fields, data URLs. The usual browser implementation breaks on anything outside Latin-1, which is why an emoji so often comes back as mangled bytes. This encoder goes through UTF-8 properly, so any text round-trips exactly.",
    iconName: "Binary",
    applicationCategory: "DeveloperApplication",
    features: [
      "Correct UTF-8 handling for emoji and accented text",
      "URL-safe variant per RFC 4648",
      "Optional MIME line wrapping at 76 characters",
      "Clear errors that name the offending character",
      "Detects when decoded data is not text",
    ],
    steps: [
      {
        name: "Choose encode or decode",
        text: "Encoding turns text into Base64; decoding turns Base64 back into text. The tool tells you immediately if the input is not valid Base64.",
      },
      {
        name: "Paste your text or data",
        text: "Type, paste from the clipboard, or drop in a file. Conversion happens as you type, with no button to press.",
      },
      {
        name: "Pick a variant if you need one",
        text: "Turn on URL-safe output to replace the plus and slash characters and drop the padding, so the result survives a query string untouched.",
      },
      {
        name: "Copy or download",
        text: "Copy the result to the clipboard or save it as a file. Both panes show byte counts, since Base64 always grows the data by roughly a third.",
      },
    ],
    examples: [
      {
        title: "Text with an emoji",
        input: "👍",
        output: "8J+RjQ==",
        explanation:
          "Encoders built on btoa alone throw an error here, and the common escape/unescape workaround mangles lone surrogates. Going through UTF-8 bytes gives the correct four-byte encoding.",
      },
      {
        title: "A value for a query string",
        input: "a?b/c+d",
        output: "YT9iL2MrZA (URL-safe)",
        explanation:
          "Standard Base64 uses plus and slash, both of which mean something else in a URL. The URL-safe variant swaps them for minus and underscore and drops the padding.",
      },
      {
        title: "Something that is not text",
        input: "iVBORw0KGgo=",
        output: "Decoded, but not valid UTF-8 text",
        explanation:
          "That is the start of a PNG file. Rather than showing replacement characters that look like a successful decode, the tool says plainly that the data is binary.",
      },
    ],
    benefits: [
      {
        title: "Round-trips any text",
        description:
          "Emoji, accents, Chinese, Arabic and combining marks all encode and decode back to exactly what you started with.",
      },
      {
        title: "Errors that say what is wrong",
        description:
          "Invalid input names the character that caused it and whether the length is even possible for Base64, instead of failing with a bare exception.",
      },
      {
        title: "Handles pasted whitespace",
        description:
          "Base64 copied from an email header or a certificate arrives with line breaks. They are stripped automatically rather than rejected.",
      },
      {
        title: "Nothing is transmitted",
        description:
          "Encoding runs in the page, so a token or a credential pasted here never reaches a server.",
      },
    ],
    limitations: [
      "Base64 is encoding, not encryption. Anyone can decode it, so it protects nothing on its own.",
      "The output is about 33% larger than the input, which matters when the result goes into a size-limited field.",
      "Decoded binary data is reported rather than rendered — this tool does not preview images or files.",
      "Very large inputs are held in memory, so a file beyond a few megabytes may be slow in the browser.",
    ],
    keyTakeaways: [
      "Base64 encodes binary as text; it does not encrypt or protect anything.",
      "Emoji and accented characters round-trip correctly here and break in many other tools.",
      "The URL-safe variant replaces plus and slash so the result is safe in a query string.",
      "Expect the output to be roughly a third larger than the input.",
      "Everything runs in your browser, so pasted secrets are not transmitted.",
    ],
    faqs: [
      {
        id: "unicode",
        question: "Why do other Base64 tools break on emoji?",
        answer:
          "They call btoa directly, which only accepts code points below 256 and throws on anything else. The common workaround using escape and unescape relies on two functions deprecated years ago and mangles lone surrogates. Encoding UTF-8 bytes first avoids both problems.",
      },
      {
        id: "encryption",
        question: "Is Base64 a form of encryption?",
        answer:
          "No, and treating it as one is a genuine security mistake. Base64 is a reversible encoding with no key — anyone who sees the string can decode it in one step. Use it to make binary data safe to transport, never to hide anything.",
      },
      {
        id: "url-safe",
        question: "What is URL-safe Base64?",
        answer:
          "The variant defined in RFC 4648 §5. Standard Base64 uses plus and slash, which are reserved in URLs, so the URL-safe form uses minus and underscore instead and usually drops the trailing equals padding. JSON Web Tokens use it.",
      },
      {
        id: "padding",
        question: "What are the equals signs at the end for?",
        answer:
          "Padding. Base64 works in groups of three input bytes, and equals signs mark where the final group was short. Decoders can usually reconstruct it, which is why the URL-safe variant omits it, and this tool restores it automatically.",
      },
      {
        id: "size",
        question: "Why did my data get bigger?",
        answer:
          "Base64 represents every three bytes as four characters, so the output is about 33% larger, before any line breaks. That is the cost of making binary data safe to put in a text field.",
      },
      {
        id: "line-breaks",
        question: "Why does Base64 from an email have line breaks in it?",
        answer:
          "MIME wraps encoded content at 76 characters. Those breaks are not part of the data, so they are stripped before decoding here — pasting a certificate or an email attachment works without cleaning it up first.",
      },
      {
        id: "binary",
        question: "Can I decode Base64 that is not text?",
        answer:
          "The decoding will succeed, but the result is bytes rather than characters. Rather than showing question marks that look like text, the tool reports that the data is not valid UTF-8, which usually means it is an image or another binary file.",
      },
      {
        id: "data-url",
        question: "Is this the same as a data URL?",
        answer:
          "A data URL wraps Base64 in a prefix that names the media type, like data:image/png;base64, followed by the encoded bytes. The encoding is identical; the prefix is what tells a browser how to interpret it.",
      },
      {
        id: "privacy",
        question: "Is anything I paste here sent to a server?",
        answer:
          "No. The conversion is a few lines of JavaScript running in this page. That matters here more than most places, since Base64 tools are often used on tokens and credentials.",
      },
    ],
    relatedSlugs: ["url-encoder", "hash-generator", "json-viewer", "uuid-generator"],
  },

  "url-encoder": {
    slug: "url-encoder",
    name: "URL Encoder",
    title: "URL Encoder & Decoder — Percent Encoding",
    description:
      "Percent-encode and decode URLs and query values. Explains when to escape a whole URL and when to escape a single parameter.",
    h1: "URL Encoder and Decoder",
    intro:
      "URL encoding replaces characters that have a special meaning in a web address with a percent sign and their byte value, so a value containing a slash or an ampersand does not break the URL around it. The part most tools leave out is that there are two different jobs here — escaping a whole URL and escaping one value inside it — and using the wrong one is the usual cause of a link that silently loses half its parameters.",
    iconName: "Link2",
    applicationCategory: "DeveloperApplication",
    features: [
      "Component, full-URL and form encoding modes",
      "Side-by-side breakdown of a URL's parts",
      "Correct handling of non-ASCII and emoji",
      "Clear errors for malformed percent sequences",
      "Decodes form data where spaces became plus signs",
    ],
    steps: [
      {
        name: "Decide what you are encoding",
        text: "Choose component for a single value, full URL to escape an address while keeping its structure, or form for data sent as application/x-www-form-urlencoded.",
      },
      {
        name: "Paste the text",
        text: "Enter the value or URL. The result appears as you type, and switching modes updates it immediately so you can compare.",
      },
      {
        name: "Check the breakdown",
        text: "When the input parses as a URL, its scheme, host, path, query parameters and fragment are listed separately so you can see which part needs escaping.",
      },
      {
        name: "Copy the result",
        text: "Copy the encoded or decoded text. Decoding reports malformed sequences rather than silently returning something wrong.",
      },
    ],
    examples: [
      {
        title: "A value inside a query string",
        input: "a/b?c=d",
        output: "a%2Fb%3Fc%3Dd",
        explanation:
          "Component mode escapes the slash, question mark and equals sign. Without this, everything after the first ampersand becomes a separate parameter and your value is truncated.",
      },
      {
        title: "A whole address",
        input: "http://x.com/a b",
        output: "http://x.com/a%20b",
        explanation:
          "Full-URL mode escapes the space but leaves the scheme, slashes and colon intact. Component mode would escape those too and produce a string no browser could follow.",
      },
      {
        title: "Form-encoded data",
        input: "hello world",
        output: "hello+world",
        explanation:
          "HTML forms encode a space as a plus sign rather than %20, and escape a few punctuation characters that percent-encoding leaves alone. Decoding form data with the wrong mode leaves stray plus signs in your text.",
      },
    ],
    benefits: [
      {
        title: "Explains the mode you need",
        description:
          "Each mode says what it escapes and when to use it, which is the actual difficulty — the encoding itself is trivial once you have chosen correctly.",
      },
      {
        title: "Shows the URL's structure",
        description:
          "Query parameters are listed as key and value pairs, so you can see exactly which value contains the character causing trouble.",
      },
      {
        title: "Handles any script",
        description:
          "Non-ASCII characters are encoded as their UTF-8 bytes, which is what every modern server expects.",
      },
      {
        title: "Useful decode errors",
        description:
          "A stray percent sign produces a clear explanation rather than an unhandled exception, which is how most decoders fail.",
      },
    ],
    limitations: [
      "Encoding a URL twice produces a valid but wrong result — %20 becomes %2520. The tool cannot tell whether input is already encoded.",
      "Internationalised domain names use Punycode rather than percent-encoding, which this tool does not convert.",
      "Form mode assumes UTF-8. A legacy endpoint expecting another character set will need different handling.",
      "The structural breakdown only appears for input that parses as an absolute URL.",
    ],
    keyTakeaways: [
      "Use component mode for a single value and full-URL mode for a whole address.",
      "Component mode escapes slashes and ampersands; full-URL mode deliberately does not.",
      "Form encoding uses a plus sign for a space, which percent-encoding does not.",
      "Double-encoding turns %20 into %2520 and is the most common cause of broken links.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "which-mode",
        question: "Should I escape the whole URL or just one value?",
        answer:
          "Escape the individual value. A whole URL needs its slashes, question mark and ampersands intact to work, so escaping it wholesale breaks it. Full-URL mode exists only for fixing an address that contains spaces or accents in its path.",
      },
      {
        id: "double-encoding",
        question: "Why does my link contain %2520?",
        answer:
          "It has been encoded twice. The first pass turned a space into %20, and the second turned the percent sign of %20 into %25. Decode it twice to recover the original, then encode only once.",
      },
      {
        id: "plus-vs-percent",
        question: "Why is a space sometimes a plus sign and sometimes %20?",
        answer:
          "HTML form submissions use application/x-www-form-urlencoded, where a space is a plus. Everywhere else in a URL a space is %20. Decoding form data as ordinary percent-encoding leaves plus signs scattered through the text.",
      },
      {
        id: "which-characters",
        question: "Which characters actually need encoding?",
        answer:
          "Anything outside letters, digits and the four characters hyphen, underscore, full stop and tilde. In practice the ones that cause real trouble are the space, ampersand, question mark, equals sign, hash and slash, because each already means something in a URL.",
      },
      {
        id: "unicode",
        question: "How are accented and non-Latin characters encoded?",
        answer:
          "As their UTF-8 bytes, each written as a percent sign and two hex digits. An é becomes %C3%A9 — two bytes, so two escapes. Any server following the modern standard decodes that back correctly.",
      },
      {
        id: "hash",
        question: "Why does everything after a hash disappear?",
        answer:
          "The fragment after a hash is never sent to the server; it is handled by the browser alone. If a value in your query string contains a hash it must be escaped as %23, or the rest of the URL is treated as a fragment and lost.",
      },
      {
        id: "already-encoded",
        question: "Can the tool tell if my text is already encoded?",
        answer:
          "Not reliably, because %20 is a legitimate literal string as well as an encoded space. If your input already contains percent escapes, decode first and check the result looks right before encoding again.",
      },
      {
        id: "safe-characters",
        question: "Why are some punctuation marks left alone?",
        answer:
          "Hyphen, underscore, full stop and tilde are unreserved in the URL standard and never need escaping. Form mode additionally escapes exclamation mark, apostrophe, brackets and asterisk, which percent-encoding leaves as they are.",
      },
      {
        id: "privacy",
        question: "Do the URLs I paste get logged?",
        answer:
          "No. Encoding happens in your browser and nothing is sent anywhere, which matters because URLs frequently contain session tokens, API keys and customer identifiers in their query strings.",
      },
    ],
    relatedSlugs: ["base64-encoder", "json-viewer", "hash-generator", "uuid-generator"],
  },

  "hash-generator": {
    slug: "hash-generator",
    name: "Hash Generator",
    title: "Hash Generator — SHA-256, SHA-512 & MD5",
    description:
      "Generate SHA-256, SHA-1, SHA-512 and MD5 hashes from text or a file, and verify a checksum. Runs in your browser.",
    h1: "Hash Generator",
    intro:
      "A hash turns any input into a fixed-length fingerprint, so two files can be compared without transferring either one. This tool uses the browser's own Web Crypto implementation for the SHA family and can hash a file without loading it anywhere but memory. MD5 and SHA-1 are included because real systems still use them, but both are labelled with what they are no longer safe for.",
    iconName: "Fingerprint",
    applicationCategory: "DeveloperApplication",
    features: [
      "SHA-256, SHA-384, SHA-512, SHA-1 and MD5",
      "Hashes files as well as typed text",
      "Checksum verification with a paste-and-compare field",
      "Correct UTF-8 handling for non-ASCII input",
      "Plain warnings on the algorithms that are broken",
    ],
    steps: [
      {
        name: "Choose an algorithm",
        text: "SHA-256 is the sensible default. MD5 and SHA-1 are available for legacy systems and are marked with what they must not be used for.",
      },
      {
        name: "Enter text or pick a file",
        text: "Type or paste text, or select a file to hash its exact bytes. A downloaded ISO or installer can be checked this way without uploading it.",
      },
      {
        name: "Read the digest",
        text: "The hash appears as lowercase hexadecimal. Text input hashes as you type; a file is read once and hashed in one pass.",
      },
      {
        name: "Verify against a published checksum",
        text: "Paste the expected value into the verification field. Comparison ignores case and any filename after the hash, which is how checksums are usually published.",
      },
    ],
    examples: [
      {
        title: "The standard test vector",
        input: "abc",
        output: "ba7816bf8f01cfea…f20015ad",
        explanation:
          "The published SHA-256 of the string abc. Any correct implementation produces this, which makes it a quick way to confirm a tool is working.",
      },
      {
        title: "Non-ASCII text",
        input: "café",
        output: "07117fe4a1ebd544965dc19573183da2 (MD5)",
        explanation:
          "The text is encoded as UTF-8 before hashing. Libraries that default to Latin-1 produce a completely different digest for the same visible text, which is a common source of mismatches.",
      },
      {
        title: "Verifying a download",
        input: "ubuntu.iso + published SHA-256",
        output: "Match",
        explanation:
          "The file is read in your browser and never uploaded. Comparison ignores case and trailing filenames, so you can paste a checksum line straight from a release page.",
      },
    ],
    benefits: [
      {
        title: "The browser's own implementation",
        description:
          "SHA hashes come from Web Crypto rather than a hand-written implementation, so they are the same code the browser uses for TLS.",
      },
      {
        title: "Files never leave your machine",
        description:
          "A file is read locally and hashed in memory, which means you can verify a download without sending it anywhere.",
      },
      {
        title: "Honest about weak algorithms",
        description:
          "MD5 and SHA-1 are offered with a plain statement of what broke them and when, rather than being listed as equal options.",
      },
      {
        title: "Encoding handled correctly",
        description:
          "Text is hashed as UTF-8, so accented and non-Latin input produces the digest other correct tools produce.",
      },
    ],
    limitations: [
      "Hashing is not encryption and not password storage. A password needs a slow algorithm such as Argon2 or bcrypt, which no browser tool should be doing.",
      "A hash cannot be reversed, but a short or common input can be found in a lookup table, so hashing alone does not anonymise data.",
      "Very large files are read into memory, so a multi-gigabyte image may fail in the browser.",
      "MD5 and SHA-1 are included for compatibility and must not be relied on where an attacker could choose the input.",
    ],
    keyTakeaways: [
      "SHA-256 is the right default for anything new.",
      "MD5 has been broken since 2004 and SHA-1 since 2017; neither is safe against a deliberate collision.",
      "Files are hashed locally, so a download can be verified without uploading it.",
      "Text is hashed as UTF-8, which is why digests here match other correct implementations.",
      "Hashing is not password storage — use a purpose-built slow algorithm for that.",
    ],
    faqs: [
      {
        id: "which-algorithm",
        question: "Which hash algorithm should I use?",
        answer:
          "SHA-256 unless something forces your hand. It is fast, widely supported and has no known weakness. SHA-512 is actually quicker on 64-bit hardware if you need a longer digest.",
      },
      {
        id: "md5-broken",
        question: "Why is MD5 marked as broken?",
        answer:
          "Collisions — two different inputs with the same hash — have been producible since 2004 and now take seconds on a laptop. That makes MD5 useless for signatures or tamper detection, though it still works as a non-adversarial checksum or cache key.",
      },
      {
        id: "sha1",
        question: "Is SHA-1 still safe to use?",
        answer:
          "Not for anything an attacker can influence. A practical collision was demonstrated in 2017, and browsers stopped trusting SHA-1 certificates soon after. It survives in Git object ids and older systems where the threat model does not include a deliberate collision.",
      },
      {
        id: "passwords",
        question: "Can I hash passwords with this?",
        answer:
          "You can, but you should not store the result. Password hashing needs a deliberately slow algorithm with a salt — Argon2, scrypt or bcrypt — because SHA-256 is fast enough to test billions of guesses per second on commodity hardware.",
      },
      {
        id: "reverse",
        question: "Can a hash be turned back into the original text?",
        answer:
          "Not by computation — the function discards information. But a short, common or predictable input can be found by hashing candidates until one matches, which is why hashing an email address does not anonymise it.",
      },
      {
        id: "file-hashing",
        question: "Is my file uploaded when I hash it?",
        answer:
          "No. The browser reads the file into memory and hashes the bytes locally. Nothing is transmitted, which is what makes verifying a confidential download here reasonable.",
      },
      {
        id: "checksum-mismatch",
        question: "My checksum does not match. What went wrong?",
        answer:
          "Usually an incomplete download, or the published checksum being for a different version or algorithm. Check you are comparing the same algorithm — a SHA-256 value is 64 hex characters and an MD5 is 32, so the length tells you immediately.",
      },
      {
        id: "encoding",
        question: "Why does the same text give a different hash elsewhere?",
        answer:
          "Almost always a character encoding difference. Text has to become bytes before it can be hashed, and a library defaulting to Latin-1 rather than UTF-8 produces a different digest for any non-ASCII input. This tool always uses UTF-8.",
      },
      {
        id: "salt",
        question: "What is a salt and does this tool add one?",
        answer:
          "A salt is random data mixed with the input so identical values do not produce identical hashes. This tool does not add one, because a salt has to be stored alongside the hash by the system that owns it — adding one here would produce a value you could never reproduce.",
      },
    ],
    relatedSlugs: ["uuid-generator", "base64-encoder", "url-encoder", "json-viewer"],
  },

  "uuid-generator": {
    slug: "uuid-generator",
    name: "UUID Generator",
    title: "UUID Generator — v4 Random & v7 Sortable",
    description:
      "Generate cryptographically random v4 UUIDs or time-sortable v7 UUIDs in bulk, and inspect any UUID's version and variant.",
    h1: "UUID Generator",
    intro:
      "A UUID is a 128-bit identifier that can be generated independently anywhere and still be unique, which is why they are used for database keys and request ids. This generator uses the browser's cryptographic random source rather than Math.random, and offers version 7 alongside version 4 — v7 embeds a timestamp so the identifiers sort by creation time, which makes a dramatic difference to database index performance.",
    iconName: "Hash",
    applicationCategory: "DeveloperApplication",
    features: [
      "Version 4 random and version 7 time-sortable UUIDs",
      "Bulk generation up to a thousand at a time",
      "Cryptographic randomness, never Math.random",
      "Uppercase, braces and no-hyphen output formats",
      "Inspector reporting any UUID's version and variant",
    ],
    steps: [
      {
        name: "Pick a version",
        text: "Version 4 is entirely random and the usual choice. Version 7 starts with a millisecond timestamp, so a batch sorts in creation order — better for database keys.",
      },
      {
        name: "Choose how many",
        text: "Generate one or up to a thousand at once. A fresh batch is produced each time, and none of it is stored anywhere.",
      },
      {
        name: "Set the format",
        text: "Standard lowercase with hyphens suits most uses. Uppercase, braces and hyphen-free variants are available for systems that expect them.",
      },
      {
        name: "Copy or inspect",
        text: "Copy the list, download it, or paste any existing UUID into the inspector to see which version and variant it is.",
      },
    ],
    examples: [
      {
        title: "A version 4 UUID",
        input: "Generate, v4",
        output: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        explanation:
          "122 of the 128 bits are random. The 4 at the start of the third group marks the version, and the first character of the fourth group marks the variant.",
      },
      {
        title: "A batch of version 7 UUIDs",
        input: "Generate 3, v7",
        output: "Three ids that sort in creation order",
        explanation:
          "The first 48 bits are a millisecond timestamp, so the ids increase over time. As a primary key this keeps database inserts at the end of the index instead of scattering them.",
      },
      {
        title: "Inspecting an unknown id",
        input: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        output: "Version 4, RFC 4122 variant",
        explanation:
          "The inspector reads the version and variant bits, which tells you how the id was generated and therefore whether it carries a timestamp.",
      },
    ],
    benefits: [
      {
        title: "Proper randomness",
        description:
          "Values come from the platform's cryptographic random source. Math.random is not used anywhere, since it is not designed to be unpredictable and can repeat across tabs.",
      },
      {
        title: "Sortable identifiers when you need them",
        description:
          "Version 7 gives you uniqueness without the index fragmentation that random keys cause on a large table.",
      },
      {
        title: "Bulk generation",
        description:
          "Produce a thousand at once for seed data or load testing, then copy or download the whole list.",
      },
      {
        title: "Nothing is recorded",
        description:
          "Identifiers are generated in your browser and never sent or stored, so none of them can have been issued to anyone else.",
      },
    ],
    limitations: [
      "A version 7 UUID reveals when it was created, which is a small information leak if the identifier is public.",
      "UUIDs are 36 characters as text, which makes them heavier database keys than an integer.",
      "Uniqueness is probabilistic rather than guaranteed, though the odds of a v4 collision are far beyond negligible.",
      "Versions 1, 3 and 5 are not offered — v1 leaks the machine's MAC address and the name-based versions need an input namespace.",
    ],
    keyTakeaways: [
      "Version 4 is random; version 7 sorts by creation time and is better as a database key.",
      "Randomness comes from the cryptographic source, never Math.random.",
      "A v4 collision is so unlikely it can be ignored in practice.",
      "Version 7 embeds a timestamp, so it reveals when the id was made.",
      "Generation happens in your browser and nothing is stored.",
    ],
    faqs: [
      {
        id: "collision",
        question: "Could two generated UUIDs ever be the same?",
        answer:
          "In principle yes, in practice no. A version 4 UUID has 122 random bits, so you would need to generate billions per second for decades before a collision became likely. It is safe to treat them as unique.",
      },
      {
        id: "v4-vs-v7",
        question: "Should I use version 4 or version 7?",
        answer:
          "Version 7 for anything that becomes a database primary key, because sorted keys keep inserts at the end of the index rather than scattering writes across it. Version 4 for public identifiers, since v7 discloses its creation time.",
      },
      {
        id: "math-random",
        question: "Why does it matter which random source is used?",
        answer:
          "Math.random is fast but predictable — its output can be reconstructed from a few samples, and two tabs opened together can produce the same sequence. Anything used as an identifier or token needs the cryptographic source instead.",
      },
      {
        id: "version-bits",
        question: "How can I tell which version a UUID is?",
        answer:
          "The first character of the third group is the version number, so a 4 there means version 4 and a 7 means version 7. The first character of the fourth group encodes the variant, and is normally 8, 9, a or b.",
      },
      {
        id: "database-key",
        question: "Are UUIDs a good primary key?",
        answer:
          "They let you generate ids without a round trip to the database, which is valuable in distributed systems. The cost is size and, for random versions, index fragmentation — which is precisely the problem version 7 was designed to solve.",
      },
      {
        id: "other-versions",
        question: "Why are versions 1, 3 and 5 not offered?",
        answer:
          "Version 1 embeds the machine's MAC address and is a privacy problem. Versions 3 and 5 are deterministic hashes of a name within a namespace, so they are not generated at random and need inputs this tool does not ask for.",
      },
      {
        id: "guid",
        question: "Is a GUID the same thing as a UUID?",
        answer:
          "Yes. GUID is Microsoft's name for the same 128-bit identifier. The only practical difference is presentation — Microsoft tooling often wraps them in braces and uses uppercase, both of which this tool can produce.",
      },
      {
        id: "secret",
        question: "Can a UUID be used as a security token?",
        answer:
          "A version 4 UUID is random enough to be unguessable, so it works as a one-off link token. Version 7 is not suitable, because most of its leading bits are a predictable timestamp rather than random.",
      },
      {
        id: "privacy",
        question: "Are generated UUIDs stored or logged anywhere?",
        answer:
          "No. They are produced in your browser and exist only on your screen until you copy them. Nothing is transmitted, so no identifier generated here has been seen by anyone else.",
      },
    ],
    relatedSlugs: ["hash-generator", "base64-encoder", "unix-timestamp-converter", "json-viewer"],
  },
};
