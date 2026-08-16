import CaseConverterTool from "./CaseConverterTool";
import TextToolPage from "@/components/text/TextToolPage";
import { buildTextToolMetadata } from "@/lib/text/metadata";

export const metadata = buildTextToolMetadata("case-converter");

export default function CaseConverterPage() {
  return (
    <TextToolPage slug="case-converter">
      <CaseConverterTool />
    </TextToolPage>
  );
}
