export function render(app) {
  app.innerHTML = `
    <section class="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">📨 Messagerie</h2>
      <p class="text-gray-600 mb-6">Aucune discussion pour le moment.</p>
      <div class="border border-dashed border-gray-300 p-6 text-center text-gray-500 rounded">
        Les messages apparaîtront ici lorsque la messagerie sera activée.
      </div>
    </section>
  `;
}
