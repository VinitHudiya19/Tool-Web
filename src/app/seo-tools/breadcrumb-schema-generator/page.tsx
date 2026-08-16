import SeoToolPage from "@/components/seo-tools/SeoToolPage";
import { buildSeoToolMetadata } from "@/lib/seo-tools/metadata";
import BreadcrumbSchemaTool from "./BreadcrumbSchemaTool";

export const metadata = buildSeoToolMetadata("breadcrumb-schema-generator");

export default function BreadcrumbSchemaGeneratorPage() {
  return (
    <SeoToolPage slug="breadcrumb-schema-generator">
      <BreadcrumbSchemaTool />
    </SeoToolPage>
  );
}
