"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  index: number;
  total: number;
}

export function QuestionCard({ question, index, total }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="card"
      >
        <div className="mb-3 flex items-center justify-between text-sm text-sage-200/80">
          <span className="rounded-full bg-sage-700/50 px-3 py-1">
            {question.category}
          </span>
          <span className="font-display">
            第 {index + 1} 問 / {total}
          </span>
        </div>
        <p className="whitespace-pre-line font-display text-2xl leading-relaxed sm:text-3xl">
          {question.question}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
