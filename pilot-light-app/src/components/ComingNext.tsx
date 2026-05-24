import Link from "next/link";

export default function ComingNext({
  number,
  title,
  blurb,
}: {
  number: string;
  title: string;
  blurb: string;
}) {
  return (
    <main className="min-h-screen px-5 py-16 sm:px-6 sm:py-24 md:px-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow eyebrow--accent flex items-center justify-center gap-3">
          <span className="on-air" aria-hidden="true" />
          Channel {number} &middot; Standby
        </p>
        <h1 className="display mt-6 text-4xl sm:text-5xl md:text-6xl text-paper leading-[1.05]">
          {title}
        </h1>
        <p className="serif mt-6 text-lg sm:text-xl text-paper/85 italic leading-relaxed">
          {blurb}
        </p>
        <p className="mt-10">
          <Link href="/" className="eyebrow eyebrow--accent hover:text-paper">
            ← Back to the rail
          </Link>
        </p>
      </div>
    </main>
  );
}
