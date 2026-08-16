import PdfToolPage from "@/components/pdf/PdfToolPage";
import { buildPdfToolMetadata } from "@/lib/pdf/metadata";
import SplitTool from "./SplitTool";

export const metadata = buildPdfToolMetadata("split-pdf");

export default function SplitPdfPage() {
  return (
    <PdfToolPage slug="split-pdf">
      <SplitTool />
    </PdfToolPage>
  );
}
