"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LevelBackground } from "@/components/LevelBackground";
import { WizardCharacter } from "@/components/WizardCharacter";
import { themeForLevel, STUDENT_FIRST, TOTAL_LEVELS } from "@/lib/levels";
import { loadProgress, resetProgress } from "@/lib/storage";
import { AVAILABLE_LEVELS } from "@/lib/questions";
import type { Progress } from "@/lib/types";

export default function HomePage() {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-sage-200">読み込み中…</div>
      </main>
    );
  }

  const theme = themeForLevel(progress.currentLevel);
  const accuracyPct =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : 0;
  const currentLevelPlayable = AVAILABLE_LEVELS.includes(progress.currentLevel);
  const nextPlayable = currentLevelPlayable
    ? progress.currentLevel
    : (AVAILABLE_LEVELS.find((l) => l >= progress.currentLevel) ??
      AVAILABLE_LEVELS[AVAILABLE_LEVELS.length - 1]);

  return (
    <>
      <LevelBackground theme={theme} />
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-10">
        <header className="text-center">
          <p className="font-display text-sm tracking-widest text-sage-200/80">
            賢者への道
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">
            {STUDENT_FIRST} の数学修行
          </h1>
        </header>

        <section className="mt-8 flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <WizardCharacter
              variant={theme.characterVariant}
              accent={theme.accent}
              size={240}
            />
          </motion.div>
          <div className="text-center">
            <p className="text-sage-200/80">現在の称号</p>
            <p className="font-display text-3xl text-magic-gold">
              {theme.title}
            </p>
            <p className="text-sm text-sage-200/70">{theme.subtitle}</p>
          </div>
        </section>

        <section className="card mt-8">
          <div className="grid grid-cols-3 text-center">
            <div>
              <p className="text-xs text-sage-200/70">現在レベル</p>
              <p className="font-display text-3xl text-magic-gold">
                {progress.currentLevel}
              </p>
            </div>
            <div>
              <p className="text-xs text-sage-200/70">最高到達</p>
              <p className="font-display text-3xl">{progress.highestLevel}</p>
            </div>
            <div>
              <p className="text-xs text-sage-200/70">正答率</p>
              <p className="font-display text-3xl">{accuracyPct}%</p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-sage-700/50">
            <div
              className="h-full rounded-full bg-magic-gold"
              style={{
                width: `${(progress.currentLevel / TOTAL_LEVELS) * 100}%`,
              }}
            />
          </div>
          <p className="mt-2 text-right text-xs text-sage-200/60">
            あと {TOTAL_LEVELS - progress.currentLevel} レベルで賢者
          </p>
        </section>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Link href={`/level/${nextPlayable}`} className="btn-primary text-lg">
            {currentLevelPlayable
              ? `レベル ${progress.currentLevel} に挑戦する`
              : `レベル ${nextPlayable} を試す`}
          </Link>
          {!currentLevelPlayable && (
            <p className="text-xs text-magic-gold">
              レベル {progress.currentLevel} の問題はまだ準備中。今は{" "}
              {AVAILABLE_LEVELS[0]}〜{AVAILABLE_LEVELS[AVAILABLE_LEVELS.length - 1]}{" "}
              までプレイできます。
            </p>
          )}
          <Link href={`/level/1`} className="btn-ghost text-sm">
            レベル1から復習する
          </Link>
        </div>

        <details className="mt-10 text-center text-xs text-sage-300/60">
          <summary className="cursor-pointer">設定</summary>
          <button
            type="button"
            className="mt-3 underline"
            onClick={() => {
              if (
                window.confirm(
                  "本当に進捗をリセットしますか？レベルが1に戻ります。",
                )
              ) {
                setProgress(resetProgress());
              }
            }}
          >
            進捗をリセット
          </button>
        </details>
      </main>
    </>
  );
}
