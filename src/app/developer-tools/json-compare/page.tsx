import JsonCompareTool from "./JsonCompareTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("json-compare");

export default function JsonComparePage() {
  return (
    <DevToolPage slug="json-compare">
      <JsonCompareTool />
    </DevToolPage>
  );
}
