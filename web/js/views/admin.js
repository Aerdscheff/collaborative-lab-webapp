import { getUsers, updateUserRole } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';
import { requireAdmin } from '../authGuard.js';

export async function render(app) {
  const session = await requireAdmin(); // 🚨 accès réservé aux admins
  if (!session) return;

  const content = `
    <!-- Hero sombre -->
    <section class="relative w-full h-[30vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center"
           style="background-image: url('/assets/batiment-aerdscheff.png'); background-attachment: fixed;"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-[#E25C5C]/70 via-purple-600/80 to-[#E25C5C]/70"></div>
      <div class="relative z-10 text-center text-white">
        <h1 class="text-3xl font-exo2 font-bold">⚙️ Administration — Utilisateurs</h1>
      </div>
    </section>

    <!-- Contenu (70%) -->
    <section class="relative w-full h-[70vh] overflow-y-auto py-10">
      <div id="admin-feedback" class="mb-6 text-center"></div>
      <div id="admin-list" class="grid gap-4 md:grid-cols-2 max-w-5xl mx-auto"></div>
    </section>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('admin-feedback');
  const list = document.getElementById('admin-list');

  try {
    showFeedback(feedback, 'info', 'Chargement des utilisateurs...');
    const users = await getUsers();
    feedback.innerHTML = '';

    if (!users || users.length === 0) {
      list.innerHTML = `<p class="text-gray-500">Aucun utilisateur enregistré.</p>`;
      return;
    }

    list.innerHTML = users.map(user => `
      <div class="rounded-xl bg-white shadow-md p-4">
        <h3 class="font-exo2 text-xl text-[#E25C5C] mb-2">${user.name || user.email}</h3>
        <p class="text-gray-700 mb-2"><strong>Email :</strong> ${user.email}</p>
        <p class="text-gray-500 text-sm mb-3">Rôle actuel : 
          <span class="font-semibold">${user.role || 'teacher'}</span>
        </p>
        <div class="flex space-x-2">
          <button data-id="${user.id}" data-role="teacher"
                  class="role-btn bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-xl text-sm">
            Teacher
          </button>
          <button data-id="${user.id}" data-role="admin"
                  class="role-btn bg-[#E25C5C] hover:bg-red-600 text-white px-3 py-1 rounded-xl text-sm">
            Admin
          </button>
        </div>
      </div>
    `).join('');

    // Gestion des changements de rôle
    list.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.dataset.id;
        const role = btn.dataset.role;
        try {
          showFeedback(feedback, 'info', `Mise à jour du rôle en cours...`);
          await updateUserRole(userId, role);
          showFeedback(feedback, 'success', `✅ Rôle mis à jour pour ${userId} (${role})`);
          setTimeout(() => window.location.reload(), 800);
        } catch (err) {
          console.error(err);
          showFeedback(feedback, 'error', '❌ Impossible de changer le rôle.');
        }
      });
    });

  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', 'Impossible de charger les utilisateurs.');
  }
}
