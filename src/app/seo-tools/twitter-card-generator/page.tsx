import SeoToolPage from "@/components/seo-tools/SeoToolPage";
import { buildSeoToolMetadata } from "@/lib/seo-tools/metadata";
import TwitterCardTool from "./TwitterCardTool";

export const metadata = buildSeoToolMetadata("twitter-card-generator");

export default function TwitterCardGeneratorPage() {
  return (
    <SeoToolPage slug="twitter-card-generator">
      <TwitterCardTool />
    </SeoToolPage>
  );
}
