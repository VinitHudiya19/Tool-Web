import BarcodeTool from "./BarcodeTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("barcode-generator");

export default function BarcodeGeneratorPage() {
  return (
    <DevToolPage slug="barcode-generator">
      <BarcodeTool />
    </DevToolPage>
  );
}
