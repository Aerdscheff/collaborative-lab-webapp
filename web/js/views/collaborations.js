import { supabase } from '../auth.js';
import { showFeedback } from '../utils/feedback.js';

export async function render(app) {
  app.innerHTML = `
    <section class="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">🤝 Collaborations pédagogiques</h2>
      <div id="collab-feedback" class="mb-4"></div>
      <div id="collab-list" class="space-y-4"></div>
    </section>
  `;

  const feedback = app.querySelector('#collab-feedback');
  const list = app.querySelector('#collab-list');

  async function loadCollaborations() {
    try {
      showFeedback(feedback, 'info', 'Chargement des collaborations…');

      // Récupérer les collaborations + la fiche liée
      const { data, error } = await supabase
        .from('collaborations')
        .select(`
          id,
          fiche_id,
          status,
          created_at,
          fiches (title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      feedback.innerHTML = '';

      if (!data || data.length === 0) {
        list.innerHTML = `<p class="text-gray-500">Aucune collaboration trouvée.</p>`;
        return;
      }

      list.innerHTML = data
        .map(
          (c) => `
          <div class="border rounded p-4 shadow-sm">
            <h3 class="text-lg font-medium">${c.fiches?.title || 'Fiche inconnue'}</h3>
            <p class="text-sm text-gray-500 mb-2">Statut : <strong>${c.status}</strong></p>
            <div class="flex space-x-2">
              <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded accept-btn"
                      data-id="${c.id}">
                ✅ Accepter
              </button>
              <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded reject-btn"
                      data-id="${c.id}">
                ❌ Rejeter
              </button>
            </div>
          </div>
        `
        )
        .join('');

      // Boutons accepter
      list.querySelectorAll('.accept-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
          try {
            const { error } = await supabase
              .from('collaborations')
              .update({ status: 'accepted' })
              .eq('id', btn.dataset.id);
            if (error) throw error;
            showFeedback(feedback, 'success', 'Collaboration acceptée ✅');
            loadCollaborations();
          } catch (err) {
            console.error('[collab] Erreur acceptation', err);
            showFeedback(feedback, 'error', 'Impossible d’accepter la collaboration.');
          }
        });
      });

      // Boutons rejeter
      list.querySelectorAll('.reject-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
          try {
            const { error } = await supabase
              .from('collaborations')
              .update({ status: 'rejected' })
              .eq('id', btn.dataset.id);
            if (error) throw error;
            showFeedback(feedback, 'success', 'Collaboration rejetée ❌');
            loadCollaborations();
          } catch (err) {
            console.error('[collab] Erreur rejet', err);
            showFeedback(feedback, 'error', 'Impossible de rejeter la collaboration.');
          }
        });
      });
    } catch (err) {
      console.error('[collab] Erreur load', err);
      showFeedback(feedback, 'error', 'Impossible de charger les collaborations.');
    }
  }

  loadCollaborations();
}
