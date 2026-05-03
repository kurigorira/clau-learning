"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { WizardCharacter } from "@/components/WizardCharacter";
import { LevelBackground } from "@/components/LevelBackground";
import { themeForLevel, STUDENT_FIRST } from "@/lib/levels";

function GateForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/";
  const theme = themeForLevel(1);

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "認証に失敗しました");
        setSubmitting(false);
        return;
      }
      router.replace(from);
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
      setSubmitting(false);
    }
  }

  return (
    <>
      <LevelBackground theme={theme} />
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <WizardCharacter
            variant={theme.characterVariant}
            accent={theme.accent}
            size={160}
            stage={theme.stage}
            emoting="think"
          />
          <p className="mt-3 font-display text-sm tracking-widest text-sage-200/80">
            賢者への道
          </p>
          <h1 className="mt-1 font-display text-2xl">
            {STUDENT_FIRST} へのとびら
          </h1>
          <p className="mt-2 text-sm text-sage-200/70">
            合言葉をいれてください
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="card mt-6 w-full">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            autoFocus
            placeholder="合言葉"
            className="w-full rounded-2xl border-2 border-sage-400/30 bg-sage-800/60 px-5 py-4 text-lg
                       text-sage-50 placeholder:text-sage-400/60 focus:border-magic-gold focus:outline-none"
          />
          {error && (
            <p className="mt-3 text-sm text-magic-ember">{error}</p>
          )}
          <button
            type="submit"
            className="btn-primary mt-4 w-full"
            disabled={submitting || !password}
          >
            {submitting ? "確認中…" : "とびらを開ける"}
          </button>
        </form>
      </main>
    </>
  );
}

export default function GatePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-sage-200">読み込み中…</div>
        </main>
      }
    >
      <GateForm />
    </Suspense>
  );
}
