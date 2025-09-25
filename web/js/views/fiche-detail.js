import { supabase } from '../auth.js';
import { renderLayout } from '../layout.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app, ficheId) {
  const content = `
    <a href="#/fiches" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">⬅ Retour</a>
    <div id="fiche-content" class="my-6"></div>
    <h2 class="text-xl font-exo2 font-semibold mb-4">💬 Discussion</h2>
    <div id="messages-feedback" class="mb-4"></div>
    <div id="messages-list" class="space-y-4 mb-6"></div>
    <form id="message-form" class="space-y-4">
      <textarea name="body" rows="3" class="w-full border rounded px-3 py-2"></textarea>
      <button type="submit" class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-[0_0_10px_2px_rgba(64,224,208,0.6)] transition">Envoyer</button>
    </form>
  `;
  renderLayout(app, content);

  const ficheContainer = document.getElementById('fiche-content');
  const list = document.getElementById('messages-list');
  const feedback = document.getElementById('messages-feedback');
  const form = document.getElementById('message-form');

  async function loadFiche() {
    const { data } = await supabase.from('fiches').select('*').eq('id', ficheId).single();
    ficheContainer.innerHTML = `
      <h1 class="text-2xl font-exo2 text-[#E25C5C]">${data.title}</h1>
      <p class="text-gray-700">${data.summary}</p>
    `;
  }

  async function loadMessages() {
    const { data } = await supabase.from('messages').select('*').eq('fiche_id', ficheId);
    list.innerHTML = data?.map(m => `<div class="border p-3 rounded bg-white shadow">${m.body}</div>`).join('') || '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = form.body.value.trim();
    try {
      await supabase.from('messages').insert({ fiche_id: ficheId, body });
      await loadMessages();
    } catch {
      showFeedback(feedback, 'error', 'Erreur envoi.');
    }
  });

  await loadFiche();
  await loadMessages();
}
