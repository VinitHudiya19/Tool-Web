import Link from "next/link";
import * as Icons from "lucide-react";

/** Resolves a Lucide icon by name, falling back when the name is unknown. */
export function ToolIcon({ name, size = 20 }: { name: string; size?: number }) {
  const icons = Icons as unknown as Record<string, Icons.LucideIcon | undefined>;
  const IconComponent = icons[name];

  if (!IconComponent) {
    return <Icons.HelpCircle size={size} />;
  }
  return <IconComponent size={size} />;
}

interface ToolCardProps {
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  iconName: string;
  compact?: boolean;
  showBadge?: boolean;
  /**
   * Real usage figure, when one is available. Omitted rather than invented —
   * the design system forbids placeholder statistics.
   */
  monthlyUses?: string;
}

const CATEGORY_STYLE_MAP: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    iconBg: string;
    iconText: string;
    hoverBorder: string;
    hoverIconBg: string;
  }
> = {
  calculators: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-100",
    iconBg: "bg-teal-50",
    iconText: "text-teal-600",
    hoverBorder: "hover:border-teal-500",
    hoverIconBg: "group-hover:bg-teal-100",
  },
  "developer-tools": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-100",
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
    hoverBorder: "hover:border-purple-500",
    hoverIconBg: "group-hover:bg-purple-100",
  },
  "seo-tools": {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-100",
    iconBg: "bg-orange-50",
    iconText: "text-orange-600",
    hoverBorder: "hover:border-orange-500",
    hoverIconBg: "group-hover:bg-orange-100",
  },
  "text-tools": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    hoverBorder: "hover:border-blue-500",
    hoverIconBg: "group-hover:bg-blue-100",
  },
  "data-tools": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    hoverBorder: "hover:border-emerald-500",
    hoverIconBg: "group-hover:bg-emerald-100",
  },
  "pdf-tools": {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
    iconBg: "bg-red-50",
    iconText: "text-red-600",
    hoverBorder: "hover:border-red-500",
    hoverIconBg: "group-hover:bg-red-100",
  },
  "image-tools": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    hoverBorder: "hover:border-amber-500",
    hoverIconBg: "group-hover:bg-amber-100",
  },
};

export default function ToolCard({
  slug,
  name,
  description,
  category,
  categorySlug,
  iconName,
  compact = false,
  showBadge = false,
  monthlyUses,
}: ToolCardProps) {
  const styles = CATEGORY_STYLE_MAP[categorySlug] || CATEGORY_STYLE_MAP[categorySlug.split("/")[0]] || {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-100",
    iconBg: "bg-slate-50",
    iconText: "text-slate-600",
    hoverBorder: "hover:border-slate-400",
    hoverIconBg: "group-hover:bg-slate-100",
  };

  return (
    <Link
      href={slug === "typing-test" ? "/typing-test" : `/${categorySlug}/${slug}`}
      className={`group relative flex flex-col justify-between h-full border border-border-custom bg-bg rounded-custom-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-custom-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
        styles.hoverBorder
      } ${compact ? "p-4 gap-3" : "p-7 gap-5"}`}
    >
      {/* "New" badge for recently added tools */}
      {showBadge && (
        <span className="absolute top-3 right-3 bg-primary text-white text-[11px] font-semibold px-2 py-0.5 rounded-full z-10">
          New
        </span>
      )}

      <div className="flex flex-col gap-3.5 items-start">
        {/* Category-colored Icon container */}
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-custom-sm border border-transparent transition-colors duration-200 ${styles.iconBg} ${styles.iconText} ${styles.hoverIconBg}`}>
          <ToolIcon name={iconName} size={22} />
        </div>

        {/* Text Details */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[17px] font-semibold text-text-custom leading-snug group-hover:text-primary transition-colors">
              {name}
            </h3>
          </div>
          <p className="text-sm font-normal text-text-2 leading-relaxed line-clamp-2 overflow-hidden text-ellipsis opacity-75">
            {description}
          </p>
        </div>
      </div>

      {/* Card Footer: Category tag & usage/CTA */}
      <div className="flex items-center justify-between border-t border-border-custom/50 pt-3.5 mt-2">
        <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles.bg} ${styles.text} ${styles.border}`}>
          {category}
        </span>
        <div className="flex items-center gap-1 text-[12px] text-text-2 group-hover:text-primary transition-colors font-medium">
          {monthlyUses && <span>{monthlyUses}</span>}
          <Icons.ArrowRight size={14} className="transform transition-transform group-hover:translate-x-0.5 duration-200" />
        </div>
      </div>
    </Link>
  );
}
