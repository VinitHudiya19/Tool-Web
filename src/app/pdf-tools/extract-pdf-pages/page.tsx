import PdfToolPage from "@/components/pdf/PdfToolPage";
import { buildPdfToolMetadata } from "@/lib/pdf/metadata";
import ExtractTool from "./ExtractTool";

export const metadata = buildPdfToolMetadata("extract-pdf-pages");

export default function ExtractPdfPagesPage() {
  return (
    <PdfToolPage slug="extract-pdf-pages">
      <ExtractTool />
    </PdfToolPage>
  );
}
