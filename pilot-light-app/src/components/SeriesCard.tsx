import Link from "next/link";
import { type CanonSeries, yearLabel } from "@/lib/series";
import { seriesSlug } from "@/lib/series-slug";

// SeriesCard — text-driven catalog tile. No cover image (we don't ship
// licensed network art); the typography and metadata are the design.
//
// Layout reads top-to-bottom like a TV Guide entry refined to editorial:
//   ┌────────────────────────────────────────┐
//   │ NETWORK · YEARS · SEASONS · FORMAT     │ <- eyebrow meta line
//   │ TITLE                                  │ <- mono display
//   │ Creator                                │ <- serif italic
//   │                                        │
//   │ Note (the editorial line)              │ <- serif body
//   │                                        │
//   │ tag · tag · tag    [best ep ⤳]         │ <- footer
//   └────────────────────────────────────────┘

export type CardSize = "s" | "m" | "l";

export default function SeriesCard({
  show,
  size = "m",
}: {
  show: CanonSeries;
  size?: CardSize;
}) {
  const slug = seriesSlug(show);
  const pad = size === "s" ? "p-4 sm:p-5" : size === "l" ? "p-6 sm:p-8" : "p-5 sm:p-6";
  const titleSize =
    size === "s" ? "text-xl"
    : size === "l" ? "text-3xl sm:text-4xl"
    : "text-2xl sm:text-3xl";

  return (
    <Link
      href={`/series/${slug}/`}
      className={`tile group flex flex-col gap-3 ${pad} no-underline focus:outline-none focus:ring-2 focus:ring-amber/60`}
      aria-label={`${show.title} by ${show.creator}, ${yearLabel(show)}`}
    >
      {/* Eyebrow meta line — the broadcast info strip */}
      <p className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="eyebrow--accent">{show.network}</span>
        <span className="text-quiet">·</span>
        <span>{yearLabel(show)}</span>
        <span className="text-quiet">·</span>
        <span>{show.seasons} {show.seasons === 1 ? "season" : "seasons"}</span>
        {show.format !== "series" ? (
          <>
            <span className="text-quiet">·</span>
            <span>{show.format}</span>
          </>
        ) : null}
      </p>

      {/* Title — JetBrains Mono display, leans into the broadcast feel */}
      <h3 className={`display ${titleSize} text-paper leading-[1.1] transition-colors group-hover:text-amber`}>
        {show.title}
      </h3>

      {/* Creator */}
      <p className="serif text-base italic note">
        {show.creator}
      </p>

      {/* Curator note */}
      {size !== "s" ? (
        <p className={`serif mt-1 leading-relaxed ${size === "l" ? "text-lg" : "text-base"} text-paper/90`}>
          {show.note}
        </p>
      ) : null}

      {/* Genres + optional best-episode chip */}
      <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {show.genres.slice(0, 4).map((g) => (
            <span key={g} className="eyebrow eyebrow--small note">
              {g}
            </span>
          ))}
        </div>
        {show.bestEpisode ? (
          <span
            className="eyebrow eyebrow--small eyebrow--accent"
            title={`Best episode: S${show.bestEpisode.season}E${show.bestEpisode.episode} ${show.bestEpisode.title}`}
          >
            best ep ⤳
          </span>
        ) : show.bestSeason ? (
          <span
            className="eyebrow eyebrow--small eyebrow--accent"
            title={`Best season: ${show.bestSeason}`}
          >
            S{show.bestSeason} essential
          </span>
        ) : null}
      </div>
    </Link>
  );
}
