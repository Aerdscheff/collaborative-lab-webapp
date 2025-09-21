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

  async function loadSuggestions() {
    try {
      showFeedback(feedback, 'info', 'Recherche de suggestions…');
      const { data, error } = await supabase
        .from('fiches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      feedback.innerHTML = '';

      if (!data || data.length === 0) {
        list.innerHTML = `<p class="text-gray-500">Aucune fiche compatible trouvée pour le moment.</p>`;
        return;
      }

      list.innerHTML = data
        .map(
          (fiche) => `
          <div class="border rounded p-4 shadow-sm">
            <h3 class="text-lg font-medium">${fiche.title || 'Sans titre'}</h3>
            <p class="text-sm text-gray-600 mb-2">${fiche.resume || ''}</p>
            <div class="flex space-x-2 mt-2">
              <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded accept-collab"
                      data-id="${fiche.id}">
                ✅ Accepter
              </button>
              <button class="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded skip-collab"
                      data-id="${fiche.id}">
                ❌ Passer
              </button>
            </div>
          </div>
        `
        )
        .join('');

      // Boutons Accepter
      list.querySelectorAll('.accept-collab').forEach((btn) => {
        btn.addEventListener('click', async () => {
          try {
            await supabase.from('collaborations').insert({
              fiche_id: btn.dataset.id,
              status: 'accepted',
              created_at: new Date().toISOString()
            });
            showFeedback(feedback, 'success', 'Collaboration acceptée ✅');
          } catch (err) {
            console.error('[collab] Erreur acceptation', err);
            showFeedback(feedback, 'error', 'Impossible d’accepter la collaboration.');
          }
        });
      });

      // Boutons Passer
      list.querySelectorAll('.skip-collab').forEach((btn) => {
        btn.addEventListener('click', () => {
          showFeedback(feedback, 'info', 'Collaboration ignorée ❌');
          btn.closest('div.border').remove();
        });
      });
    } catch (err) {
      console.error('[collab] Erreur load', err);
      showFeedback(feedback, 'error', 'Impossible de charger les collaborations.');
    }
  }

  loadSuggestions();
}
