import { supabase } from '../auth.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app, ficheId) {
  app.innerHTML = `
    <section class="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
      <div id="fiche-content" class="mb-8"></div>
      <h2 class="text-xl font-semibold mb-4">💬 Discussion</h2>
      <div id="messages-feedback" class="mb-4"></div>
      <div id="messages-list" class="space-y-4 mb-6"></div>
      <form id="message-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nouveau message</label>
          <textarea name="body" rows="3"
            class="mt-1 block w-full border rounded px-3 py-2"
            placeholder="Écrivez votre message..."></textarea>
        </div>
        <div class="text-right">
          <button type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Envoyer
          </button>
        </div>
      </form>
    </section>
  `;

  const ficheContainer = app.querySelector('#fiche-content');
  const feedback = app.querySelector('#messages-feedback');
  const list = app.querySelector('#messages-list');
  const form = app.querySelector('#message-form');

  // Charger la fiche
  async function loadFiche() {
    try {
      ficheContainer.innerHTML = `<p class="text-gray-500">Chargement de la fiche…</p>`;
      const { data, error } = await supabase
        .from('fiches')
        .select('id, title, summary, content, created_at, updated_at')
        .eq('id', ficheId)
        .single();

      if (error) throw error;
      if (!data) {
        ficheContainer.innerHTML = `<p class="text-red-500">Fiche introuvable.</p>`;
        return;
      }

      ficheContainer.innerHTML = `
        <h1 class="text-2xl font-bold mb-2">${data.title}</h1>
        <p class="text-gray-600 mb-4">${data.summary || ''}</p>
        <div class="prose">${data.content || ''}</div>
        <p class="text-sm text-gray-500 mt-4">
          Créée le ${new Date(data.created_at).toLocaleString()} – Dernière mise à jour le ${new Date(data.updated_at).toLocaleString()}
        </p>
      `;
    } catch (err) {
      console.error('[fiche-detail] Erreur load fiche', err);
      ficheContainer.innerHTML = `<p class="text-red-500">Impossible de charger la fiche.</p>`;
    }
  }

  // Charger les messages liés à la fiche
  async function loadMessages() {
    try {
      showFeedback(feedback, 'info', 'Chargement des messages…');
      const { data, error } = await supabase
        .from('messages')
        .select('id, author_id, body, created_at')
        .eq('fiche_id', ficheId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      feedback.innerHTML = '';

      if (!data || data.length === 0) {
        list.innerHTML = `<p class="text-gray-500">Aucun message pour cette fiche.</p>`;
        return;
      }

      list.innerHTML = data
        .map(
          (msg) => `
          <div class="border rounded p-3 shadow-sm">
            <p class="text-gray-800">${msg.body || '[message vide]'}</p>
            <p class="text-sm text-gray-500 mt-1">
              Auteur: ${msg.author_id || 'Inconnu'} – ${new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
        `
        )
        .join('');
    } catch (err) {
      console.error('[fiche-detail] Erreur load messages', err);
      showFeedback(feedback, 'error', 'Impossible de charger les messages.');
    }
  }

  // Soumission du formulaire message
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = form.body.value.trim();
    if (!body) {
      showFeedback(feedback, 'error', 'Le message est vide.');
      return;
    }

    showFeedback(feedback, 'info', 'Envoi en cours…');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      const { error } = await supabase.from('messages').insert({
        fiche_id: ficheId,
        author_id: userId,
        body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        kind: 'comment'
      });
      if (error) throw error;

      showFeedback(feedback, 'success', 'Message envoyé ✅');
      form.reset();
      await loadMessages();
    } catch (err) {
      console.error('[fiche-detail] Erreur envoi message', err);
      showFeedback(feedback, 'error', err.message || 'Impossible d’envoyer le message.');
    }
  });

  // Charger fiche + messages au démarrage
  await loadFiche();
  await loadMessages();
}
