import { series } from "@/lib/series";

// Pilot Light hero — a broadcast hash card. Mono headline, ON-AIR pip,
// curator byline. Reads like a station identification before the show.

export default function Hero() {
  const total = series.length;
  const earliest = series.reduce((a, b) => (a.yearStart < b.yearStart ? a : b)).yearStart;
  const networks = new Set(series.map((s) => s.network)).size;

  return (
    <header className="relative border-b border-line overflow-hidden">
      {/* Thin amber stripe — broadcast on-air indicator */}
      <div aria-hidden="true" style={{ height: "2px", background: "linear-gradient(90deg, #a4762d 0%, #c19243 40%, #6e4b14 100%)" }} />

      <div className="px-5 py-9 sm:px-6 sm:py-12 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl flex flex-col gap-y-7 md:flex-row md:items-end md:justify-between md:gap-x-10">

          {/* Left — station identification */}
          <div className="min-w-0">
            <p className="eyebrow eyebrow--accent flex items-center gap-3">
              <span className="on-air" aria-hidden="true" />
              Pilot Light &nbsp;/&nbsp; Channel 01
            </p>
            <h1 className="display mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-paper leading-[1.05]">
              The pilot is the spark.<br />
              <span className="text-amber">Everything that follows is the burn.</span>
            </h1>
            <p className="serif mt-5 max-w-2xl text-lg sm:text-xl text-paper/85 leading-relaxed">
              Television worth your time, curated by{" "}
              <span className="text-amber">Jason Chletsos</span>. Procedural to prestige,
              broadcast to streaming, the shows that earn the screen.
            </p>
          </div>

          {/* Right — broadcast stats card */}
          <div className="shrink-0 md:w-[280px]">
            <div className="border border-line bg-surface/60 p-5">
              <p className="eyebrow eyebrow--quiet">Tonight's broadcast</p>
              <dl className="mt-4 space-y-3.5">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="eyebrow note">Series on the rail</dt>
                  <dd className="display text-2xl text-paper">{total}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="eyebrow note">Networks</dt>
                  <dd className="display text-2xl text-paper">{networks}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="eyebrow note">Earliest</dt>
                  <dd className="display text-2xl text-paper">{earliest}</dd>
                </div>
              </dl>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
