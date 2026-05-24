import Link from "next/link";
import { series, yearLabel, networkColor } from "@/lib/series";
import { seriesSlug } from "@/lib/series-slug";

// Pilot Wall — every show as a giant typographic tile. Each tile is the
// first episode (S1E1) of that series, framed as "would you start it
// tonight?" The whole page is the typographic centerpiece of Pilot Light.

export default function PilotsPage() {
  const rows = [...series].sort((a, b) => a.yearStart - b.yearStart);

  return (
    <main className="min-h-screen">
      <div className="border-b border-line px-5 py-4 sm:px-6 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow note flex items-center gap-3">
            <Link href="/" className="hover:text-amber">Pilot Light</Link>
            <span className="text-quiet">/</span>
            <span className="eyebrow--bright">Pilot Wall</span>
          </p>
        </div>
      </div>

      <header className="border-b border-line px-5 py-9 sm:px-6 md:px-16 md:py-14">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow eyebrow--accent flex items-center gap-3">
            <span className="on-air" aria-hidden="true" />
            Channel 07 · The Pilot Wall
          </p>
          <h1 className="display mt-3 text-4xl sm:text-5xl md:text-7xl text-paper leading-[1.02] tracking-[-0.02em]">
            Season one, episode one.
          </h1>
          <p className="serif mt-4 max-w-2xl text-lg sm:text-xl italic note">
            Every show on the rail, reduced to the spark. Would you start it tonight?
          </p>
        </div>
      </header>

      <section className="px-3 py-10 sm:px-5 md:px-10 md:py-14">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {rows.map((show) => {
              const color = networkColor(show.network);
              const onAir = show.yearEnd === null;
              return (
                <Link
                  key={`${show.creator}-${show.title}`}
                  href={`/series/${seriesSlug(show)}/`}
                  className="group relative aspect-[3/4] block overflow-hidden bg-ink border border-line hover:border-amber transition-colors p-3 sm:p-4 flex flex-col justify-between"
                >
                  {/* Network-family color wash at the bottom */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2/3 opacity-30 group-hover:opacity-50 transition-opacity"
                    style={{ background: `linear-gradient(to top, ${color}, transparent)` }}
                  />
                  {/* Subtle scanlines */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none"
                    style={{
                      backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px)",
                    }}
                  />

                  {/* Top: episode marker */}
                  <div className="relative">
                    <p className="eyebrow eyebrow--accent flex items-center gap-2">
                      S1 · E1
                      {onAir ? <span className="on-air" aria-hidden="true" /> : null}
                    </p>
                    <p className="eyebrow eyebrow--small note mt-1">
                      {show.network} · {yearLabel(show)}
                    </p>
                  </div>

                  {/* Middle/bottom: title fills */}
                  <div className="relative">
                    <h2
                      className="display text-paper leading-[0.95] tracking-[-0.02em] group-hover:text-amber transition-colors"
                      style={{ fontSize: "clamp(1.25rem, 4vw, 2.5rem)" }}
                    >
                      {show.title}
                    </h2>
                    <p className="serif mt-2 text-sm italic note line-clamp-2">
                      {show.creator}
                    </p>
                    <p className="mt-3 eyebrow eyebrow--small eyebrow--accent opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                      Tune in →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="mt-12 px-2 sm:px-3">
            <Link href="/" className="eyebrow eyebrow--accent hover:text-paper">
              ← Back to the rail
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
