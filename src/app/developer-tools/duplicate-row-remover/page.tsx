import DuplicateRemoverTool from "./DuplicateRemoverTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("duplicate-row-remover");

export default function DuplicateRowRemoverPage() {
  return (
    <DevToolPage slug="duplicate-row-remover">
      <DuplicateRemoverTool />
    </DevToolPage>
  );
}
