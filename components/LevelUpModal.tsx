"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { themeForLevel, isStageBoundary, STUDENT_FIRST } from "@/lib/levels";
import { playLevelUp, playStageUp } from "@/lib/sound";
import { WizardCharacter } from "./WizardCharacter";

interface Props {
  open: boolean;
  fromLevel: number;
  toLevel: number;
  onContinue: () => void;
  onHome: () => void;
}

export function LevelUpModal({
  open,
  fromLevel,
  toLevel,
  onContinue,
  onHome,
}: Props) {
  const newTheme = themeForLevel(toLevel);
  const stageChanged = isStageBoundary(toLevel);

  useEffect(() => {
    if (!open) return;
    if (stageChanged) playStageUp();
    else playLevelUp();
  }, [open, stageChanged]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
        >
          {/* 画面いっぱいの放射光 */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.3] }}
            transition={{ duration: 1.2, times: [0, 0.4, 1] }}
            style={{
              background: `radial-gradient(circle at center, ${newTheme.accent}88, transparent 60%)`,
            }}
          />

          {/* 紙吹雪パーティクル */}
          {stageChanged &&
            [...Array(28)].map((_, i) => {
              const angle = (i / 28) * 2 * Math.PI;
              const dist = 200 + (i % 5) * 40;
              return (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute text-2xl"
                  style={{ color: i % 2 === 0 ? newTheme.accent : "#f5c842" }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    scale: [0, 1.4, 0.6],
                    rotate: 360,
                  }}
                  transition={{ duration: 1.6, delay: i * 0.02 }}
                >
                  ✦
                </motion.span>
              );
            })}

          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="card relative w-full max-w-md text-center"
          >
            {/* 内側のスパークル */}
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute text-2xl"
                style={{
                  top: `${20 + ((i * 11) % 60)}%`,
                  left: `${(i * 23) % 90}%`,
                  color: newTheme.accent,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
                transition={{
                  duration: 1.4,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                ✦
              </motion.span>
            ))}

            <p className="font-display text-sm text-sage-200/80">
              レベル {fromLevel} クリア！
            </p>
            <h2 className="mt-1 font-display text-4xl text-magic-gold">
              レベル {toLevel}
            </h2>

            {stageChanged && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 rounded-2xl bg-sage-700/40 p-4"
              >
                <p className="font-display text-lg text-magic-gold">
                  ✨ 新しい称号 ✨
                </p>
                <p className="mt-1 font-display text-2xl">
                  「{newTheme.title}」
                </p>
                <p className="text-sm text-sage-200/80">{newTheme.subtitle}</p>
              </motion.div>
            )}

            <div className="my-4 flex justify-center">
              <WizardCharacter
                variant={newTheme.characterVariant}
                accent={newTheme.accent}
                size={180}
                stage={newTheme.stage}
                emoting="celebrate"
              />
            </div>

            <p className="text-sage-100">よくがんばったね、{STUDENT_FIRST}！</p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button onClick={onContinue} className="btn-primary">
                次のレベルへ
              </button>
              <button onClick={onHome} className="btn-ghost">
                ホームに戻る
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
