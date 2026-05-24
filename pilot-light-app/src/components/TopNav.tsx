"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { num: "01", href: "/", label: "The Rail" },
  { num: "02", href: "/showrunners", label: "Showrunners" },
  { num: "03", href: "/seasons", label: "Season Heatmap" },
  { num: "04", href: "/eras", label: "Eras" },
  { num: "05", href: "/tonight", label: "Tonight" },
  { num: "06", href: "/weekend", label: "Weekend Plan" },
  { num: "07", href: "/pilots", label: "Pilot Wall" },
  { num: "08", href: "/stats", label: "Stats" },
];

export default function TopNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-30 bg-ink/85 backdrop-blur-md border-b border-line">
      <div aria-hidden="true" style={{ height: "2px", background: "linear-gradient(90deg, #a4762d 0%, #c19243 50%, #6e4b14 100%)" }} />

      <div className="mx-auto flex max-w-7xl items-center gap-x-6 gap-y-2 px-4 py-3 overflow-x-auto sm:px-6 sm:py-4 md:px-10">
        <Link
          href="/"
          className="flex-none flex items-center gap-2.5 display text-xl text-paper hover:text-amber min-h-[44px]
            focus:outline-none focus:ring-2 focus:ring-amber/40 sm:text-2xl"
          aria-label="Pilot Light home"
        >
          <span className="on-air" aria-hidden="true" />
          <span className="hidden sm:inline">Pilot Light</span>
        </Link>

        <nav
          aria-label="Primary"
          className="flex flex-1 flex-nowrap items-center gap-x-6 sm:gap-x-7"
        >
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group flex flex-none items-baseline gap-2 py-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-amber/40 focus:ring-offset-2 focus:ring-offset-ink"
              >
                <span
                  className={
                    "hidden sm:inline font-mono text-sm tracking-[0.2em] uppercase " +
                    (active ? "text-amber" : "text-amber/65")
                  }
                  aria-hidden="true"
                >
                  {item.num}
                </span>
                <span
                  className={
                    "display text-base sm:text-lg transition-colors " +
                    (active ? "text-paper" : "text-paper/65 group-hover:text-paper")
                  }
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
