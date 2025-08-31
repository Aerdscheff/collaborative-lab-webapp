// Helpers d’interface : fil d’Ariane, toasts, badges, montage des vues.

(function(){
  // Construit et affiche le fil d’Ariane à partir d’une liste d’items { label, href? }
  function renderBreadcrumb(items) {
    const ol = document.getElementById('breadcrumb');
    if (!ol) return;
    ol.innerHTML = '';
    items.forEach((it, i) => {
      const li = document.createElement('li');
      if (it.href && i < items.length - 1) {
        const a = document.createElement('a');
        a.href = it.href;
        a.textContent = it.label;
        li.appendChild(a);
      } else {
        li.textContent = it.label;
      }
      ol.appendChild(li);
    });
  }

  // Affiche un toast pendant quelques secondes
  function toast(message, type = 'info') {
    const wrap = document.getElementById('toast-container');
    if (!wrap) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.setAttribute('role', 'alert');
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 3000);
  }

  // Crée un badge d’état (synced/local/error)
  function badge(state) {
    const span = document.createElement('span');
    span.className = `badge ${state}`;
    span.textContent = state;
    return span;
  }

  // Monte le nœud dans le conteneur #app et place le focus
  function mount(node) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = '';
    app.appendChild(node);
    // Accessibilité : replacer le focus dans le main
    if (document.activeElement) {
      app.focus();
    }
  }

  window.UI = { renderBreadcrumb, toast, badge, mount };
})();