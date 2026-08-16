import CodeFormatterTool from "@/components/dev/CodeFormatterTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("xml-formatter");

export default function XmlFormatterPage() {
  return (
    <DevToolPage slug="xml-formatter">
      <CodeFormatterTool language="xml" />
    </DevToolPage>
  );
}
