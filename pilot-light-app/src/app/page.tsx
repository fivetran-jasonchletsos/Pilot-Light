import { Suspense } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import SeriesCatalog from "@/components/SeriesCatalog";
import { series } from "@/lib/series";

type HubCard = {
  number: string;
  href: string;
  title: string;
  blurb: string;
  glyph: string;
};

const HUB: HubCard[] = [
  {
    number: "02",
    href: "/showrunners",
    title: "Showrunners",
    blurb:
      "The people behind the rail. Career arcs across multiple series — Gilligan + Gould, the Kings, Ingelsby, Milch — with the work that built them.",
    glyph: "names · careers · the writing room",
  },
  {
    number: "03",
    href: "/seasons",
    title: "Season Heatmap",
    blurb:
      "Every show, every season, in one grid. Quality plotted across years. The view only episodic media gives you.",
    glyph: "rows = shows · cols = seasons",
  },
  {
    number: "04",
    href: "/eras",
    title: "Eras",
    blurb:
      "First Golden Age · Peak Cable · Streaming Era. Three theses on television's last twenty-five years, each anchored by signature work.",
    glyph: "1997 → now · in thirds",
  },
  {
    number: "05",
    href: "/tonight",
    title: "Tonight",
    blurb:
      "Three honest questions about tonight — mood, runtime budget, mental load. The matcher picks the episode that fits.",
    glyph: "3 questions · 1 episode",
  },
  {
    number: "06",
    href: "/weekend",
    title: "Weekend Plan",
    blurb:
      "Six hours, one curated short binge. Whole miniseries, or a perfect run from a longer show.",
    glyph: "6h · one arc",
  },
  {
    number: "07",
    href: "/pilots",
    title: "Pilot Wall",
    blurb:
      "First episodes only. Would you start any of these tonight? A grid built around the spark.",
    glyph: "S1 · E1 · every show",
  },
];

export default function Home() {
  const total = series.length;

  return (
    <main className="min-h-screen">
      <Hero />

      <Section
        number="01"
        title="The Rail"
        blurb={`${total} series. Sort, filter, find what's worth tonight.`}
      >
        <div id="rail" />
        <Suspense fallback={<p className="serif text-paper/40">Loading the rail…</p>}>
          <SeriesCatalog />
        </Suspense>
      </Section>

      <Section
        number="·"
        title="Around the rail"
        blurb="The shows are the point. Everything else here is in support of them."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HUB.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group tile flex flex-col gap-3 p-7 no-underline
                focus:outline-none focus:ring-2 focus:ring-amber/40"
            >
              <p className="eyebrow eyebrow--accent">{card.number}</p>
              <h3 className="display text-2xl sm:text-3xl text-paper leading-snug">{card.title}</h3>
              <p className="serif text-sm italic note">{card.glyph}</p>
              <p className="serif text-base text-paper/85 mt-auto pt-3 leading-relaxed">
                {card.blurb}
              </p>
              <span className="eyebrow note group-hover:text-amber transition">Open →</span>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
