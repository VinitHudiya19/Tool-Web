"use client";

import type { ReactNode } from "react";

/** The primary action button for every tool. One verb, full width on mobile. */
export default function ActionButton({
  children,
  onClick,
  disabled = false,
  icon,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-custom-sm bg-pdf-accent px-6 text-sm font-semibold text-white shadow-custom-sm transition-colors hover:bg-pdf-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-border-custom disabled:text-text-2 disabled:shadow-none sm:w-auto sm:min-w-[200px]"
    >
      {icon}
      {children}
    </button>
  );
}
