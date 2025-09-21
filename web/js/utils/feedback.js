export function showFeedback(container, type = 'success', message = '') {
  if (!container) return;
  const styles = {
    success: 'bg-green-100 border-green-300 text-green-800',
    error: 'bg-red-100 border-red-300 text-red-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800'
  };

  container.innerHTML = `
    <div class="mb-4 rounded border px-4 py-3 ${styles[type]}" role="alert">
      ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}
    </div>
  `;
}
