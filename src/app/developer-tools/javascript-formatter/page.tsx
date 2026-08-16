import CodeFormatterTool from "@/components/dev/CodeFormatterTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("javascript-formatter");

export default function JavaScriptFormatterPage() {
  return (
    <DevToolPage slug="javascript-formatter">
      <CodeFormatterTool language="javascript" />
    </DevToolPage>
  );
}
