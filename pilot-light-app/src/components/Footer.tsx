const BUILD_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 pt-14 pb-12 sm:px-6 md:px-16">
      <div className="mx-auto max-w-6xl">

        {/* Colophon top — broadcast identity */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between mb-10">
          <div>
            <p className="eyebrow eyebrow--quiet mb-3 flex items-center gap-2.5">
              <span className="on-air" aria-hidden="true" />
              Pilot Light &middot; Volume 1
            </p>
            <p className="display text-2xl sm:text-3xl text-paper leading-snug max-w-md">
              The pilot is the spark; everything that follows is the burn.
            </p>
            <p className="serif mt-3 text-base note italic">
              Curated by Jason Chletsos.
            </p>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Footer navigation">
            <a
              href="https://github.com/fivetran-jasonchletsos/Pilot-Light"
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow note hover:text-amber min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-amber/40"
            >
              GitHub
            </a>
            <a
              href="https://www.fivetran.com"
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow note hover:text-amber min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-amber/40"
            >
              Fivetran
            </a>
          </nav>
        </div>

        <div className="border-t border-line pt-6" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <p className="eyebrow eyebrow--small eyebrow--quiet">
              Set in JetBrains Mono and Fraunces
            </p>
            <p className="eyebrow eyebrow--small eyebrow--quiet">
              Built with Next.js &middot; Tailwind CSS
            </p>
          </div>
          <div className="text-right">
            <p className="eyebrow eyebrow--small eyebrow--quiet">
              v0.1 &middot; {BUILD_YEAR}
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
