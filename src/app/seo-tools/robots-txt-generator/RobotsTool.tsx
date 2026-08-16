"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Check, Plus, Trash2, X } from "lucide-react";

import {
  CodeOutput,
  Field,
  TextArea,
  TextInput,
  ToolShell,
} from "@/components/seo-tools/ui";
import {
  CRAWLER_PRESETS,
  findWarnings,
  renderRobotsTxt,
  testPath,
  type RuleGroup,
} from "@/lib/seo-tools/robots";

const newGroup = (userAgent = "*"): RuleGroup => ({
  id: crypto.randomUUID(),
  userAgent,
  disallow: [""],
  allow: [],
  crawlDelay: "",
});

export default function RobotsTool() {
  const [groups, setGroups] = useState<RuleGroup[]>(() => [
    { ...newGroup("*"), disallow: ["/admin/", "/cart/"] },
  ]);
  const [sitemapText, setSitemapText] = useState("");
  const [testUrl, setTestUrl] = useState("/admin/settings");
  const [testAgent, setTestAgent] = useState("Googlebot");

  const sitemaps = useMemo(
    () => sitemapText.split("\n").map((line) => line.trim()).filter(Boolean),
    [sitemapText],
  );

  const update = (id: string, patch: Partial<RuleGroup>) =>
    setGroups((current) =>
      current.map((group) => (group.id === id ? { ...group, ...patch } : group)),
    );

  const setPaths = (id: string, key: "disallow" | "allow", value: string) =>
    update(id, { [key]: value.split("\n") } as Partial<RuleGroup>);

  const warnings = useMemo(() => findWarnings(groups, sitemaps), [groups, sitemaps]);
  const code = useMemo(() => renderRobotsTxt(groups, sitemaps), [groups, sitemaps]);
  const match = useMemo(
    () => testPath(groups, testUrl, testAgent),
    [groups, testUrl, testAgent],
  );

  const addPreset = (agents: string[]) => {
    setGroups((current) => {
      const existing = new Set(current.map((g) => g.userAgent.trim().toLowerCase()));
      const additions = agents
        .filter((agent) => !existing.has(agent.toLowerCase()))
        .map((agent) => ({ ...newGroup(agent), disallow: ["/"] }));
      return [...current, ...additions];
    });
  };

  return (
    <ToolShell>
      {/* Rule groups */}
      <div className="space-y-4">
        {groups.map((group, index) => (
          <fieldset
            key={group.id}
            className="rounded-custom-sm border border-border-custom bg-surface p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <legend className="text-xs font-semibold uppercase tracking-wider text-text-2">
                Group {index + 1}
              </legend>
              <button
                type="button"
                onClick={() =>
                  setGroups((current) =>
                    current.length > 1 ? current.filter((g) => g.id !== group.id) : current,
                  )
                }
                disabled={groups.length === 1}
                aria-label={`Remove group ${index + 1}`}
                className="rounded p-1.5 text-text-2 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                id={`agent-${group.id}`}
                label="User-agent"
                hint="Use * for all crawlers. Names must be spelled exactly."
              >
                <TextInput
                  id={`agent-${group.id}`}
                  value={group.userAgent}
                  onChange={(value) => update(group.id, { userAgent: value })}
                  placeholder="*"
                />
              </Field>

              <Field
                id={`delay-${group.id}`}
                label="Crawl-delay"
                hint="Seconds. Google ignores this; Bing honours it."
              >
                <TextInput
                  id={`delay-${group.id}`}
                  value={group.crawlDelay}
                  onChange={(value) => update(group.id, { crawlDelay: value })}
                  placeholder="10"
                />
              </Field>

              <Field
                id={`disallow-${group.id}`}
                label="Disallow paths"
                hint="One per line, starting with /"
              >
                <TextArea
                  id={`disallow-${group.id}`}
                  value={group.disallow.join("\n")}
                  onChange={(value) => setPaths(group.id, "disallow", value)}
                  placeholder={"/admin/\n/cart/"}
                  rows={3}
                />
              </Field>

              <Field
                id={`allow-${group.id}`}
                label="Allow paths"
                hint="Exceptions inside a disallowed folder."
              >
                <TextArea
                  id={`allow-${group.id}`}
                  value={group.allow.join("\n")}
                  onChange={(value) => setPaths(group.id, "allow", value)}
                  placeholder="/admin/public/"
                  rows={3}
                />
              </Field>
            </div>
          </fieldset>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGroups((current) => [...current, newGroup("")])}
          className="inline-flex h-10 items-center gap-2 rounded-custom-sm border border-dashed border-border-custom bg-bg px-4 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Plus size={15} aria-hidden="true" />
          Add group
        </button>

        {CRAWLER_PRESETS.slice(1).map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => addPreset(preset.agents)}
            title={preset.agents.join(", ")}
            className="inline-flex h-10 items-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-4 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Block {preset.label.toLowerCase()}
          </button>
        ))}
      </div>

      <Field
        id="sitemaps"
        label="Sitemap URLs"
        hint="One absolute URL per line. The most useful line in the file."
      >
        <TextArea
          id="sitemaps"
          value={sitemapText}
          onChange={setSitemapText}
          placeholder="https://example.com/sitemap.xml"
          rows={2}
        />
      </Field>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div role="status" className="space-y-2">
          {warnings.map((warning) => (
            <p
              key={warning.message}
              className={`flex items-start gap-2.5 rounded-custom-sm border p-3 text-sm leading-relaxed ${
                warning.tone === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              {warning.message}
            </p>
          ))}
        </div>
      )}

      {/* Path tester */}
      <div className="rounded-custom-md border border-border-custom bg-surface p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
          Test a path
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="test-path" label="URL path">
            <TextInput
              id="test-path"
              value={testUrl}
              onChange={setTestUrl}
              placeholder="/admin/settings"
            />
          </Field>
          <Field id="test-agent" label="Crawler">
            <TextInput id="test-agent" value={testAgent} onChange={setTestAgent} />
          </Field>
        </div>

        <p
          aria-live="polite"
          className={`mt-3 flex items-start gap-2 text-sm font-medium ${
            match.allowed ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {match.allowed ? (
            <Check size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          ) : (
            <X size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          )}
          <span>
            {match.allowed ? "Allowed" : "Blocked"} — {match.reason}
          </span>
        </p>
      </div>

      <div className="border-t border-border-custom pt-6">
        <CodeOutput
          code={code || "User-agent: *\nDisallow:"}
          fileName="robots.txt"
          label="robots.txt"
          language="text"
        />
        <p className="mt-3 text-xs text-text-2">
          Save this as <code className="font-mono">robots.txt</code> at the root of your
          domain, reachable at <code className="font-mono">/robots.txt</code>.
        </p>
      </div>
    </ToolShell>
  );
}
