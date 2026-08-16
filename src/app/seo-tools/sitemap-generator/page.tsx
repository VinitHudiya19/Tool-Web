import SeoToolPage from "@/components/seo-tools/SeoToolPage";
import { buildSeoToolMetadata } from "@/lib/seo-tools/metadata";
import SitemapTool from "./SitemapTool";

export const metadata = buildSeoToolMetadata("sitemap-generator");

export default function SitemapGeneratorPage() {
  return (
    <SeoToolPage slug="sitemap-generator">
      <SitemapTool />
    </SeoToolPage>
  );
}
