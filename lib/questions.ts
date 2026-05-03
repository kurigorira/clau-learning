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
import lv011 from "@/data/questions/level-011.json";
import lv012 from "@/data/questions/level-012.json";
import lv013 from "@/data/questions/level-013.json";
import lv014 from "@/data/questions/level-014.json";
import lv015 from "@/data/questions/level-015.json";
import lv016 from "@/data/questions/level-016.json";
import lv017 from "@/data/questions/level-017.json";
import lv018 from "@/data/questions/level-018.json";
import lv019 from "@/data/questions/level-019.json";
import lv020 from "@/data/questions/level-020.json";
import lv021 from "@/data/questions/level-021.json";
import lv022 from "@/data/questions/level-022.json";
import lv023 from "@/data/questions/level-023.json";
import lv024 from "@/data/questions/level-024.json";
import lv025 from "@/data/questions/level-025.json";
import lv026 from "@/data/questions/level-026.json";
import lv027 from "@/data/questions/level-027.json";
import lv028 from "@/data/questions/level-028.json";
import lv029 from "@/data/questions/level-029.json";
import lv030 from "@/data/questions/level-030.json";
import lv031 from "@/data/questions/level-031.json";
import lv032 from "@/data/questions/level-032.json";
import lv033 from "@/data/questions/level-033.json";
import lv034 from "@/data/questions/level-034.json";
import lv035 from "@/data/questions/level-035.json";
import lv036 from "@/data/questions/level-036.json";
import lv037 from "@/data/questions/level-037.json";
import lv038 from "@/data/questions/level-038.json";
import lv039 from "@/data/questions/level-039.json";
import lv040 from "@/data/questions/level-040.json";
import lv041 from "@/data/questions/level-041.json";
import lv042 from "@/data/questions/level-042.json";
import lv043 from "@/data/questions/level-043.json";
import lv044 from "@/data/questions/level-044.json";
import lv045 from "@/data/questions/level-045.json";
import lv046 from "@/data/questions/level-046.json";
import lv047 from "@/data/questions/level-047.json";
import lv048 from "@/data/questions/level-048.json";
import lv049 from "@/data/questions/level-049.json";
import lv050 from "@/data/questions/level-050.json";
import lv051 from "@/data/questions/level-051.json";
import lv052 from "@/data/questions/level-052.json";
import lv053 from "@/data/questions/level-053.json";
import lv054 from "@/data/questions/level-054.json";
import lv055 from "@/data/questions/level-055.json";
import lv056 from "@/data/questions/level-056.json";
import lv057 from "@/data/questions/level-057.json";
import lv058 from "@/data/questions/level-058.json";
import lv059 from "@/data/questions/level-059.json";
import lv060 from "@/data/questions/level-060.json";
import lv061 from "@/data/questions/level-061.json";
import lv062 from "@/data/questions/level-062.json";
import lv063 from "@/data/questions/level-063.json";
import lv064 from "@/data/questions/level-064.json";
import lv065 from "@/data/questions/level-065.json";
import lv066 from "@/data/questions/level-066.json";
import lv067 from "@/data/questions/level-067.json";
import lv068 from "@/data/questions/level-068.json";
import lv069 from "@/data/questions/level-069.json";
import lv070 from "@/data/questions/level-070.json";
import lv071 from "@/data/questions/level-071.json";
import lv072 from "@/data/questions/level-072.json";
import lv073 from "@/data/questions/level-073.json";
import lv074 from "@/data/questions/level-074.json";
import lv075 from "@/data/questions/level-075.json";
import lv076 from "@/data/questions/level-076.json";
import lv077 from "@/data/questions/level-077.json";
import lv078 from "@/data/questions/level-078.json";
import lv079 from "@/data/questions/level-079.json";
import lv080 from "@/data/questions/level-080.json";
import lv081 from "@/data/questions/level-081.json";
import lv082 from "@/data/questions/level-082.json";
import lv083 from "@/data/questions/level-083.json";
import lv084 from "@/data/questions/level-084.json";
import lv085 from "@/data/questions/level-085.json";
import lv086 from "@/data/questions/level-086.json";
import lv087 from "@/data/questions/level-087.json";
import lv088 from "@/data/questions/level-088.json";
import lv089 from "@/data/questions/level-089.json";
import lv090 from "@/data/questions/level-090.json";
import lv091 from "@/data/questions/level-091.json";
import lv092 from "@/data/questions/level-092.json";
import lv093 from "@/data/questions/level-093.json";
import lv094 from "@/data/questions/level-094.json";
import lv095 from "@/data/questions/level-095.json";
import lv096 from "@/data/questions/level-096.json";
import lv097 from "@/data/questions/level-097.json";
import lv098 from "@/data/questions/level-098.json";
import lv099 from "@/data/questions/level-099.json";
import lv100 from "@/data/questions/level-100.json";

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
  11: lv011 as Question[],
  12: lv012 as Question[],
  13: lv013 as Question[],
  14: lv014 as Question[],
  15: lv015 as Question[],
  16: lv016 as Question[],
  17: lv017 as Question[],
  18: lv018 as Question[],
  19: lv019 as Question[],
  20: lv020 as Question[],
  21: lv021 as Question[],
  22: lv022 as Question[],
  23: lv023 as Question[],
  24: lv024 as Question[],
  25: lv025 as Question[],
  26: lv026 as Question[],
  27: lv027 as Question[],
  28: lv028 as Question[],
  29: lv029 as Question[],
  30: lv030 as Question[],
  31: lv031 as Question[],
  32: lv032 as Question[],
  33: lv033 as Question[],
  34: lv034 as Question[],
  35: lv035 as Question[],
  36: lv036 as Question[],
  37: lv037 as Question[],
  38: lv038 as Question[],
  39: lv039 as Question[],
  40: lv040 as Question[],
  41: lv041 as Question[],
  42: lv042 as Question[],
  43: lv043 as Question[],
  44: lv044 as Question[],
  45: lv045 as Question[],
  46: lv046 as Question[],
  47: lv047 as Question[],
  48: lv048 as Question[],
  49: lv049 as Question[],
  50: lv050 as Question[],
  51: lv051 as Question[],
  52: lv052 as Question[],
  53: lv053 as Question[],
  54: lv054 as Question[],
  55: lv055 as Question[],
  56: lv056 as Question[],
  57: lv057 as Question[],
  58: lv058 as Question[],
  59: lv059 as Question[],
  60: lv060 as Question[],
  61: lv061 as Question[],
  62: lv062 as Question[],
  63: lv063 as Question[],
  64: lv064 as Question[],
  65: lv065 as Question[],
  66: lv066 as Question[],
  67: lv067 as Question[],
  68: lv068 as Question[],
  69: lv069 as Question[],
  70: lv070 as Question[],
  71: lv071 as Question[],
  72: lv072 as Question[],
  73: lv073 as Question[],
  74: lv074 as Question[],
  75: lv075 as Question[],
  76: lv076 as Question[],
  77: lv077 as Question[],
  78: lv078 as Question[],
  79: lv079 as Question[],
  80: lv080 as Question[],
  81: lv081 as Question[],
  82: lv082 as Question[],
  83: lv083 as Question[],
  84: lv084 as Question[],
  85: lv085 as Question[],
  86: lv086 as Question[],
  87: lv087 as Question[],
  88: lv088 as Question[],
  89: lv089 as Question[],
  90: lv090 as Question[],
  91: lv091 as Question[],
  92: lv092 as Question[],
  93: lv093 as Question[],
  94: lv094 as Question[],
  95: lv095 as Question[],
  96: lv096 as Question[],
  97: lv097 as Question[],
  98: lv098 as Question[],
  99: lv099 as Question[],
  100: lv100 as Question[],
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
