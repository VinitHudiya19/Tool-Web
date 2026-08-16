import PdfToolPage from "@/components/pdf/PdfToolPage";
import { buildPdfToolMetadata } from "@/lib/pdf/metadata";
import UnlockTool from "./UnlockTool";

export const metadata = buildPdfToolMetadata("unlock-pdf");

export default function UnlockPdfPage() {
  return (
    <PdfToolPage slug="unlock-pdf">
      <UnlockTool />
    </PdfToolPage>
  );
}
