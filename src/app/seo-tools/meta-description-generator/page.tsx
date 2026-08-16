import SeoToolPage from "@/components/seo-tools/SeoToolPage";
import { buildSeoToolMetadata } from "@/lib/seo-tools/metadata";
import MetaDescriptionTool from "./MetaDescriptionTool";

export const metadata = buildSeoToolMetadata("meta-description-generator");

export default function MetaDescriptionGeneratorPage() {
  return (
    <SeoToolPage slug="meta-description-generator">
      <MetaDescriptionTool />
    </SeoToolPage>
  );
}
