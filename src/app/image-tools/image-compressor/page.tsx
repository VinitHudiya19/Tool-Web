import BatchImageTool from "@/components/image/BatchImageTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("image-compressor");

export default function ImageCompressorPage() {
  return (
    <ImageToolPage slug="image-compressor">
      <BatchImageTool mode="compress" defaultFormat="jpeg" allowKeepFormat />
    </ImageToolPage>
  );
}
