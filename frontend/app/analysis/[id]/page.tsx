import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnalysisById } from "@/lib/analysis-store";

const featureLabels: Array<{ key: string; label: string; suffix?: string }> = [
  { key: "bpm", label: "BPM" },
  { key: "estimatedKey", label: "Estimated key" },
  { key: "energy", label: "Energy" },
  { key: "spectralCentroid", label: "Spectral centroid", suffix: " Hz" },
  { key: "bassIntensity", label: "Bass intensity proxy" },
  { key: "duration", label: "Duration", suffix: " s" }
];

export default function AnalysisResultPage({ params }: { params: { id: string } }) {
  const result = getAnalysisById(params.id);

  if (!result) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <section className="glass-card p-8">
        <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Analysis result</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{result.trackName}</h1>
        <p className="mt-2 text-slate-300">Trend cluster: {result.trendCluster}</p>
        <p className="mt-1 text-lg font-medium text-cyan-300">Trend score: {result.trendScore}/100</p>

        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {featureLabels.map((feature) => {
            const value = result.features[feature.key as keyof typeof result.features];
            return (
              <article key={feature.key} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{feature.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {typeof value === "number" ? value.toFixed(feature.key === "spectralCentroid" ? 0 : 2) : value}
                  {feature.suffix}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Mood tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.features.moodTags.map((tag) => (
              <span key={tag} className="rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-card mt-6 p-8">
        <h2 className="text-xl font-semibold text-white">Closest artist-style matches</h2>
        <ul className="mt-4 space-y-3">
          {result.artistMatches.map((match) => (
            <li key={match.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{match.name}</p>
                <p className="font-semibold text-cyan-300">{match.score}% match</p>
              </div>
              <p className="mt-2 text-sm text-slate-300">{match.rationale}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Link href="/dashboard" className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10">
            Back to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
