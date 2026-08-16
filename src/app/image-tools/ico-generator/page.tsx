import IcoGeneratorTool from "./IcoGeneratorTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("ico-generator");

export default function IcoGeneratorPage() {
  return (
    <ImageToolPage slug="ico-generator">
      <IcoGeneratorTool />
    </ImageToolPage>
  );
}
