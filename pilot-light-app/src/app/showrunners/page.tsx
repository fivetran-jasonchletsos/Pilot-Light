import Link from "next/link";
import { series, yearLabel } from "@/lib/series";
import { seriesSlug } from "@/lib/series-slug";

// One-line thesis per auteur. These are mine to draft; edit to taste.
const THESIS: Record<string, string> = {
  "Dick Wolf": "Built the modern American procedural three times over. The franchise didn't replicate; it metastasized.",
  "Vince Gilligan": "Walter, then Jimmy. The slow tragedy of becoming what you always were. Two of the great hours of cable.",
  "Vince Gilligan & Peter Gould": "Walter, then Jimmy. The slow tragedy of becoming what you always were. Two of the great hours of cable.",
  "Sally Wainwright": "Yorkshire women who carry the weight. Procedural framework, novelistic interior.",
  "Sally Wainwright & Diane Taylor": "Yorkshire women who carry the weight. Procedural framework, novelistic interior.",
  "Brad Ingelsby": "Pennsylvania, working-class grief, a missing person who matters. Two limited series, both perfect.",
  "Robert & Michelle King": "Cases the law can't quite touch — corruption, conscience, sometimes literal evil. The Good Wife was the warmup.",
  "David Chase": "Tony Soprano in therapy. The series that broke the dam; everything after stands on that ground.",
  "David Milch": "The writer's writer. Deadwood, John from Cincinnati — Shakespeare in dust, theology in surf.",
  "David Milch & Kem Nunn": "The writer's writer. Deadwood, John from Cincinnati — Shakespeare in dust, theology in surf.",
  "David E. Kelley": "Picket Fences to Goliath, three decades of legal/moral fables with characters who quote scripture in court.",
  "Nic Pizzolatto": "True Detective. The anthology bet that paid off in season one and has been negotiated against ever since.",
  "Tom Fontana": "Oz. The pre-history of HBO drama; the show that proved cable could do what film couldn't.",
  "Aaron Sorkin": "Words at speed. Walk-and-talks, monologues, the politics of competence. Love him or quit — there's no middle.",
  "Jed Mercurio": "The British procedural's modern master. Bodyguard, Line of Duty — twenty-minute interrogation scenes nobody else dares write.",
  "J.J. Abrams, Damon Lindelof & Jeffrey Lieber": "Lost. The pilot that opened streaming-era storytelling by accident; the finale that still hasn't healed.",
  "Bill Hader & Alec Berg": "Barry. A hitman who wants to act. Comedy that becomes tragedy without a seam.",
  "Joe Weisberg & Joel Fields": "The Americans. Two KGB illegals in Reagan's America; the most patient long-game in modern TV.",
  "Christopher Cantwell & Christopher C. Rogers": "Halt and Catch Fire. The most quietly tender show about how technology gets made — and remade — by the people who can't quit it.",
  "Jesse Armstrong": "Succession. Family Shakespeare at boardroom volume.",
  "Eric Newman & Carlo Bernard": "Narcos: Mexico. The cartel show that found its voice when it shifted south.",
  "Chris Brancato, Carlo Bernard & Doug Miro": "Narcos. The English-Spanish-subtitle handoff was the format.",
  "Tony Basgallop": "Servant. A Philadelphia brownstone, a held breath, four seasons of measured dread.",
};

export default function ShowrunnersPage() {
  // Group by creator, only those with 2+ shows
  const map = new Map<string, typeof series>();
  for (const s of series) {
    if (!map.has(s.creator)) map.set(s.creator, []);
    map.get(s.creator)!.push(s);
  }
  const multi = Array.from(map.entries())
    .filter(([, shows]) => shows.length >= 2)
    .map(([creator, shows]) => ({
      creator,
      shows: [...shows].sort((a, b) => a.yearStart - b.yearStart),
    }))
    .sort((a, b) => b.shows.length - a.shows.length || a.creator.localeCompare(b.creator));

  // Single-show creators worth surfacing (those with a thesis written for them)
  const single = Array.from(map.entries())
    .filter(([creator, shows]) => shows.length === 1 && THESIS[creator])
    .map(([creator, shows]) => ({ creator, show: shows[0] }))
    .sort((a, b) => a.show.yearStart - b.show.yearStart);

  return (
    <main className="min-h-screen">
      <div className="border-b border-line px-5 py-4 sm:px-6 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow note flex items-center gap-3">
            <Link href="/" className="hover:text-amber">Pilot Light</Link>
            <span className="text-quiet">/</span>
            <span className="eyebrow--bright">Showrunners</span>
          </p>
        </div>
      </div>

      <header className="border-b border-line px-5 py-9 sm:px-6 md:px-16 md:py-14">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow eyebrow--accent">Channel 02 · Showrunners</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl md:text-7xl text-paper leading-[1.02] tracking-[-0.02em]">
            The names behind the rail.
          </h1>
          <p className="serif mt-4 max-w-2xl text-lg sm:text-xl italic note">
            The auteurs who keep showing up. Multiple shows mean a pattern;
            the pattern is the thesis.
          </p>
        </div>
      </header>

      {/* Multi-show creators */}
      <section className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
        <div className="mx-auto max-w-7xl space-y-14 sm:space-y-20">
          {multi.map(({ creator, shows }, i) => {
            const yearsActive = shows.reduce((s, x) => s + (x.yearEnd ?? x.yearStart) - x.yearStart, 0);
            const span = shows[shows.length - 1].yearEnd
              ? `${shows[0].yearStart}–${shows[shows.length - 1].yearEnd}`
              : `${shows[0].yearStart}–`;
            return (
              <article
                key={creator}
                id={creator.replace(/[^a-zA-Z0-9]/g, "-")}
                className="grid gap-8 md:grid-cols-[280px_1fr] md:gap-12"
              >
                <div>
                  <p className="eyebrow eyebrow--accent">No. {String(i + 1).padStart(2, "0")} · {shows.length} shows</p>
                  <h2 className="display mt-3 text-3xl sm:text-4xl text-paper leading-[1.05] tracking-[-0.01em]">
                    {creator}
                  </h2>
                  <p className="mt-3 eyebrow note">{span}</p>
                  {THESIS[creator] ? (
                    <p className="serif mt-5 text-lg italic text-paper/85 leading-relaxed">
                      {THESIS[creator]}
                    </p>
                  ) : null}
                </div>

                {/* Show timeline */}
                <div className="space-y-3">
                  {shows.map((s) => (
                    <Link
                      key={s.title}
                      href={`/series/${seriesSlug(s)}/`}
                      className="tile group flex items-baseline gap-5 p-5 sm:p-6"
                    >
                      <p className="display text-xl text-amber shrink-0 w-20 sm:w-24">
                        {s.yearStart}
                      </p>
                      <div className="min-w-0 flex-1">
                        <p className="display text-xl sm:text-2xl text-paper group-hover:text-amber transition-colors">
                          {s.title}
                        </p>
                        <p className="eyebrow note mt-1.5">
                          {s.network} · {yearLabel(s)} · {s.seasons} {s.seasons === 1 ? "season" : "seasons"}
                        </p>
                        <p className="serif mt-2 text-base text-paper/85 leading-relaxed line-clamp-2">
                          {s.note}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Single-show creators with a written thesis */}
      {single.length > 0 ? (
        <section className="border-t border-line px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow eyebrow--accent">Single appearances · signature work</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl md:text-5xl text-paper leading-[1.05]">
              One on the rail, one for the record.
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {single.map(({ creator, show }) => (
                <Link
                  key={creator}
                  href={`/series/${seriesSlug(show)}/`}
                  className="tile p-5 sm:p-6 group"
                >
                  <p className="eyebrow eyebrow--accent">{creator}</p>
                  <h3 className="display mt-3 text-2xl text-paper group-hover:text-amber transition-colors">
                    {show.title}
                  </h3>
                  <p className="eyebrow note mt-2">{show.network} · {yearLabel(show)}</p>
                  {THESIS[creator] ? (
                    <p className="serif mt-3 text-sm text-paper/85 italic leading-relaxed">
                      {THESIS[creator]}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <p className="px-5 pb-12 sm:px-6 md:px-16">
        <Link href="/" className="eyebrow eyebrow--accent hover:text-paper">
          ← Back to the rail
        </Link>
      </p>
    </main>
  );
}
