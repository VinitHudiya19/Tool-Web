import FlexboxTool from "./FlexboxTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("flexbox-generator");

export default function FlexboxGeneratorPage() {
  return (
    <DevToolPage slug="flexbox-generator">
      <FlexboxTool />
    </DevToolPage>
  );
}
