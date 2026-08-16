import BusinessToolPage from "@/components/business/BusinessToolPage";
import DocumentBuilder from "@/components/business/DocumentBuilder";
import { buildBusinessToolMetadata } from "@/lib/business/metadata";

export const metadata = buildBusinessToolMetadata("invoice-generator");

export default function InvoiceGeneratorPage() {
  return (
    <BusinessToolPage slug="invoice-generator">
      <DocumentBuilder kind="invoice" />
    </BusinessToolPage>
  );
}
