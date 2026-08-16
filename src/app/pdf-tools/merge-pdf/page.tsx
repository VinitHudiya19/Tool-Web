import PdfToolPage from "@/components/pdf/PdfToolPage";
import { buildPdfToolMetadata } from "@/lib/pdf/metadata";
import MergeTool from "./MergeTool";

export const metadata = buildPdfToolMetadata("merge-pdf");

export default function MergePdfPage() {
  return (
    <PdfToolPage slug="merge-pdf">
      <MergeTool />
    </PdfToolPage>
  );
}
