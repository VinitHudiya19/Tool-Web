import QrCodeTool from "./QrCodeTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("qr-code-generator");

export default function QrCodeGeneratorPage() {
  return (
    <DevToolPage slug="qr-code-generator">
      <QrCodeTool />
    </DevToolPage>
  );
}
