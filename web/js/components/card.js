// web/js/components/card.js
export function renderCard({ id, title, summary }) {
  return `
    <div class="rounded-lg bg-white shadow-md overflow-hidden transform transition hover:scale-[1.02] hover:shadow-[0_0_15px_3px_rgba(64,224,208,0.4)]">
      <div class="bg-gradient-to-r from-[#E25C5C] to-purple-600 h-2"></div>
      <div class="p-5">
        <h3 class="font-exo2 text-xl text-[#E25C5C] font-semibold mb-2">${title || 'Sans titre'}</h3>
        <p class="text-gray-700 mb-4">${summary || 'Pas de résumé disponible.'}</p>
        <div class="flex space-x-3">
          <a href="#/fiches/${id}"
             class="text-sm bg-[#E25C5C] hover:bg-red-600 text-white px-3 py-1 rounded-lg transition">
             👀 Voir
          </a>
          <a href="#/fiches/${id}/messages"
             class="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition">
             💬 Messages
          </a>
        </div>
      </div>
    </div>
  `;
}
