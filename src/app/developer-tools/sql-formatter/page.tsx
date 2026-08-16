import CodeFormatterTool from "@/components/dev/CodeFormatterTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("sql-formatter");

export default function SqlFormatterPage() {
  return (
    <DevToolPage slug="sql-formatter">
      <CodeFormatterTool language="sql" minifiable={false} />
    </DevToolPage>
  );
}
