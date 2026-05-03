"use client";

import { motion } from "framer-motion";
import type { CharacterVariant } from "@/lib/types";

interface Props {
  variant: CharacterVariant;
  accent: string;
  size?: number;
  emoting?: "idle" | "celebrate" | "think";
}

export function WizardCharacter({
  variant,
  accent,
  size = 220,
  emoting = "idle",
}: Props) {
  const { robe, trim, hat, staff, aura, emblem } = variant;

  return (
    <motion.svg
      viewBox="0 0 200 240"
      width={size}
      height={size}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={emoting === "idle" ? "animate-float" : ""}
      role="img"
      aria-label="魔法使いキャラクター"
    >
      {/* オーラ */}
      {aura && (
        <motion.circle
          cx={100}
          cy={120}
          r={92}
          fill={accent}
          opacity={0.18}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* ローブ（体） */}
      <path
        d="M60 220 Q60 130 100 130 Q140 130 140 220 Z"
        fill={robe}
        stroke={trim}
        strokeWidth={3}
      />

      {/* ローブの裾飾り */}
      <path
        d="M60 220 Q80 210 100 220 Q120 210 140 220"
        fill="none"
        stroke={trim}
        strokeWidth={3}
      />

      {/* 顔 */}
      <circle cx={100} cy={92} r={26} fill="#fce7c8" stroke="#d6b58a" strokeWidth={1.5} />

      {/* 髪（女の子っぽく前髪） */}
      <path
        d="M76 90 Q76 70 100 66 Q124 70 124 90 Q120 80 110 82 Q100 76 90 82 Q80 80 76 90 Z"
        fill="#3a2a1a"
      />

      {/* サイドの髪 */}
      <path d="M75 92 Q70 110 78 118 L82 116 Q78 105 80 95 Z" fill="#3a2a1a" />
      <path d="M125 92 Q130 110 122 118 L118 116 Q122 105 120 95 Z" fill="#3a2a1a" />

      {/* 目 */}
      <circle cx={92} cy={94} r={2.4} fill="#1a1a1a" />
      <circle cx={108} cy={94} r={2.4} fill="#1a1a1a" />

      {/* 口 */}
      {emoting === "celebrate" ? (
        <path d="M92 104 Q100 112 108 104" fill="none" stroke="#1a1a1a" strokeWidth={1.8} strokeLinecap="round" />
      ) : emoting === "think" ? (
        <path d="M94 104 Q100 102 106 104" fill="none" stroke="#1a1a1a" strokeWidth={1.8} strokeLinecap="round" />
      ) : (
        <path d="M94 104 Q100 108 106 104" fill="none" stroke="#1a1a1a" strokeWidth={1.8} strokeLinecap="round" />
      )}

      {/* ほっぺ */}
      <circle cx={86} cy={100} r={2.5} fill="#ff9aa2" opacity={0.7} />
      <circle cx={114} cy={100} r={2.5} fill="#ff9aa2" opacity={0.7} />

      {/* 帽子 */}
      {hat === "cap" && (
        <path d="M76 76 Q100 56 124 76 L120 80 Q100 70 80 80 Z" fill={trim} />
      )}
      {hat === "wizard" && (
        <g>
          <path d="M70 80 L100 30 L130 80 Z" fill={trim} />
          <path d="M68 80 Q100 90 132 80 L132 84 Q100 94 68 84 Z" fill={trim} stroke={accent} strokeWidth={1} />
          {emblem && (
            <text x={100} y={68} textAnchor="middle" fontSize={14} fill={accent} fontWeight="bold">
              {emblem}
            </text>
          )}
        </g>
      )}
      {hat === "crown" && (
        <g>
          <path
            d="M74 74 L82 56 L92 70 L100 50 L108 70 L118 56 L126 74 Z"
            fill={accent}
            stroke={trim}
            strokeWidth={1.5}
          />
          <circle cx={100} cy={62} r={3} fill={trim} />
        </g>
      )}

      {/* 杖 */}
      {staff !== "none" && (
        <g>
          <line
            x1={148}
            y1={210}
            x2={158}
            y2={120}
            stroke={staff === "wood" ? "#7a5a3a" : trim}
            strokeWidth={4}
            strokeLinecap="round"
          />
          {staff === "wood" && (
            <circle cx={158} cy={118} r={6} fill="#7a5a3a" />
          )}
          {staff === "ornate" && (
            <g>
              <circle cx={158} cy={118} r={8} fill={accent} />
              <circle cx={158} cy={118} r={4} fill="#fff" opacity={0.7} />
            </g>
          )}
          {staff === "glow" && (
            <g>
              <motion.circle
                cx={158}
                cy={118}
                r={11}
                fill={accent}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx={158} cy={118} r={5} fill="#fff" />
              <text x={158} y={122} textAnchor="middle" fontSize={9} fill={trim} fontWeight="bold">
                {emblem ?? "★"}
              </text>
            </g>
          )}
        </g>
      )}

      {/* 体の正面の紋章 */}
      {emblem && hat !== "wizard" && (
        <text
          x={100}
          y={172}
          textAnchor="middle"
          fontSize={18}
          fill={accent}
          fontWeight="bold"
        >
          {emblem}
        </text>
      )}
    </motion.svg>
  );
}
