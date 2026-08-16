import SeoToolPage from "@/components/seo-tools/SeoToolPage";
import { buildSeoToolMetadata } from "@/lib/seo-tools/metadata";
import OpenGraphTool from "./OpenGraphTool";

export const metadata = buildSeoToolMetadata("open-graph-generator");

export default function OpenGraphGeneratorPage() {
  return (
    <SeoToolPage slug="open-graph-generator">
      <OpenGraphTool />
    </SeoToolPage>
  );
}
