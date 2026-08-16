"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";

import {
  ActionButton,
  ErrorBanner,
  InfoNote,
  OptionGroup,
  ToolShell,
  downloadText,
} from "@/components/dev/ui";

type Preset = "url" | "text" | "wifi" | "contact";
type Correction = "L" | "M" | "Q" | "H";

const CORRECTION_LEVELS: { id: Correction; label: string; hint: string }[] = [
  { id: "L", label: "Low", hint: "Recovers about 7% damage. Smallest code." },
  { id: "M", label: "Medium", hint: "About 15%. The right default for most uses." },
  { id: "Q", label: "Quartile", hint: "About 25%. For print that will be handled." },
  { id: "H", label: "High", hint: "About 30%. Needed if you overlay a logo." },
];

/** Escapes the characters that are structural in the WiFi format. */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export default function QrCodeTool() {
  const [preset, setPreset] = useState<Preset>("url");
  const [correction, setCorrection] = useState<Correction>("M");
  const [dark, setDark] = useState("#000000");
  const [light, setLight] = useState("#FFFFFF");

  const [url, setUrl] = useState("https://example.com");
  const [text, setText] = useState("");
  const [wifi, setWifi] = useState({ ssid: "", password: "", security: "WPA" });
  const [contact, setContact] = useState({ name: "", phone: "", email: "", org: "" });

  const [pngUrl, setPngUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  /** Builds the string that actually gets encoded. */
  const payload = useMemo(() => {
    switch (preset) {
      case "url":
        return url.trim();
      case "text":
        return text;
      case "wifi":
        if (!wifi.ssid.trim()) return "";
        return `WIFI:T:${wifi.security};S:${escapeWifi(wifi.ssid)};P:${escapeWifi(
          wifi.password,
        )};;`;
      case "contact": {
        if (!contact.name.trim()) return "";
        // vCard 3.0 is the version phone cameras handle most reliably.
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `FN:${contact.name}`,
          contact.org && `ORG:${contact.org}`,
          contact.phone && `TEL:${contact.phone}`,
          contact.email && `EMAIL:${contact.email}`,
          "END:VCARD",
        ]
          .filter(Boolean)
          .join("\n");
      }
    }
  }, [preset, url, text, wifi, contact]);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      if (!payload) {
        setPngUrl("");
        setSvg("");
        return;
      }

      setIsWorking(true);
      setError("");

      try {
        const QRCode = (await import("qrcode")).default;
        const options = {
          errorCorrectionLevel: correction,
          margin: 2,
          color: { dark, light },
        };

        const [dataUrl, svgString] = await Promise.all([
          QRCode.toDataURL(payload, { ...options, width: 512 }),
          QRCode.toString(payload, { ...options, type: "svg" }),
        ]);

        if (!cancelled) {
          setPngUrl(dataUrl);
          setSvg(svgString);
        }
      } catch (cause) {
        if (!cancelled) {
          setPngUrl("");
          setSvg("");
          setError(
            cause instanceof Error
              ? `That could not be encoded: ${cause.message}`
              : "That content could not be encoded as a QR code.",
          );
        }
      } finally {
        if (!cancelled) setIsWorking(false);
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [payload, correction, dark, light]);

  const downloadPng = () => {
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "qr-code.png";
    document.body.append(link);
    link.click();
    link.remove();
  };

  return (
    <ToolShell>
      <ErrorBanner message={error} onDismiss={() => setError("")} />

      <OptionGroup<Preset>
        legend="What to encode"
        value={preset}
        onChange={setPreset}
        options={[
          { id: "url", label: "Link" },
          { id: "text", label: "Text" },
          { id: "wifi", label: "WiFi", hint: "Phones will offer to join the network directly." },
          { id: "contact", label: "Contact", hint: "A vCard that phones offer to save." },
        ]}
      />

      {preset === "url" && (
        <Field
          id="qr-url"
          label="Link"
          value={url}
          onChange={setUrl}
          placeholder="https://example.com"
        />
      )}

      {preset === "text" && (
        <div>
          <label htmlFor="qr-text" className="mb-1.5 block text-sm font-medium text-text-2">
            Text
          </label>
          <textarea
            id="qr-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={4}
            placeholder="Any text you want the code to carry."
            className="w-full resize-y rounded-custom-sm border border-border-custom bg-bg px-3.5 py-3 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
          />
        </div>
      )}

      {preset === "wifi" && (
        <div className="space-y-3">
          <Field
            id="wifi-ssid"
            label="Network name"
            value={wifi.ssid}
            onChange={(value) => setWifi((current) => ({ ...current, ssid: value }))}
            placeholder="Guest WiFi"
          />
          <Field
            id="wifi-password"
            label="Password"
            value={wifi.password}
            onChange={(value) => setWifi((current) => ({ ...current, password: value }))}
            placeholder="Leave blank for an open network"
          />
          <OptionGroup
            legend="Security"
            value={wifi.security}
            onChange={(value) => setWifi((current) => ({ ...current, security: value }))}
            options={[
              { id: "WPA", label: "WPA/WPA2/WPA3" },
              { id: "WEP", label: "WEP" },
              { id: "nopass", label: "Open" },
            ]}
          />
          <InfoNote>
            The password becomes part of the code&rsquo;s data, so anyone who can scan the
            code can read it. It is encoded here in your browser and never transmitted.
          </InfoNote>
        </div>
      )}

      {preset === "contact" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            id="vcard-name"
            label="Full name"
            value={contact.name}
            onChange={(value) => setContact((current) => ({ ...current, name: value }))}
            placeholder="Ada Lovelace"
          />
          <Field
            id="vcard-org"
            label="Organisation"
            value={contact.org}
            onChange={(value) => setContact((current) => ({ ...current, org: value }))}
          />
          <Field
            id="vcard-phone"
            label="Phone"
            value={contact.phone}
            onChange={(value) => setContact((current) => ({ ...current, phone: value }))}
          />
          <Field
            id="vcard-email"
            label="Email"
            value={contact.email}
            onChange={(value) => setContact((current) => ({ ...current, email: value }))}
          />
        </div>
      )}

      <OptionGroup<Correction>
        legend="Error correction"
        value={correction}
        onChange={setCorrection}
        options={CORRECTION_LEVELS}
      />

      <div className="flex flex-wrap gap-4">
        <ColourField id="qr-dark" label="Foreground" value={dark} onChange={setDark} />
        <ColourField id="qr-light" label="Background" value={light} onChange={setLight} />
      </div>

      {pngUrl && (
        <div aria-live="polite" className="space-y-4 border-t border-border-custom pt-4">
          <div className="flex justify-center rounded-custom-md border border-border-custom bg-white p-6">
            {isWorking ? (
              <Loader2 size={32} className="animate-spin text-text-2" aria-hidden="true" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pngUrl} alt="Generated QR code" className="h-56 w-56" />
            )}
          </div>

          <p className="text-xs text-text-2">
            {payload.length} characters encoded. Shorter content makes a simpler code that
            scans from further away.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <ActionButton onClick={downloadPng} icon={<Download size={15} aria-hidden="true" />}>
              Download PNG
            </ActionButton>
            <button
              type="button"
              onClick={() => downloadText(svg, "qr-code.svg", "image/svg+xml")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-custom-sm border border-border-custom bg-bg px-5 text-sm font-medium text-text-2 transition-colors hover:text-text-custom focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Download size={15} aria-hidden="true" />
              Download SVG
            </button>
          </div>

          <p className="text-xs text-text-2">
            Use SVG for print — it stays sharp at any size, and a soft barcode is one that
            fails to scan.
          </p>
        </div>
      )}
    </ToolShell>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-2">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-custom-sm border border-border-custom bg-bg px-3.5 text-sm text-text-custom focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
      />
    </div>
  );
}

function ColourField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-2">
        {label}
      </label>
      <input
        id={id}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-20 cursor-pointer rounded border border-border-custom bg-bg"
      />
    </div>
  );
}
