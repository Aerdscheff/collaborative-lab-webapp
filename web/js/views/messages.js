import { getMessages } from '../api.js';
import { showFeedback } from '../utils/feedback.js';
import { renderLayout } from '../layout.js';

export async function render(app) {
  const content = `
    <h1 class="text-4xl font-exo2 font-bold text-purple-700 mb-8">✉️ Messagerie</h1>
    <div id="messages-feedback" class="mb-6"></div>
    <div id="messages-list" class="space-y-4"></div>
  `;

  renderLayout(app, content);

  const feedback = document.getElementById('messages-feedback');
  const list = document.getElementById('messages-list');

  try {
    showFeedback(feedback, 'info', '<div class="animate-spin h-6 w-6 border-2 border-t-transparent border-purple-700 rounded-full mx-auto"></div>');
    const messages = await getMessages();
    feedback.innerHTML = '';

    if (!messages || messages.length === 0) {
      list.innerHTML = `<p class="text-gray-500">Aucun message.</p>`;
      return;
    }

    list.innerHTML = messages
      .map(
        (msg) => `
        <div class="rounded-xl bg-white shadow p-4">
          <p class="text-gray-700 mb-2"><strong>${msg.sender}</strong> : ${msg.content}</p>
          <p class="text-xs text-gray-500">${new Date(msg.date).toLocaleString()}</p>
        </div>
      `
      )
      .join('');
  } catch {
    showFeedback(feedback, 'error', 'Impossible de charger les messages.');
  }
}
