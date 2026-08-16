import SvgToPngTool from "./SvgToPngTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("svg-to-png");

export default function SvgToPngPage() {
  return (
    <ImageToolPage slug="svg-to-png">
      <SvgToPngTool />
    </ImageToolPage>
  );
}
