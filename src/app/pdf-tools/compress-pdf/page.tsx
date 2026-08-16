import PdfToolPage from "@/components/pdf/PdfToolPage";
import { buildPdfToolMetadata } from "@/lib/pdf/metadata";
import CompressTool from "./CompressTool";

export const metadata = buildPdfToolMetadata("compress-pdf");

export default function CompressPdfPage() {
  return (
    <PdfToolPage slug="compress-pdf">
      <CompressTool />
    </PdfToolPage>
  );
}
