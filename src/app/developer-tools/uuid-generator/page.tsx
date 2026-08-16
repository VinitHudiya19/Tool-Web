import UuidGeneratorTool from "./UuidGeneratorTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("uuid-generator");

export default function UuidGeneratorPage() {
  return (
    <DevToolPage slug="uuid-generator">
      <UuidGeneratorTool />
    </DevToolPage>
  );
}
