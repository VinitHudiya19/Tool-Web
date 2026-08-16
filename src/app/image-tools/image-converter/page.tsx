import BatchImageTool from "@/components/image/BatchImageTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("image-converter");

export default function ImageConverterPage() {
  return (
    <ImageToolPage slug="image-converter">
      <BatchImageTool mode="convert" defaultFormat="webp" />
    </ImageToolPage>
  );
}
