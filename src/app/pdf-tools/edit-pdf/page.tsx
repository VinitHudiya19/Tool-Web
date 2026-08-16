import PdfToolPage from "@/components/pdf/PdfToolPage";
import { buildPdfToolMetadata } from "@/lib/pdf/metadata";
import EditTool from "./EditTool";

export const metadata = buildPdfToolMetadata("edit-pdf");

export default function EditPdfPage() {
  return (
    <PdfToolPage slug="edit-pdf">
      <EditTool />
    </PdfToolPage>
  );
}
