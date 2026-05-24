import Link from "next/link";
import { series, networkFamily, FAMILY_COLORS, yearLabel, onAirCount } from "@/lib/series";
import { seriesSlug } from "@/lib/series-slug";
import Section from "@/components/Section";

export default function StatsPage() {
  const total = series.length;

  // Decade buckets
  const decadeMap = new Map<number, typeof series>();
  for (const s of series) {
    const d = Math.floor(s.yearStart / 10) * 10;
    if (!decadeMap.has(d)) decadeMap.set(d, []);
    decadeMap.get(d)!.push(s);
  }
  const decades = Array.from(decadeMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([decade, shows]) => ({ decade, shows, count: shows.length }));
  const maxDecadeCount = Math.max(...decades.map((d) => d.count));

  // Network family breakdown
  const familyMap = new Map<string, number>();
  for (const s of series) {
    const f = networkFamily(s.network);
    familyMap.set(f, (familyMap.get(f) ?? 0) + 1);
  }
  const families = Array.from(familyMap.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([family, count]) => ({
      family,
      count,
      pct: Math.round((count / total) * 100),
      color: FAMILY_COLORS[family as keyof typeof FAMILY_COLORS].color,
      label: FAMILY_COLORS[family as keyof typeof FAMILY_COLORS].label,
    }));

  // Format breakdown
  const formatMap = new Map<string, number>();
  for (const s of series) {
    formatMap.set(s.format, (formatMap.get(s.format) ?? 0) + 1);
  }
  const formats = Array.from(formatMap.entries())
    .sort(([, a], [, b]) => b - a);

  // Creators with 2+ shows
  const creatorMap = new Map<string, typeof series>();
  for (const s of series) {
    if (!creatorMap.has(s.creator)) creatorMap.set(s.creator, []);
    creatorMap.get(s.creator)!.push(s);
  }
  const multiCreators = Array.from(creatorMap.entries())
    .filter(([, shows]) => shows.length >= 2)
    .map(([creator, shows]) => ({
      creator,
      shows: [...shows].sort((a, b) => a.yearStart - b.yearStart),
      count: shows.length,
    }))
    .sort((a, b) => b.count - a.count || a.creator.localeCompare(b.creator));

  // Total seasons across the rail
  const totalSeasons = series.reduce((s, x) => s + x.seasons, 0);

  // Earliest / latest
  const sortedByYear = [...series].sort((a, b) => a.yearStart - b.yearStart);
  const earliest = sortedByYear[0];
  const latest = sortedByYear[sortedByYear.length - 1];

  return (
    <main className="min-h-screen">
      <div className="border-b border-line px-5 py-4 sm:px-6 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow note flex items-center gap-3">
            <Link href="/" className="hover:text-amber">Pilot Light</Link>
            <span className="text-quiet">/</span>
            <span className="eyebrow--bright">Stats</span>
          </p>
        </div>
      </div>

      <header className="border-b border-line px-5 py-9 sm:px-6 md:px-16 md:py-12">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow eyebrow--accent">Channel 08 · Stats</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl md:text-7xl text-paper leading-[1.02] tracking-[-0.02em]">
            The rail, counted.
          </h1>
          <p className="serif mt-4 max-w-2xl text-lg sm:text-xl italic note">
            Every number derived from the catalog. Click anything to drill back into the shows.
          </p>
        </div>
      </header>

      {/* Section A: headline grid */}
      <Section number="01" title="By the numbers" blurb="Where the rail sits today.">
        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {[
            { label: "Series on the rail", value: total },
            { label: "Total seasons", value: totalSeasons },
            { label: "On air now", value: onAirCount, accent: true },
            { label: "Networks", value: new Set(series.map((s) => s.network)).size },
          ].map(({ label, value, accent }) => (
            <div key={label} className="bg-ink p-6 sm:p-8">
              <p className="eyebrow note">{label}</p>
              <p className={`display mt-4 text-5xl sm:text-6xl ${accent ? "text-amber" : "text-paper"} leading-none`}>
                {value}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 eyebrow note">
          Earliest: <Link href={`/series/${seriesSlug(earliest)}/`} className="eyebrow--accent hover:text-paper">{earliest.title}</Link> · {earliest.yearStart}
          &nbsp; &nbsp;
          Most recent: <Link href={`/series/${seriesSlug(latest)}/`} className="eyebrow--accent hover:text-paper">{latest.title}</Link> · {latest.yearStart}
        </p>
      </Section>

      {/* Section B: By the decade */}
      <Section number="02" title="By the decade" blurb="Shows by the decade they premiered.">
        <div className="space-y-3">
          {decades.map(({ decade, count, shows }) => {
            const pct = Math.round((count / maxDecadeCount) * 100);
            const share = Math.round((count / total) * 100);
            return (
              <div key={decade} className="border border-line bg-surface p-4 sm:p-5">
                <div className="mb-3 flex items-baseline justify-between gap-4">
                  <Link
                    href={`/?decade=${decade}`}
                    className="display text-2xl sm:text-3xl text-paper hover:text-amber transition-colors"
                  >
                    {decade}s
                  </Link>
                  <p className="display text-2xl text-paper">
                    {count} <span className="text-paper/55 text-base">{count === 1 ? "show" : "shows"}</span> <span className="eyebrow note ml-2">{share}%</span>
                  </p>
                </div>
                <div className="mb-4 h-2 w-full bg-line overflow-hidden">
                  <div className="h-full bg-amber/65" style={{ width: `${pct}%` }} aria-hidden="true" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {shows.map((s) => (
                    <Link
                      key={`${s.creator}-${s.title}`}
                      href={`/series/${seriesSlug(s)}/`}
                      className="display text-xs sm:text-sm text-paper/75 border border-line bg-ink px-2.5 py-1 hover:border-amber hover:text-amber transition"
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Section C: Network families */}
      <Section number="03" title="By the network family" blurb="Where they aired.">
        <div className="space-y-3">
          {families.map(({ family, count, pct, color, label }) => (
            <div key={family} className="flex items-center gap-4 border border-line bg-surface p-4 sm:p-5">
              <span aria-hidden="true" className="block h-12 w-1.5 shrink-0" style={{ background: color }} />
              <div className="flex-1 min-w-0">
                <p className="display text-lg sm:text-xl text-paper">{label}</p>
                <div className="mt-2 h-1.5 w-full bg-line overflow-hidden">
                  <div className="h-full" style={{ width: `${pct}%`, background: color, opacity: 0.7 }} aria-hidden="true" />
                </div>
              </div>
              <p className="display text-2xl text-paper shrink-0">
                {count} <span className="eyebrow note ml-1">{pct}%</span>
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section D: Format mix */}
      <Section number="04" title="By the format" blurb="Series, miniseries, limited, anthology.">
        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {formats.map(([format, count]) => (
            <div key={format} className="bg-ink p-6">
              <p className="eyebrow note">{format}</p>
              <p className="display mt-3 text-4xl sm:text-5xl text-paper leading-none">{count}</p>
              <p className="mt-2 eyebrow eyebrow--small note">{Math.round((count / total) * 100)}% of the rail</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section E: Most-represented creators */}
      <Section number="05" title="Most represented" blurb="Creators on the rail twice or more.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {multiCreators.map(({ creator, shows, count }) => (
            <Link
              key={creator}
              href={`/showrunners/#${creator.replace(/[^a-zA-Z0-9]/g, "-")}`}
              className="tile p-5 sm:p-6 group"
            >
              <p className="eyebrow eyebrow--accent">{count} shows</p>
              <h3 className="display mt-3 text-2xl sm:text-3xl text-paper group-hover:text-amber transition-colors">
                {creator}
              </h3>
              <ul className="mt-3 space-y-1.5">
                {shows.map((s) => (
                  <li key={s.title} className="serif text-base text-paper/85">
                    {s.title} <span className="eyebrow eyebrow--small note ml-1">{yearLabel(s)}</span>
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
