"use client";

import { motion } from "framer-motion";
import type { LevelTheme } from "@/lib/types";

interface Props {
  theme: LevelTheme;
}

export function LevelBackground({ theme }: Props) {
  const stars = theme.stage >= 7 ? 36 : theme.stage >= 5 ? 16 : 0;
  const starArray = Array.from({ length: stars }).map((_, i) => ({
    cx: ((i * 53) % 100) + (i * 7) % 5,
    cy: ((i * 31) % 100),
    r: 0.6 + ((i * 13) % 10) / 12,
    delay: (i * 0.17) % 3,
  }));

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b ${theme.bgGradient}`}
    >
      {stars > 0 && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {starArray.map((s, i) => (
            <motion.circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="#fff"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: s.delay }}
            />
          ))}
        </svg>
      )}

      {/* ステージごとのアクセント光 */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 opacity-40"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.accent}33, transparent 70%)`,
        }}
      />
    </div>
  );
}
