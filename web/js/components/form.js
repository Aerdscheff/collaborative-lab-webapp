// web/js/components/form.js
export function renderForm({ actionLabel = "Enregistrer" }) {
  return `
    <form class="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <input type="text" placeholder="Nom"
        class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-turquoise transition" />

      <input type="email" placeholder="Email"
        class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-turquoise transition" />

      <button type="submit"
        class="w-full bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-[0_0_10px_2px_rgba(64,224,208,0.6)] transition">
        ${actionLabel}
      </button>
    </form>
  `;
}
