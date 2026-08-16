import PdfToolPage from "@/components/pdf/PdfToolPage";
import { buildPdfToolMetadata } from "@/lib/pdf/metadata";
import DeleteTool from "./DeleteTool";

export const metadata = buildPdfToolMetadata("delete-pdf-pages");

export default function DeletePdfPagesPage() {
  return (
    <PdfToolPage slug="delete-pdf-pages">
      <DeleteTool />
    </PdfToolPage>
  );
}
