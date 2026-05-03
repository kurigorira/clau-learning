"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LevelBackground } from "@/components/LevelBackground";
import { themeForLevel, LEVEL_THEMES, TOTAL_LEVELS } from "@/lib/levels";
import { clearWeakCategories, loadProgress } from "@/lib/storage";
import type { Progress } from "@/lib/types";

export default function ProgressPage() {
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

  const weakSorted = Object.entries(progress.weakCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxWeak = weakSorted[0]?.[1] ?? 1;

  // ステージごとの達成率
  const stageProgress = LEVEL_THEMES.map((t) => {
    const [from, to] = t.range;
    const cleared = progress.history.filter(
      (h) => h.level >= from && h.level <= to,
    ).length;
    const total = to - from + 1;
    return { ...t, cleared, total };
  });

  const recentHistory = [...progress.history].slice(-8).reverse();

  function handleClearWeak() {
    if (
      window.confirm(
        "苦手データだけリセットします（レベルや正答率は残ります）。よろしいですか？",
      )
    ) {
      setProgress(clearWeakCategories(progress!));
    }
  }

  return (
    <>
      <LevelBackground theme={theme} />
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm text-sage-200/80 hover:text-sage-50">
            ← ホーム
          </Link>
          <p className="font-display text-xl">学習レポート</p>
        </header>

        {/* Hero stats */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mt-6"
        >
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
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
              <p className="text-xs text-sage-200/70">解いた問題</p>
              <p className="font-display text-3xl">{progress.totalAnswered}</p>
            </div>
            <div>
              <p className="text-xs text-sage-200/70">正答率</p>
              <p className="font-display text-3xl">{accuracyPct}%</p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-sage-700/50">
            <div
              className="h-full rounded-full bg-magic-gold transition-all"
              style={{
                width: `${(progress.currentLevel / TOTAL_LEVELS) * 100}%`,
              }}
            />
          </div>
        </motion.section>

        {/* 苦手分野 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mt-6"
        >
          <h2 className="font-display text-xl">苦手分野ランキング</h2>
          <p className="mt-1 text-xs text-sage-200/70">
            間違えた回数が多い順に上位10件。次のセッションでは ここから
            少し多めに出題されるよ。
          </p>
          {weakSorted.length === 0 ? (
            <p className="mt-4 text-sage-100">
              まだ苦手分野はありません。素晴らしい！
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {weakSorted.map(([cat, count]) => (
                <li key={cat} className="flex items-center gap-3">
                  <span className="w-44 shrink-0 truncate text-sm text-sage-100">
                    {cat}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-sage-700/50">
                    <div
                      className="h-full rounded-full bg-magic-ember"
                      style={{ width: `${(count / maxWeak) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-display text-sm text-magic-ember">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {weakSorted.length > 0 && (
            <button
              type="button"
              onClick={handleClearWeak}
              className="btn-ghost mt-4 text-sm"
            >
              苦手データをリセット
            </button>
          )}
        </motion.section>

        {/* ステージ進捗 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mt-6"
        >
          <h2 className="font-display text-xl">称号別の進み具合</h2>
          <ul className="mt-4 space-y-3">
            {stageProgress.map((s) => {
              const pct = Math.round((s.cleared / s.total) * 100);
              return (
                <li key={s.stage} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-sm">
                    <span className="font-display text-sage-100">
                      {s.title}
                    </span>
                    <span className="ml-1 text-xs text-sage-200/60">
                      Lv {s.range[0]}〜{s.range[1]}
                    </span>
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-sage-700/50">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: s.accent }}
                    />
                  </div>
                  <span className="w-14 text-right font-display text-xs text-sage-200/80">
                    {s.cleared}/{s.total}
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.section>

        {/* 最近のクリア履歴 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mt-6"
        >
          <h2 className="font-display text-xl">最近の足あと</h2>
          {recentHistory.length === 0 ? (
            <p className="mt-3 text-sage-100">
              まだクリア履歴はありません。1問ずつ進もう！
            </p>
          ) : (
            <ul className="mt-3 space-y-1 text-sm">
              {recentHistory.map((h) => {
                const t = themeForLevel(h.level);
                const date = new Date(h.clearedAt);
                return (
                  <li
                    key={h.clearedAt + h.level}
                    className="flex justify-between text-sage-100"
                  >
                    <span>
                      <span className="font-display text-magic-gold">
                        Lv {h.level}
                      </span>{" "}
                      <span className="text-sage-200/70">「{t.title}」</span>
                    </span>
                    <span className="text-xs text-sage-200/60">
                      {date.toLocaleDateString("ja-JP", {
                        month: "numeric",
                        day: "numeric",
                      })}{" "}
                      {date.toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </motion.section>

        <div className="mt-8 text-center">
          <Link href="/" className="btn-primary">
            ホームに戻る
          </Link>
        </div>
      </main>
    </>
  );
}
