import Link from "next/link";
import { series, yearLabel } from "@/lib/series";
import { seriesSlug } from "@/lib/series-slug";

type Era = {
  num: string;
  title: string;
  yearStart: number;
  yearEnd: number;
  kicker: string;
  thesis: string;
  signatureMatcher: (title: string) => boolean;
};

const ERAS: Era[] = [
  {
    num: "01",
    title: "First Golden Age",
    yearStart: 1997,
    yearEnd: 2007,
    kicker: "1997 – 2007",
    thesis:
      "Cable proves it can make work that cinema can't. Oz cracks the door at HBO in 1997; The Sopranos kicks it down in 1999; The Shield brings FX into the conversation; Lost teaches the broadcast networks to think in arcs. By the time the curtain falls in 2007 — Sopranos cuts to black, Mad Men begins — prestige is no longer a niche.",
    signatureMatcher: (t) =>
      ["Oz", "The Sopranos", "The Shield", "Six Feet Under", "The Wire", "Deadwood", "Lost"].some((x) => t.includes(x)),
  },
  {
    num: "02",
    title: "Peak Cable",
    yearStart: 2008,
    yearEnd: 2015,
    kicker: "2008 – 2015",
    thesis:
      "Cable holds the high ground. Breaking Bad runs from Pinkman's RV to Felina; Mad Men reads the seventies; Justified, Hannibal, The Americans, Rectify, Halt and Catch Fire fill the back catalogue with work that streaming inherits whole. The format crystalizes: 10–13 hours, novelistic, antiheroes optional. The miniseries gets serious — Top of the Lake, Band of Brothers' echo in Generation Kill and Chernobyl-prelude work. By 2015 the conversation has moved.",
    signatureMatcher: (t) =>
      ["Breaking Bad", "Justified", "The Americans", "Rectify", "Halt and Catch Fire", "Banshee", "Better Call Saul"].some((x) => t.includes(x)),
  },
  {
    num: "03",
    title: "Streaming Era",
    yearStart: 2016,
    yearEnd: 2099,
    kicker: "2016 – now",
    thesis:
      "Streaming wins the distribution war and the writers' room expands to absorb the slack. Succession does family Shakespeare at boardroom volume. Better Call Saul nests inside Breaking Bad's universe and matches it. Mare of Easttown and Task make limited-series the prestige object. Apple TV+ becomes an unexpected home (Slow Horses, Severance, For All Mankind). The Pitt resurrects the real-time medical drama; Dope Thief shows the format still has range. The argument now is volume — too much TV, not enough hours.",
    signatureMatcher: (t) =>
      ["Succession", "Better Call Saul", "Mare", "Task", "Slow Horses", "For All Mankind", "The Pitt", "Barry", "Dope Thief"].some((x) => t.includes(x)),
  },
];

export default function ErasPage() {
  function showsInEra(era: Era) {
    return [...series]
      .filter((s) => s.yearStart >= era.yearStart && s.yearStart <= era.yearEnd)
      .sort((a, b) => a.yearStart - b.yearStart);
  }

  function signatureShows(era: Era) {
    return [...series]
      .filter((s) => era.signatureMatcher(s.title) && s.yearStart >= era.yearStart && s.yearStart <= era.yearEnd)
      .sort((a, b) => a.yearStart - b.yearStart);
  }

  return (
    <main className="min-h-screen">
      <div className="border-b border-line px-5 py-4 sm:px-6 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow note flex items-center gap-3">
            <Link href="/" className="hover:text-amber">Pilot Light</Link>
            <span className="text-quiet">/</span>
            <span className="eyebrow--bright">Eras</span>
          </p>
        </div>
      </div>

      <header className="border-b border-line px-5 py-9 sm:px-6 md:px-16 md:py-14">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow eyebrow--accent">Channel 04 · Eras</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl md:text-7xl text-paper leading-[1.02] tracking-[-0.02em]">
            The last twenty-five years.
          </h1>
          <p className="serif mt-4 max-w-2xl text-lg sm:text-xl italic note">
            Three theses on how television got here. Signature shows below each.
          </p>
        </div>
      </header>

      <section className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
        <div className="mx-auto max-w-7xl space-y-20 sm:space-y-28">
          {ERAS.map((era) => {
            const signatures = signatureShows(era);
            const all = showsInEra(era);
            return (
              <article key={era.num}>
                <header>
                  <p className="eyebrow eyebrow--accent">Era {era.num} · {era.kicker}</p>
                  <h2 className="display mt-3 text-4xl sm:text-5xl md:text-6xl text-paper leading-[1.02] tracking-[-0.02em]">
                    {era.title}
                  </h2>
                  <p className="serif mt-6 max-w-3xl text-lg sm:text-xl text-paper leading-relaxed">
                    {era.thesis}
                  </p>
                </header>

                {signatures.length > 0 ? (
                  <div className="mt-10">
                    <p className="eyebrow eyebrow--accent">Signature work</p>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {signatures.map((s) => (
                        <Link
                          key={s.title}
                          href={`/series/${seriesSlug(s)}/`}
                          className="tile p-5 group"
                        >
                          <p className="eyebrow note">{s.network} · {yearLabel(s)}</p>
                          <p className="display mt-2 text-2xl text-paper group-hover:text-amber transition-colors">
                            {s.title}
                          </p>
                          <p className="serif text-sm italic note mt-1">{s.creator}</p>
                          <p className="serif mt-3 text-base text-paper/85 leading-relaxed line-clamp-3">
                            {s.note}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {all.length > signatures.length ? (
                  <div className="mt-10 border-t border-line pt-6">
                    <p className="eyebrow note mb-3">Also from this era on the rail</p>
                    <div className="flex flex-wrap gap-1.5">
                      {all
                        .filter((s) => !signatures.includes(s))
                        .map((s) => (
                          <Link
                            key={s.title}
                            href={`/series/${seriesSlug(s)}/`}
                            className="display text-sm text-paper/75 border border-line bg-surface px-2.5 py-1 hover:border-amber hover:text-amber transition"
                          >
                            {s.title}
                          </Link>
                        ))}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <p className="mt-16 mx-auto max-w-7xl">
          <Link href="/" className="eyebrow eyebrow--accent hover:text-paper">
            ← Back to the rail
          </Link>
        </p>
      </section>
    </main>
  );
}
