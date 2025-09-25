import { supabase } from '../auth.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  let content = `
    <h1 class="text-2xl font-bold text-[#E25C5C] mb-6">🤝 Collaborations</h1>
    <div id="collab-feedback"></div>
    <div id="collab-list" class="space-y-4"></div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('collab-feedback');
  const list = document.getElementById('collab-list');

  try {
    const { data } = await supabase.from('collaborations').select('*, fiches(title)');
    if (!data || data.length === 0) {
      list.innerHTML = `<p>Aucune collaboration.</p>`;
      return;
    }
    list.innerHTML = data.map(c => `
      <div class="border p-3 rounded bg-white">
        <h3 class="font-bold">${c.fiches?.title || 'Fiche inconnue'}</h3>
        <p>Statut : ${c.status}</p>
      </div>
    `).join('');
  } catch {
    showFeedback(feedback, 'error', 'Erreur chargement collaborations.');
  }
}
