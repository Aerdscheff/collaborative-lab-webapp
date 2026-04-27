import { getCurrentRole, getSession, signInWithMagicLink, signInWithPassword, signOut } from './auth.js';
import { requireRole, requireSession } from './guards.js';

const studentActions = [
  'I observed something',
  'I have an idea',
  'We tested something',
  'What we learned',
];

function shell(content) {
  return `
    <nav>
      <div class="links container">
        <a class="btn" href="/">Home</a>
        <a class="btn" href="/dashboard">Dashboard</a>
        <a class="btn" href="/lycees">Lycées</a>
        <a class="btn" href="/admin">Admin</a>
        <a class="btn" href="/publications/demo">Publication</a>
      </div>
    </nav>
    <main class="container">${content}</main>
  `;
}

function notFound() {
  return shell(`
    <section class="card">
      <h1 class="h1">Page not found</h1>
      <a class="btn" href="/">Return home</a>
    </section>
  `);
}

async function home() {
  return shell(`
    <section class="card">
      <h1 class="h1">Transition Lab V0.3.1</h1>
      <p class="muted">Private-by-default prototype for 4 pilot high schools.</p>
      <div class="notice">Public visibility is only allowed after explicit Äerdschëff validation.</div>
      <div style="margin-top:.75rem">
        <a class="btn primary" href="/login">Invitation login</a>
      </div>
    </section>
  `);
}

async function login() {
  return shell(`
    <section class="card">
      <h1 class="h1">Invitation-based login</h1>
      <p class="muted">No open registration. Enter invited email to receive a secure sign-in link.</p>
      <p class="notice">Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local environment.</p>
      <form id="login-form" class="grid" style="margin-top:.75rem">
        <input required type="email" name="email" placeholder="invited.user@school.lu" />
        <input type="password" name="password" placeholder="Password (test accounts only)" />
        <button class="btn primary" type="submit">Send magic link</button>
        <button class="btn" type="button" id="password-login-btn">Connexion test avec mot de passe</button>
      </form>
    </section>
  `);
}

async function dashboard() {
  const session = await requireSession();
  if (!session) return '';
  const role = await getCurrentRole();

  return shell(`
    <section class="card">
      <h1 class="h1">Dashboard</h1>
      <p class="muted">Role: <span class="badge">${role}</span></p>
      ${role === 'student' ? `
        <h2 class="h2">Your 4 actions</h2>
        <ul class="clean">
          ${studentActions.map((action) => `<li><button class="btn" type="button">${action}</button></li>`).join('')}
        </ul>
      ` : `
        <h2 class="h2">Pilot overview</h2>
        <p class="muted">Review project submissions and move statuses toward validation.</p>
      `}
      <div style="margin-top:1rem"><button id="logout" class="btn">Sign out</button></div>
    </section>
  `);
}

async function lycees() {
  await requireSession();
  return shell(`
    <section class="card">
      <h1 class="h1">Pilot high schools</h1>
      <ul>
        <li>Lycée Pilote Nord</li>
        <li>Lycée Pilote Sud</li>
        <li>Lycée Pilote Est</li>
        <li>Lycée Pilote Ouest</li>
      </ul>
    </section>
  `);
}

async function project(pathname) {
  await requireSession();
  const id = pathname.split('/')[2];
  return shell(`
    <section class="card">
      <h1 class="h1">Project ${id}</h1>
      <p class="muted">Default status: draft. Content remains private until publication status is reached.</p>
      <div class="grid grid-2">
        <a class="btn" href="/projects/${id}/journal">Open journal</a>
        <a class="btn" href="/projects/${id}/ideas">Open ideas</a>
      </div>
    </section>
  `);
}

async function journal(pathname) {
  await requireSession();
  const id = pathname.split('/')[2];
  return shell(`
    <section class="card">
      <h1 class="h1">Project ${id} · Journal</h1>
      <p class="muted">Capture observations, tests, and learning notes.</p>
      <textarea rows="5" placeholder="Placeholder journal input"></textarea>
      <div style="margin-top:.75rem"><button class="btn primary">Save draft</button></div>
    </section>
  `);
}

async function ideas(pathname) {
  await requireSession();
  const id = pathname.split('/')[2];
  return shell(`
    <section class="card">
      <h1 class="h1">Project ${id} · Ideas</h1>
      <p class="muted">Track idea discussions and decision state.</p>
      <select>
        <option>pending</option><option>test</option><option>modify</option><option>abandon</option><option>escalated</option><option>published_summary</option>
      </select>
      <div style="margin-top:.75rem"><button class="btn primary">Update decision</button></div>
    </section>
  `);
}

async function admin() {
  const guard = await requireRole(['admin', 'facilitator']);
  if (!guard) return '';

  return shell(`
    <section class="card">
      <h1 class="h1">Validation console</h1>
      <p class="muted">Only facilitator/admin can validate content for publication.</p>
      <div class="grid">
        <button class="btn">Mark as validated_local</button>
        <button class="btn primary">Mark as validated_global</button>
        <button class="btn">Publish reviewed content</button>
      </div>
    </section>
  `);
}

async function publication(pathname) {
  const slug = pathname.split('/')[2];
  return shell(`
    <section class="card">
      <h1 class="h1">Publication: ${slug}</h1>
      <p class="muted">Public page placeholder. Should only expose items with status published.</p>
    </section>
  `);
}

export async function renderRoute(pathname) {
  if (pathname === '/') return home();
  if (pathname === '/login') return login();
  if (pathname === '/dashboard') return dashboard();
  if (pathname === '/lycees') return lycees();
  if (pathname === '/admin') return admin();
  if (/^\/projects\/[^/]+$/.test(pathname)) return project(pathname);
  if (/^\/projects\/[^/]+\/journal$/.test(pathname)) return journal(pathname);
  if (/^\/projects\/[^/]+\/ideas$/.test(pathname)) return ideas(pathname);
  if (/^\/publications\/[^/]+$/.test(pathname)) return publication(pathname);
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
