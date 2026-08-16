"use client";

import { useCallback, useState } from "react";

import TransformTool, { type TransformOutcome } from "@/components/dev/TransformTool";
import { OptionGroup, Toggle } from "@/components/dev/ui";
import { decodeBase64, encodeBase64 } from "@/lib/dev/encoding";

type Direction = "encode" | "decode";

export default function Base64Tool() {
  const [direction, setDirection] = useState<Direction>("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [lineBreaks, setLineBreaks] = useState(false);

  const transform = useCallback(
    (input: string): TransformOutcome => {
      if (direction === "decode") {
        // Throws a DecodeError with a readable message, which TransformTool
        // surfaces where the output would be.
        const { output } = decodeBase64(input);
        return { output };
      }

      const { output, inputBytes, outputBytes } = encodeBase64(input, {
        urlSafe,
        lineBreaks,
      });

      return {
        output,
        stats: [
          {
            label: "Growth",
            value: `${Math.round((outputBytes / Math.max(inputBytes, 1) - 1) * 100)}%`,
            hint: "Base64 always grows data",
          },
        ],
      };
    },
    [direction, urlSafe, lineBreaks],
  );

  return (
    <TransformTool
      transform={transform}
      canSwap
      inputLabel={direction === "encode" ? "Text to encode" : "Base64 to decode"}
      outputLabel={direction === "encode" ? "Base64" : "Decoded text"}
      placeholder={
        direction === "encode"
          ? "Type or paste any text, including emoji."
          : "Paste Base64. Line breaks and whitespace are ignored."
      }
      downloadName={direction === "encode" ? "encoded.txt" : "decoded.txt"}
      showByteCounts={false}
      controls={
        <div className="space-y-4">
          <OptionGroup<Direction>
            legend="Direction"
            value={direction}
            onChange={setDirection}
            options={[
              { id: "encode", label: "Encode", hint: "Turn text into Base64." },
              { id: "decode", label: "Decode", hint: "Turn Base64 back into text." },
            ]}
          />

          {direction === "encode" && (
            <div className="grid gap-2 sm:grid-cols-2">
              <Toggle
                checked={urlSafe}
                onChange={setUrlSafe}
                label="URL-safe output"
                hint="Uses - and _ instead of + and /, and drops the padding."
              />
              <Toggle
                checked={lineBreaks}
                onChange={setLineBreaks}
                label="Wrap at 76 characters"
                hint="The MIME convention, used in email and certificates."
              />
            </div>
          )}
        </div>
      }
    />
  );
}
