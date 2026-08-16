import ImageWatermarkTool from "./ImageWatermarkTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("image-watermark");

export default function ImageWatermarkPage() {
  return (
    <ImageToolPage slug="image-watermark">
      <ImageWatermarkTool />
    </ImageToolPage>
  );
}
