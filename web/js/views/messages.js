import { getMessages, markMessageRead, sendMessage } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';
import { requireAuth } from '../authGuard.js';

export async function render(app) {
  const session = await requireAuth();
  if (!session) return;

  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-purple-700 mb-8">✉️ Messagerie</h1>
    <div id="messages-feedback" class="mb-6"></div>
    <div id="messages-list" class="space-y-4 mb-12"></div>

    <h2 class="text-2xl font-exo2 text-[#E25C5C] mb-4">📤 Nouveau message</h2>
    <form id="new-message-form" class="bg-white shadow-md rounded-xl p-6 space-y-4 max-w-xl">
      <div>
        <label for="to_email" class="block text-sm font-medium text-gray-700 mb-1">Destinataire (email)</label>
        <input type="email" id="to_email" name="to_email" required
               class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600">
      </div>
      <div>
        <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
        <input type="text" id="subject" name="subject" required
               class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600">
      </div>
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea id="content" name="content" rows="4" required
                  class="w-full border-gray-300 rounded-xl p-2 focus:ring-purple-600 focus:border-purple-600"></textarea>
      </div>
      <div class="flex justify-end">
        <button type="submit"
                class="bg-gradient-to-r from-[#E25C5C] to-purple-600 text-white px-6 py-2 rounded-xl shadow-md transition">
          📩 Envoyer
        </button>
      </div>
    </form>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('messages-feedback');
  const list = document.getElementById('messages-list');

  try {
    showFeedback(feedback, 'info', 'Chargement des messages...');
    const messages = await getMessages(session.user.email);
    feedback.innerHTML = '';

    if (!messages || messages.length === 0) {
      list.innerHTML = `<p class="text-gray-500">📭 Aucun message.</p>`;
      return;
    }

    list.innerHTML = messages.map(msg => `
      <div class="bg-white shadow-md rounded-xl p-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-exo2 text-lg text-[#E25C5C]">${msg.subject || '(sans sujet)'}</h3>
          <span class="text-xs text-gray-500">${new Date(msg.created_at).toLocaleString()}</span>
        </div>
        <p class="text-gray-700 mb-2">${msg.content}</p>
        <p class="text-sm text-gray-500">De : <strong>${msg.from_email}</strong></p>
        <div class="mt-3">
          ${msg.read
            ? `<span class="text-xs text-green-600">✅ Lu</span>`
            : `<button data-id="${msg.id}" class="mark-read bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-xl text-xs">Marquer comme lu</button>`}
        </div>
      </div>
    `).join('');

    // Gestion des boutons "Marquer comme lu"
    list.querySelectorAll('.mark-read').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        try {
          await markMessageRead(id);
          showFeedback(feedback, 'success', 'Message marqué comme lu.');
          setTimeout(() => window.location.reload(), 500);
        } catch (err) {
          console.error(err);
          showFeedback(feedback, 'error', 'Impossible de marquer comme lu.');
        }
      });
    });

  } catch (err) {
    console.error(err);
    showFeedback(feedback, 'error', 'Impossible de charger les messages.');
  }

  // Formulaire d'envoi de message
  const form = document.getElementById('new-message-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const newMessage = {
      to_email: formData.get('to_email'),
      from_email: session.user.email,
      subject: formData.get('subject'),
      content: formData.get('content'),
      read: false,
    };

    try {
      showFeedback(feedback, 'info', 'Envoi du message...');
      await sendMessage(newMessage);
      showFeedback(feedback, 'success', '✅ Message envoyé !');
      form.reset();
    } catch (err) {
      console.error(err);
      showFeedback(feedback, 'error', '❌ Erreur lors de l’envoi du message.');
    }
  });
}
