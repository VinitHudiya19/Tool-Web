import SeoToolPage from "@/components/seo-tools/SeoToolPage";
import { buildSeoToolMetadata } from "@/lib/seo-tools/metadata";
import FaqSchemaTool from "./FaqSchemaTool";

export const metadata = buildSeoToolMetadata("faq-schema-generator");

export default function FaqSchemaGeneratorPage() {
  return (
    <SeoToolPage slug="faq-schema-generator">
      <FaqSchemaTool />
    </SeoToolPage>
  );
}
