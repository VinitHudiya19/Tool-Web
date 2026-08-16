import BatchImageTool from "@/components/image/BatchImageTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("avif-converter");

export default function AvifConverterPage() {
  return (
    <ImageToolPage slug="avif-converter">
      <BatchImageTool
        mode="convert"
        defaultFormat="avif"
        formats={["avif", "webp", "jpeg", "png"]}
      />
    </ImageToolPage>
  );
}
