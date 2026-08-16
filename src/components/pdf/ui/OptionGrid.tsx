"use client";

export interface Option<T extends string> {
  id: T;
  title: string;
  description: string;
}

/**
 * A labelled group of mutually exclusive choices.
 *
 * Built from real radio inputs so arrow keys move between options and the
 * group is announced with its label, which a grid of clickable divs is not.
 */
export default function OptionGrid<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  columns = 4,
}: {
  legend: string;
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
}) {
  const columnClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-2">
        {legend}
      </legend>

      <div className={`grid grid-cols-1 gap-3 ${columnClass}`}>
        {options.map((option) => {
          const isSelected = option.id === value;
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer flex-col rounded-custom-sm border p-3 text-center transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary ${
                isSelected
                  ? "border-pdf-accent bg-pdf-surface/50"
                  : "border-border-custom bg-bg hover:border-pdf-accent-soft"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={isSelected}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              <span
                className={`text-sm font-semibold ${
                  isSelected ? "text-pdf-accent" : "text-text-custom"
                }`}
              >
                {option.title}
              </span>
              <span className="mt-0.5 text-[11px] leading-snug text-text-2">
                {option.description}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
