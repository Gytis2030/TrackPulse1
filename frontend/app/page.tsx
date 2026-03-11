import { Hero } from '@/components/Hero';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <section className="mx-auto mt-12 grid max-w-6xl gap-4 px-6 md:grid-cols-3">
        {[
          ['Fast upload flow', 'Drop a track and get key features in seconds.'],
          ['Deterministic score', 'Scoring logic is transparent and reproducible for demos.'],
          ['Artist style matching', 'Closest references based on feature profile fit.']
        ].map(([title, body]) => (
          <article key={title} className="panel p-6">
            <h2 className="text-lg font-medium text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-300">{body}</p>
          </article>
        ))}
      </section>
    </>
  );
}
