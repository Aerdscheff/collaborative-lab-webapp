export function render(app) {
  app.innerHTML = `
    <section class="max-w-5xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">⚙️ Administration</h2>
      <p class="text-gray-600 mb-6">Outils de gestion (utilisateurs, fiches, trames) en construction.</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="border rounded p-4 text-center shadow-sm">
          <h3 class="font-medium mb-2">Utilisateurs</h3>
          <p class="text-sm text-gray-500">Gestion des rôles et droits.</p>
          <button class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Accéder</button>
        </div>
        <div class="border rounded p-4 text-center shadow-sm">
          <h3 class="font-medium mb-2">Fiches</h3>
          <p class="text-sm text-gray-500">Exports, suppression, validation.</p>
          <button class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Accéder</button>
        </div>
        <div class="border rounded p-4 text-center shadow-sm">
          <h3 class="font-medium mb-2">Paramètres</h3>
          <p class="text-sm text-gray-500">Clés API, quotas, intégrations.</p>
          <button class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Accéder</button>
        </div>
      </div>
    </section>
  `;
}
