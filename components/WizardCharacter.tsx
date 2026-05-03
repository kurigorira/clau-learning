"use client";

import { motion } from "framer-motion";
import type { CharacterVariant } from "@/lib/types";

interface Props {
  variant: CharacterVariant;
  accent: string;
  size?: number;
  emoting?: "idle" | "celebrate" | "think";
  stage?: number;
}

export function WizardCharacter({
  variant,
  accent,
  size = 220,
  emoting = "idle",
  stage = 1,
}: Props) {
  const { robe, trim, hat, staff, aura, emblem } = variant;
  const isAdvanced = stage >= 6;
  const isMaster = stage >= 9;

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
      <defs>
        <radialGradient id={`aura-${stage}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.18" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`robe-${stage}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={robe} />
          <stop offset="100%" stopColor={trim} stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id={`staff-glow-${stage}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="40%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* マスター後光 */}
      {isMaster && (
        <motion.circle
          cx={100}
          cy={92}
          r={56}
          fill="none"
          stroke={accent}
          strokeWidth={1.2}
          strokeDasharray="2 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 92px" }}
          opacity={0.7}
        />
      )}

      {/* オーラ */}
      {aura && (
        <motion.circle
          cx={100}
          cy={120}
          r={92}
          fill={`url(#aura-${stage})`}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* マントの裾（高位魔導士以降） */}
      {isAdvanced && (
        <path
          d="M55 218 Q60 200 70 195 L130 195 Q140 200 145 218 Z"
          fill={accent}
          opacity={0.45}
        />
      )}

      {/* ローブ */}
      <path
        d="M60 220 Q60 130 100 130 Q140 130 140 220 Z"
        fill={`url(#robe-${stage})`}
        stroke={trim}
        strokeWidth={3}
      />

      {/* ローブのVライン */}
      <path d="M100 130 L92 160 L108 160 Z" fill={trim} opacity={0.5} />

      {/* 裾飾り */}
      <path
        d="M60 220 Q80 210 100 220 Q120 210 140 220"
        fill="none"
        stroke={trim}
        strokeWidth={3}
      />

      {/* 体の正面の紋章 */}
      {emblem && hat !== "wizard" && (
        <text
          x={100}
          y={172}
          textAnchor="middle"
          fontSize={20}
          fill={accent}
          fontWeight="bold"
          style={{ filter: isAdvanced ? `drop-shadow(0 0 4px ${accent})` : "none" }}
        >
          {emblem}
        </text>
      )}

      {/* 顔 */}
      <circle cx={100} cy={92} r={26} fill="#fce7c8" stroke="#d6b58a" strokeWidth={1.5} />

      {/* 髪 */}
      <path
        d="M76 90 Q76 70 100 66 Q124 70 124 90 Q120 80 110 82 Q100 76 90 82 Q80 80 76 90 Z"
        fill="#3a2a1a"
      />
      <path d="M75 92 Q70 110 78 118 L82 116 Q78 105 80 95 Z" fill="#3a2a1a" />
      <path d="M125 92 Q130 110 122 118 L118 116 Q122 105 120 95 Z" fill="#3a2a1a" />

      {/* 目 */}
      <circle cx={92} cy={94} r={2.4} fill="#1a1a1a" />
      <circle cx={108} cy={94} r={2.4} fill="#1a1a1a" />
      <circle cx={93} cy={93} r={0.8} fill="#fff" />
      <circle cx={109} cy={93} r={0.8} fill="#fff" />

      {/* 口 */}
      {emoting === "celebrate" ? (
        <path
          d="M92 104 Q100 113 108 104"
          fill="#c14a3d"
          stroke="#1a1a1a"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ) : emoting === "think" ? (
        <path
          d="M94 105 Q100 103 106 105"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M94 104 Q100 108 106 104"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      )}

      {/* ほっぺ */}
      <circle cx={86} cy={100} r={2.6} fill="#ff9aa2" opacity={0.7} />
      <circle cx={114} cy={100} r={2.6} fill="#ff9aa2" opacity={0.7} />

      {/* 帽子 */}
      {hat === "cap" && (
        <path d="M76 76 Q100 56 124 76 L120 80 Q100 70 80 80 Z" fill={trim} />
      )}
      {hat === "wizard" && (
        <g>
          <path d="M70 80 L100 30 L130 80 Z" fill={trim} />
          <path
            d="M68 80 Q100 90 132 80 L132 84 Q100 94 68 84 Z"
            fill={trim}
            stroke={accent}
            strokeWidth={1}
          />
          {emblem && (
            <motion.text
              x={100}
              y={68}
              textAnchor="middle"
              fontSize={16}
              fill={accent}
              fontWeight="bold"
              animate={isAdvanced ? { opacity: [0.7, 1, 0.7] } : undefined}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {emblem}
            </motion.text>
          )}
          {isMaster && (
            <motion.circle
              cx={100}
              cy={30}
              r={3}
              fill="#fff"
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
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
          <circle cx={100} cy={62} r={3} fill="#c14a3d" />
          <circle cx={84} cy={68} r={2} fill="#fff" />
          <circle cx={116} cy={68} r={2} fill="#fff" />
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
          {staff === "wood" && <circle cx={158} cy={118} r={6} fill="#7a5a3a" />}
          {staff === "ornate" && (
            <g>
              <circle cx={158} cy={118} r={9} fill={accent} />
              <circle cx={158} cy={118} r={5} fill="#fff" opacity={0.85} />
              <text
                x={158}
                y={122}
                textAnchor="middle"
                fontSize={9}
                fill={trim}
                fontWeight="bold"
              >
                {emblem ?? "✦"}
              </text>
            </g>
          )}
          {staff === "glow" && (
            <g>
              <motion.circle
                cx={158}
                cy={118}
                r={14}
                fill={`url(#staff-glow-${stage})`}
                animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx={158} cy={118} r={6} fill="#fff" />
              <text
                x={158}
                y={122}
                textAnchor="middle"
                fontSize={9}
                fill={trim}
                fontWeight="bold"
              >
                {emblem ?? "★"}
              </text>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={158 + (i - 1) * 8}
                  cy={108}
                  r={1.5}
                  fill="#fff"
                  animate={{ opacity: [0, 1, 0], cy: [108, 100, 108] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              ))}
            </g>
          )}
        </g>
      )}

      {/* 使い魔（アークメイジ以上） */}
      {stage >= 8 && (
        <motion.g
          animate={{ x: [0, 4, 0], y: [0, -3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <ellipse cx={45} cy={100} rx={10} ry={6} fill="#5dd6a5" />
          <circle cx={42} cy={97} r={2} fill="#1a1a1a" />
          <path d="M48 96 L54 92 L52 100 Z" fill="#5dd6a5" />
          <path d="M48 105 L54 109 L52 100 Z" fill="#5dd6a5" />
        </motion.g>
      )}
    </motion.svg>
  );
}
