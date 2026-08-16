import PdfToolPage from "@/components/pdf/PdfToolPage";
import { buildPdfToolMetadata } from "@/lib/pdf/metadata";
import JpgToPdfTool from "./JpgToPdfTool";

export const metadata = buildPdfToolMetadata("jpg-to-pdf");

export default function JpgToPdfPage() {
  return (
    <PdfToolPage slug="jpg-to-pdf">
      <JpgToPdfTool />
    </PdfToolPage>
  );
}
