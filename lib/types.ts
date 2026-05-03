export type QuestionType = "multiple_choice" | "numeric" | "free_text";

export interface Question {
  id: string;
  level: number;
  category: string;
  type: QuestionType;
  question: string;
  choices?: string[];
  answer: string;
  acceptableAnswers?: string[];
  explanation: string;
}

export interface LevelTheme {
  stage: number;
  range: [number, number];
  title: string;
  subtitle: string;
  bgGradient: string;
  accent: string;
  characterVariant: CharacterVariant;
}

export interface CharacterVariant {
  robe: string;
  trim: string;
  hat: "none" | "cap" | "wizard" | "crown";
  staff: "none" | "wood" | "ornate" | "glow";
  aura: boolean;
  emblem: string | null;
}

export interface Progress {
  studentName: string;
  currentLevel: number;
  highestLevel: number;
  totalCorrect: number;
  totalAnswered: number;
  weakCategories: Record<string, number>;
  history: Array<{
    level: number;
    clearedAt: string;
  }>;
}

export interface GradeResponse {
  correct: boolean;
  score: number;
  feedback: string;
  hint: string;
}
