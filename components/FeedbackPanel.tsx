"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { playCorrect, playWrong } from "@/lib/sound";
import type { GradeResponse, Question } from "@/lib/types";

interface Props {
  question: Question;
  correct: boolean;
  ai?: GradeResponse | null;
  onNext: () => void;
}

export function FeedbackPanel({ question, correct, ai, onNext }: Props) {
  useEffect(() => {
    if (correct) playCorrect();
    else playWrong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card border-2 ${
        correct ? "border-magic-mint/60" : "border-magic-ember/60"
      }`}
    >
      <div className="mb-2 flex items-center gap-3">
        <span className="text-3xl">{correct ? "○" : "×"}</span>
        <h3 className="font-display text-2xl">
          {correct ? "せいかい！" : "おしい！もう一度"}
        </h3>
        {ai && (
          <span className="ml-auto rounded-full bg-magic-violet/30 px-3 py-1 text-xs text-sage-100">
            AI採点 {ai.score}点
          </span>
        )}
      </div>

      {ai ? (
        <>
          <p className="leading-relaxed text-sage-100">{ai.feedback}</p>
          {ai.hint && (
            <p className="mt-3 rounded-2xl bg-sage-700/40 p-3 text-sm text-sage-100">
              <span className="font-display text-magic-gold">ヒント: </span>
              {ai.hint}
            </p>
          )}
          <details className="mt-3 text-sm text-sage-200/80">
            <summary className="cursor-pointer">模範解答と解説を見る</summary>
            <p className="mt-2">
              正しい答え：
              <span className="font-display text-magic-gold">
                {question.answer}
              </span>
            </p>
            <p className="mt-1 leading-relaxed">{question.explanation}</p>
          </details>
        </>
      ) : (
        <>
          {!correct && (
            <p className="mb-3 text-sage-100">
              正しい答え：{" "}
              <span className="font-display text-magic-gold">
                {question.answer}
              </span>
            </p>
          )}
          <p className="leading-relaxed text-sage-100/90">
            {question.explanation}
          </p>
        </>
      )}

      <div className="mt-5 flex justify-end">
        <button onClick={onNext} className="btn-primary">
          {correct ? "次の問題へ" : "もう一問やる"}
        </button>
      </div>
    </motion.div>
  );
}
