"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { series, allDecades, decadeOf, type CanonSeries } from "@/lib/series";
import SeriesCard from "@/components/SeriesCard";

type Sort = "title" | "year" | "creator";

const GRID_CLASS_BY_SIZE: Record<"s" | "m" | "l", string> = {
  s: "grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3",
  m: "grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  l: "grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3",
};

export default function SeriesCatalog() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialQuery = params?.get("q") ?? "";
  const initialDecade = params?.get("decade") ? Number(params.get("decade")) : null;

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<Sort>("year");
  const [size, setSize] = useState<"s" | "m" | "l">("m");
  const [decadeFilter, setDecadeFilter] = useState<number | null>(initialDecade);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let xs: CanonSeries[] = series.filter((s) => {
      if (decadeFilter !== null && decadeOf(s) !== decadeFilter) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.creator.toLowerCase().includes(q) ||
        s.network.toLowerCase().includes(q) ||
        s.note.toLowerCase().includes(q) ||
        s.genres.some((g) => g.includes(q))
      );
    });

    xs = [...xs].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "creator") return a.creator.localeCompare(b.creator);
      // year
      return a.yearStart - b.yearStart;
    });

    return xs;
  }, [query, sort, decadeFilter]);

  function clearFilters() {
    setQuery("");
    setDecadeFilter(null);
    router.replace(pathname, { scroll: false });
  }

  const isFiltering = !!query || decadeFilter !== null;

  return (
    <div className="relative">
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-5 border-b border-line pb-7 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="eyebrow note">Sort</span>
          <div className="flex border border-line">
            {([
              ["year", "Year"],
              ["title", "Title"],
              ["creator", "Creator"],
            ] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSort(mode)}
                aria-pressed={sort === mode}
                className={
                  "px-4 py-2.5 font-mono text-sm uppercase tracking-[0.15em] min-h-[44px] transition focus:outline-none focus:ring-2 focus:ring-amber/40 " +
                  (sort === mode
                    ? "bg-amber text-ink"
                    : "text-paper/80 hover:text-amber")
                }
              >
                {label}
              </button>
            ))}
          </div>

          <span className="ml-2 eyebrow note">Decade</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setDecadeFilter(null)}
              aria-pressed={decadeFilter === null}
              className={
                "px-3 py-2 font-mono text-sm uppercase tracking-[0.15em] min-h-[40px] min-w-[44px] transition focus:outline-none focus:ring-2 focus:ring-amber/40 " +
                (decadeFilter === null
                  ? "bg-ember text-paper"
                  : "text-paper/75 hover:text-amber")
              }
            >
              All
            </button>
            {allDecades.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDecadeFilter(d === decadeFilter ? null : d)}
                aria-pressed={decadeFilter === d}
                className={
                  "px-3 py-2 font-mono text-sm uppercase tracking-[0.15em] min-h-[40px] min-w-[44px] transition focus:outline-none focus:ring-2 focus:ring-amber/40 " +
                  (decadeFilter === d
                    ? "bg-amber text-ink"
                    : "text-paper/75 hover:text-amber")
                }
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="eyebrow note">Size</span>
          <div className="flex border border-line">
            {(["s", "m", "l"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                aria-label={`Card size ${s.toUpperCase()}`}
                className={
                  "px-4 py-2.5 font-mono text-sm uppercase tracking-[0.15em] min-h-[44px] min-w-[44px] transition focus:outline-none focus:ring-2 focus:ring-amber/40 " +
                  (size === s
                    ? "bg-amber text-ink"
                    : "text-paper/80 hover:text-amber")
                }
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a show, creator, network…"
            aria-label="Search the rail"
            className="w-full bg-surface border border-line px-4 py-2.5 serif text-base text-paper placeholder:text-muted min-h-[44px]
              focus:outline-none focus:ring-2 focus:ring-amber/40 md:w-72"
          />
          {isFiltering && (
            <button
              type="button"
              onClick={clearFilters}
              className="eyebrow note hover:text-amber min-h-[44px] px-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <p className="mb-7 eyebrow note">
        Showing {filtered.length} of {series.length} series
      </p>

      <div className={GRID_CLASS_BY_SIZE[size]}>
        {filtered.map((show) => (
          <SeriesCard key={`${show.creator}-${show.title}`} show={show} size={size} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center serif text-lg italic note">
          No series match. Try clearing the filter.
        </p>
      )}
    </div>
  );
}
