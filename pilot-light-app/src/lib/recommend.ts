import { series, type CanonSeries } from "@/lib/series";

// ---------------------------------------------------------------------------
// Five-question recommender. Each answer contributes a score delta to every
// show. Highest total wins. Designed so a missing/weak answer doesn't trash
// the result — every question is "soft" weighted.
// ---------------------------------------------------------------------------

export type Mood = "escape" | "sharp" | "grace" | "dark-laughs" | "comfort";
export type EraPick = "2020s" | "2010s" | "2000s" | "older" | "any";
export type TimePick = "one-ep" | "short-evening" | "few-nights" | "weekend" | "long-haul";
export type Load = "background" | "half" | "full" | "wrecked";
export type Familiar = "surprise" | "new" | "comfort";

export type Answers = {
  mood: Mood;
  era: EraPick;
  time: TimePick;
  load: Load;
  familiar: Familiar;
};

export type Recommendation = {
  pick: CanonSeries;
  runners: CanonSeries[];
  scoreById: Map<string, number>;
};

// ---------------------------------------------------------------------------
// Tag/keyword weights. Higher = better match for the show.
// ---------------------------------------------------------------------------

const MOOD_GENRE_WEIGHTS: Record<Mood, Record<string, number>> = {
  escape:        { "action": 5, "sci-fi": 4, "thriller": 3, "comedy": 3, "sports": 4, "animation": 3, "miniseries": 2 },
  sharp:         { "drama": 4, "mystery": 5, "thriller": 4, "procedural": 4, "crime": 4, "prestige": 3 },
  grace:         { "drama": 5, "prestige": 5, "miniseries": 4 },
  "dark-laughs": { "dark-comedy": 6, "comedy": 4, "drama": 1 },
  comfort:       { "comedy": 5, "procedural": 5, "crime": 2, "drama": 1, "animation": 2 },
};

const LOAD_GENRE_WEIGHTS: Record<Load, Record<string, number>> = {
  background: { "procedural": 4, "comedy": 4, "animation": 3, "crime": 2 },
  half:       { "procedural": 3, "comedy": 3, "crime": 3, "mystery": 2 },
  full:       { "drama": 4, "mystery": 4, "thriller": 3, "crime": 2, "sci-fi": 3 },
  wrecked:    { "drama": 6, "prestige": 6, "miniseries": 4, "war": 5 },
};

function eraScore(show: CanonSeries, era: EraPick): number {
  if (era === "any") return 0;
  const y = show.yearStart;
  if (era === "2020s") return y >= 2020 ? 4 : y >= 2018 ? 1 : -2;
  if (era === "2010s") return y >= 2010 && y < 2020 ? 4 : Math.abs(y - 2015) <= 4 ? 1 : -1;
  if (era === "2000s") return y >= 2000 && y < 2010 ? 4 : Math.abs(y - 2005) <= 4 ? 1 : -1;
  // older
  return y < 2000 ? 4 : y < 2005 ? 1 : -2;
}

function timeScore(show: CanonSeries, time: TimePick): number {
  // For "one episode" any show works — slight preference for procedurals where
  // a single episode is self-contained.
  if (time === "one-ep") {
    return show.genres.includes("procedural") || show.genres.includes("comedy") ? 3 : 1;
  }
  // Short evening: 3-5 hours total — best for limited / miniseries / very short season.
  if (time === "short-evening") {
    if (show.format === "miniseries" || show.format === "limited") return 6;
    if (show.seasons === 1) return 4;
    return 1;
  }
  // Few nights: 6-10 hours — miniseries, limited, or a tight short season.
  if (time === "few-nights") {
    if (show.format === "miniseries" || show.format === "limited") return 5;
    if (show.seasons <= 2) return 3;
    return 0;
  }
  // Weekend: 8-15 hours — short multi-season or a tight series.
  if (time === "weekend") {
    if (show.seasons >= 1 && show.seasons <= 3) return 4;
    if (show.seasons === 4) return 2;
    return -1;
  }
  // Long haul: 4+ seasons.
  if (show.seasons >= 5) return 5;
  if (show.seasons === 4) return 2;
  return -3;
}

function familiarScore(show: CanonSeries, familiar: Familiar): number {
  // We use "popularity by network familiarity" as a proxy.
  // Big-network primetime = comfort. Streaming + cable foreign-language = new.
  const network = show.network;
  const bigNetwork = /\b(NBC|CBS|ABC|Fox|HBO)\b/i.test(network);
  const streamerOrCable = /\b(Netflix|Apple TV\+|Amazon|FX|AMC|Showtime|Peacock|Hulu|HBO Max|Max|Cinemax|Starz|Sundance|Paramount\+)\b/i.test(network);
  const foreignOrIndie = /\b(BBC|ITV|Sky|Canal\+|Yes|DirecTV)\b/i.test(network);

  if (familiar === "comfort") {
    if (bigNetwork) return 4;
    if (streamerOrCable) return 1;
    return -1;
  }
  if (familiar === "new") {
    if (foreignOrIndie) return 4;
    if (streamerOrCable) return 2;
    return -1;
  }
  // surprise — small bonus for variety, no big lean
  return 1;
}

function moodScore(show: CanonSeries, mood: Mood): number {
  const map = MOOD_GENRE_WEIGHTS[mood];
  let s = 0;
  for (const g of show.genres) {
    s += map[g] ?? 0;
  }
  return s;
}

function loadScore(show: CanonSeries, load: Load): number {
  const map = LOAD_GENRE_WEIGHTS[load];
  let s = 0;
  for (const g of show.genres) {
    s += map[g] ?? 0;
  }
  return s;
}

// Stable jitter so ties resolve deterministically per show.
function jitter(show: CanonSeries): number {
  let h = 5381;
  const s = show.creator + show.title;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 10000; // tiny <0.1
}

export function recommend(answers: Answers): Recommendation {
  const scoreById = new Map<string, number>();
  const scored = series.map((show) => {
    const score =
      moodScore(show, answers.mood) +
      eraScore(show, answers.era) +
      timeScore(show, answers.time) +
      loadScore(show, answers.load) +
      familiarScore(show, answers.familiar) +
      jitter(show);
    const id = `${show.creator}::${show.title}`;
    scoreById.set(id, Math.round(score * 10) / 10);
    return { show, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const pick = scored[0].show;
  const runners = scored.slice(1, 4).map((s) => s.show);

  return { pick, runners, scoreById };
}

// ---------------------------------------------------------------------------
// Question copy. Lives next to the scoring so the two stay in sync.
// ---------------------------------------------------------------------------

export type Choice<T extends string> = { id: T; label: string; hint: string };

export const MOOD_CHOICES: Choice<Mood>[] = [
  { id: "escape",       label: "Pure escape",       hint: "Get me out of my head." },
  { id: "sharp",        label: "Sharp focus",       hint: "I want to think." },
  { id: "grace",        label: "Slow grace",        hint: "Let it breathe." },
  { id: "dark-laughs",  label: "Dark laughs",       hint: "Make it funny and mean." },
  { id: "comfort",      label: "Comfort rewatch",   hint: "Something familiar." },
];

export const ERA_CHOICES: Choice<EraPick>[] = [
  { id: "2020s", label: "This decade",      hint: "2020 onward" },
  { id: "2010s", label: "Recent",           hint: "2010 – 2019" },
  { id: "2000s", label: "Modern classic",   hint: "2000 – 2009" },
  { id: "older", label: "Old-school",       hint: "Before 2000" },
  { id: "any",   label: "Doesn't matter",   hint: "Any era" },
];

export const TIME_CHOICES: Choice<TimePick>[] = [
  { id: "one-ep",        label: "One episode",     hint: "An hour, give or take" },
  { id: "short-evening", label: "Short evening",   hint: "3 – 5 hours" },
  { id: "few-nights",    label: "A few nights",    hint: "6 – 10 hours" },
  { id: "weekend",       label: "A weekend",       hint: "10 – 20 hours" },
  { id: "long-haul",     label: "Long haul",       hint: "A whole season run" },
];

export const LOAD_CHOICES: Choice<Load>[] = [
  { id: "background", label: "Background",       hint: "I'm doing something else" },
  { id: "half",       label: "Half-attention",   hint: "Phone's nearby" },
  { id: "full",       label: "Full attention",   hint: "Lights down" },
  { id: "wrecked",    label: "I want to be wrecked", hint: "Earn the screen" },
];

export const FAMILIAR_CHOICES: Choice<Familiar>[] = [
  { id: "surprise", label: "Surprise me",          hint: "I trust the rail" },
  { id: "new",      label: "Take me somewhere new", hint: "Less-traveled picks" },
  { id: "comfort",  label: "Comfort food",          hint: "Big networks, broad appeal" },
];
