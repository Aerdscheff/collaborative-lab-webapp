import { renderLayout } from '../layout.js';
import { requireAdmin } from '../authGuard.js';

export async function render(app) {
  const session = await requireAdmin();
  if (!session) return;

  const content = `
    <!-- Hero sombre -->
    <section class="relative w-full h-[30vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center"
           style="background-image: url('/assets/batiment-aerdscheff.png'); background-attachment: fixed;"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-[#E25C5C]/70 via-purple-600/80 to-[#E25C5C]/70"></div>
      <div class="relative z-10 text-center text-white">
        <h1 class="text-3xl font-exo2 font-bold">📜 Administration — Logs</h1>
      </div>
    </section>

    <!-- Contenu (70%) -->
    <section class="relative w-full h-[70vh] overflow-y-auto py-10">
      <div class="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6">
        <pre class="text-sm text-gray-700">
[2025-09-27 12:00] Application démarrée
[2025-09-27 12:05] Profil utilisateur mis à jour
[2025-09-27 12:10] Nouvelle fiche créée
        </pre>
      </div>
    </section>
  `;

  renderLayout(app, content);
}
