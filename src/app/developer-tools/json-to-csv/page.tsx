import JsonToCsvTool from "./JsonToCsvTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("json-to-csv");

export default function JsonToCsvPage() {
  return (
    <DevToolPage slug="json-to-csv">
      <JsonToCsvTool />
    </DevToolPage>
  );
}
