import SeoToolPage from "@/components/seo-tools/SeoToolPage";
import { buildSeoToolMetadata } from "@/lib/seo-tools/metadata";
import MetaTitleTool from "./MetaTitleTool";

export const metadata = buildSeoToolMetadata("meta-title-generator");

export default function MetaTitleGeneratorPage() {
  return (
    <SeoToolPage slug="meta-title-generator">
      <MetaTitleTool />
    </SeoToolPage>
  );
}
