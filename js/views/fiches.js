// frontend_files/js/views/fiches.js
// Fiches list view with search, filters, pagination, skeleton loader, and empty state

import { debounce, getHashQuery, setHashQuery } from './utils.js';

const Views_Fiches = (function () {
  // Minimum characters to trigger search
  const MIN_QUERY_LENGTH = 2;

  function buildFicheCard(row) {
    const id = `fiche-${row.id}`;
    const card = document.createElement('article');
    card.className = 'card fiche-card';
    card.setAttribute('id', id);
    card.setAttribute('aria-expanded', 'false');
    card.innerHTML = `
      <header style="display:flex;justify-content:space-between;gap:12px;">
        <div>
          <h3 style="margin:0;">${row.title || '(Sans titre)'}</h3>
          <div class="meta">${row.author_name || '—'} · ${new Date(row.updated_at || row.created_at).toLocaleDateString()}</div>
        </div>
        <span class="badge ${row.status === 'published' ? 'synced' : 'local'}" aria-label="Statut : ${row.status || 'draft'}">${row.status || 'draft'}</span>
      </header>
      <div class="meta">
        ${row.level ? `Niveau : ${row.level}` : ''}${row.skills ? ` · Compétences : ${row.skills}` : ''}
      </div>
      <p class="summary" id="${id}-summary">${row.resume || row.content || ''}</p>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <button class="toggle" type="button" aria-controls="${id}-summary" aria-expanded="false">Voir plus</button>
        <button class="button secondary" type="button" data-exp="pdf" aria-label="Exporter en PDF">PDF</button>
        <button class="button secondary" type="button" data-exp="docx" aria-label="Exporter en DOCX">DOCX</button>
        <a class="button" href="#/fiches/${row.id}">Modifier</a>
      </div>
    `;
    // Action bindings
    card.querySelector('[data-exp="pdf"]').addEventListener('click', async () => {
      try {
        await API.Fiches.export(row.id, 'pdf');
        UI.toast('Export PDF lancé', 'success');
      } catch {
        UI.toast('Erreur export PDF', 'error');
      }
    });
    card.querySelector('[data-exp="docx"]').addEventListener('click', async () => {
      try {
        await API.Fiches.export(row.id, 'docx');
        UI.toast('Export DOCX lancé', 'success');
      } catch {
        UI.toast('Erreur export DOCX', 'error');
      }
    });
    const toggle = card.querySelector('.toggle');
    toggle.addEventListener('click', () => {
      const expanded = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.textContent = expanded ? 'Voir plus' : 'Voir moins';
      if (expanded) card.scrollIntoView({ block: 'nearest' });
    });
    return card;
  }

  function renderEmpty(container, clearFilters) {
    container.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'empty-state';
    box.innerHTML = `
      <p>Aucun résultat trouvé avec ces filtres.</p>
      <div class="empty-actions">
        <button class="clear-btn" type="button">Effacer les filtres</button>
      </div>
    `;
    box.querySelector('.clear-btn').addEventListener('click', () => clearFilters());
    container.appendChild(box);
  }

  function showSkeleton(container, count = 2) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const sk = document.createElement('div');
      sk.className = 'skeleton-card';
      sk.innerHTML = `
        <div class="skel-line w70"></div>
        <div class="skel-line w30"></div>
        <div class="skel-badge"></div>
        <div class="skel-line"></div>
        <div class="skel-line w50"></div>
      `;
      container.appendChild(sk);
    }
  }

  async function list() {
    UI.renderBreadcrumb([
      { label: 'Accueil', href: '#/' },
      { label: 'Fiches' }
    ]);
    const wrap = document.createElement('div');
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.marginBottom = '12px';
    header.innerHTML = `
      <div>
        <input id="q" placeholder="Rechercher…" />
        <select id="status">
          <option value="">Statut</option>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
          <option value="archived">Archivé</option>
        </select>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <a href="#/fiches/create" class="button">Créer une fiche</a>
        <a href="#/collaborations" class="button secondary">→ Explorer les collaborations</a>
      </div>
    `;
    const container = document.createElement('div');
    const more = document.createElement('button');
    more.className = 'button secondary';
    more.textContent = 'Charger plus';
    more.style.marginTop = '12px';
    wrap.append(header, container, more);
    UI.mount(wrap);

    const { params } = getHashQuery();
    let state = {
      q: params.get('q') || '',
      status: params.get('status') || '',
      page: Math.max(1, parseInt(params.get('page') || '1', 10))
    };
    header.querySelector('#q').value = state.q;
    header.querySelector('#status').value = state.status;

    function clearFilters() {
      header.querySelector('#q').value = '';
      header.querySelector('#status').value = '';
      state.q = '';
      state.status = '';
      state.page = 1;
      setHashQuery('/fiches', { q: state.q, status: state.status, page: String(state.page) });
      fetchAndRender(true);
    }

    async function fetchAndRender(reset) {
      setHashQuery('/fiches', { q: state.q, status: state.status, page: String(state.page) });
      if (reset) showSkeleton(container, 2);
      more.disabled = true;
      const qs = {
        status: state.status || undefined,
        q: state.q && state.q.length >= MIN_QUERY_LENGTH ? state.q : '',
        limit: 20,
        offset: (state.page - 1) * 20
      };
      let data;
      try {
        data = await API.Fiches.list(qs);
      } catch (e) {
        data = null;
      }
      if (reset) container.innerHTML = '';
      if (!data || data.length === 0) {
        if (state.page === 1) {
          renderEmpty(container, clearFilters);
        }
        more.style.display = 'none';
      } else {
        data.forEach(row => container.appendChild(buildFicheCard(row)));
        more.style.display = data.length === 20 ? 'inline-flex' : 'none';
      }
      more.disabled = false;
    }

    const applyFilters = debounce(() => {
      state.q = header.querySelector('#q').value.trim();
      state.status = header.querySelector('#status').value;
      state.page = 1;
      fetchAndRender(true);
    }, 300);

    header.querySelector('#q').addEventListener('input', applyFilters);
    header.querySelector('#status').addEventListener('change', applyFilters);

    more.addEventListener('click', () => {
      state.page += 1;
      fetchAndRender(false);
    });

    await fetchAndRender(true);
  }

  return { list };
})();

export { Views_Fiches };