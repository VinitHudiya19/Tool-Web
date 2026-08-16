"use client";

import { useCallback, useEffect, useState } from "react";

import TransformTool, { type TransformOutcome } from "./TransformTool";
import { OptionGroup, Toggle } from "./ui";
import {
  minifyCss,
  minifyHtml,
  minifyJavaScript,
  minifyXml,
  type MinifyResult,
} from "@/lib/dev/minify";

export type CodeLanguage = "javascript" | "css" | "html" | "xml" | "sql";

type Mode = "beautify" | "minify";

const MINIFIERS: Record<
  Exclude<CodeLanguage, "sql">,
  (source: string, options: { removeComments: boolean }) => MinifyResult
> = {
  javascript: minifyJavaScript,
  css: minifyCss,
  html: minifyHtml,
  xml: minifyXml,
};

const EXTENSIONS: Record<CodeLanguage, string> = {
  javascript: "js",
  css: "css",
  html: "html",
  xml: "xml",
  sql: "sql",
};

/** SQL dialects that behave differently enough to matter. */
const SQL_DIALECTS = [
  { id: "postgresql", label: "PostgreSQL", hint: "Uses $1 placeholders and double-quoted identifiers." },
  { id: "mysql", label: "MySQL", hint: "Uses ? placeholders and backtick-quoted identifiers." },
  { id: "sqlite", label: "SQLite", hint: "Close to PostgreSQL, with a smaller keyword set." },
  { id: "transactsql", label: "T-SQL", hint: "SQL Server, using @name placeholders and brackets." },
] as const;

type SqlDialect = (typeof SQL_DIALECTS)[number]["id"];

/**
 * Shared implementation for the five code formatters.
 *
 * They differ only in which library formats them and which minifier applies,
 * so sharing one component keeps the input handling, error reporting and byte
 * counts identical rather than reimplemented five times.
 */
export default function CodeFormatterTool({
  language,
  minifiable = true,
}: {
  language: CodeLanguage;
  minifiable?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("beautify");
  const [indent, setIndent] = useState("2");
  const [removeComments, setRemoveComments] = useState(true);
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);
  const [dialect, setDialect] = useState<SqlDialect>("postgresql");

  // The formatting libraries are async imports, so results arrive after the
  // transform has already run. Keeping the loaded formatter in state lets the
  // synchronous transform below stay simple.
  const [beautifiers, setBeautifiers] = useState<{
    js?: (source: string, options: object) => string;
    css?: (source: string, options: object) => string;
    html?: (source: string, options: object) => string;
    sql?: (source: string, options: object) => string;
    xml?: (source: string, indent: string) => string;
  }>({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (language === "sql") {
        const { format } = await import("sql-formatter");
        if (!cancelled) {
          setBeautifiers({
            sql: (source, options) =>
              format(source, options as Parameters<typeof format>[1]),
          });
        }
        return;
      }

      if (language === "xml") {
        // fast-xml-parser can rebuild a document with indentation, which is
        // safer than a hand-written indenter that has to guess at structure.
        const { XMLParser, XMLBuilder } = await import("fast-xml-parser");
        if (cancelled) return;
        setBeautifiers({
          xml: (source, indentBy) => {
            const options = {
              ignoreAttributes: false,
              preserveOrder: true,
              parseTagValue: false,
              trimValues: false,
            };
            const parsed = new XMLParser(options).parse(source);
            return new XMLBuilder({
              ...options,
              format: true,
              indentBy,
              suppressEmptyNode: false,
            }).build(parsed);
          },
        });
        return;
      }

      const beautify = await import("js-beautify");
      if (cancelled) return;
      setBeautifiers({
        js: beautify.js as never,
        css: beautify.css as never,
        html: beautify.html as never,
      });
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [language]);

  const transform = useCallback(
    (input: string): TransformOutcome => {
      if (mode === "minify" && language !== "sql") {
        const minifier = MINIFIERS[language];
        const result = minifier(input, { removeComments });
        return { output: result.code };
      }

      const indentSize = indent === "tab" ? 1 : Number.parseInt(indent, 10);
      const useTabs = indent === "tab";

      if (language === "sql") {
        if (!beautifiers.sql) return { output: "", note: "Loading formatter…" };
        return {
          output: beautifiers.sql(input, {
            language: dialect,
            tabWidth: indentSize,
            useTabs,
            keywordCase: uppercaseKeywords ? "upper" : "preserve",
          }),
        };
      }

      if (language === "xml") {
        if (!beautifiers.xml) return { output: "", note: "Loading formatter…" };
        return {
          output: beautifiers.xml(input, useTabs ? "\t" : " ".repeat(indentSize)),
        };
      }

      const options = {
        indent_size: indentSize,
        indent_with_tabs: useTabs,
        end_with_newline: true,
        preserve_newlines: true,
        max_preserve_newlines: 2,
      };

      const beautifier =
        language === "javascript"
          ? beautifiers.js
          : language === "css"
            ? beautifiers.css
            : beautifiers.html;

      if (!beautifier) return { output: "", note: "Loading formatter…" };
      return { output: beautifier(input, options) };
    },
    [mode, language, removeComments, indent, dialect, uppercaseKeywords, beautifiers],
  );

  const controls = (
    <div className="space-y-4">
      {minifiable && language !== "sql" && (
        <OptionGroup<Mode>
          legend="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { id: "beautify", label: "Beautify", hint: "Reindent so the structure is readable." },
            {
              id: "minify",
              label: "Minify",
              hint: "Strip whitespace and comments without touching string or literal contents.",
            },
          ]}
        />
      )}

      {language === "sql" && (
        <OptionGroup<SqlDialect>
          legend="Dialect"
          value={dialect}
          onChange={setDialect}
          options={SQL_DIALECTS.map((entry) => ({ ...entry }))}
        />
      )}

      <div className="flex flex-wrap items-end gap-4">
        {mode === "beautify" && (
          <OptionGroup
            legend="Indent"
            value={indent}
            onChange={setIndent}
            options={[
              { id: "2", label: "2 spaces" },
              { id: "4", label: "4 spaces" },
              { id: "tab", label: "Tabs" },
            ]}
          />
        )}
      </div>

      {mode === "minify" && (
        <Toggle
          checked={removeComments}
          onChange={setRemoveComments}
          label="Remove comments"
          hint={
            language === "css"
              ? "Licence comments starting /*! are always kept."
              : language === "html"
                ? "Conditional comments are always kept."
                : "Comment markers inside strings are never touched."
          }
        />
      )}

      {language === "sql" && (
        <Toggle
          checked={uppercaseKeywords}
          onChange={setUppercaseKeywords}
          label="Uppercase keywords"
          hint="Conventional, and makes clause boundaries easier to scan."
        />
      )}
    </div>
  );

  return (
    <TransformTool
      transform={transform}
      controls={controls}
      inputLabel="Input"
      outputLabel={mode === "minify" ? "Minified" : "Formatted"}
      placeholder={`Paste your ${language === "sql" ? "SQL" : language.toUpperCase()} here.`}
      downloadName={`formatted.${EXTENSIONS[language]}`}
      canSwap
      rows={14}
    />
  );
}
