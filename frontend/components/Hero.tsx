import Link from 'next/link';

export function Hero() {
  return (
    <section className="mx-auto mt-14 max-w-6xl px-6 text-center">
      <div className="panel mx-auto max-w-3xl p-10 shadow-glow">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Music Intelligence MVP</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">
          Understand how your track fits trends before you release.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-slate-300">
          Upload audio, extract core features, and get deterministic trend scoring + style matches in a premium dashboard.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/upload" className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-500">
            Analyze track
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:border-slate-500">
            View dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
