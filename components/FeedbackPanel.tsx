"use client";

import { motion } from "framer-motion";
import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  correct: boolean;
  onNext: () => void;
}

export function FeedbackPanel({ question, correct, onNext }: Props) {
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
      </div>
      {!correct && (
        <p className="mb-3 text-sage-100">
          正しい答え： <span className="font-display text-magic-gold">{question.answer}</span>
        </p>
      )}
      <p className="text-sage-100/90 leading-relaxed">{question.explanation}</p>
      <div className="mt-5 flex justify-end">
        <button onClick={onNext} className="btn-primary">
          {correct ? "次の問題へ" : "もう一問やる"}
        </button>
      </div>
    </motion.div>
  );
}
