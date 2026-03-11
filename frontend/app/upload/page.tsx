'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError('Please choose an audio file first.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? 'Upload failed.');
      setLoading(false);
      return;
    }

    const payload = (await res.json()) as { id: string };
    router.push(`/results/${payload.id}`);
  }

  return (
    <section className="mx-auto mt-12 max-w-3xl px-6">
      <div className="panel p-8">
        <h1 className="text-3xl font-semibold text-white">Upload a track</h1>
        <p className="mt-2 text-slate-300">Supported: WAV, MP3, and M4A. Deterministic analysis for demo reliability.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            type="file"
            accept="audio/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-violet-500"
          />

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? 'Analyzing...' : 'Upload and analyze'}
          </button>
        </form>
      </div>
    </section>
  );
}
