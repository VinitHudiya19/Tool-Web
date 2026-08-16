import CodeFormatterTool from "@/components/dev/CodeFormatterTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("css-formatter");

export default function CssFormatterPage() {
  return (
    <DevToolPage slug="css-formatter">
      <CodeFormatterTool language="css" />
    </DevToolPage>
  );
}
