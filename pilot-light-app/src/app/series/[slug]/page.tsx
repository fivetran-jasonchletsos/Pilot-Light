import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { series, yearLabel } from "@/lib/series";
import { allSeriesSlugs, findSeriesBySlug, seriesSlug } from "@/lib/series-slug";

export const dynamic = "force-static";

export function generateStaticParams() {
  return allSeriesSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const show = findSeriesBySlug(params.slug);
  if (!show) return { title: "Not found — Pilot Light" };
  return {
    title: `${show.title} — Pilot Light`,
    description: show.note,
  };
}

export default function SeriesDetail({ params }: { params: { slug: string } }) {
  const show = findSeriesBySlug(params.slug);
  if (!show) notFound();

  const others = series.filter((s) => s.creator === show.creator && s.title !== show.title);
  const decade = Math.floor(show.yearStart / 10) * 10;

  return (
    <main className="min-h-screen px-5 py-10 sm:px-6 sm:py-14 md:px-16">
      <div className="mx-auto max-w-4xl">

        {/* Breadcrumb */}
        <p className="eyebrow flex flex-wrap items-center gap-x-2">
          <Link href="/" className="hover:text-amber">Pilot Light</Link>
          <span className="text-quiet">/</span>
          <Link href="/" className="hover:text-amber">The Rail</Link>
          <span className="text-quiet">/</span>
          <span className="eyebrow--bright">{show.title}</span>
        </p>

        {/* Header */}
        <header className="mt-7 pb-8 border-b border-line">
          <p className="eyebrow eyebrow--accent flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{show.network}</span>
            <span className="text-quiet">·</span>
            <span>{yearLabel(show)}</span>
            <span className="text-quiet">·</span>
            <span>{show.seasons} {show.seasons === 1 ? "season" : "seasons"}</span>
            <span className="text-quiet">·</span>
            <span>{show.format}</span>
          </p>
          <h1 className="display mt-4 text-4xl sm:text-5xl md:text-6xl text-paper leading-[1.05]">
            {show.title}
          </h1>
          <p className="serif mt-4 text-xl italic note">
            Created by {show.creator}
          </p>
        </header>

        {/* Curator note */}
        <blockquote className="mt-10 border-l-2 border-amber pl-6">
          <p className="serif text-xl sm:text-2xl italic text-paper leading-relaxed">
            {show.note}
          </p>
          <footer className="mt-4 eyebrow note">— Jason Chletsos, curator</footer>
        </blockquote>

        {/* Highlights */}
        {(show.bestSeason || show.bestEpisode) ? (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {show.bestSeason ? (
              <div className="tile p-5">
                <p className="eyebrow eyebrow--accent">Essential season</p>
                <p className="display mt-3 text-3xl text-paper">Season {show.bestSeason}</p>
                <p className="serif mt-2 text-base note italic">If you only have time for one.</p>
              </div>
            ) : null}
            {show.bestEpisode ? (
              <div className="tile p-5">
                <p className="eyebrow eyebrow--accent">Essential episode</p>
                <p className="display mt-3 text-2xl text-paper">S{show.bestEpisode.season} · E{show.bestEpisode.episode}</p>
                <p className="serif mt-2 text-base note italic">&ldquo;{show.bestEpisode.title}&rdquo;</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Tags */}
        <div className="mt-10">
          <p className="eyebrow note">Tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {show.genres.map((g) => (
              <span key={g} className="px-3 py-1.5 border border-line text-paper/85 font-mono text-sm uppercase tracking-[0.1em]">
                {g}
              </span>
            ))}
            <Link
              href={`/?decade=${decade}`}
              className="px-3 py-1.5 border border-line text-paper/85 font-mono text-sm uppercase tracking-[0.1em] hover:text-amber hover:border-amber"
            >
              {decade}s
            </Link>
          </div>
        </div>

        {/* Other work by creator */}
        {others.length > 0 ? (
          <div className="mt-10 border-t border-line pt-8">
            <p className="eyebrow note">Also on the rail by {show.creator}</p>
            <ul className="mt-3 space-y-2">
              {others.map((o) => (
                <li key={`${o.creator}-${o.title}`} className="flex items-baseline gap-3">
                  <Link
                    href={`/series/${seriesSlug(o)}/`}
                    className="serif text-lg text-paper hover:text-amber"
                  >
                    {o.title}
                  </Link>
                  <span className="font-mono text-sm note">{yearLabel(o)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Back link */}
        <p className="mt-12">
          <Link href="/" className="eyebrow eyebrow--accent hover:text-paper">
            ← Back to the rail
          </Link>
        </p>

      </div>
    </main>
  );
}
