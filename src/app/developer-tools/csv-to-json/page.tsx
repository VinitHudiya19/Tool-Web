import CsvToJsonTool from "./CsvToJsonTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("csv-to-json");

export default function CsvToJsonPage() {
  return (
    <DevToolPage slug="csv-to-json">
      <CsvToJsonTool />
    </DevToolPage>
  );
}
