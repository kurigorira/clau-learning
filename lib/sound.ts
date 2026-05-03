"use client";

const KEY = "clau-learning:sound-enabled:v1";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    type WebkitWindow = typeof window & { webkitAudioContext?: typeof AudioContext };
    const Ctx = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const v = window.localStorage.getItem(KEY);
  return v !== "0";
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, enabled ? "1" : "0");
}

interface ToneOptions {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  startTime?: number;
  gain?: number;
  attack?: number;
  release?: number;
}

function tone(ctx: AudioContext, opts: ToneOptions): void {
  const {
    frequency,
    duration,
    type = "sine",
    startTime = ctx.currentTime,
    gain = 0.18,
    attack = 0.01,
    release = 0.08,
  } = opts;

  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);
  env.gain.setValueAtTime(0, startTime);
  env.gain.linearRampToValueAtTime(gain, startTime + attack);
  env.gain.setValueAtTime(gain, startTime + duration - release);
  env.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.connect(env);
  env.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

export function playCorrect(): void {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  // 上行3和音 ド-ミ-ソ
  tone(ctx, { frequency: 523.25, duration: 0.12, startTime: t, type: "triangle" });
  tone(ctx, { frequency: 659.25, duration: 0.12, startTime: t + 0.1, type: "triangle" });
  tone(ctx, { frequency: 783.99, duration: 0.2, startTime: t + 0.2, type: "triangle", gain: 0.22 });
}

export function playWrong(): void {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(ctx, { frequency: 220, duration: 0.18, startTime: t, type: "sawtooth", gain: 0.1 });
  tone(ctx, { frequency: 165, duration: 0.22, startTime: t + 0.16, type: "sawtooth", gain: 0.08 });
}

export function playLevelUp(): void {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  // ファンファーレ風 ソ-ド-ミ-ソ-ド(高)
  const notes = [392, 523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => {
    tone(ctx, {
      frequency: f,
      duration: i === notes.length - 1 ? 0.4 : 0.12,
      startTime: t + i * 0.09,
      type: "triangle",
      gain: 0.18,
    });
  });
}

export function playStageUp(): void {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  // 大進化 — 重ね和音
  const chord = [261.63, 329.63, 392, 523.25];
  chord.forEach((f) => {
    tone(ctx, { frequency: f, duration: 0.6, startTime: t, type: "triangle", gain: 0.1 });
    tone(ctx, { frequency: f * 2, duration: 0.6, startTime: t + 0.15, type: "sine", gain: 0.06 });
  });
  tone(ctx, { frequency: 1046.5, duration: 0.8, startTime: t + 0.3, type: "triangle", gain: 0.16 });
}

export function playClick(): void {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, {
    frequency: 880,
    duration: 0.05,
    type: "square",
    gain: 0.05,
    attack: 0.005,
    release: 0.04,
  });
}
