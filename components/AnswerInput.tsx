"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  disabled: boolean;
  selected?: string;
  feedback?: "correct" | "wrong" | null;
  loading?: boolean;
  onSubmit: (answer: string) => void;
}

export function AnswerInput({
  question,
  disabled,
  selected,
  feedback,
  loading = false,
  onSubmit,
}: Props) {
  const [text, setText] = useState("");

  if (question.type === "multiple_choice" && question.choices) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {question.choices.map((choice) => {
          const isSelected = selected === choice;
          const showResult = disabled && isSelected;
          const cls =
            showResult && feedback === "correct"
              ? "choice-button choice-button-correct"
              : showResult && feedback === "wrong"
                ? "choice-button choice-button-wrong"
                : disabled && choice === question.answer
                  ? "choice-button choice-button-correct"
                  : "choice-button";
          return (
            <button
              key={choice}
              type="button"
              disabled={disabled}
              onClick={() => onSubmit(choice)}
              className={cls}
            >
              <span className="font-display">{choice}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "free_text") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!disabled && text.trim()) onSubmit(text);
        }}
        className="flex flex-col gap-3"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          rows={4}
          placeholder="考え方や途中式も書いてOK。文章で答えてもいいよ。"
          className="w-full rounded-2xl border-2 border-sage-400/30 bg-sage-800/60 px-5 py-4 text-lg
                     text-sage-50 placeholder:text-sage-400/60 focus:border-magic-gold focus:outline-none
                     resize-y min-h-[7rem]"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-sage-200/70">
            {loading
              ? "AIの先生が読んでいるよ…"
              : "Claude が考え方も含めて採点してくれるよ"}
          </span>
          <button
            type="submit"
            className="btn-primary"
            disabled={disabled || !text.trim() || loading}
          >
            {loading ? "採点中…" : "こたえる"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && text.trim()) onSubmit(text);
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="text"
        inputMode={question.type === "numeric" ? "decimal" : "text"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="答えを入力（半角）"
        className="w-full rounded-2xl border-2 border-sage-400/30 bg-sage-800/60 px-5 py-4 text-lg
                   text-sage-50 placeholder:text-sage-400/60 focus:border-magic-gold focus:outline-none"
      />
      <button type="submit" className="btn-primary" disabled={disabled || !text.trim()}>
        こたえる
      </button>
    </form>
  );
}
