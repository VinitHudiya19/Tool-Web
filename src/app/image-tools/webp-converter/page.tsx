import BatchImageTool from "@/components/image/BatchImageTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("webp-converter");

export default function WebpConverterPage() {
  return (
    <ImageToolPage slug="webp-converter">
      {/* AVIF is left out here — this tool is about WebP in both directions. */}
      <BatchImageTool
        mode="convert"
        defaultFormat="webp"
        formats={["webp", "jpeg", "png"]}
      />
    </ImageToolPage>
  );
}
