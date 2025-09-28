import { renderLayout } from '../layout.js';
import { showFeedback } from '../utils/feedback.js';
import { requireAuth } from '../authGuard.js';
import { supabase } from '../auth.js';

export async function render(app) {
  const session = await requireAuth();
  if (!session) return;

  const content = `
    <h1 class="text-3xl font-exo2 font-bold text-[#E25C5C] mb-8">💬 Messagerie</h1>
    <div id="messages-feedback" class="mb-6"></div>
    <div id="messages-list" class="space-y-4"></div>

    <h2 class="text-xl font-exo2 font-semibold text-purple-700 mt-10 mb-4">✉️ Nouveau message</h2>
    <form id="message-form" class="bg-white shadow-md rounded-xl p-6 space-y-4 max-w-2xl mx-auto">
      <div>
        <label for="to_user" class="block text-sm font-medium text-gray-700 mb-1">Destinataire (UUID)</label>
        <input id="to_user" name="to_user" type="text" required
          placeholder="UUID du destinataire"
          class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600">
      </div>
      <div>
        <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
        <input id="subject" name="subject" type="text" required
          class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600">
      </div>
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea id="content" name="content" rows="4" required
          class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600"></textarea>
      </div>
      <button type="submit"
        class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition">
        📩 Envoyer
      </button>
    </form>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('messages-feedback');
  const list = document.getElementById('messages-list');
  const form = document.getElementById('message-form');

  try {
    showFeedback(feedback, 'info', 'Chargement des messages...');
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('to_user', session.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    feedback.innerHTML = '';

    if (!data || data.length === 0) {
      list.innerHTML = `<p class="text-gray-500">📭 Aucun message reçu.</p>`;
    } else {
      list.innerHTML = data
        .map(
          (msg) => `
        <div class="bg-white shadow-md rounded-xl p-4">
          <p class="text-sm text-gray-500 mb-1">De: ${msg.from_user}</p>
          <p class="font-semibold text-[#E25C5C]">${msg.subject}</p>
          <p class="text-gray-700 mt-2 whitespace-pre-line">${msg.content}</p>
          <p class="text-xs text-gray-400 mt-2">Reçu le ${new Date(msg.created_at).toLocaleString()}</p>
        </div>
      `
        )
        .join('');
    }
  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', '❌ Impossible de charger les messages.');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const newMessage = {
      from_user: session.user.id,
      to_user: formData.get('to_user'),
      subject: formData.get('subject'),
      content: formData.get('content'),
    };

    try {
      showFeedback(feedback, 'info', '📨 Envoi en cours...');
      const { error } = await supabase.from('messages').insert(newMessage);
      if (error) throw error;
      showFeedback(feedback, 'success', '✅ Message envoyé avec succès !');
      form.reset();
    } catch (err) {
      console.error(err);
      showFeedback(feedback, 'error', '❌ Erreur lors de l’envoi.');
    }
  });
}
