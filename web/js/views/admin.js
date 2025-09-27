import { getUsers, updateUserRole } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';
import { requireAdmin } from '../authGuard.js';

export async function render(app) {
  const session = await requireAdmin(); // 🚨 réservé aux admins
  if (!session) return;

  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-[#E25C5C] mb-8">⚙️ Administration</h1>
    <div id="admin-feedback" class="mb-6"></div>
    <div id="admin-list" class="grid gap-4 md:grid-cols-2"></div>
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
        <p class="text-gray-700 mb-2">${user.email}</p>
        <p class="text-gray-500 text-sm mb-3">Rôle actuel : <strong>${user.role || 'teacher'}</strong></p>
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
          await updateUserRole(userId, role);
          showFeedback(feedback, 'success', `✅ Rôle mis à jour pour ${userId}`);
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
