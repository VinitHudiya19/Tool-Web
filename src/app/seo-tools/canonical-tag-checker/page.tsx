import SeoToolPage from "@/components/seo-tools/SeoToolPage";
import { buildSeoToolMetadata } from "@/lib/seo-tools/metadata";
import CanonicalCheckerTool from "./CanonicalCheckerTool";

export const metadata = buildSeoToolMetadata("canonical-tag-checker");

export default function CanonicalTagCheckerPage() {
  return (
    <SeoToolPage slug="canonical-tag-checker">
      <CanonicalCheckerTool />
    </SeoToolPage>
  );
}
