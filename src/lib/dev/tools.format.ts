import type { SeoToolConfig } from "@/lib/seo-tools/types";

/** Code formatting and minification tools. */
export const FORMAT_TOOLS: Record<string, SeoToolConfig> = {
  "javascript-formatter": {
    slug: "javascript-formatter",
    name: "JavaScript Formatter",
    title: "JavaScript Formatter & Minifier — Safe",
    description:
      "Beautify or minify JavaScript in your browser. The minifier understands strings and regex, so URLs and template literals survive intact.",
    h1: "JavaScript Formatter and Minifier",
    intro:
      "This tool reindents JavaScript for reading and strips it down for shipping. The minifier is the part worth explaining: most browser-based minifiers are a stack of regular expressions that cannot tell code from a string, so a URL inside quotes loses everything after its double slash. This one tracks whether it is inside a string, template, regex or comment before removing anything.",
    iconName: "Braces",
    applicationCategory: "DeveloperApplication",
    features: [
      "Beautify with configurable indent and brace style",
      "Minify without corrupting strings, templates or regex",
      "Preserves line breaks where semicolon insertion depends on them",
      "Optional comment removal",
      "Live byte count and saving",
    ],
    steps: [
      {
        name: "Paste your JavaScript",
        text: "Type, paste, or load a .js file. Formatting runs as you type with no button to press.",
      },
      {
        name: "Choose beautify or minify",
        text: "Beautify reindents for reading. Minify strips whitespace and comments while leaving anything inside a string or regular expression untouched.",
      },
      {
        name: "Set your preferences",
        text: "Pick an indent size or tabs, and choose a brace style. For minifying, decide whether comments should go.",
      },
      {
        name: "Check the saving and copy",
        text: "The byte counts show what the minification bought you. Copy the result or download it as a file.",
      },
    ],
    examples: [
      {
        title: "A URL inside a string",
        input: 'const url = "https://example.com/api";',
        output: 'const url="https://example.com/api";',
        explanation:
          "A regex-based minifier treats the double slash as the start of a comment and deletes the rest of the line, producing an unterminated string. Tracking string context avoids that entirely.",
      },
      {
        title: "A template literal",
        input: "const t = `line one\n    indented`;",
        output: "const t=`line one\n    indented`;",
        explanation:
          "The indentation inside a template literal is part of the value. Collapsing it changes what the program outputs, which is why templates are copied through byte for byte.",
      },
      {
        title: "A regular expression",
        input: "const re = /a\\/b/g;",
        output: "const re=/a\\/b/g;",
        explanation:
          "The escaped slash inside the regex would end a comment for a naive scanner. Distinguishing division from a regex literal requires looking at the preceding token, which this minifier does.",
      },
    ],
    benefits: [
      {
        title: "Minification that cannot corrupt your code",
        description:
          "Strings, template literals, regular expressions and comments are identified before anything is removed, so nothing inside them is ever touched.",
      },
      {
        title: "Respects automatic semicolon insertion",
        description:
          "Line breaks that carry meaning are kept, so code written without semicolons still behaves the same after minifying.",
      },
      {
        title: "Backed by js-beautify",
        description:
          "The beautify path uses a well-established library rather than a home-made reindenter, so unusual syntax is handled properly.",
      },
      {
        title: "Nothing is uploaded",
        description:
          "Proprietary source stays in your browser. No request is made and no copy is kept.",
      },
    ],
    limitations: [
      "This is a whitespace minifier, not a compressor. It does not rename variables, remove dead code or bundle modules — use a real build tool for that.",
      "Very old or non-standard syntax may confuse the beautifier, though the minifier only needs to find string boundaries.",
      "Minified output is valid but not obfuscated. Anyone can reformat it back into readable code.",
      "Extremely large files are held in memory and may make the browser sluggish.",
    ],
    keyTakeaways: [
      "The minifier understands string, template, regex and comment context.",
      "A URL inside a string survives, where regex-based minifiers truncate it.",
      "Line breaks are preserved where automatic semicolon insertion depends on them.",
      "Minification here removes whitespace only — it does not rename or obfuscate.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "url-bug",
        question: "Why do some minifiers break URLs in strings?",
        answer:
          "They strip comments with a regular expression that looks for two slashes. The double slash in https:// matches, so everything after it on that line is deleted — leaving an unterminated string and code that will not parse.",
      },
      {
        id: "minify-vs-obfuscate",
        question: "Is minified code protected from being read?",
        answer:
          "No. Minifying removes whitespace and comments, and any formatter turns it straight back into readable code. Obfuscation is a different process, and even that only slows a determined reader down.",
      },
      {
        id: "semicolons",
        question: "Will minifying break code written without semicolons?",
        answer:
          "Not here. JavaScript inserts semicolons at certain line breaks, so removing those breaks changes behaviour. Line breaks that could matter are kept, which costs a few bytes and avoids a class of bug that is very hard to find later.",
      },
      {
        id: "template-literals",
        question: "Are template literals safe to minify?",
        answer:
          "They are in this tool, because their contents are copied verbatim. Whitespace inside a template is part of the string value, so a minifier that collapses it silently changes what your program prints.",
      },
      {
        id: "regex",
        question: "How does it tell a regex from a division sign?",
        answer:
          "By the preceding token. After a value, a variable or a closing bracket, a slash is division; after an operator, an opening bracket or a keyword like return, it starts a regular expression. That is the same rule the language itself uses.",
      },
      {
        id: "comments",
        question: "Should I remove comments when minifying?",
        answer:
          "For production, yes — they are pure weight. Keep them if you are minifying to compare two files, since comments are often the only thing distinguishing two builds of the same source.",
      },
      {
        id: "build-tool",
        question: "Can this replace a bundler?",
        answer:
          "No. A real build tool renames variables, removes unreachable code, splits bundles and generates source maps. This is for a quick tidy of a snippet, a config file or a script you are pasting somewhere.",
      },
      {
        id: "jsx",
        question: "Does it handle JSX or TypeScript?",
        answer:
          "The minifier will not corrupt them, since it only looks for string and comment boundaries. The beautifier is built for plain JavaScript, so JSX attributes and type annotations may not be reindented the way you expect.",
      },
      {
        id: "privacy",
        question: "Is my source code sent anywhere?",
        answer:
          "No. Both formatting and minification run as JavaScript in this page. Unreleased or proprietary code never leaves your machine.",
      },
    ],
    relatedSlugs: ["css-formatter", "html-formatter", "json-viewer", "xml-formatter"],
  },

  "css-formatter": {
    slug: "css-formatter",
    name: "CSS Formatter",
    title: "CSS Formatter & Minifier — url() Safe",
    description:
      "Beautify or minify CSS in your browser. Keeps url() values and content strings intact instead of mangling them.",
    h1: "CSS Formatter and Minifier",
    intro:
      "This tool reindents CSS for reading and compresses it for shipping. The compression is where care is needed: a URL can legally contain the characters that start a comment, and a content string can contain runs of spaces that matter. A minifier that treats the whole file as one long string destroys both, so this one identifies strings and url() values first.",
    iconName: "Palette",
    applicationCategory: "DeveloperApplication",
    features: [
      "Beautify with configurable indentation",
      "Minify without touching strings or url() values",
      "Keeps /*! licence comments",
      "Removes the redundant final semicolon in each block",
      "Live byte count and saving",
    ],
    steps: [
      {
        name: "Paste your CSS",
        text: "Type, paste, or load a .css file. The result updates as you type.",
      },
      {
        name: "Choose beautify or minify",
        text: "Beautify puts each declaration on its own line. Minify strips every unnecessary byte while leaving quoted values alone.",
      },
      {
        name: "Decide about comments",
        text: "Comments can be removed when minifying. Licence comments beginning /*! are kept regardless, which is the usual convention.",
      },
      {
        name: "Copy the result",
        text: "The byte counts show what you saved. Copy the output or download it as a file.",
      },
    ],
    examples: [
      {
        title: "A URL containing a comment marker",
        input: '.a { background: url("http://x.com/a/*b*/c.png"); }',
        output: '.a{background:url("http://x.com/a/*b*/c.png")}',
        explanation:
          "A minifier that strips anything between /* and */ removes the middle of this URL and leaves a broken path. Recognising url() as a unit prevents that.",
      },
      {
        title: "A content string",
        input: '.a::before { content: "a    b"; }',
        output: '.a::before{content:"a    b"}',
        explanation:
          "Those spaces are rendered on the page, so collapsing them changes the design. Quoted strings are copied through unchanged.",
      },
      {
        title: "A licence header",
        input: "/*! MIT licensed */ .a { color: red; }",
        output: "/*! MIT licensed */.a{color:red}",
        explanation:
          "The /*! form conventionally marks a comment that must survive minification for licensing reasons, so it is kept while ordinary comments go.",
      },
    ],
    benefits: [
      {
        title: "Values are never corrupted",
        description:
          "Quoted strings and url() values are identified before any whitespace or comment removal, so their contents come through byte for byte.",
      },
      {
        title: "Licence comments survive",
        description:
          "The /*! convention is respected, so minifying does not strip an attribution you are required to keep.",
      },
      {
        title: "Real savings, shown",
        description:
          "Byte counts before and after tell you whether the minification was worth doing for this particular file.",
      },
      {
        title: "Runs in your browser",
        description:
          "Unreleased stylesheets are not uploaded anywhere, and the tool works with no network connection.",
      },
    ],
    limitations: [
      "This removes whitespace and comments. It does not merge duplicate rules, shorten colours or drop unused selectors.",
      "Vendor prefixes are neither added nor removed — use a build step with a browser support target for that.",
      "CSS with syntax errors is passed through as-is rather than corrected, since guessing intent would be worse.",
      "Very large stylesheets are held in memory and may be slow.",
    ],
    keyTakeaways: [
      "url() values and quoted strings are protected from the minifier.",
      "Licence comments starting /*! are kept while ordinary comments are removed.",
      "Minification here is whitespace and comments only, not rule optimisation.",
      "The redundant semicolon before each closing brace is dropped.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "url-safety",
        question: "Why do some minifiers break background images?",
        answer:
          "Because a URL can contain the sequence that opens a CSS comment. Stripping everything between /* and */ across the whole file removes part of the path, leaving a request for an image that does not exist.",
      },
      {
        id: "content-strings",
        question: "Are spaces inside a content property preserved?",
        answer:
          "Yes. Anything in quotes is rendered literally on the page, so collapsing whitespace there changes what the user sees. Quoted values are copied through untouched.",
      },
      {
        id: "licence-comments",
        question: "How do I keep a licence header when minifying?",
        answer:
          "Start it with /*! rather than /*. That convention is understood by most minifiers, including this one, and marks a comment that must survive because it carries attribution you are obliged to keep.",
      },
      {
        id: "savings",
        question: "How much smaller does minified CSS get?",
        answer:
          "Typically 20 to 30 percent for hand-written CSS with normal indentation and comments. Generated or already-compact stylesheets save far less, which is why the byte counts are shown rather than assumed.",
      },
      {
        id: "optimisation",
        question: "Does it merge duplicate rules or shorten colours?",
        answer:
          "No. Those transformations change the cascade or rely on knowing which browsers you support, so they belong in a build step with proper configuration rather than in a quick browser tool.",
      },
      {
        id: "semicolon",
        question: "Is it safe to remove the last semicolon in a block?",
        answer:
          "Yes. The semicolon separates declarations, so the one before a closing brace is optional. Removing it is a small, entirely safe saving that every minifier makes.",
      },
      {
        id: "preprocessors",
        question: "Can I format Sass or Less with this?",
        answer:
          "Only partly. Nesting and variables are not CSS syntax, so the beautifier will not indent them meaningfully. Compile to plain CSS first, then format the output.",
      },
      {
        id: "errors",
        question: "What happens if my CSS has a mistake in it?",
        answer:
          "It passes through rather than being silently repaired. A minifier guessing at what a malformed rule meant would be far more dangerous than leaving it visible for you to fix.",
      },
      {
        id: "privacy",
        question: "Does my stylesheet get uploaded?",
        answer:
          "No. Both formatting and minification happen in this page, so an unreleased design system stays entirely on your machine.",
      },
    ],
    relatedSlugs: ["html-formatter", "javascript-formatter", "css-grid-generator", "flexbox-generator"],
  },

  "html-formatter": {
    slug: "html-formatter",
    name: "HTML Formatter",
    title: "HTML Formatter & Minifier — pre Safe",
    description:
      "Beautify or minify HTML in your browser. Preserves pre and textarea content and the meaningful spaces between inline elements.",
    h1: "HTML Formatter and Minifier",
    intro:
      "This tool reindents HTML for reading and compresses it for shipping. HTML minification is deceptively risky, because whitespace matters in some places and not others: inside a pre or textarea it is content, and between two inline elements it is a word separator. Collapsing it everywhere is what turns \"bold italic\" into \"bolditalic\".",
    iconName: "Code2",
    applicationCategory: "DeveloperApplication",
    features: [
      "Beautify with configurable indentation",
      "Preserves pre, textarea, script and style contents exactly",
      "Keeps the single space between inline elements",
      "Retains conditional comments",
      "Live byte count and saving",
    ],
    steps: [
      {
        name: "Paste your HTML",
        text: "Type, paste, or load an .html file. The output updates as you type.",
      },
      {
        name: "Choose beautify or minify",
        text: "Beautify indents the tree so the structure is readable. Minify collapses formatting whitespace while protecting the elements where it is content.",
      },
      {
        name: "Decide about comments",
        text: "Comments can be stripped. Conditional comments and those beginning with an exclamation mark are kept, since removing them changes behaviour.",
      },
      {
        name: "Copy the result",
        text: "Check the saving in the byte counts, then copy the output or download it.",
      },
    ],
    examples: [
      {
        title: "A preformatted block",
        input: "<pre>line one\n    indented\n</pre>",
        output: "<pre>line one\n    indented\n</pre>",
        explanation:
          "Everything inside pre is displayed exactly as written, so a minifier that collapses it destroys the code sample it was showing. The element's contents are copied through untouched.",
      },
      {
        title: "Space between inline elements",
        input: "<p><b>bold</b> <i>italic</i></p>",
        output: "<p><b>bold</b> <i>italic</i></p>",
        explanation:
          "Removing that single space renders as \"bolditalic\". Runs of whitespace are collapsed to one space rather than deleted, which keeps the words apart.",
      },
      {
        title: "Indentation between block elements",
        input: "<div>\n  <p>hi</p>\n</div>",
        output: "<div> <p>hi</p> </div>",
        explanation:
          "Here the whitespace is only formatting, so it collapses to a single space. That is safe between block elements and unsafe between inline ones, which is why the distinction is made.",
      },
    ],
    benefits: [
      {
        title: "Whitespace-sensitive elements protected",
        description:
          "The contents of pre, textarea, script and style are copied through byte for byte, so code samples and scripts survive minification.",
      },
      {
        title: "Words stay apart",
        description:
          "Whitespace runs collapse to one space rather than vanishing, so text either side of a tag boundary does not run together.",
      },
      {
        title: "Attributes left alone",
        description:
          "Quoted attribute values are never rewritten, so a class list or an alt text containing multiple spaces stays as written.",
      },
      {
        title: "Runs offline",
        description:
          "Formatting happens in your browser, so markup containing customer data or unreleased copy is not uploaded.",
      },
    ],
    limitations: [
      "Whitespace handling depends on CSS, so an element set to display:inline by a stylesheet is not detected as inline by the minifier.",
      "Attribute quotes are not removed and boolean attributes are not shortened, both of which a dedicated build tool would do.",
      "Malformed markup is passed through rather than repaired, since browsers each recover differently.",
      "Embedded script and style contents are preserved but not themselves minified — use the JavaScript or CSS tool for that.",
    ],
    keyTakeaways: [
      "pre, textarea, script and style contents survive minification exactly.",
      "Whitespace collapses to a single space rather than being deleted, keeping words apart.",
      "Conditional comments are kept because removing them changes behaviour.",
      "Attribute values are never rewritten.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "pre",
        question: "Why does minifying HTML sometimes ruin code samples?",
        answer:
          "Because the contents of a pre element are displayed exactly as written, and most minifiers collapse whitespace across the whole document. The indentation that made the sample readable disappears and every line runs together.",
      },
      {
        id: "inline-space",
        question: "Why keep a space between two tags?",
        answer:
          "Between inline elements that space is a word separator. Deleting the space in <b>bold</b> <i>italic</i> renders as bolditalic. Collapsing runs to one space is the safe compromise.",
      },
      {
        id: "conditional-comments",
        question: "Which comments are kept?",
        answer:
          "Conditional comments beginning <!--[if and those starting <!--! are preserved, because both are load-bearing — the first targets old Internet Explorer and the second is the convention for a comment that must survive.",
      },
      {
        id: "attributes",
        question: "Are attribute values changed?",
        answer:
          "Never. A class attribute with awkward spacing, or an alt text with a double space, is copied through exactly. Rewriting attribute values is how minifiers break things in ways nobody notices until production.",
      },
      {
        id: "savings",
        question: "How much does HTML minification save?",
        answer:
          "Usually 10 to 20 percent on hand-written markup, and much less on generated output that is already compact. Gzip compresses repeated whitespace very effectively, so the real-world gain over the wire is smaller than the byte count suggests.",
      },
      {
        id: "scripts",
        question: "Does it minify the JavaScript inside a script tag?",
        answer:
          "No. Script contents are preserved exactly rather than being passed through a second minifier, which would risk corrupting them. Minify the script separately and paste the result back in.",
      },
      {
        id: "malformed",
        question: "What happens with unclosed tags?",
        answer:
          "The markup is passed through as written. Browsers each have their own recovery rules for malformed HTML, so a formatter that silently restructured your document could easily change how it renders.",
      },
      {
        id: "templates",
        question: "Can I format template files with handlebars or JSX syntax?",
        answer:
          "The minifier will not corrupt the template expressions, since it only recognises tags and text. The beautifier is built for plain HTML, so unusual template syntax may not indent the way you would like.",
      },
      {
        id: "privacy",
        question: "Is my markup sent to a server?",
        answer:
          "No. Everything runs in the page, which matters because HTML pasted into a formatter often contains real customer names, addresses or order details from a rendered page.",
      },
    ],
    relatedSlugs: ["css-formatter", "javascript-formatter", "xml-formatter", "json-viewer"],
  },

  "xml-formatter": {
    slug: "xml-formatter",
    name: "XML Formatter",
    title: "XML Formatter & Validator — CDATA Safe",
    description:
      "Format, minify and validate XML in your browser. Preserves CDATA and text content, and reports errors with a line number.",
    h1: "XML Formatter and Validator",
    intro:
      "This tool indents XML so a document's structure is visible, compresses it for transport, and validates it well enough to find the mistake. Unlike HTML, XML has no convention that lets a tool decide whitespace inside an element is unimportant — any character data may be significant — so only the whitespace between elements is touched.",
    iconName: "FileCode2",
    applicationCategory: "DeveloperApplication",
    features: [
      "Indent with configurable spacing",
      "Minify by removing only inter-element whitespace",
      "CDATA sections preserved exactly",
      "Validation with a line number for the error",
      "Live byte count and saving",
    ],
    steps: [
      {
        name: "Paste your XML",
        text: "Type, paste, or load an .xml file. Validation runs as you type, so a mistake is reported immediately.",
      },
      {
        name: "Choose format or minify",
        text: "Formatting indents each level so the nesting is clear. Minifying strips the whitespace between elements without touching text content.",
      },
      {
        name: "Fix any reported errors",
        text: "An unclosed or mismatched tag is reported with the line it occurs on, rather than a bare statement that the document is invalid.",
      },
      {
        name: "Copy the result",
        text: "Copy the formatted or minified XML, or download it as a file.",
      },
    ],
    examples: [
      {
        title: "Text content with spacing",
        input: "<note>hello    world</note>",
        output: "<note>hello    world</note>",
        explanation:
          "In XML any character data may be significant, and there is no equivalent of HTML's inline-element convention. Text content is therefore left exactly as written.",
      },
      {
        title: "Whitespace between elements",
        input: "<a>\n  <b>x</b>\n</a>",
        output: "<a><b>x</b></a>",
        explanation:
          "Whitespace that sits entirely between two tags is formatting rather than content, so it is the only whitespace minification removes.",
      },
      {
        title: "A CDATA section",
        input: "<a><![CDATA[  keep  this  ]]></a>",
        output: "<a><![CDATA[  keep  this  ]]></a>",
        explanation:
          "CDATA exists precisely to hold content that must not be interpreted, so its contents are copied through byte for byte.",
      },
    ],
    benefits: [
      {
        title: "Content is never altered",
        description:
          "Only whitespace lying entirely between elements is removed. Text nodes and CDATA sections come through unchanged.",
      },
      {
        title: "Errors with a location",
        description:
          "Validation reports the line where the document stops making sense, which is the difference between a fixable error and a shrug.",
      },
      {
        title: "Handles large documents",
        description:
          "Formatting is a single pass, so a sizeable feed or configuration file reindents without freezing the browser.",
      },
      {
        title: "Runs in your browser",
        description:
          "XML frequently carries invoices, payroll or patient data. None of it is uploaded here.",
      },
    ],
    limitations: [
      "Validation checks that the document is well-formed. It does not validate against a DTD, XSD or RELAX NG schema.",
      "Namespaces are preserved but not resolved or rewritten.",
      "Entity definitions in a DOCTYPE are left as they are rather than expanded.",
      "Attribute order is preserved, which is correct, but means two semantically identical documents can still differ textually.",
    ],
    keyTakeaways: [
      "Only whitespace between elements is removed; text content is untouched.",
      "CDATA sections are preserved exactly.",
      "Validation is well-formedness only, not schema validation.",
      "Errors are reported with the line number where they occur.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "whitespace",
        question: "Why is whitespace inside an XML element left alone?",
        answer:
          "Because XML has no way to know it is unimportant. HTML has a convention that whitespace between inline elements is a word separator and the rest is formatting; XML has no equivalent, so any character data could be meaningful and is preserved.",
      },
      {
        id: "cdata",
        question: "What is a CDATA section for?",
        answer:
          "It holds text that would otherwise have to be escaped — markup, code, anything containing angle brackets or ampersands. Since its whole purpose is to be taken literally, its contents are never modified by formatting.",
      },
      {
        id: "validation",
        question: "What does validation actually check?",
        answer:
          "That the document is well-formed: every tag closed, correctly nested, one root element, attributes quoted. It does not check the document against a schema, which would require you to supply the schema.",
      },
      {
        id: "html-difference",
        question: "Can I use this for HTML?",
        answer:
          "Only for HTML that happens to be well-formed XML. Real HTML has void elements like <br> that are never closed and attributes without quotes, all of which are errors in XML. Use the HTML formatter instead.",
      },
      {
        id: "namespaces",
        question: "Are namespace prefixes handled?",
        answer:
          "They are preserved exactly as written. Prefixes are not resolved to their URIs or rewritten, since doing so would change a document that other tools may be comparing textually.",
      },
      {
        id: "declaration",
        question: "Should the XML declaration stay at the top?",
        answer:
          "Yes, and it must be the very first thing in the file with nothing before it, not even whitespace. That is why a document sometimes fails to parse after being edited — a blank line crept in above the declaration.",
      },
      {
        id: "encoding",
        question: "What if my file declares a non-UTF-8 encoding?",
        answer:
          "The text is processed as UTF-8 regardless, since that is how the browser has already decoded it. The declaration is preserved, but it will no longer describe the bytes if you save the result.",
      },
      {
        id: "large-files",
        question: "How large a document can it handle?",
        answer:
          "A few megabytes formats comfortably. Beyond that the browser holds both input and output in memory at once, so a very large feed may become sluggish or fail outright.",
      },
      {
        id: "privacy",
        question: "Is my XML uploaded for formatting?",
        answer:
          "No. It is processed in this page. That matters given how often XML carries exactly the data you cannot paste into a random website — invoices, payroll records, health data.",
      },
    ],
    relatedSlugs: ["html-formatter", "json-viewer", "css-formatter", "json-to-csv"],
  },

  "sql-formatter": {
    slug: "sql-formatter",
    name: "SQL Formatter",
    title: "SQL Formatter — Readable Queries in Seconds",
    description:
      "Format SQL for readability with support for PostgreSQL, MySQL, SQLite and more. Runs entirely in your browser.",
    h1: "SQL Formatter",
    intro:
      "This tool reindents SQL so a long query becomes readable — clauses on their own lines, joins aligned, nesting visible. It supports the dialect differences that matter, since PostgreSQL, MySQL and T-SQL disagree about quoting, parameter markers and a good deal of syntax, and a formatter using the wrong dialect will mangle what it does not recognise.",
    iconName: "Database",
    applicationCategory: "DeveloperApplication",
    features: [
      "PostgreSQL, MySQL, SQLite, MariaDB, T-SQL and BigQuery dialects",
      "Configurable indentation and keyword case",
      "Handles CTEs, window functions and subqueries",
      "Preserves string literals and comments",
      "Formats as you type",
    ],
    steps: [
      {
        name: "Paste your query",
        text: "Type, paste, or load a .sql file. Formatting runs as you type.",
      },
      {
        name: "Choose your dialect",
        text: "Pick the database you are targeting. This affects quoting, parameter placeholders and which words are treated as keywords.",
      },
      {
        name: "Set indentation and case",
        text: "Choose an indent width and whether keywords are uppercased. Uppercase keywords are the long-standing convention and make clause boundaries easier to scan.",
      },
      {
        name: "Copy the result",
        text: "Copy the formatted query back into your editor, or download it as a file.",
      },
    ],
    examples: [
      {
        title: "A query written on one line",
        input: "select a.id, b.name from a join b on a.id = b.a_id where a.active = 1",
        output: "SELECT\n  a.id,\n  b.name\nFROM\n  a\n  JOIN b ON a.id = b.a_id\nWHERE\n  a.active = 1",
        explanation:
          "Each clause moves to its own line and the join condition is indented under it, so the query's shape becomes visible at a glance.",
      },
      {
        title: "A common table expression",
        input: "with t as (select 1) select * from t",
        output: "WITH t AS (\n  SELECT\n    1\n)\nSELECT\n  *\nFROM\n  t",
        explanation:
          "The CTE body is indented inside its parentheses, which makes a chain of several CTEs — the usual reason a query becomes unreadable — possible to follow.",
      },
      {
        title: "A dialect-specific placeholder",
        input: "SELECT * FROM t WHERE id = $1",
        output: "Formatted as PostgreSQL, $1 kept as a parameter",
        explanation:
          "PostgreSQL uses $1, MySQL uses ?, and T-SQL uses @name. Choosing the wrong dialect can cause a placeholder to be misread as an operator.",
      },
    ],
    benefits: [
      {
        title: "Dialect-aware",
        description:
          "Quoting rules, parameter markers and keyword sets differ between databases, and picking the right dialect avoids the formatter mangling syntax it does not recognise.",
      },
      {
        title: "Makes long queries reviewable",
        description:
          "A hundred-line query with nested subqueries becomes something a colleague can actually read in a pull request.",
      },
      {
        title: "Literals and comments preserved",
        description:
          "String contents and comments are kept as written, so a formatted query is identical in behaviour to the one you pasted.",
      },
      {
        title: "Nothing is uploaded",
        description:
          "Queries routinely contain table names, business logic and sometimes literal customer data. None of it leaves your browser.",
      },
    ],
    limitations: [
      "This formats SQL; it does not validate it. A query with a syntax error will still be reindented.",
      "It cannot connect to a database, so it cannot check that the tables or columns exist.",
      "Very unusual vendor extensions may not be recognised and will be laid out conservatively.",
      "Formatting does not change performance — an unreadable query and a tidy one execute identically.",
    ],
    keyTakeaways: [
      "Choose the dialect that matches your database, since quoting and placeholders differ.",
      "Formatting changes layout only and never alters what the query does.",
      "CTEs, window functions and subqueries are all indented meaningfully.",
      "Uppercase keywords are conventional and make clauses easier to scan.",
      "Everything runs in your browser.",
    ],
    faqs: [
      {
        id: "dialect",
        question: "Does the dialect setting really matter?",
        answer:
          "Yes. Databases disagree about how identifiers are quoted, which parameter markers they use and which words are reserved. A formatter using the wrong dialect can misread a placeholder as an operator or fail to recognise a keyword.",
      },
      {
        id: "performance",
        question: "Will formatting make my query faster?",
        answer:
          "No. Whitespace is discarded by the parser, so a formatted query and a one-line query produce exactly the same execution plan. Formatting is for the humans reading it.",
      },
      {
        id: "validation",
        question: "Does it check my SQL is correct?",
        answer:
          "No. It lays out whatever you give it, including a query with a syntax error. Checking correctness would require knowing your schema, which means connecting to your database — something this tool deliberately never does.",
      },
      {
        id: "uppercase",
        question: "Should SQL keywords be uppercase?",
        answer:
          "SQL is case-insensitive for keywords, so it is a readability convention rather than a rule. Uppercase keywords separate the structure of a query from its table and column names, which is why the convention has lasted.",
      },
      {
        id: "ctes",
        question: "Can it handle CTEs and window functions?",
        answer:
          "Yes. WITH clauses are indented inside their parentheses and window function OVER clauses are laid out on their own lines, which is where a complex analytical query usually becomes impossible to read.",
      },
      {
        id: "comments",
        question: "Are my comments preserved?",
        answer:
          "Yes, both the double-dash line form and the slash-star block form. Comments in SQL usually explain why a filter or a join exists, so losing them during formatting would be a genuine loss.",
      },
      {
        id: "stored-procedures",
        question: "Does it format stored procedures?",
        answer:
          "Partly. The SQL statements inside are formatted, but procedural syntax — variable declarations, loops, exception blocks — varies so much between databases that it is laid out conservatively rather than restructured.",
      },
      {
        id: "long-queries",
        question: "Is there a limit on query length?",
        answer:
          "Nothing fixed. A query of a few thousand lines formats without trouble; beyond that the browser starts to feel it, since the input and output are both held in memory.",
      },
      {
        id: "privacy",
        question: "Are my queries sent to a server?",
        answer:
          "No. Formatting happens in this page. That is worth knowing, because a query pasted from a bug report often contains real identifiers, table names and occasionally literal customer data in its WHERE clause.",
      },
    ],
    relatedSlugs: ["json-viewer", "csv-to-json", "json-to-csv", "duplicate-row-remover"],
  },
};
