/* Patch UI tweaks: adjust meet card title, hide extraneous sections, add latest projects table */
(function () {
  function patchAddPage() {
    try {
      const addView = document.getElementById('addView');
      if (!addView) return;
      // Hide introduction paragraph
      const pIntro = addView.querySelector('p');
      if (pIntro) pIntro.style.display = 'none';
      // Hide elements after the form to keep only the form
      const form = addView.querySelector('form');
      if (form) {
        let el = form.nextElementSibling;
        while (el) {
          el.style.display = 'none';
          el = el.nextElementSibling;
        }
      }
    } catch (e) {
      console.warn('patchAddPage:', e);
    }
  }
  function patchMeetCardTitle(projectIndex) {
    try {
      const prj = window.projects && window.projects[projectIndex];
      const card = document.querySelector('#meetCardContainer .card.meet');
      if (card && prj) {
        const existing = card.querySelector('h3');
        if (existing) existing.remove();
        const newH3 = document.createElement('h3');
        newH3.textContent = prj.title || prj.level || 'Sans titre';
        card.prepend(newH3);
        if (prj.level) {
          const small = document.createElement('small');
          small.textContent = 'Niveau / Âge : ' + prj.level;
          card.insertBefore(small, newH3.nextSibling);
        }
      }
    } catch (e) {
      console.warn('patchMeetCardTitle:', e);
    }
  }
  function insertLatestProjectsTable() {
    try {
      const container = document.getElementById('projects');
      if (!container) return;
      const existing = document.getElementById('latest-projects');
      if (existing) existing.remove();
      const projs = Array.isArray(window.projects) ? window.projects.slice() : [];
      if (!projs.length) return;
      projs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      const latest = projs.slice(0, 5);
      const wrapper = document.createElement('div');
      wrapper.id = 'latest-projects';
      wrapper.style.marginTop = '1rem';
      const title = document.createElement('h3');
      title.textContent = 'Dernières fiches';
      wrapper.appendChild(title);
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      const thead = document.createElement('thead');
      thead.innerHTML = '<tr><th style="text-align:left;padding:4px;">Titre</th><th style="text-align:left;padding:4px;">Niveau/Âge</th><th style="text-align:left;padding:4px;">Disciplines</th></tr>';
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      latest.forEach(p => {
        const tr = document.createElement('tr');
        const skills = p.skills && p.skills.length ? p.skills.join(', ') : '';
        tr.innerHTML = `<td style="padding:4px;">${p.title || ''}</td><td style="padding:4px;">${p.level || ''}</td><td style="padding:4px;">${skills}</td>`;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrapper.appendChild(table);
      container.parentNode.insertBefore(wrapper, container.nextSibling);
    } catch (e) {
      console.warn('insertLatestProjectsTable:', e);
    }
  }
  // Hook into meet card rendering
  if (typeof window.renderMeetCard === 'function') {
    const origMeetCard = window.renderMeetCard;
    window.renderMeetCard = function (projectIndex) {
      origMeetCard(projectIndex);
      patchMeetCardTitle(projectIndex);
    };
  } else {
    document.addEventListener('readystatechange', () => {
  /* Patch UI tweaks: adjust meet card title, hide extraneous sections, add latest projects table */
(function () {
  function patchAddPage() {
    try {
      const addView = document.getElementById('addView');
      if (!addView) return;
      // Hide introduction paragraph
      const pIntro = addView.querySelector('p');
      if (pIntro) pIntro.style.display = 'none';
      // Hide elements after the form to keep only the form
      const form = addView.querySelector('form');
      if (form) {
        let el = form.nextElementSibling;
        while (el) {
          el.style.display = 'none';
          el = el.nextElementSibling;
        }
      }
    } catch (e) {
      console.warn('patchAddPage:', e);
    }
  }
  function patchMeetCardTitle(projectIndex) {
    try {
      const prj = window.projects && window.projects[projectIndex];
      const card = document.querySelector('#meetCardContainer .card.meet');
      if (card && prj) {
        const existing = card.querySelector('h3');
        if (existing) existing.remove();
        const newH3 = document.createElement('h3');
        newH3.textContent = prj.title || prj.level || 'Sans titre';
        card.prepend(newH3);
        if (prj.level) {
          const small = document.createElement('small');
          small.textContent = 'Niveau / Âge : ' + prj.level;
          card.insertBefore(small, newH3.nextSibling);
        }
      }
    } catch (e) {
      console.warn('patchMeetCardTitle:', e);
    }
  }
  function insertLatestProjectsTable() {
    try {
      const container = document.getElementById('projects');
      if (!container) return;
      const existing = document.getElementById('latest-projects');
      if (existing) existing.remove();
      const projs = Array.isArray(window.projects) ? window.projects.slice() : [];
      if (!projs.length) return;
      projs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      const latest = projs.slice(0, 5);
      const wrapper = document.createElement('div');
      wrapper.id = 'latest-projects';
      wrapper.style.marginTop = '1rem';
      const title = document.createElement('h3');
      title.textContent = 'Dernières fiches';
      wrapper.appendChild(title);
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      const thead = document.createElement('thead');
      thead.innerHTML = '<tr><th style="text-align:left;padding:4px;">Titre</th><th style="text-align:left;padding:4px;">Niveau/Âge</th><th style="text-align:left;padding:4px;">Disciplines</th></tr>';
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      latest.forEach(p => {
        const tr = document.createElement('tr');
        const skills = p.skills && p.skills.length ? p.skills.join(', ') : '';
        tr.innerHTML = `<td style="padding:4px;">${p.title || ''}</td><td style="padding:4px;">${p.level || ''}</td><td style="padding:4px;">${skills}</td>`;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrapper.appendChild(table);
      container.parentNode.insertBefore(wrapper, container.nextSibling);
    } catch (e) {
      console.warn('insertLatestProjectsTable:', e);
    }
  }
  // Hook into meet card rendering
  if (typeof window.renderMeetCard === 'function') {
    const origMeetCard = window.renderMeetCard;
    window.renderMeetCard = function (projectIndex) {
      origMeetCard(projectIndex);
      patchMeetCardTitle(projectIndex);
    };
  } else {
    document.addEventListener('readystatechange', () => {
      if (typeof window.renderMeetCard === 'function') {
        const origMeetCard = window.renderMeetCard;
        window.renderMeetCard = function (projectIndex) {
          origMeetCard(projectIndex);
          patchMeetCardTitle(projectIndex);
        };
      }
    });
  }
  // Hook into projects rendering
  if (typeof window.renderProjects === 'function') {
    const origRenderProjects = window.renderProjects;
    window.renderProjects = async function () {
      await origRenderProjects();
      insertLatestProjectsTable();
    };
  } else {
    document.addEventListener('readystatechange', () => {
      if (typeof window.renderProjects === 'function') {
        const origRenderProjects = window.renderProjects;
        window.renderProjects = async function () {
          await origRenderProjects();
          insertLatestProjectsTable();
        };
      }
    });
  }
  // Apply add page patch on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    patchAddPage();
  });
})();    if (typeof window.renderMeetCard === 'function') {
        const origMeetCard = window.renderMeetCard;
        window.renderMeetCard = function (projectIndex) {
          origMeetCard(projectIndex);
          patchMeetCardTitle(projectIndex);
        };
      }
    });
  }
  // Hook into projects rendering
  if (typeof window.renderProjects === 'function') {
    const origRenderProjects = window.renderProjects;
    window.renderProjects = async function () {
      await origRenderProjects();
      insertLatestProjectsTable();
    };
  } else {
    document.addEventListener('readystatechange', () => {
      if (typeof window.renderProjects === 'function') {
        const origRenderProjects = window.renderProjects;
        window.renderProjects = async function () {
          await origRenderProjects();
          insertLatestProjectsTable();
        };
      }
    });
  }
  // Apply add page patch on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    patchAddPage();
  });
})();
