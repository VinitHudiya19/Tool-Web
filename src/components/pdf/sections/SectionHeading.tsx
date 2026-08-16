/** The one heading pattern every tool-page section uses. */
export default function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="mb-8">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="text-2xl font-bold leading-tight tracking-tight text-text-custom sm:text-3xl"
      >
        {title}
      </h2>
    </div>
  );
}
