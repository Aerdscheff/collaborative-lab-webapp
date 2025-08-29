/* Patch to condense project cards and add menu for details & contact */
(function() {
  function miniRenderCard(card, project) {
    try {
      // Clear existing card content
      card.innerHTML = '';
      card.style.position = 'relative';
      // Title
      const h3 = document.createElement('h3');
      h3.textContent = project.title || project.level || 'Sans titre';
      card.appendChild(h3);
      // Age/level
      const smallLevel = document.createElement('small');
      smallLevel.textContent = 'Âge / Niveau : ' + (project.level || '—');
      smallLevel.style.display = 'block';
      smallLevel.style.marginBottom = '.25rem';
      card.appendChild(smallLevel);
      // Disciplines / skills
      const pSkills = document.createElement('p');
      const skills = (project.skills && project.skills.length) ? project.skills.join(', ') : '—';
      pSkills.textContent = 'Disciplines : ' + skills;
      pSkills.style.margin = '0 0 .5rem 0';
      card.appendChild(pSkills);
      // Hidden details container
      const details = document.createElement('div');
      details.style.display = 'none';
      details.style.marginTop = '.5rem';
      // Période
      const pPeriod = document.createElement('p');
      pPeriod.textContent = 'Période : ' + (project.period || '—');
      details.appendChild(pPeriod);
      // Pédagogie
      const pPedagogy = document.createElement('p');
      pPedagogy.textContent = 'Pédagogie : ' + ((project.pedagogy && project.pedagogy.length) ? project.pedagogy.join(', ') : '—');
      details.appendChild(pPedagogy);
      // Tags
      const pTags = document.createElement('p');
      pTags.textContent = 'Mots-clés : ' + ((project.tags && project.tags.length) ? project.tags.join(', ') : '—');
      details.appendChild(pTags);
      // Summary
      if (project.summary) {
        const pSummary = document.createElement('p');
        pSummary.textContent = project.summary;
        details.appendChild(pSummary);
      }
      card.appendChild(details);
      // Menu button
      const menuBtn = document.createElement('span');
      menuBtn.textContent = '⋮';
      menuBtn.style.position = 'absolute';
      menuBtn.style.top = '0.5rem';
      menuBtn.style.right = '0.5rem';
      menuBtn.style.cursor = 'pointer';
      card.appendChild(menuBtn);
      // Menu container
      const menu = document.createElement('div');
      menu.style.position = 'absolute';
      menu.style.top = '1.5rem';
      menu.style.right = '0.5rem';
      menu.style.background = '#fff';
      menu.style.border = '1px solid #ccc';
      menu.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      menu.style.display = 'none';
      menu.style.zIndex = '100';
      // Option: Lire la fiche
      const optDetails = document.createElement('div');
      optDetails.textContent = 'Lire la fiche';
      optDetails.style.padding = '0.25rem 0.5rem';
      optDetails.style.cursor = 'pointer';
      menu.appendChild(optDetails);
      // Option: Contacter l’émetteur
      const optContact = document.createElement('div');
      optContact.textContent = 'Contacter';
      optContact.style.padding = '0.25rem 0.5rem';
      optContact.style.cursor = 'pointer';
      menu.appendChild(optContact);
      card.appendChild(menu);
      // Event listeners
      menuBtn.addEventListener('click', function(ev) {
        ev.stopPropagation();
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
      });
      optDetails.addEventListener('click', function() {
        details.style.display = (details.style.display === 'none' || details.style.display === '') ? 'block' : 'none';
        menu.style.display = 'none';
      });
      optContact.addEventListener('click', function() {
        menu.style.display = 'none';
        const email = project.ownerEmail || project.owner || '';
        if (email) {
          // Try using existing sendMessage if available
          if (typeof window.sendMessage === 'function') {
            const subject = 'Contact à propos de votre projet';
            const content = 'Un utilisateur est intéressé par votre fiche: "' + (project.title || '') + '".';
            window.sendMessage(email, subject, content);
          } else {
            window.location.href = 'mailto:' + email;
          }
        } else {
          alert('Aucune adresse e-mail de contact disponible.');
        }
      });
      // Hide menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!card.contains(e.target)) {
          menu.style.display = 'none';
        }
      });
    } catch (e) {
      console.warn('miniRenderCard error', e);
    }
  }
  function patchCards() {
    try {
      const cards = document.querySelectorAll('.project-card');
      if (!Array.isArray(window.projects)) return;
      cards.forEach(function(card, idx) {
        const proj = window.projects[idx];
        if (proj) {
          miniRenderCard(card, proj);
        }
      });
    } catch (e) {
      console.warn('patchCards error', e);
    }
  }
  const originalRenderProjects = window.renderProjects;
  window.renderProjects = async function(...args) {
    if (originalRenderProjects) {
      await originalRenderProjects.apply(this, args);
    }
    patchCards();
      // Dynamically load UI tweaks script
  (function() {
    try {
      const s = document.createElement('script');
      s.src = 'patch-ui-tweaks.js';
      document.body.appendChild(s);
    } catch (e) { console.warn('load patch-ui-tweaks', e); }
  })();
    
  };
})();
