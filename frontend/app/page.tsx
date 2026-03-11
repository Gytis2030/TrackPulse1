const checks = [
  "Upload flow placeholder",
  "Audio feature extraction service connectivity",
  "Deterministic trend scoring module",
  "Artist-style match insights panel"
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="inline-flex rounded-full border border-pulse/50 bg-pulse/10 px-3 py-1 text-xs uppercase tracking-wide text-pulse">
          TrackPulse MVP scaffold
        </p>
        <h1 className="text-4xl font-semibold">TrackPulse</h1>
        <p className="max-w-2xl text-slate-300">
          A production-ready foundation for uploading tracks, analyzing audio, and showing trend fit insights.
        </p>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-lg font-medium">Initial modules</h2>
        <ul className="mt-4 space-y-2 text-slate-300">
          {checks.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-pulse" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
