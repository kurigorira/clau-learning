"use client";

import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  index: number;
  total: number;
}

export function QuestionCard({ question, index, total }: Props) {
  return (
    <div className="card">
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
    </div>
  );
}
