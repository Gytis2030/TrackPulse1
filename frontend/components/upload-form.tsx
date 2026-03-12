"use client";

import type { Route } from "next";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function UploadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Please choose an audio file before running analysis.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Unable to analyze file.");
      }

      const payload = (await response.json()) as { id: string };
      router.push(`/analysis/${payload.id}` as Route);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unexpected error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={onSubmit} className="glass-card mx-auto flex w-full max-w-2xl flex-col gap-5 p-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">Upload a track</h2>
        <p className="mt-1 text-sm text-slate-300">Accepted formats: WAV, MP3, AIFF, M4A. Deterministic analysis for demo-ready results.</p>
      </div>

      <label className="rounded-xl border border-dashed border-white/25 bg-white/5 p-6 text-sm text-slate-200">
        <span className="mb-3 block text-xs uppercase tracking-[0.18em] text-slate-400">Audio File</span>
        <input type="file" name="file" accept="audio/*" className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-blue-500/20 file:px-4 file:py-2 file:text-blue-100 hover:file:bg-blue-500/30" />
      </label>

      {error ? <p className="rounded-lg border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Analyzing..." : "Analyze Track"}
      </button>
    </form>
  );
}
