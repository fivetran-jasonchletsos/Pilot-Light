"use client";

import { useState } from "react";
import Link from "next/link";
import {
  recommend,
  MOOD_CHOICES,
  ERA_CHOICES,
  TIME_CHOICES,
  LOAD_CHOICES,
  FAMILIAR_CHOICES,
  type Answers,
  type Mood,
  type EraPick,
  type TimePick,
  type Load,
  type Familiar,
  type Choice,
} from "@/lib/recommend";
import { yearLabel } from "@/lib/series";
import { seriesSlug } from "@/lib/series-slug";

type Stage = 0 | 1 | 2 | 3 | 4 | 5; // 0–4 are questions, 5 is result

export default function TonightPage() {
  const [stage, setStage] = useState<Stage>(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [era, setEra] = useState<EraPick | null>(null);
  const [time, setTime] = useState<TimePick | null>(null);
  const [load, setLoad] = useState<Load | null>(null);
  const [familiar, setFamiliar] = useState<Familiar | null>(null);

  function reset() {
    setStage(0);
    setMood(null);
    setEra(null);
    setTime(null);
    setLoad(null);
    setFamiliar(null);
  }

  function back() {
    if (stage > 0) setStage((stage - 1) as Stage);
  }

  return (
    <main className="min-h-screen px-5 py-12 sm:px-6 sm:py-16 md:px-16">
      <div className="mx-auto max-w-3xl">

        <p className="eyebrow eyebrow--accent flex items-center gap-3">
          <span className="on-air" aria-hidden="true" />
          Channel 05 &middot; Tonight
        </p>
        <h1 className="display mt-4 text-4xl sm:text-5xl md:text-6xl text-paper leading-[1.05]">
          What are we watching?
        </h1>
        <p className="serif mt-4 text-lg sm:text-xl italic text-paper/80 leading-relaxed">
          Five questions. The rail will answer.
        </p>

        {/* Progress dots */}
        <div className="mt-10 flex items-center gap-2" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={
                "h-1.5 flex-1 transition-colors " +
                (stage === 5
                  ? "bg-amber"
                  : i < stage
                  ? "bg-amber"
                  : i === stage
                  ? "bg-amber/60"
                  : "bg-line")
              }
            />
          ))}
        </div>

        {/* Stages */}
        <div className="mt-10">
          {stage === 0 && (
            <QuestionPanel
              number={1}
              prompt="What's the mood tonight?"
              choices={MOOD_CHOICES}
              value={mood}
              onPick={(v) => { setMood(v); setStage(1); }}
            />
          )}
          {stage === 1 && (
            <QuestionPanel
              number={2}
              prompt="What era?"
              choices={ERA_CHOICES}
              value={era}
              onPick={(v) => { setEra(v); setStage(2); }}
            />
          )}
          {stage === 2 && (
            <QuestionPanel
              number={3}
              prompt="How much time?"
              choices={TIME_CHOICES}
              value={time}
              onPick={(v) => { setTime(v); setStage(3); }}
            />
          )}
          {stage === 3 && (
            <QuestionPanel
              number={4}
              prompt="What's your mental load?"
              choices={LOAD_CHOICES}
              value={load}
              onPick={(v) => { setLoad(v); setStage(4); }}
            />
          )}
          {stage === 4 && (
            <QuestionPanel
              number={5}
              prompt="Familiar or new?"
              choices={FAMILIAR_CHOICES}
              value={familiar}
              onPick={(v) => { setFamiliar(v); setStage(5); }}
            />
          )}
          {stage === 5 && mood && era && time && load && familiar && (
            <Result
              answers={{ mood, era, time, load, familiar }}
              onReset={reset}
            />
          )}
        </div>

        {/* Back / cancel */}
        {stage > 0 && stage < 5 && (
          <div className="mt-12 flex gap-6 border-t border-line pt-6">
            <button
              type="button"
              onClick={back}
              className="eyebrow note hover:text-amber min-h-[44px]"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={reset}
              className="eyebrow note hover:text-amber min-h-[44px] ml-auto"
            >
              Start over
            </button>
          </div>
        )}

      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// QuestionPanel — one question, N choices.
// ---------------------------------------------------------------------------

function QuestionPanel<T extends string>({
  number,
  prompt,
  choices,
  value,
  onPick,
}: {
  number: number;
  prompt: string;
  choices: readonly Choice<T>[];
  value: T | null;
  onPick: (v: T) => void;
}) {
  return (
    <div style={{ animation: "fadeUp 0.5s ease-out both" }}>
      <p className="eyebrow eyebrow--quiet">Question {number} of 5</p>
      <h2 className="display mt-3 text-3xl sm:text-4xl text-paper leading-[1.1]">
        {prompt}
      </h2>
      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {choices.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick(c.id)}
            aria-pressed={value === c.id}
            className={
              "tile group text-left p-5 transition focus:outline-none focus:ring-2 focus:ring-amber/40 min-h-[88px] " +
              (value === c.id ? "border-amber bg-surface-2" : "")
            }
          >
            <p className="display text-lg sm:text-xl text-paper group-hover:text-amber transition-colors">
              {c.label}
            </p>
            <p className="serif mt-1.5 text-sm italic note">
              {c.hint}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result — pick + 2 runners-up.
// ---------------------------------------------------------------------------

function Result({ answers, onReset }: { answers: Answers; onReset: () => void }) {
  const { pick, runners } = recommend(answers);

  return (
    <div style={{ animation: "fadeUp 0.6s ease-out both" }}>
      <p className="eyebrow eyebrow--accent flex items-center gap-3">
        <span className="on-air" aria-hidden="true" />
        Tune in &middot; Tonight's pick
      </p>

      <article className="mt-6 tile p-6 sm:p-8 hover:border-amber">
        <p className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="eyebrow--accent">{pick.network}</span>
          <span className="text-quiet">·</span>
          <span>{yearLabel(pick)}</span>
          <span className="text-quiet">·</span>
          <span>{pick.seasons} {pick.seasons === 1 ? "season" : "seasons"}</span>
          <span className="text-quiet">·</span>
          <span>{pick.format}</span>
        </p>
        <h3 className="display mt-3 text-4xl sm:text-5xl md:text-6xl text-paper leading-[1.05]">
          {pick.title}
        </h3>
        <p className="serif mt-3 text-lg italic note">
          Created by {pick.creator}
        </p>
        <p className="serif mt-5 text-lg sm:text-xl text-paper leading-relaxed">
          {pick.note}
        </p>
        {pick.bestSeason || pick.bestEpisode ? (
          <p className="eyebrow eyebrow--accent mt-5">
            {pick.bestEpisode
              ? `Start with S${pick.bestEpisode.season} E${pick.bestEpisode.episode} — "${pick.bestEpisode.title}"`
              : `Start with season ${pick.bestSeason}`}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/series/${seriesSlug(pick)}/`}
            className="inline-flex items-center gap-2 bg-amber px-5 py-3 font-mono text-sm uppercase tracking-[0.15em] text-ink min-h-[44px] hover:bg-ember transition focus:outline-none focus:ring-2 focus:ring-amber/40"
          >
            Open the file →
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 border border-line px-5 py-3 font-mono text-sm uppercase tracking-[0.15em] text-paper min-h-[44px] hover:border-amber hover:text-amber transition focus:outline-none focus:ring-2 focus:ring-amber/40"
          >
            Ask again
          </button>
        </div>
      </article>

      {runners.length > 0 ? (
        <div className="mt-10">
          <p className="eyebrow eyebrow--quiet">Also worth your night</p>
          <ul className="mt-4 space-y-2.5">
            {runners.map((r) => (
              <li key={`${r.creator}-${r.title}`}>
                <Link
                  href={`/series/${seriesSlug(r)}/`}
                  className="group flex items-baseline justify-between gap-4 border-b border-line pb-2.5 hover:border-amber"
                >
                  <div className="min-w-0">
                    <p className="display text-lg sm:text-xl text-paper group-hover:text-amber transition-colors truncate">
                      {r.title}
                    </p>
                    <p className="serif text-sm italic note">{r.creator}</p>
                  </div>
                  <p className="eyebrow note shrink-0">{r.network} · {yearLabel(r)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-12">
        <Link href="/" className="eyebrow eyebrow--accent hover:text-paper">
          ← Back to the rail
        </Link>
      </p>
    </div>
  );
}
