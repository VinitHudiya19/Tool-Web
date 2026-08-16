import BusinessToolPage from "@/components/business/BusinessToolPage";
import DocumentBuilder from "@/components/business/DocumentBuilder";
import { buildBusinessToolMetadata } from "@/lib/business/metadata";

export const metadata = buildBusinessToolMetadata("receipt-generator");

export default function ReceiptGeneratorPage() {
  return (
    <BusinessToolPage slug="receipt-generator">
      <DocumentBuilder kind="receipt" />
    </BusinessToolPage>
  );
}
