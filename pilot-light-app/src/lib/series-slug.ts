import { series, type CanonSeries } from "@/lib/series";

function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

export function seriesSlug(s: CanonSeries): string {
  return djb2(s.creator + "###" + s.title).toString(16);
}

export function findSeriesBySlug(slug: string): CanonSeries | undefined {
  return series.find((s) => seriesSlug(s) === slug);
}

export function allSeriesSlugs(): string[] {
  return series.map(seriesSlug);
}
