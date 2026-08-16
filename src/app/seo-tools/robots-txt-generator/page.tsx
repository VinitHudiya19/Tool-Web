import SeoToolPage from "@/components/seo-tools/SeoToolPage";
import { buildSeoToolMetadata } from "@/lib/seo-tools/metadata";
import RobotsTool from "./RobotsTool";

export const metadata = buildSeoToolMetadata("robots-txt-generator");

export default function RobotsTxtGeneratorPage() {
  return (
    <SeoToolPage slug="robots-txt-generator">
      <RobotsTool />
    </SeoToolPage>
  );
}
