import Base64Tool from "./Base64Tool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("base64-encoder");

export default function Base64EncoderPage() {
  return (
    <DevToolPage slug="base64-encoder">
      <Base64Tool />
    </DevToolPage>
  );
}
