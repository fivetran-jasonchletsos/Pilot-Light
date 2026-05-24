import Link from "next/link";
import { type CanonSeries, yearLabel, networkColor } from "@/lib/series";
import { seriesSlug } from "@/lib/series-slug";

export type CardSize = "s" | "m" | "l";

export default function SeriesCard({
  show,
  size = "m",
}: {
  show: CanonSeries;
  size?: CardSize;
}) {
  const slug = seriesSlug(show);
  const pad = size === "s" ? "p-4 pl-5 sm:p-5 sm:pl-6" : size === "l" ? "p-6 pl-7 sm:p-8 sm:pl-9" : "p-5 pl-6 sm:p-6 sm:pl-7";
  const titleSize =
    size === "s" ? "text-xl"
    : size === "l" ? "text-3xl sm:text-4xl"
    : "text-2xl sm:text-3xl";

  const stripeColor = networkColor(show.network);
  const onAir = show.yearEnd === null;

  return (
    <Link
      href={`/series/${slug}/`}
      className={`tile group relative flex flex-col gap-3 ${pad} no-underline focus:outline-none focus:ring-2 focus:ring-amber/60`}
      aria-label={`${show.title} by ${show.creator}, ${yearLabel(show)}`}
    >
      {/* Network-family stripe down the left edge */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: stripeColor, opacity: 0.7 }}
      />

      {/* Eyebrow meta line */}
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
        {onAir ? (
          <>
            <span className="text-quiet">·</span>
            <span className="inline-flex items-center gap-1.5 eyebrow--accent">
              <span className="on-air" aria-hidden="true" />
              ON AIR
            </span>
          </>
        ) : null}
      </p>

      {/* Title */}
      <h3 className={`display ${titleSize} text-paper leading-[1.05] tracking-[-0.01em] transition-colors group-hover:text-amber`}>
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

      {/* Footer */}
      <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {show.genres.slice(0, 4).map((g) => (
            <span key={g} className="eyebrow eyebrow--small note">
              {g}
            </span>
          ))}
        </div>
        <span className="eyebrow eyebrow--small eyebrow--accent opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
          Tune in →
        </span>
      </div>

      {/* Essential badge (top-right) */}
      {show.bestEpisode ? (
        <span
          className="absolute right-3 top-3 eyebrow eyebrow--small eyebrow--accent border border-amber/40 bg-ink/80 px-2 py-1 backdrop-blur-sm"
          title={`Best ep: S${show.bestEpisode.season}E${show.bestEpisode.episode} ${show.bestEpisode.title}`}
        >
          ◆ Best ep
        </span>
      ) : show.bestSeason ? (
        <span
          className="absolute right-3 top-3 eyebrow eyebrow--small eyebrow--accent border border-amber/40 bg-ink/80 px-2 py-1 backdrop-blur-sm"
          title={`Essential: Season ${show.bestSeason}`}
        >
          ◆ S{show.bestSeason}
        </span>
      ) : null}
    </Link>
  );
}
