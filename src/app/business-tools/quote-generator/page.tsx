import BusinessToolPage from "@/components/business/BusinessToolPage";
import DocumentBuilder from "@/components/business/DocumentBuilder";
import { buildBusinessToolMetadata } from "@/lib/business/metadata";

export const metadata = buildBusinessToolMetadata("quote-generator");

export default function QuoteGeneratorPage() {
  return (
    <BusinessToolPage slug="quote-generator">
      <DocumentBuilder kind="quote" />
    </BusinessToolPage>
  );
}
