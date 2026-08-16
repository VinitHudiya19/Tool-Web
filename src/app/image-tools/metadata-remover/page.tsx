import MetadataRemoverTool from "./MetadataRemoverTool";
import ImageToolPage from "@/components/image/ImageToolPage";
import { buildImageToolMetadata } from "@/lib/image/metadata";

export const metadata = buildImageToolMetadata("metadata-remover");

export default function MetadataRemoverPage() {
  return (
    <ImageToolPage slug="metadata-remover">
      <MetadataRemoverTool />
    </ImageToolPage>
  );
}
