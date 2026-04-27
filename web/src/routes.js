import {
  getCurrentUserContext,
  getSession,
  signInWithMagicLink,
  signInWithPassword,
  signOut,
} from './auth.js';
import { requireRole, requireSession } from './guards.js';
import { supabase } from './supabase.js';

const studentActions = [
  'I observed something',
  'I have an idea',
  'We tested something',
  'What we learned',
];

function getMenuItemsByRole(role) {
  if (role === 'facilitator') {
    return [
      { href: '/', label: 'Maison' },
      { href: '/dashboard', label: 'Tableau de bord' },
      { href: '/lycees', label: 'Lycées' },
      { href: '/admin', label: 'Administrateur' },
      { href: '/publication', label: 'Publication' },
    ];
  }

  if (role === 'referent') {
    return [
      { href: '/', label: 'Maison' },
      { href: '/dashboard', label: 'Tableau de bord' },
      { href: '/mon-lycee', label: 'Mon lycée' },
      { href: '/contributions', label: 'Contributions établissement' },
    ];
  }

  return [
    { href: '/', label: 'Maison' },
    { href: '/dashboard', label: 'Tableau de bord' },
    { href: '/mon-lycee', label: 'Mon lycée' },
    { href: '/contributions', label: 'Mes contributions' },
  ];
}

async function shell(content) {
  const session = await getSession();
  const context = session ? await getCurrentUserContext() : { role: null };

  const items = session
    ? getMenuItemsByRole(context.role)
    : [{ href: '/', label: 'Maison' }, { href: '/login', label: 'Connexion' }];

  return `
    <nav>
      <div class="links container">
        ${items.map((item) => `<a class="btn" href="${item.href}">${item.label}</a>`).join('')}
      </div>
    </nav>
    <main class="container">${content}</main>
  `;
}

async function notFound() {
  return shell(`
    <section class="card">
      <h1 class="h1">Page non trouvée</h1>
      <a class="btn" href="/">Retour à la maison</a>
    </section>
  `);
}

async function home() {
  return shell(`
    <section class="card">
      <h1 class="h1">Transition Lab V0.3.2</h1>
      <p class="muted">Prototype private-by-default pour les lycées pilotes.</p>
      <div class="notice">La visibilité publique est autorisée seulement après validation explicite Äerdschëff.</div>
      <div style="margin-top:.75rem">
        <a class="btn primary" href="/login">Connexion invitation</a>
      </div>
    </section>
  `);
}

async function login() {
  return shell(`
    <section class="card">
      <h1 class="h1">Connexion par invitation</h1>
      <p class="muted">Pas d'inscription ouverte. Entrez l'email invité pour recevoir un lien de connexion sécurisé.</p>
      <p class="notice">Nécessite VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre environnement local.</p>
      <form id="login-form" class="grid" style="margin-top:.75rem">
        <input required type="email" name="email" placeholder="invited.user@school.lu" />
        <input type="password" name="password" placeholder="Mot de passe (comptes de test)" />
        <button class="btn primary" type="submit">Envoyer le magic link</button>
        <button class="btn" type="button" id="password-login-btn">Connexion test avec mot de passe</button>
      </form>
    </section>
  `);
}

async function dashboard() {
  const session = await requireSession();
  if (!session) return '';

  const context = await getCurrentUserContext();

  return shell(`
    <section class="card">
      <h1 class="h1">Tableau de bord</h1>
      <p class="muted">Rôle: <span class="badge">${context.role}</span></p>
      ${context.role === 'student' ? `
        <h2 class="h2">Vos 4 actions</h2>
        <ul class="clean">
          ${studentActions.map((action) => `<li><button class="btn" type="button">${action}</button></li>`).join('')}
        </ul>
      ` : `
        <h2 class="h2">Vue d'ensemble</h2>
        <p class="muted">Suivez les contributions de votre périmètre et leur validation.</p>
      `}
      <div style="margin-top:1rem"><button id="logout" class="btn">Déconnexion</button></div>
    </section>
  `);
}

async function fetchOrganizationsForContext(context) {
  if (!supabase) return { organizations: [], error: new Error('Supabase not configured') };

  if (context.role === 'facilitator') {
    const { data, error } = await supabase.from('organizations').select('id, name').order('name');
    return { organizations: data ?? [], error };
  }

  if (!context.organizationId) {
    return { organizations: [], error: null };
  }

  const { data, error } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('id', context.organizationId)
    .limit(1);

  return { organizations: data ?? [], error };
}

async function fetchProjectsForContext(context) {
  if (!supabase) return { projects: [], error: new Error('Supabase not configured') };

  let query = supabase.from('projects').select('id, title, status, organization_id').order('created_at', { ascending: false });

  if (context.role !== 'facilitator' && context.organizationId) {
    query = query.eq('organization_id', context.organizationId);
  }

  const { data, error } = await query.limit(50);
  return { projects: data ?? [], error };
}

async function lycees() {
  const guard = await requireRole(['facilitator'], { redirectPath: '/mon-lycee' });
  if (!guard) return '';

  const context = await getCurrentUserContext();
  const { organizations, error } = await fetchOrganizationsForContext(context);

  return shell(`
    <section class="card">
      <h1 class="h1">Lycées</h1>
      ${error ? `<p class="notice">Erreur de lecture organizations: ${error.message}</p>` : ''}
      <ul>
        ${organizations.map((org) => `<li>${org.name}</li>`).join('') || '<li>Aucun lycée trouvé.</li>'}
      </ul>
    </section>
  `);
}

async function monLycee() {
  const session = await requireSession();
  if (!session) return '';

  const context = await getCurrentUserContext();
  const { organizations, error: orgError } = await fetchOrganizationsForContext(context);
  const { projects, error: projectError } = await fetchProjectsForContext(context);

  return shell(`
    <section class="card">
      <h1 class="h1">Mon lycée</h1>
      ${(orgError || projectError) ? `<p class="notice">Certaines données sont bloquées (RLS ou schéma): ${(orgError || projectError).message}</p>` : ''}
      <h2 class="h2">Établissement</h2>
      <ul>
        ${organizations.map((org) => `<li>${org.name}</li>`).join('') || '<li>Aucun établissement associé.</li>'}
      </ul>
      <h2 class="h2">Projets de l’établissement</h2>
      <ul>
        ${projects.map((project) => `<li>${project.title ?? `Projet ${project.id}`} · ${project.status ?? 'draft'}</li>`).join('') || '<li>Aucun projet disponible.</li>'}
      </ul>
    </section>
  `);
}

async function contributions() {
  const session = await requireSession();
  if (!session) return '';

  const context = await getCurrentUserContext();
  const { projects, error } = await fetchProjectsForContext(context);
  const title = context.role === 'referent' ? 'Contributions établissement' : 'Mes contributions';

  return shell(`
    <section class="card">
      <h1 class="h1">${title}</h1>
      ${error ? `<p class="notice">Erreur de lecture projects: ${error.message}</p>` : ''}
      <ul>
        ${projects.map((project) => `<li>${project.title ?? `Projet ${project.id}`} · ${project.status ?? 'draft'}</li>`).join('') || '<li>Aucune contribution disponible.</li>'}
      </ul>
    </section>
  `);
}

async function project(pathname) {
  const session = await requireSession();
  if (!session) return '';

  const id = pathname.split('/')[2];
  return shell(`
    <section class="card">
      <h1 class="h1">Projet ${id}</h1>
      <p class="muted">Contenu privé par défaut jusqu’à validation publication.</p>
      <div class="grid grid-2">
        <a class="btn" href="/projects/${id}/journal">Journal</a>
        <a class="btn" href="/projects/${id}/ideas">Idées</a>
      </div>
    </section>
  `);
}

async function journal(pathname) {
  const session = await requireSession();
  if (!session) return '';

  const id = pathname.split('/')[2];
  return shell(`
    <section class="card">
      <h1 class="h1">Projet ${id} · Journal</h1>
      <p class="muted">Capture observations, tests et apprentissages.</p>
      <textarea rows="5" placeholder="Saisie journal"></textarea>
      <div style="margin-top:.75rem"><button class="btn primary">Enregistrer brouillon</button></div>
    </section>
  `);
}

async function ideas(pathname) {
  const session = await requireSession();
  if (!session) return '';

  const id = pathname.split('/')[2];
  return shell(`
    <section class="card">
      <h1 class="h1">Projet ${id} · Idées</h1>
      <p class="muted">Suivi des décisions d'idées.</p>
      <select>
        <option>pending</option><option>test</option><option>modify</option><option>abandon</option><option>escalated</option><option>published_summary</option>
      </select>
      <div style="margin-top:.75rem"><button class="btn primary">Mettre à jour</button></div>
    </section>
  `);
}

async function admin() {
  const guard = await requireRole(['facilitator']);
  if (!guard) return '';

  return shell(`
    <section class="card">
      <h1 class="h1">Console de validation</h1>
      <p class="muted">Seul le facilitateur peut valider du contenu pour publication.</p>
      <div class="grid">
        <button class="btn">Marquer validated_local</button>
        <button class="btn primary">Marquer validated_global</button>
        <button class="btn">Publier le contenu validé</button>
      </div>
    </section>
  `);
}

async function publication() {
  const guard = await requireRole(['facilitator']);
  if (!guard) return '';

  return shell(`
    <section class="card">
      <h1 class="h1">Publication</h1>
      <p class="muted">Page de publication interne. Expose uniquement les éléments publiés.</p>
    </section>
  `);
}

async function publicationBySlug(pathname) {
  const session = await requireSession();
  if (!session) return '';

  const slug = pathname.split('/')[2];
  return shell(`
    <section class="card">
      <h1 class="h1">Publication: ${slug}</h1>
      <p class="muted">Aperçu publication (accès session requis).</p>
    </section>
  `);
}

export async function renderRoute(pathname) {
  if (pathname === '/') return home();
  if (pathname === '/login') return login();
  if (pathname === '/dashboard') return dashboard();
  if (pathname === '/lycees') return lycees();
  if (pathname === '/mon-lycee') return monLycee();
  if (pathname === '/contributions') return contributions();
  if (pathname === '/admin') return admin();
  if (pathname === '/publication') return publication();
  if (/^\/projects\/[^/]+$/.test(pathname)) return project(pathname);
  if (/^\/projects\/[^/]+\/journal$/.test(pathname)) return journal(pathname);
  if (/^\/projects\/[^/]+\/ideas$/.test(pathname)) return ideas(pathname);
  if (/^\/publications\/[^/]+$/.test(pathname)) return publicationBySlug(pathname);
  return notFound();
}

export function bindRouteEvents(root) {
  root.querySelectorAll('a[href^="/"]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      const href = el.getAttribute('href');
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  });

  const loginForm = root.querySelector('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = String(formData.get('email') || '');
      const { error } = await signInWithMagicLink(email);
      window.alert(error ? `Login failed: ${error.message}` : 'Magic link sent. Check your inbox.');
    });

    const passwordLoginBtn = root.querySelector('#password-login-btn');
    if (passwordLoginBtn) {
      passwordLoginBtn.addEventListener('click', async () => {
        const formData = new FormData(loginForm);
        const email = String(formData.get('email') || '');
        const password = String(formData.get('password') || '');

        if (!email || !password) {
          window.alert('Email and password are required for test password login.');
          return;
        }

        const { error } = await signInWithPassword(email, password);
        if (error) {
          window.alert(`Password login failed: ${error.message}`);
          return;
        }

        window.history.pushState({}, '', '/dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
  }

  const logout = root.querySelector('#logout');
  if (logout) {
    logout.addEventListener('click', async () => {
      await signOut();
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  }

  const sessionRecovery = getSession;
  sessionRecovery();
}
