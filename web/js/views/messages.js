import { supabase } from '../auth.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app, ficheId) {
  let content = `
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[#E25C5C]">💬 Discussion</h1>
      <a href="#/fiches/${ficheId}" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">⬅ Retour</a>
    </div>
    <div id="messages-feedback" class="mb-4"></div>
    <div id="messages-list" class="space-y-4 mb-6"></div>
    <form id="message-form" class="space-y-4">
      <textarea name="body" rows="3" class="w-full border rounded px-3 py-2"></textarea>
      <button type="submit" class="bg-[#E25C5C] hover:bg-red-600 text-white px-4 py-2 rounded">Envoyer</button>
    </form>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('messages-feedback');
  const list = document.getElementById('messages-list');
  const form = document.getElementById('message-form');

  async function loadMessages() {
    try {
      const { data } = await supabase.from('messages').select('*').eq('fiche_id', ficheId).order('created_at', { ascending: false });
      if (!data || data.length === 0) {
        list.innerHTML = `<p class="text-gray-500">Aucun message.</p>`;
        return;
      }
      list.innerHTML = data.map(m => `<div class="border p-3 rounded bg-white shadow-sm">${m.body}</div>`).join('');
    } catch {
      showFeedback(feedback, 'error', 'Erreur chargement messages.');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = form.body.value.trim();
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    await supabase.from('messages').insert({ fiche_id: ficheId, author_id: userId, body });
    form.reset();
    loadMessages();
  });

  loadMessages();
}
