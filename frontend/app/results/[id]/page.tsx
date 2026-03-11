import { notFound } from 'next/navigation';
import { getAnalysisById } from '@/lib/storage';

export default async function AnalysisResultPage({ params }: { params: { id: string } }) {
  const result = await getAnalysisById(params.id);

  if (!result) {
    notFound();
  }

  return (
    <section className="mx-auto mt-10 max-w-5xl space-y-6 px-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Analysis results</h1>
        <p className="mt-1 text-slate-300">{result.filename}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries({
          BPM: result.features.bpm,
          Key: result.features.estimatedKey,
          Energy: result.features.energy,
          'Spectral centroid': result.features.spectralCentroid,
          'Bass intensity': result.features.bassIntensity,
          Duration: `${result.features.duration}s`
        }).map(([key, value]) => (
          <div key={key} className="panel p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{key}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-lg font-medium text-white">Trend score</h2>
          <p className="mt-2 text-5xl font-semibold text-violet-300">{result.trendScore}</p>
          <p className="mt-2 text-sm text-slate-300">Deterministic score based on BPM, energy, bass and centroid fit.</p>
        </div>
        <div className="panel p-5">
          <h2 className="text-lg font-medium text-white">Mood tags</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.features.moodTags.map((tag) => (
              <span key={tag} className="rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="panel p-5">
        <h2 className="text-lg font-medium text-white">Closest artist-style matches</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {result.artistMatches.map((match) => (
            <li key={match.name} className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3">
              <span>{match.name}</span>
              <span className="font-semibold text-violet-300">{match.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
