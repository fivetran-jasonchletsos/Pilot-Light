export default function Section({
  number,
  title,
  blurb,
  children,
}: {
  number: string;
  title: string;
  blurb?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      {/* Ornament — broadcast hash with center dot */}
      <div className="mx-auto max-w-6xl mb-10 sm:mb-14">
        <div className="section-ornament">
          <span className="eyebrow eyebrow--quiet" aria-hidden="true">·  ·  ·</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow eyebrow--accent">{number}</p>
            <h2 className="display mt-3 text-3xl text-paper sm:text-4xl md:text-5xl leading-[1.08]">
              {title}
            </h2>
          </div>
          {blurb ? (
            <p className="max-w-md serif text-base text-paper/85 sm:text-lg md:text-right leading-relaxed italic">
              {blurb}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
