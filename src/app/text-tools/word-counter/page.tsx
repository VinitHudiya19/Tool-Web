import WordCounterTool from "./WordCounterTool";
import TextToolPage from "@/components/text/TextToolPage";
import { buildTextToolMetadata } from "@/lib/text/metadata";

export const metadata = buildTextToolMetadata("word-counter");

export default function WordCounterPage() {
  return (
    <TextToolPage slug="word-counter">
      <WordCounterTool />
    </TextToolPage>
  );
}
