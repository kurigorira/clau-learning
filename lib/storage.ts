"use client";

import type { Progress } from "./types";
import { STUDENT_NAME } from "./levels";

const KEY = "clau-learning:progress:v1";

export function defaultProgress(): Progress {
  return {
    studentName: STUDENT_NAME,
    currentLevel: 1,
    highestLevel: 1,
    totalCorrect: 0,
    totalAnswered: 0,
    weakCategories: {},
    history: [],
  };
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function recordAnswer(
  p: Progress,
  category: string,
  correct: boolean,
): Progress {
  const next: Progress = {
    ...p,
    totalAnswered: p.totalAnswered + 1,
    totalCorrect: p.totalCorrect + (correct ? 1 : 0),
    weakCategories: { ...p.weakCategories },
  };
  if (!correct) {
    next.weakCategories[category] = (next.weakCategories[category] ?? 0) + 1;
  }
  return next;
}

export function clearLevel(p: Progress, level: number): Progress {
  const nextLevel = Math.min(level + 1, 100);
  return {
    ...p,
    currentLevel: Math.max(p.currentLevel, nextLevel),
    highestLevel: Math.max(p.highestLevel, nextLevel),
    history: [...p.history, { level, clearedAt: new Date().toISOString() }],
  };
}

export function resetProgress(): Progress {
  const fresh = defaultProgress();
  saveProgress(fresh);
  return fresh;
}

export function clearWeakCategories(p: Progress): Progress {
  const next = { ...p, weakCategories: {} };
  saveProgress(next);
  return next;
}
