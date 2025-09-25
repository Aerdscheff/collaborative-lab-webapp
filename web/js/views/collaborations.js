import { supabase } from '../auth.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  const content = `
    <h1 class="text-3xl font-exo2 text-[#E25C5C] mb-6">🤝 Collaborations</h1>
    <div id="collab-list" class="space-y-4"></div>
  `;
  renderLayout(app, content);

  const list = document.getElementById('collab-list');
  const { data } = await supabase.from('collaborations').select('*, fiches(title)');
  list.innerHTML = data?.map(c => `
    <div class="border p-3 rounded bg-white shadow">
      <h3 class="font-exo2 text-[#E25C5C]">${c.fiches?.title}</h3>
      <p>Statut : ${c.status}</p>
    </div>
  `).join('') || `<p>Aucune collaboration.</p>`;
}
