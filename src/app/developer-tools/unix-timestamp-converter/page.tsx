import TimestampTool from "./TimestampTool";
import DevToolPage from "@/components/dev/DevToolPage";
import { buildDevToolMetadata } from "@/lib/dev/metadata";

export const metadata = buildDevToolMetadata("unix-timestamp-converter");

export default function UnixTimestampConverterPage() {
  return (
    <DevToolPage slug="unix-timestamp-converter">
      <TimestampTool />
    </DevToolPage>
  );
}
