import { series, onAirCount } from "@/lib/series";

// Pilot Light hero — broadcast station identification.
// JetBrains Mono headline at editorial scale (110-180px on desktop).

export default function Hero() {
  const total = series.length;
  const earliest = series.reduce((a, b) => (a.yearStart < b.yearStart ? a : b)).yearStart;
  const networks = new Set(series.map((s) => s.network)).size;

  return (
    <header className="relative border-b border-line overflow-hidden">
      {/* Amber stripe — broadcast on-air indicator */}
      <div aria-hidden="true" style={{ height: "2px", background: "linear-gradient(90deg, #a4762d 0%, #c19243 40%, #6e4b14 100%)" }} />

      {/* One-time amber sweep — CRT warming up */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(110deg, transparent 25%, rgba(193,146,67,0.10) 50%, transparent 75%)",
          backgroundSize: "200% 100%",
          animation: "hero-sweep 1.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      />

      <div className="relative px-5 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl flex flex-col gap-y-8 md:flex-row md:items-end md:justify-between md:gap-x-10">

          {/* Left — station identification */}
          <div className="min-w-0 flex-1" style={{ animation: "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <p className="eyebrow eyebrow--accent flex items-center gap-3">
              <span className="on-air" aria-hidden="true" />
              Pilot Light &nbsp;/&nbsp; Channel 01
            </p>
            <h1
              className="display mt-5 text-paper leading-[0.95] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(2.75rem, 10vw, 9rem)",
                animation: "fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
              }}
            >
              The pilot is the spark.
            </h1>
            <h1
              className="display text-amber leading-[0.95] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(2.75rem, 10vw, 9rem)",
                animation: "fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both",
              }}
            >
              Everything that follows<br className="hidden sm:inline" /> is the burn.
            </h1>
            <p
              className="serif mt-6 max-w-2xl text-lg sm:text-xl text-paper/85 leading-relaxed"
              style={{ animation: "fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both" }}
            >
              Television worth your time, curated by{" "}
              <span className="text-amber">Jason Chletsos</span>. Procedural to prestige,
              broadcast to streaming, the shows that earn the screen.
            </p>
          </div>

          {/* Right — broadcast stats */}
          <div
            className="shrink-0 md:w-[300px]"
            style={{ animation: "fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both" }}
          >
            <div className="border border-line bg-surface/70 backdrop-blur-sm p-6">
              <p className="eyebrow eyebrow--quiet">Broadcast log</p>
              <dl className="mt-5 space-y-4">
                <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
                  <dt className="eyebrow note">On the rail</dt>
                  <dd className="display text-3xl text-paper">{total}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
                  <dt className="eyebrow note">Networks</dt>
                  <dd className="display text-3xl text-paper">{networks}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
                  <dt className="eyebrow note">On air now</dt>
                  <dd className="display text-3xl text-amber">{onAirCount}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="eyebrow note">Earliest</dt>
                  <dd className="display text-3xl text-paper">{earliest}</dd>
                </div>
              </dl>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
