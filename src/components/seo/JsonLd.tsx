/**
 * Renders JSON-LD structured data.
 *
 * `<` is escaped to its unicode form so a value containing markup cannot break
 * out of the script tag — the sanitisation step Next.js documents for JSON-LD.
 */
export default function JsonLd({ schema }: { schema: object | object[] }) {
  const blocks = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
