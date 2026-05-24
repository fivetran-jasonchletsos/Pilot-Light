import Link from "next/link";
import { series, yearLabel } from "@/lib/series";
import { seriesSlug } from "@/lib/series-slug";

// Weekend plan — curated short-arc binges, each ~6 hours of TV. Three kinds:
//   1. Whole miniseries / limited (single object, complete arc)
//   2. Essential season of a longer show (the "if you only watch one")
//   3. A pilot run that earns the rest of the show

type Plan = {
  hours: string;
  type: "miniseries" | "season" | "pilot-run";
  showTitle: string;
  detail: string;
  pitch: string;
};

const PLANS: Plan[] = [
  // Miniseries / limited — whole-object binges
  { hours: "5 hours",  type: "miniseries", showTitle: "Mare of Easttown",  detail: "Seven episodes · one weekend.",      pitch: "Brad Ingelsby's Delco missing-persons case. Winslet works backward through every kitchen in town." },
  { hours: "5 hours",  type: "miniseries", showTitle: "Station Eleven",    detail: "Ten episodes · one arc.",            pitch: "A traveling Shakespeare troupe twenty years after a flu collapses civilization. Made during the pandemic, about something larger." },
  { hours: "9 hours",  type: "miniseries", showTitle: "Band of Brothers",  detail: "Ten episodes · weekend or two.",     pitch: "Easy Company from Toccoa to Berchtesgaden. Still the miniseries the medium measures itself against." },
  { hours: "5 hours",  type: "miniseries", showTitle: "Task",              detail: "Brad Ingelsby returns to HBO.",      pitch: "Ruffalo's FBI task force in the Philadelphia suburbs. Same instrument, sharper key." },
  { hours: "5 hours",  type: "miniseries", showTitle: "Dope Thief",        detail: "Eight episodes · 2025.",             pitch: "Two Philly hustlers ripping the wrong drug house. Brian Tyree Henry and Wagner Moura on broken nerve." },

  // Essential seasons — one perfect run from a longer show
  { hours: "11 hours", type: "season",    showTitle: "Breaking Bad",       detail: "Season 4 only.",                     pitch: "The lily of the valley season. The hit ends a problem, the problem doesn't end. Heisenberg is who Walter chose." },
  { hours: "10 hours", type: "season",    showTitle: "The Americans",      detail: "Season 5.",                          pitch: "Quiet, slow, the marriage straining. Wheat fields and double-binds. Sets up the perfect final season." },
  { hours: "10 hours", type: "season",    showTitle: "Better Call Saul",   detail: "Season 5 only.",                     pitch: "Jimmy becomes Saul; Kim becomes complicit; the desert opens." },
  { hours: "13 hours", type: "season",    showTitle: "The Shield",         detail: "Season 5.",                          pitch: "Forest Whitaker shows up to crack Vic Mackey. The whole show pivots on his work." },
  { hours: "10 hours", type: "season",    showTitle: "Succession",         detail: "Season 3.",                          pitch: "All the Bells Say. The Italian wedding, the deal at the altar, the children realizing what they always were." },

  // Pilot runs — six hours that earn the rest
  { hours: "6 hours",  type: "pilot-run", showTitle: "The Sopranos",       detail: "Episodes 1–6 of Season 1.",          pitch: "The setup: Tony, Carmela, Dr. Melfi, Christopher. If 'College' (S1E5) doesn't land, the show isn't for you. Spoiler: it lands." },
  { hours: "5 hours",  type: "pilot-run", showTitle: "Six Feet Under",     detail: "Episodes 1–5 of Season 1.",          pitch: "The Fishers' funeral home. Death every cold open. Closes with the best finale in TV — but the opening five teach you the show." },
  { hours: "5 hours",  type: "pilot-run", showTitle: "Slow Horses",        detail: "All of Season 1 (six hours).",       pitch: "Jackson Lamb's leper colony. Gary Oldman wearing his coat. Six episodes that hook you for the next four seasons." },
  { hours: "6 hours",  type: "pilot-run", showTitle: "Happy Valley",       detail: "All of Season 1.",                   pitch: "Sarah Lancashire's Sgt. Cawood. Six episodes; an entire town's grief. The first season is the case for the rest." },
  { hours: "6 hours",  type: "pilot-run", showTitle: "The Bureau",         detail: "Season 1 of Le Bureau des Légendes.", pitch: "DGSE undercover ops. Subtitled, French, patient. The slowest first season in spy television; pays off across five." },
];

export default function WeekendPage() {
  const byType = {
    miniseries: PLANS.filter((p) => p.type === "miniseries"),
    season: PLANS.filter((p) => p.type === "season"),
    "pilot-run": PLANS.filter((p) => p.type === "pilot-run"),
  };

  const TYPE_LABEL: Record<Plan["type"], string> = {
    "miniseries": "Whole limited / miniseries",
    "season": "Essential season of a longer show",
    "pilot-run": "Pilot run that earns the rest",
  };

  const TYPE_BLURB: Record<Plan["type"], string> = {
    "miniseries": "Single object, complete arc. Start and finish in one weekend.",
    "season": "If you only watch one. The peak run from a longer series.",
    "pilot-run": "The hook. Watch these and you'll know whether to commit.",
  };

  function findShow(title: string) {
    return series.find((s) => s.title === title);
  }

  return (
    <main className="min-h-screen">
      <div className="border-b border-line px-5 py-4 sm:px-6 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow note flex items-center gap-3">
            <Link href="/" className="hover:text-amber">Pilot Light</Link>
            <span className="text-quiet">/</span>
            <span className="eyebrow--bright">Weekend Plan</span>
          </p>
        </div>
      </div>

      <header className="border-b border-line px-5 py-9 sm:px-6 md:px-16 md:py-14">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow eyebrow--accent">Channel 06 · Weekend Plan</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl md:text-7xl text-paper leading-[1.02] tracking-[-0.02em]">
            One weekend. One show.
          </h1>
          <p className="serif mt-4 max-w-2xl text-lg sm:text-xl italic note">
            Curated short binges from the rail. Five to twelve hours, complete or near-complete arcs.
          </p>
        </div>
      </header>

      <section className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
        <div className="mx-auto max-w-7xl space-y-16">

          {(["miniseries", "season", "pilot-run"] as const).map((type) => (
            <div key={type}>
              <p className="eyebrow eyebrow--accent">{TYPE_LABEL[type]}</p>
              <p className="serif mt-2 max-w-2xl text-base italic note">{TYPE_BLURB[type]}</p>

              <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {byType[type].map((plan) => {
                  const show = findShow(plan.showTitle);
                  if (!show) return null;
                  return (
                    <Link
                      key={plan.showTitle}
                      href={`/series/${seriesSlug(show)}/`}
                      className="tile p-6 group flex flex-col"
                    >
                      <p className="eyebrow eyebrow--accent">{plan.hours}</p>
                      <h3 className="display mt-3 text-2xl sm:text-3xl text-paper group-hover:text-amber transition-colors leading-[1.05]">
                        {show.title}
                      </h3>
                      <p className="serif mt-1 text-sm italic note">
                        {show.creator}
                      </p>
                      <p className="eyebrow eyebrow--small note mt-3">
                        {plan.detail} &nbsp;·&nbsp; {show.network}
                      </p>
                      <p className="serif mt-4 text-base text-paper/90 leading-relaxed">
                        {plan.pitch}
                      </p>
                      <p className="mt-auto pt-5 eyebrow eyebrow--small eyebrow--accent opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                        Open the file →
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <p>
            <Link href="/" className="eyebrow eyebrow--accent hover:text-paper">
              ← Back to the rail
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}
