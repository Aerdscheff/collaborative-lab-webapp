import React from 'react';

export default function App() {
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Äerdschëff – Collaborative Lab</h1>
        <span className="badge">Consented (v1)</span>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <article key={i} className="card">
            <h2 className="font-medium mb-2">Proposition #{i}</h2>
            <p className="text-sm opacity-80">Résumé court de la proposition.</p>
            <div className="mt-3 flex gap-2">
              <span className="badge">Forum</span>
              <span className="badge">Consentement</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
