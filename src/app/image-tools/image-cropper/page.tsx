import ImageCropperTool from "./ImageCropperTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("image-cropper");

export default function ImageCropperPage() {
  return (
    <ImageToolPage slug="image-cropper">
      <ImageCropperTool />
    </ImageToolPage>
  );
}
