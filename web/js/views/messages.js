import { supabase } from '../auth.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app, ficheId) {
  app.innerHTML = `
    <section class="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">📨 Discussions liées à cette fiche</h2>
      <div id="messages-feedback" class="mb-4"></div>

      <!-- Liste des messages -->
      <div id="messages-list" class="space-y-4 mb-6"></div>

      <!-- Formulaire envoi -->
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

  const feedback = app.querySelector('#messages-feedback');
  const list = app.querySelector('#messages-list');
  const form = app.querySelector('#message-form');

  // Charger les messages d'une fiche
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
      console.error('[messages] Erreur load', err);
      showFeedback(feedback, 'error', 'Impossible de charger les messages.');
    }
  }

  // Soumission du formulaire
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
      console.error('[messages] Erreur envoi', err);
      showFeedback(feedback, 'error', err.message || 'Impossible d’envoyer le message.');
    }
  });

  // Charger au démarrage
  loadMessages();
}
