import HashGeneratorTool from "./HashGeneratorTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("hash-generator");

export default function HashGeneratorPage() {
  return (
    <DevToolPage slug="hash-generator">
      <HashGeneratorTool />
    </DevToolPage>
  );
}
