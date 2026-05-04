import type { LevelTheme } from "./types";

export const STUDENT_NAME = "junior";
export const STUDENT_FIRST = "junior";

export const TOTAL_LEVELS = 100;

export const LEVEL_THEMES: LevelTheme[] = [
  {
    stage: 1,
    range: [1, 10],
    title: "見習い",
    subtitle: "草原の小屋",
    bgGradient: "from-emerald-700 via-sage-800 to-sage-900",
    accent: "#7ed957",
    characterVariant: {
      robe: "#d6c4a8",
      trim: "#8c7a5b",
      hat: "none",
      staff: "none",
      aura: false,
      emblem: null,
    },
  },
  {
    stage: 2,
    range: [11, 20],
    title: "弟子",
    subtitle: "森の入り口",
    bgGradient: "from-emerald-900 via-sage-800 to-sage-900",
    accent: "#5dd6a5",
    characterVariant: {
      robe: "#a8c4a0",
      trim: "#5b8c6b",
      hat: "cap",
      staff: "wood",
      aura: false,
      emblem: null,
    },
  },
  {
    stage: 3,
    range: [21, 30],
    title: "学徒",
    subtitle: "古代遺跡",
    bgGradient: "from-amber-900 via-stone-800 to-sage-900",
    accent: "#d4a574",
    characterVariant: {
      robe: "#b8a890",
      trim: "#7a6a4d",
      hat: "cap",
      staff: "wood",
      aura: false,
      emblem: "○",
    },
  },
  {
    stage: 4,
    range: [31, 40],
    title: "魔導士見習い",
    subtitle: "魔法学院",
    bgGradient: "from-blue-900 via-indigo-900 to-sage-900",
    accent: "#7c8cff",
    characterVariant: {
      robe: "#6a7ad6",
      trim: "#3a4a96",
      hat: "wizard",
      staff: "wood",
      aura: false,
      emblem: "✦",
    },
  },
  {
    stage: 5,
    range: [41, 50],
    title: "魔導士",
    subtitle: "塔の中腹",
    bgGradient: "from-violet-900 via-indigo-900 to-sage-900",
    accent: "#9b6cff",
    characterVariant: {
      robe: "#7a4ab8",
      trim: "#4a2a78",
      hat: "wizard",
      staff: "ornate",
      aura: false,
      emblem: "✦",
    },
  },
  {
    stage: 6,
    range: [51, 60],
    title: "上級魔導士",
    subtitle: "雲上の塔",
    bgGradient: "from-rose-900 via-violet-900 to-sage-900",
    accent: "#ff8c42",
    characterVariant: {
      robe: "#c14a3d",
      trim: "#7a2520",
      hat: "wizard",
      staff: "ornate",
      aura: true,
      emblem: "✧",
    },
  },
  {
    stage: 7,
    range: [61, 70],
    title: "大魔導士",
    subtitle: "星見の間",
    bgGradient: "from-indigo-950 via-violet-900 to-sage-900",
    accent: "#f5c842",
    characterVariant: {
      robe: "#3a2a78",
      trim: "#f5c842",
      hat: "wizard",
      staff: "glow",
      aura: true,
      emblem: "★",
    },
  },
  {
    stage: 8,
    range: [71, 80],
    title: "アークメイジ",
    subtitle: "星空回廊",
    bgGradient: "from-slate-950 via-indigo-950 to-violet-950",
    accent: "#5dd6a5",
    characterVariant: {
      robe: "#1a3a5e",
      trim: "#5dd6a5",
      hat: "wizard",
      staff: "glow",
      aura: true,
      emblem: "✺",
    },
  },
  {
    stage: 9,
    range: [81, 90],
    title: "賢者見習い",
    subtitle: "銀河の縁",
    bgGradient: "from-black via-indigo-950 to-violet-950",
    accent: "#c8d2ff",
    characterVariant: {
      robe: "#0f1530",
      trim: "#c8d2ff",
      hat: "wizard",
      staff: "glow",
      aura: true,
      emblem: "✺",
    },
  },
  {
    stage: 10,
    range: [91, 100],
    title: "賢者",
    subtitle: "賢者の間",
    bgGradient: "from-black via-violet-950 to-amber-900",
    accent: "#f5c842",
    characterVariant: {
      robe: "#f5f7ff",
      trim: "#f5c842",
      hat: "crown",
      staff: "glow",
      aura: true,
      emblem: "☀",
    },
  },
];

export function themeForLevel(level: number): LevelTheme {
  const clamped = Math.max(1, Math.min(TOTAL_LEVELS, level));
  return (
    LEVEL_THEMES.find((t) => clamped >= t.range[0] && clamped <= t.range[1]) ??
    LEVEL_THEMES[0]
  );
}

export function isStageBoundary(level: number): boolean {
  return LEVEL_THEMES.some((t) => t.range[0] === level);
}
