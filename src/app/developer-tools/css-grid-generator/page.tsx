import CssGridTool from "./CssGridTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("css-grid-generator");

export default function CssGridGeneratorPage() {
  return (
    <DevToolPage slug="css-grid-generator">
      <CssGridTool />
    </DevToolPage>
  );
}
