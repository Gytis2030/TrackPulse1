import Link from 'next/link';
import { getAnalyses } from '@/lib/storage';
import { MetricCard } from '@/components/MetricCard';

export default async function DashboardPage() {
  const analyses = await getAnalyses();
  const avgScore = analyses.length
    ? (analyses.reduce((acc, item) => acc + item.trendScore, 0) / analyses.length).toFixed(1)
    : '0.0';

  return (
    <section className="mx-auto mt-10 max-w-6xl space-y-6 px-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-slate-300">Founder demo overview of recent analyses.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Analyses" value={String(analyses.length)} />
        <MetricCard label="Average trend score" value={avgScore} />
        <MetricCard label="Top track" value={analyses[0]?.filename ?? '—'} />
      </div>
      <div className="panel overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="px-4 py-3">Track</th>
              <th className="px-4 py-3">BPM</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Trend score</th>
              <th className="px-4 py-3">Result</th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((item) => (
              <tr key={item.id} className="border-b border-slate-900/80 text-slate-200">
                <td className="px-4 py-3">{item.filename}</td>
                <td className="px-4 py-3">{item.features.bpm}</td>
                <td className="px-4 py-3">{item.features.estimatedKey}</td>
                <td className="px-4 py-3">{item.trendScore}</td>
                <td className="px-4 py-3">
                  <Link href={`/results/${item.id}`} className="text-violet-300 hover:text-violet-200">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!analyses.length && <p className="p-6 text-sm text-slate-400">No analyses yet. Upload your first track.</p>}
      </div>
    </section>
  );
}
