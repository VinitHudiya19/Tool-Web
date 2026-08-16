import ColorPickerTool from "./ColorPickerTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("color-picker");

export default function ColorPickerPage() {
  return (
    <ImageToolPage slug="color-picker">
      <ColorPickerTool />
    </ImageToolPage>
  );
}
