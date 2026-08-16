import UrlEncoderTool from "./UrlEncoderTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("url-encoder");

export default function UrlEncoderPage() {
  return (
    <DevToolPage slug="url-encoder">
      <UrlEncoderTool />
    </DevToolPage>
  );
}
