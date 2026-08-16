import CharacterCounterTool from "./CharacterCounterTool";
import TextToolPage from "@/components/text/TextToolPage";
import { buildTextToolMetadata } from "@/lib/text/metadata";

export const metadata = buildTextToolMetadata("character-counter");

export default function CharacterCounterPage() {
  return (
    <TextToolPage slug="character-counter">
      <CharacterCounterTool />
    </TextToolPage>
  );
}
