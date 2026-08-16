import CodeFormatterTool from "@/components/dev/CodeFormatterTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("html-formatter");

export default function HtmlFormatterPage() {
  return (
    <DevToolPage slug="html-formatter">
      <CodeFormatterTool language="html" />
    </DevToolPage>
  );
}
