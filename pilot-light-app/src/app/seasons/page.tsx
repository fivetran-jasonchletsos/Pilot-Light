import Link from "next/link";
import { series, networkColor, yearLabel } from "@/lib/series";
import { seriesSlug } from "@/lib/series-slug";

// Season heatmap — every show as a row, every season as a colored cell.
// The cell for the bestSeason gets the bright amber treatment; others get
// the show's network-family color at lower opacity. The whole thing reads
// like a TV programming archive grid.

export default function SeasonsPage() {
  // Sort by yearStart so the grid reads chronologically top-to-bottom.
  const rows = [...series].sort((a, b) => a.yearStart - b.yearStart);
  const maxSeasons = Math.max(...rows.map((s) => s.seasons));

  return (
    <main className="min-h-screen">
      <div className="border-b border-line px-5 py-4 sm:px-6 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow note flex items-center gap-3">
            <Link href="/" className="hover:text-amber">Pilot Light</Link>
            <span className="text-quiet">/</span>
            <span className="eyebrow--bright">Season Heatmap</span>
          </p>
        </div>
      </div>

      <header className="border-b border-line px-5 py-9 sm:px-6 md:px-16 md:py-14">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow eyebrow--accent">Channel 03 · Season Heatmap</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl md:text-7xl text-paper leading-[1.02] tracking-[-0.02em]">
            Every show, every season.
          </h1>
          <p className="serif mt-4 max-w-2xl text-lg sm:text-xl italic note">
            One row per show, one cell per season. The bright cell is the essential one — Jason's pick where it's flagged.
          </p>
        </div>
      </header>

      <section className="px-5 py-10 sm:px-6 sm:py-14 md:px-16 md:py-18">
        <div className="mx-auto max-w-7xl">

          {/* Column header (season numbers) */}
          <div className="grid sticky top-[60px] z-10 bg-ink/95 backdrop-blur border-b border-line mb-3 py-2"
               style={{ gridTemplateColumns: `minmax(180px, 22%) repeat(${maxSeasons}, minmax(28px, 1fr))` }}>
            <p className="eyebrow note pl-1">Series</p>
            {Array.from({ length: maxSeasons }, (_, i) => (
              <p key={i} className="eyebrow eyebrow--small note text-center">
                S{i + 1}
              </p>
            ))}
          </div>

          {/* Heatmap rows */}
          <div className="space-y-1">
            {rows.map((show) => {
              const color = networkColor(show.network);
              const onAir = show.yearEnd === null;
              return (
                <div
                  key={`${show.creator}-${show.title}`}
                  className="grid items-center gap-1 group hover:bg-surface/60 transition-colors"
                  style={{ gridTemplateColumns: `minmax(180px, 22%) repeat(${maxSeasons}, minmax(28px, 1fr))` }}
                >
                  <Link
                    href={`/series/${seriesSlug(show)}/`}
                    className="min-w-0 pr-3 py-1.5"
                  >
                    <p className="display text-sm sm:text-base text-paper group-hover:text-amber transition-colors truncate">
                      {show.title}
                    </p>
                    <p className="eyebrow eyebrow--small note truncate">
                      {show.network} · {yearLabel(show)}
                    </p>
                  </Link>
                  {Array.from({ length: maxSeasons }, (_, i) => {
                    const seasonNum = i + 1;
                    const hasSeason = seasonNum <= show.seasons;
                    const isBest =
                      show.bestSeason === seasonNum ||
                      (show.bestEpisode && show.bestEpisode.season === seasonNum);
                    if (!hasSeason) {
                      return <span key={i} className="block h-6" aria-hidden="true" />;
                    }
                    return (
                      <Link
                        key={i}
                        href={`/series/${seriesSlug(show)}/`}
                        className="block h-6 transition-all hover:scale-110"
                        style={{
                          background: isBest ? "#c19243" : color,
                          opacity: isBest ? 1 : 0.42,
                          boxShadow: isBest ? "0 0 8px rgba(193,146,67,0.5)" : "none",
                        }}
                        title={
                          isBest
                            ? `${show.title} · Season ${seasonNum} (essential)`
                            : `${show.title} · Season ${seasonNum}`
                        }
                        aria-label={`${show.title} season ${seasonNum}${isBest ? " — essential" : ""}`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-10 border-t border-line pt-6">
            <p className="eyebrow note mb-3">Reading the grid</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <span className="block h-4 w-4" style={{ background: "#c19243", boxShadow: "0 0 6px rgba(193,146,67,0.5)" }} aria-hidden="true" />
                <span className="serif text-sm note">Essential season</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="block h-4 w-4" style={{ background: "#c7b89f", opacity: 0.42 }} aria-hidden="true" />
                <span className="serif text-sm note">Premium cable</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="block h-4 w-4" style={{ background: "#a4582d", opacity: 0.42 }} aria-hidden="true" />
                <span className="serif text-sm note">Indie cable (FX, AMC)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="block h-4 w-4" style={{ background: "#6a8a82", opacity: 0.42 }} aria-hidden="true" />
                <span className="serif text-sm note">Streamer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="block h-4 w-4" style={{ background: "#7a708a", opacity: 0.42 }} aria-hidden="true" />
                <span className="serif text-sm note">UK / Europe</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="block h-4 w-4" style={{ background: "#8a8275", opacity: 0.42 }} aria-hidden="true" />
                <span className="serif text-sm note">Broadcast</span>
              </div>
            </div>
          </div>

          <p className="mt-10">
            <Link href="/" className="eyebrow eyebrow--accent hover:text-paper">
              ← Back to the rail
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}
