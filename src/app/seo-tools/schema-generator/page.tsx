import SeoToolPage from "@/components/seo-tools/SeoToolPage";
import { buildSeoToolMetadata } from "@/lib/seo-tools/metadata";
import SchemaGeneratorTool from "./SchemaGeneratorTool";

export const metadata = buildSeoToolMetadata("schema-generator");

export default function SchemaGeneratorPage() {
  return (
    <SeoToolPage slug="schema-generator">
      <SchemaGeneratorTool />
    </SeoToolPage>
  );
}
