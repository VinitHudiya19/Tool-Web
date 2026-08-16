import SvgOptimizerTool from "./SvgOptimizerTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("svg-optimizer");

export default function SvgOptimizerPage() {
  return (
    <ImageToolPage slug="svg-optimizer">
      <SvgOptimizerTool />
    </ImageToolPage>
  );
}
