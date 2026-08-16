import Link from "next/link";
import { ToolIcon } from "./ToolCard";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  slug: string;
  name: string;
  toolCount: number;
  iconName: string;
  previewTools: string[];
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

export default function CategoryCard({
  slug,
  name,
  toolCount,
  iconName,
  previewTools,
}: CategoryCardProps) {
  const styles = CATEGORY_STYLE_MAP[slug] || {
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
      href={`/${slug}`}
      className={`group flex flex-col justify-between border border-border-custom bg-bg p-6 rounded-custom-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-custom-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${styles.hoverBorder}`}
    >
      <div className="flex flex-col gap-4">
        {/* Category Icon */}
        <div className={`flex h-14 w-14 items-center justify-center rounded-custom-sm border border-transparent transition-colors duration-200 ${styles.iconBg} ${styles.iconText} ${styles.hoverIconBg}`}>
          <ToolIcon name={iconName} size={32} />
        </div>

        {/* Category Name */}
        <h3 className="text-lg font-bold text-text-custom leading-snug group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Mini Tool Previews */}
        {previewTools.length > 0 && (
          <div className="flex flex-col gap-1 border-l-2 border-border-custom/80 pl-3 py-0.5">
            {previewTools.map((tool) => (
              <span key={tool} className="text-[13px] text-text-2 leading-relaxed font-medium">
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tool Count / Footer */}
      <div className="flex items-center justify-between border-t border-border-custom/50 pt-4 mt-6">
        <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles.bg} ${styles.text} ${styles.border}`}>
          {toolCount} tools
        </span>
        <span className="flex items-center gap-0.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Explore</span>
          <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
