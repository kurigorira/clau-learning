import type { Question } from "./types";

import lv001 from "@/data/questions/level-001.json";
import lv002 from "@/data/questions/level-002.json";
import lv003 from "@/data/questions/level-003.json";
import lv004 from "@/data/questions/level-004.json";
import lv005 from "@/data/questions/level-005.json";
import lv006 from "@/data/questions/level-006.json";
import lv007 from "@/data/questions/level-007.json";
import lv008 from "@/data/questions/level-008.json";
import lv009 from "@/data/questions/level-009.json";
import lv010 from "@/data/questions/level-010.json";

const BANK: Record<number, Question[]> = {
  1: lv001 as Question[],
  2: lv002 as Question[],
  3: lv003 as Question[],
  4: lv004 as Question[],
  5: lv005 as Question[],
  6: lv006 as Question[],
  7: lv007 as Question[],
  8: lv008 as Question[],
  9: lv009 as Question[],
  10: lv010 as Question[],
};

export const AVAILABLE_LEVELS = Object.keys(BANK)
  .map(Number)
  .sort((a, b) => a - b);

export function getQuestionsForLevel(level: number): Question[] {
  return BANK[level] ?? [];
}

export const QUESTIONS_PER_SESSION = 5;

export function pickSession(level: number, seed = Date.now()): Question[] {
  const pool = [...getQuestionsForLevel(level)];
  if (pool.length === 0) return [];
  const rng = mulberry32(seed);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, QUESTIONS_PER_SESSION);
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
