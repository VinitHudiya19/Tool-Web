import PdfToolPage from "@/components/pdf/PdfToolPage";
import { buildPdfToolMetadata } from "@/lib/pdf/metadata";
import PdfToJpgTool from "./PdfToJpgTool";

export const metadata = buildPdfToolMetadata("pdf-to-jpg");

export default function PdfToJpgPage() {
  return (
    <PdfToolPage slug="pdf-to-jpg">
      <PdfToJpgTool />
    </PdfToolPage>
  );
}
