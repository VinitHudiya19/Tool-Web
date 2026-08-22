import { pruneEmpty } from "./jsonLd";

/**
 * Field definitions and builders for each schema type.
 *
 * Keeping the shape declarative means the form renders itself from this, and
 * adding a type never touches the component.
 */

export interface SchemaField {
  name: string;
  label: string;
  placeholder?: string;
  hint?: string;
  /** Google needs this for rich-result eligibility. */
  required?: boolean;
  type?: "text" | "url" | "textarea" | "date" | "number";
}

export interface SchemaTypeDefinition {
  id: string;
  label: string;
  /** One line explaining when to use this type. */
  description: string;
  fields: SchemaField[];
  build: (values: Record<string, string>) => object;
}

const text = (
  name: string,
  label: string,
  extra: Partial<SchemaField> = {},
): SchemaField => ({ name, label, type: "text", ...extra });

export const SCHEMA_TYPES: SchemaTypeDefinition[] = [
  {
    id: "Article",
    label: "Article",
    description: "Blog posts, news stories and editorial pages.",
    fields: [
      text("headline", "Headline", {
        required: true,
        placeholder: "How to Compress a PDF Without Losing Quality",
        hint: "Google truncates headlines over 110 characters.",
      }),
      text("description", "Description", { type: "textarea", placeholder: "A short summary of the article." }),
      text("authorName", "Author name", { required: true, placeholder: "Jane Doe" }),
      text("publisherName", "Publisher name", { placeholder: "QuickToolz" }),
      text("datePublished", "Date published", { required: true, type: "date" }),
      text("dateModified", "Date modified", { type: "date" }),
      text("image", "Image URL", { type: "url", placeholder: "https://example.com/cover.jpg" }),
      text("url", "Page URL", { type: "url", placeholder: "https://example.com/post" }),
    ],
    build: (v) =>
      pruneEmpty({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: v.headline,
        description: v.description,
        image: v.image,
        url: v.url,
        datePublished: v.datePublished,
        dateModified: v.dateModified || v.datePublished,
        author: { "@type": "Person", name: v.authorName },
        publisher: { "@type": "Organization", name: v.publisherName },
      }),
  },
  {
    id: "Product",
    label: "Product",
    description: "Shop and product detail pages.",
    fields: [
      text("name", "Product name", { required: true, placeholder: "Trail Runner X" }),
      text("description", "Description", { type: "textarea" }),
      text("image", "Image URL", { type: "url" }),
      text("brand", "Brand", { placeholder: "Acme" }),
      text("sku", "SKU", { placeholder: "TR-X-42" }),
      text("price", "Price", { required: true, type: "number", placeholder: "129.99" }),
      text("priceCurrency", "Currency", { required: true, placeholder: "USD" }),
      text("availability", "Availability", {
        placeholder: "InStock",
        hint: "InStock, OutOfStock, PreOrder or BackOrder.",
      }),
      text("url", "Product URL", { type: "url" }),
    ],
    build: (v) =>
      pruneEmpty({
        "@context": "https://schema.org",
        "@type": "Product",
        name: v.name,
        description: v.description,
        image: v.image,
        sku: v.sku,
        brand: { "@type": "Brand", name: v.brand },
        offers: {
          "@type": "Offer",
          price: v.price,
          priceCurrency: v.priceCurrency,
          availability: v.availability
            ? `https://schema.org/${v.availability.replace(/^https:\/\/schema\.org\//, "")}`
            : "",
          url: v.url,
        },
      }),
  },
  {
    id: "LocalBusiness",
    label: "Local business",
    description: "Shops, restaurants and any business with a physical address.",
    fields: [
      text("name", "Business name", { required: true }),
      text("description", "Description", { type: "textarea" }),
      text("telephone", "Phone", { placeholder: "+1 555 123 4567" }),
      text("streetAddress", "Street address", { required: true }),
      text("addressLocality", "City", { required: true }),
      text("addressRegion", "Region or state"),
      text("postalCode", "Postal code", { required: true }),
      text("addressCountry", "Country code", { required: true, placeholder: "US" }),
      text("url", "Website", { type: "url" }),
      text("priceRange", "Price range", { placeholder: "$$" }),
    ],
    build: (v) =>
      pruneEmpty({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: v.name,
        description: v.description,
        telephone: v.telephone,
        url: v.url,
        priceRange: v.priceRange,
        address: {
          "@type": "PostalAddress",
          streetAddress: v.streetAddress,
          addressLocality: v.addressLocality,
          addressRegion: v.addressRegion,
          postalCode: v.postalCode,
          addressCountry: v.addressCountry,
        },
      }),
  },
  {
    id: "Event",
    label: "Event",
    description: "Concerts, conferences, webinars and classes.",
    fields: [
      text("name", "Event name", { required: true }),
      text("description", "Description", { type: "textarea" }),
      text("startDate", "Start date", { required: true, type: "date" }),
      text("endDate", "End date", { type: "date" }),
      text("locationName", "Venue name", { required: true }),
      text("streetAddress", "Street address"),
      text("addressLocality", "City"),
      text("addressCountry", "Country code", { placeholder: "US" }),
      text("url", "Event URL", { type: "url" }),
      text("price", "Ticket price", { type: "number" }),
      text("priceCurrency", "Currency", { placeholder: "USD" }),
    ],
    build: (v) =>
      pruneEmpty({
        "@context": "https://schema.org",
        "@type": "Event",
        name: v.name,
        description: v.description,
        startDate: v.startDate,
        endDate: v.endDate,
        url: v.url,
        location: {
          "@type": "Place",
          name: v.locationName,
          address: {
            "@type": "PostalAddress",
            streetAddress: v.streetAddress,
            addressLocality: v.addressLocality,
            addressCountry: v.addressCountry,
          },
        },
        offers: {
          "@type": "Offer",
          price: v.price,
          priceCurrency: v.priceCurrency,
          url: v.url,
        },
      }),
  },
  {
    id: "Recipe",
    label: "Recipe",
    description: "Cooking and baking pages.",
    fields: [
      text("name", "Recipe name", { required: true }),
      text("description", "Description", { type: "textarea" }),
      text("authorName", "Author", { required: true }),
      text("image", "Image URL", { type: "url", required: true }),
      text("prepTime", "Prep time", { placeholder: "PT20M", hint: "ISO 8601 duration, e.g. PT20M." }),
      text("cookTime", "Cook time", { placeholder: "PT45M" }),
      text("recipeYield", "Yield", { placeholder: "4 servings" }),
      text("ingredients", "Ingredients", {
        type: "textarea",
        required: true,
        hint: "One per line.",
      }),
      text("instructions", "Instructions", {
        type: "textarea",
        required: true,
        hint: "One step per line.",
      }),
    ],
    build: (v) =>
      pruneEmpty({
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: v.name,
        description: v.description,
        image: v.image,
        author: { "@type": "Person", name: v.authorName },
        prepTime: v.prepTime,
        cookTime: v.cookTime,
        recipeYield: v.recipeYield,
        recipeIngredient: splitLines(v.ingredients),
        recipeInstructions: splitLines(v.instructions).map((step) => ({
          "@type": "HowToStep",
          text: step,
        })),
      }),
  },
  {
    id: "Person",
    label: "Person",
    description: "Author bios, team members and profile pages.",
    fields: [
      text("name", "Full name", { required: true }),
      text("jobTitle", "Job title"),
      text("description", "Bio", { type: "textarea" }),
      text("image", "Photo URL", { type: "url" }),
      text("url", "Profile URL", { type: "url" }),
      text("worksFor", "Organisation"),
      text("sameAs", "Profile links", {
        type: "textarea",
        hint: "One URL per line — social or professional profiles.",
      }),
    ],
    build: (v) =>
      pruneEmpty({
        "@context": "https://schema.org",
        "@type": "Person",
        name: v.name,
        jobTitle: v.jobTitle,
        description: v.description,
        image: v.image,
        url: v.url,
        worksFor: { "@type": "Organization", name: v.worksFor },
        sameAs: splitLines(v.sameAs),
      }),
  },
  {
    id: "Organization",
    label: "Organisation",
    description: "Company home and about pages.",
    fields: [
      text("name", "Organisation name", { required: true }),
      text("url", "Website", { type: "url", required: true }),
      text("logo", "Logo URL", { type: "url" }),
      text("description", "Description", { type: "textarea" }),
      text("telephone", "Phone"),
      text("email", "Email"),
      text("sameAs", "Social profiles", {
        type: "textarea",
        hint: "One URL per line.",
      }),
    ],
    build: (v) =>
      pruneEmpty({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: v.name,
        url: v.url,
        logo: v.logo,
        description: v.description,
        telephone: v.telephone,
        email: v.email,
        sameAs: splitLines(v.sameAs),
      }),
  },
];

/** Splits a textarea into trimmed, non-empty lines. */
function splitLines(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function getSchemaType(id: string): SchemaTypeDefinition {
  return SCHEMA_TYPES.find((type) => type.id === id) ?? SCHEMA_TYPES[0];
}
