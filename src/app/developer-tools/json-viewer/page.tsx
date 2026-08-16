import JsonViewerTool from "./JsonViewerTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("json-viewer");

export default function JsonViewerPage() {
  return (
    <DevToolPage slug="json-viewer">
      <JsonViewerTool />
    </DevToolPage>
  );
}
