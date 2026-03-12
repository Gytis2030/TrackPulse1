import type { Route } from "next";
import Link from "next/link";
import { getAllAnalyses } from "@/lib/analysis-store";

export default function DashboardPage() {
  const analyses = getAllAnalyses();
  const avgScore = analyses.length > 0 ? Math.round(analyses.reduce((sum, item) => sum + item.trendScore, 0) / analyses.length) : 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="glass-card p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Total analyses</p>
          <p className="mt-3 text-3xl font-semibold text-white">{analyses.length}</p>
        </article>
        <article className="glass-card p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Average trend score</p>
          <p className="mt-3 text-3xl font-semibold text-white">{avgScore}</p>
        </article>
        <article className="glass-card p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Suggested action</p>
          <p className="mt-3 text-sm text-slate-200">Run at least 3 tracks to benchmark your release strategy before pitching.</p>
        </article>
      </section>

      <section className="glass-card mt-6 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Recent analyses</h1>
          <Link href="/upload" className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10">
            New upload
          </Link>
        </div>

        {analyses.length === 0 ? (
          <p className="text-sm text-slate-300">No analyses yet. Upload a track to populate your dashboard.</p>
        ) : (
          <ul className="space-y-3">
            {analyses.map((analysis) => (
              <li key={analysis.id}>
                <Link
                  href={`/analysis/${analysis.id}` as Route}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                >
                  <div>
                    <p className="font-medium text-white">{analysis.trackName}</p>
                    <p className="text-xs text-slate-400">{new Date(analysis.uploadedAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-slate-300">{analysis.trendCluster}</p>
                    <p className="font-semibold text-cyan-300">Trend score: {analysis.trendScore}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
