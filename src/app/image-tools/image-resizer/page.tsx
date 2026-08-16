import BatchImageTool from "@/components/image/BatchImageTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("image-resizer");

export default function ImageResizerPage() {
  return (
    <ImageToolPage slug="image-resizer">
      <BatchImageTool mode="resize" defaultFormat="jpeg" allowKeepFormat />
    </ImageToolPage>
  );
}
