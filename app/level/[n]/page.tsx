"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LevelBackground } from "@/components/LevelBackground";
import { WizardCharacter } from "@/components/WizardCharacter";
import { QuestionCard } from "@/components/QuestionCard";
import { AnswerInput } from "@/components/AnswerInput";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { LevelUpModal } from "@/components/LevelUpModal";
import { ProgressDots } from "@/components/ProgressDots";
import { themeForLevel } from "@/lib/levels";
import {
  AVAILABLE_LEVELS,
  QUESTIONS_PER_SESSION,
  pickSession,
  getQuestionsForLevel,
} from "@/lib/questions";
import { gradeLocally } from "@/lib/grading";
import {
  clearLevel,
  loadProgress,
  recordAnswer,
  saveProgress,
} from "@/lib/storage";
import type { GradeResponse, Question } from "@/lib/types";

type Phase = "answering" | "grading" | "feedback" | "complete";
type Result = "correct" | "wrong" | null;

export default function LevelPage() {
  const params = useParams<{ n: string }>();
  const router = useRouter();
  const level = Math.max(1, Math.min(100, Number(params.n) || 1));
  const theme = useMemo(() => themeForLevel(level), [level]);

  const [seed] = useState<number>(() => Date.now());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [results, setResults] = useState<Result[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [aiResult, setAiResult] = useState<GradeResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const isPlayable = AVAILABLE_LEVELS.includes(level);

  useEffect(() => {
    if (!isPlayable) return;
    const progress = loadProgress();
    setQuestions(pickSession(level, progress.weakCategories, seed));
    setIndex(0);
    setPhase("answering");
    setResults(Array(QUESTIONS_PER_SESSION).fill(null));
    setSelected(undefined);
    setAiResult(null);
    setAiError(null);
  }, [level, seed, isPlayable]);

  if (!isPlayable) {
    return (
      <>
        <LevelBackground theme={theme} />
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 py-10 text-center">
          <p className="font-display text-2xl">
            レベル {level} はまだ準備中です
          </p>
          <p className="mt-2 text-sage-200/70">
            現在プレイ可能なレベル： {AVAILABLE_LEVELS.join(", ")}
          </p>
          <Link href="/" className="btn-primary mt-6">
            ホームに戻る
          </Link>
        </main>
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-sage-200">問題を準備中…</div>
      </main>
    );
  }

  const current = questions[index];

  async function handleSubmit(answer: string) {
    if (phase !== "answering") return;
    setSelected(answer);
    setAiError(null);

    if (current.type === "free_text") {
      setPhase("grading");
      try {
        const res = await fetch("/api/grade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: current, userAnswer: answer }),
        });
        const data = (await res.json()) as
          | GradeResponse
          | { error: string };
        if (!res.ok || "error" in data) {
          const message = "error" in data ? data.error : "採点に失敗しました";
          setAiError(message);
          setPhase("answering");
          return;
        }
        setAiResult(data);
        const correct = data.correct;
        setLastCorrect(correct);
        const updated = [...results];
        updated[index] = correct ? "correct" : "wrong";
        setResults(updated);
        const progress = loadProgress();
        saveProgress(recordAnswer(progress, current.category, correct));
        setPhase("feedback");
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "通信エラーが発生しました";
        setAiError(message);
        setPhase("answering");
      }
      return;
    }

    const correct = gradeLocally(current, answer);
    setLastCorrect(correct);
    setAiResult(null);
    const updated = [...results];
    updated[index] = correct ? "correct" : "wrong";
    setResults(updated);
    const progress = loadProgress();
    saveProgress(recordAnswer(progress, current.category, correct));
    setPhase("feedback");
  }

  function handleNext() {
    if (lastCorrect) {
      const nextIdx = index + 1;
      if (nextIdx >= QUESTIONS_PER_SESSION) {
        const progress = loadProgress();
        const cleared = clearLevel(progress, level);
        saveProgress(cleared);
        setPhase("complete");
        setShowLevelUp(true);
        return;
      }
      setIndex(nextIdx);
      setSelected(undefined);
      setAiResult(null);
      setPhase("answering");
    } else {
      const pool = getQuestionsForLevel(level);
      const others = pool.filter((q) => q.id !== current.id);
      if (others.length === 0) {
        setSelected(undefined);
        setAiResult(null);
        setPhase("answering");
        return;
      }
      const replacement = others[Math.floor(Math.random() * others.length)];
      const next = [...questions];
      next[index] = replacement;
      setQuestions(next);
      const updated = [...results];
      updated[index] = null;
      setResults(updated);
      setSelected(undefined);
      setAiResult(null);
      setPhase("answering");
    }
  }

  return (
    <>
      <LevelBackground theme={theme} />
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-6">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm text-sage-200/80 hover:text-sage-50">
            ← ホーム
          </Link>
          <div className="text-right">
            <p className="text-xs text-sage-200/70">{theme.title}</p>
            <p className="font-display text-xl">レベル {level}</p>
          </div>
        </header>

        <div className="mt-3 flex items-center justify-center gap-4">
          <WizardCharacter
            variant={theme.characterVariant}
            accent={theme.accent}
            size={120}
            stage={theme.stage}
            emoting={phase === "feedback" && lastCorrect ? "celebrate" : "think"}
          />
          <div className="flex-1">
            <ProgressDots
              total={QUESTIONS_PER_SESSION}
              current={index}
              results={results}
            />
            <p className="mt-2 text-center text-xs text-sage-200/70">
              5問連続正解でレベルアップ
            </p>
          </div>
        </div>

        <div className="mt-6 flex-1 space-y-4">
          <QuestionCard
            question={current}
            index={index}
            total={QUESTIONS_PER_SESSION}
          />

          <AnswerInput
            question={current}
            disabled={phase !== "answering"}
            loading={phase === "grading"}
            selected={selected}
            feedback={
              phase === "feedback" ? (lastCorrect ? "correct" : "wrong") : null
            }
            onSubmit={handleSubmit}
          />

          {aiError && (
            <p className="rounded-2xl border border-magic-ember/40 bg-magic-ember/10 p-3 text-sm text-magic-ember">
              採点エラー: {aiError}
            </p>
          )}

          {phase === "feedback" && (
            <FeedbackPanel
              question={current}
              correct={lastCorrect}
              ai={aiResult}
              onNext={handleNext}
            />
          )}
        </div>

        <LevelUpModal
          open={showLevelUp}
          fromLevel={level}
          toLevel={Math.min(level + 1, 100)}
          onContinue={() => {
            setShowLevelUp(false);
            const next = level + 1;
            if (AVAILABLE_LEVELS.includes(next)) {
              router.push(`/level/${next}`);
            } else {
              router.push("/");
            }
          }}
          onHome={() => {
            setShowLevelUp(false);
            router.push("/");
          }}
        />
      </main>
    </>
  );
}
