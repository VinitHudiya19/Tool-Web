import PdfToolPage from "@/components/pdf/PdfToolPage";
import { buildPdfToolMetadata } from "@/lib/pdf/metadata";
import ProtectTool from "./ProtectTool";

export const metadata = buildPdfToolMetadata("protect-pdf");

export default function ProtectPdfPage() {
  return (
    <PdfToolPage slug="protect-pdf">
      <ProtectTool />
    </PdfToolPage>
  );
}
