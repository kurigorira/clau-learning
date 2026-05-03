"use client";

import { motion } from "framer-motion";
import type { LevelTheme } from "@/lib/types";

interface Props {
  theme: LevelTheme;
}

export function LevelBackground({ theme }: Props) {
  const stage = theme.stage;
  const stars = stage >= 7 ? 60 : stage >= 5 ? 24 : 0;
  const starArray = Array.from({ length: stars }).map((_, i) => ({
    cx: ((i * 53) % 100) + ((i * 7) % 5),
    cy: (i * 31) % 100,
    r: 0.5 + ((i * 13) % 10) / 10,
    delay: (i * 0.17) % 3,
  }));

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b ${theme.bgGradient}`}
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

      {/* ステージ別シーン要素（地平線下のシルエット） */}
      <svg
        className="absolute inset-x-0 bottom-0 h-1/2 w-full"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0 70 Q50 65 100 70 T200 70 L200 100 L0 100 Z"
          fill="#000"
          opacity={0.35}
        />

        {stage <= 2 && (
          <g>
            <polygon points="30,70 38,58 46,70" fill="#3a5a3a" opacity={0.7} />
            <polygon points="40,70 50,55 60,70" fill="#3a5a3a" opacity={0.7} />
            <rect x="150" y="62" width="20" height="8" fill="#7a5a3a" opacity={0.8} />
            <polygon points="148,62 160,52 172,62" fill="#a64a3a" opacity={0.85} />
          </g>
        )}

        {stage === 3 && (
          <g>
            <rect x="20" y="50" width="6" height="20" fill="#a89070" opacity={0.85} />
            <rect x="34" y="46" width="6" height="24" fill="#a89070" opacity={0.85} />
            <rect x="48" y="50" width="6" height="20" fill="#a89070" opacity={0.85} />
            <rect x="18" y="48" width="40" height="3" fill="#c8b090" opacity={0.85} />
            <rect x="140" y="55" width="50" height="15" fill="#a89070" opacity={0.7} />
          </g>
        )}

        {(stage === 4 || stage === 5) && (
          <g>
            <rect x="80" y="40" width="14" height="30" fill="#3a4a96" opacity={0.85} />
            <polygon points="78,42 87,28 96,42" fill={theme.accent} opacity={0.8} />
            <rect x="100" y="48" width="20" height="22" fill="#2a317a" opacity={0.85} />
            <polygon points="98,50 110,38 122,50" fill={theme.accent} opacity={0.7} />
            <circle cx="87" cy="50" r="2" fill={theme.accent} />
            <circle cx="110" cy="58" r="2" fill={theme.accent} />
          </g>
        )}

        {(stage === 6 || stage === 7) && (
          <g>
            <ellipse cx="40" cy="68" rx="30" ry="6" fill="#fff" opacity={0.25} />
            <ellipse cx="160" cy="72" rx="38" ry="7" fill="#fff" opacity={0.2} />
            <rect x="92" y="30" width="16" height="40" fill={theme.accent} opacity={0.55} />
            <polygon points="90,32 100,18 110,32" fill={theme.accent} opacity={0.7} />
            <circle cx="100" cy="40" r="2" fill="#fff" />
          </g>
        )}

        {stage >= 8 && (
          <g>
            <ellipse cx="100" cy="70" rx="80" ry="6" fill={theme.accent} opacity={0.3} />
            <motion.circle
              cx="100"
              cy="40"
              r="6"
              fill={theme.accent}
              animate={{ opacity: [0.5, 1, 0.5], r: [6, 8, 6] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {[20, 50, 80, 120, 150, 180].map((x, i) => (
              <motion.circle
                key={i}
                cx={x}
                cy={40 + (i % 2) * 8}
                r={1.5}
                fill="#fff"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </g>
        )}
      </svg>

      <div
        className="absolute inset-x-0 bottom-0 h-1/3 opacity-50"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.accent}33, transparent 70%)`,
        }}
      />
    </div>
  );
}
