import React from 'react';
import FichesList from './FichesList';

export default function App() {
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Äerdschëff – Collaborative Lab</h1>
      </header>
      <section>
        <FichesList />
      </section>
    </main>
  );
}
