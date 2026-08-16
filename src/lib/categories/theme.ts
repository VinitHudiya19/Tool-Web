import type { CSSProperties } from "react";

/**
 * Per-category accent colours from DESIGN_SYSTEM.md.
 *
 * These are applied as CSS custom properties on the page wrapper rather than as
 * Tailwind classes, so one set of section components can theme itself to any
 * category without every colour combination needing its own class names.
 */
export interface CategoryTheme {
  accent: string;
  accentHover: string;
  surface: string;
  border: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  teal: {
    accent: "#0F6E56",
    accentHover: "#0B5643",
    surface: "#E1F5EE",
    border: "rgba(93, 202, 165, 0.5)",
  },
  purple: {
    accent: "#3C3489",
    accentHover: "#2E2769",
    surface: "#EEEDFE",
    border: "rgba(175, 169, 236, 0.5)",
  },
  amber: {
    accent: "#854F0B",
    accentHover: "#663C08",
    surface: "#FAEEDA",
    border: "rgba(239, 159, 39, 0.5)",
  },
  blue: {
    accent: "#185FA5",
    accentHover: "#124A80",
    surface: "#E6F1FB",
    border: "rgba(133, 183, 235, 0.5)",
  },
  coral: {
    accent: "#993C1D",
    accentHover: "#7D3117",
    surface: "#FAECE7",
    border: "rgba(240, 153, 123, 0.5)",
  },
  pink: {
    accent: "#993556",
    accentHover: "#7A2A44",
    surface: "#FBEAF0",
    border: "rgba(237, 147, 177, 0.5)",
  },
  green: {
    accent: "#3B6D11",
    accentHover: "#2D530D",
    surface: "#EAF3DE",
    border: "rgba(151, 196, 89, 0.5)",
  },
};

/** CSS variables consumed by the category page's section components. */
export function getCategoryThemeVars(color: string): CSSProperties {
  const theme = CATEGORY_THEMES[color] ?? CATEGORY_THEMES.teal;

  return {
    "--cat-accent": theme.accent,
    "--cat-accent-hover": theme.accentHover,
    "--cat-surface": theme.surface,
    "--cat-border": theme.border,
  } as CSSProperties;
}
