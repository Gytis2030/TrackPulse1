import Link from "next/link";

const highlights = [
  "Upload audio and run deterministic analysis in seconds",
  "Compare feature profile against trend-fit clusters",
  "Reveal artist-style similarity scores for pitch decks"
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-20 pt-16">
      <section className="glass-card relative overflow-hidden p-10">
        <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-cyan-500/20 blur-3xl" />

        <p className="inline-flex rounded-full border border-blue-300/30 bg-blue-300/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-blue-200">
          Founder demo MVP
        </p>
        <h1 className="headline mt-5 max-w-3xl text-5xl font-semibold leading-tight">Understand how your track fits what is trending right now.</h1>
        <p className="mt-4 max-w-2xl text-slate-200">
          TrackPulse gives producers and small labels a fast way to inspect musical features, score trend alignment, and find style-adjacent artist references.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/upload" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            Upload Track
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Open Dashboard
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item} className="glass-card p-5 text-sm text-slate-200">
            <p>{item}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
