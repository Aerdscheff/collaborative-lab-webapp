import { supabase } from '../auth.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app, ficheId) {
  let content = `
    <a href="#/fiches" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">⬅ Retour</a>
    <div id="fiche-content" class="my-6"></div>
    <h2 class="text-xl font-semibold mb-4">💬 Discussion</h2>
    <div id="messages-feedback" class="mb-4"></div>
    <div id="messages-list" class="space-y-4 mb-6"></div>
    <form id="message-form" class="space-y-4">
      <textarea name="body" rows="3" class="w-full border rounded px-3 py-2"></textarea>
      <button type="submit" class="bg-[#E25C5C] hover:bg-red-600 text-white px-4 py-2 rounded">Envoyer</button>
    </form>
  `;

  renderLayout(app, content);

  const ficheContainer = document.getElementById('fiche-content');
  const feedback = document.getElementById('messages-feedback');
  const list = document.getElementById('messages-list');
  const form = document.getElementById('message-form');

  async function loadFiche() {
    try {
      ficheContainer.innerHTML = `<p>Chargement…</p>`;
      const { data } = await supabase.from('fiches').select('*').eq('id', ficheId).single();
      ficheContainer.innerHTML = `
        <h1 class="text-2xl font-bold text-[#E25C5C]">${data.title}</h1>
        <p>${data.summary || ''}</p>
      `;
    } catch (err) {
      ficheContainer.innerHTML = `<p class="text-red-500">Erreur chargement fiche</p>`;
    }
  }

  async function loadMessages() {
    try {
      const { data } = await supabase.from('messages').select('*').eq('fiche_id', ficheId);
      list.innerHTML = data.map(m => `<div class="border p-3">${m.body}</div>`).join('');
    } catch (err) {
      showFeedback(feedback, 'error', 'Erreur chargement messages');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = form.body.value.trim();
    await supabase.from('messages').insert({ fiche_id: ficheId, body });
    await loadMessages();
  });

  await loadFiche();
  await loadMessages();
}
