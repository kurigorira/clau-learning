import type { Question } from "./types";

function normalize(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, "")
    .replace(/，/g, ",")
    .replace(/[（(]/g, "(")
    .replace(/[）)]/g, ")")
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    )
    .toLowerCase();
}

function asNumber(input: string): number | null {
  const cleaned = normalize(input).replace(/[^0-9./-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
  if (cleaned.includes("/")) {
    const [num, den] = cleaned.split("/").map(Number);
    if (Number.isFinite(num) && Number.isFinite(den) && den !== 0) {
      return num / den;
    }
    return null;
  }
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function gradeLocally(question: Question, userAnswer: string): boolean {
  const candidates = [question.answer, ...(question.acceptableAnswers ?? [])];
  const normUser = normalize(userAnswer);

  for (const c of candidates) {
    if (normalize(c) === normUser) return true;
  }

  if (question.type === "numeric") {
    const userNum = asNumber(userAnswer);
    if (userNum === null) return false;
    for (const c of candidates) {
      const n = asNumber(c);
      if (n !== null && Math.abs(n - userNum) < 1e-9) return true;
    }
  }

  return false;
}
