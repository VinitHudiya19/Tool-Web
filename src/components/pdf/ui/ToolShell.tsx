import type { ReactNode } from "react";

/** The bordered card every tool's interface sits inside. */
export default function ToolShell({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 rounded-custom-md border border-border-custom bg-bg p-4 shadow-custom-sm sm:p-6">
      {children}
    </div>
  );
}
