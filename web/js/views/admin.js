import { getUsers } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-[#E25C5C] mb-8">⚙️ Administration</h1>
    <div id="admin-feedback" class="mb-6"></div>
    <div id="admin-list" class="grid gap-4 md:grid-cols-2"></div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('admin-feedback');
  const list = document.getElementById('admin-list');

  try {
    showFeedback(feedback, 'info', '<div class="animate-spin h-6 w-6 border-2 border-t-transparent border-[#E25C5C] rounded-full mx-auto"></div>');
    const users = await getUsers();
    feedback.innerHTML = '';

    if (!users || users.length === 0) {
      list.innerHTML = `<p class="text-gray-500">Aucun utilisateur enregistré.</p>`;
      return;
    }

    list.innerHTML = users
      .map(
        (user) => `
        <div class="rounded-xl bg-white shadow-md p-4">
          <h3 class="font-exo2 text-xl text-[#E25C5C] mb-2">${user.name}</h3>
          <p class="text-gray-700 mb-2">${user.email}</p>
          <p class="text-gray-500 text-sm">Rôle : ${user.role || 'inconnu'}</p>
        </div>
      `
      )
      .join('');
  } catch {
    showFeedback(feedback, 'error', 'Impossible de charger les utilisateurs.');
  }
}
