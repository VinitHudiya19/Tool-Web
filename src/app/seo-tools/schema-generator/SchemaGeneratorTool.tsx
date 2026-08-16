"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";

import {
  CodeOutput,
  EmptyState,
  Field,
  TextArea,
  TextInput,
  ToolShell,
} from "@/components/seo-tools/ui";
import { toScriptTag } from "@/lib/seo-tools/jsonLd";
import { getSchemaType, SCHEMA_TYPES } from "@/lib/seo-tools/schemaTypes";

export default function SchemaGeneratorTool() {
  const [typeId, setTypeId] = useState(SCHEMA_TYPES[0].id);
  // Values are kept per type so switching back does not lose what you typed.
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});

  const definition = getSchemaType(typeId);
  // Memoised so the fallback object does not create a new identity each render
  // and re-run the derived memos below.
  const current = useMemo(() => values[typeId] ?? {}, [values, typeId]);

  const setValue = (name: string, value: string) =>
    setValues((all) => ({
      ...all,
      [typeId]: { ...(all[typeId] ?? {}), [name]: value },
    }));

  const missingRequired = useMemo(
    () =>
      definition.fields.filter(
        (field) => field.required && !(current[field.name] ?? "").trim(),
      ),
    [definition, current],
  );

  const hasAnyValue = Object.values(current).some((value) => value.trim());

  const code = useMemo(() => {
    if (!hasAnyValue) return "";
    return toScriptTag(definition.build(current));
  }, [definition, current, hasAnyValue]);

  return (
    <ToolShell>
      {/* Type selection */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
          Schema type
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SCHEMA_TYPES.map((type) => {
            const isActive = type.id === typeId;
            return (
              <label
                key={type.id}
                title={type.description}
                className={`flex cursor-pointer flex-col rounded-custom-sm border p-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary ${
                  isActive ? "bg-surface" : "border-border-custom bg-bg hover:bg-surface"
                }`}
                style={isActive ? { borderColor: "var(--cat-accent)" } : undefined}
              >
                <input
                  type="radio"
                  name="schema-type"
                  value={type.id}
                  checked={isActive}
                  onChange={() => setTypeId(type.id)}
                  className="sr-only"
                />
                <span
                  className="text-sm font-semibold"
                  style={isActive ? { color: "var(--cat-accent)" } : undefined}
                >
                  {type.label}
                </span>
                <span className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-text-2">
                  {type.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Fields for the selected type */}
      <div className="grid gap-4 border-t border-border-custom pt-6 sm:grid-cols-2">
        {definition.fields.map((field) => {
          const id = `${typeId}-${field.name}`;
          const value = current[field.name] ?? "";
          const isTextarea = field.type === "textarea";

          return (
            <div key={field.name} className={isTextarea ? "sm:col-span-2" : undefined}>
              <Field
                id={id}
                label={field.label}
                required={field.required}
                hint={field.hint}
              >
                {isTextarea ? (
                  <TextArea
                    id={id}
                    value={value}
                    onChange={(next) => setValue(field.name, next)}
                    placeholder={field.placeholder}
                    rows={field.name === "instructions" ? 5 : 3}
                  />
                ) : (
                  <TextInput
                    id={id}
                    type={field.type === "date" ? "date" : "text"}
                    value={value}
                    onChange={(next) => setValue(field.name, next)}
                    placeholder={field.placeholder}
                  />
                )}
              </Field>
            </div>
          );
        })}
      </div>

      {/* Google needs these for rich results, so say so before the validator does */}
      {hasAnyValue && missingRequired.length > 0 && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-custom-sm border border-amber-200 bg-amber-50 p-4"
        >
          <AlertCircle size={16} className="mt-px shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-amber-800">
            <strong className="font-semibold">
              Missing {missingRequired.length} field
              {missingRequired.length === 1 ? "" : "s"} Google needs
            </strong>{" "}
            for {definition.label} rich results:{" "}
            {missingRequired.map((field) => field.label).join(", ")}. The markup is
            still valid without them, but it will not be eligible.
          </p>
        </div>
      )}

      <div className="border-t border-border-custom pt-6">
        {code ? (
          <CodeOutput
            code={code}
            fileName={`${typeId.toLowerCase()}-schema.html`}
            label={`${definition.label} JSON-LD`}
            language="html"
          />
        ) : (
          <EmptyState message="Fill in at least one field to generate the markup." />
        )}
      </div>
    </ToolShell>
  );
}
