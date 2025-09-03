export const MODE = "local"; // "local" maintenant, "api" quand le back est prêt

const KEY = "clab_data_v1";
function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; }
}
function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

const seed = {
  profile: { id:"u-1", role:"teacher", name:"Demo User", email:"demo@school.lu",
             niveaux:["8-12"], disciplines:["SVT"], odd:["4","12"] },
  fiches: [
    { id:"f-1", titre:"Compost & cycles", niveaux:["8-12"], disciplines:["SVT"],
      tags:["compost","sols"], resume:"Atelier cycle du vivant" },
    { id:"f-2", titre:"Énergie low-tech", niveaux:["12-15"], disciplines:["Techno"],
      tags:["énergie","low-tech"], resume:"Micro-éolienne carton" }
  ],
  messages: [
    { id:"m-1", subject:"Bienvenue", body:"Heureux·se de vous voir sur Collaborative Lab !", lu:false }
  ]
};

// ---------- LOCAL MODE ----------
function ensureLocal() {
  const d = load();
  if (!d.fiches) { save(seed); return seed; }
  return d;
}

export async function getProfile() {
  if (MODE === "local") return ensureLocal().profile;
  // TODO: appeler GET /me/profile (JWT Supabase):contentReference[oaicite:9]{index=9}:contentReference[oaicite:10]{index=10}
}

export async function saveProfile(patch) {
  if (MODE === "local") {
    const d = ensureLocal();
    d.profile = { ...d.profile, ...patch };
    save(d); return d.profile;
  }
  // TODO: PUT /me/profile
}

export async function listFiches(filters = {}) {
  if (MODE === "local") {
    const d = ensureLocal();
    const f = d.fiches;
    if (!filters.niveau) return f;
    return f.filter(x => x.niveaux?.some(n => n.includes(filters.niveau)));
  }
  // TODO: GET /fiches?filters=...
}

export async function createFiche(payload) {
  if (MODE === "local") {
    const d = ensureLocal();
    const f = { id: "f-" + Date.now(), ...payload };
    d.fiches.unshift(f);
    // Simule un "match" pour la UX (conforme à la mécanique prévue):contentReference[oaicite:11]{index=11}
    const hit = d.fiches.find(x => x.id !== f.id && x.niveaux?.some(n => f.niveaux?.includes(n)));
    if (hit) d.messages.unshift({ id:"m-"+Date.now(), subject:"Nouveau match",
      body:`“${f.titre}” ↔ “${hit.titre}” (${(f.niveaux||[]).join(', ')}) 🎯`, lu:false });
    save(d);
    return f;
  }
  // TODO: POST /fiches
}

export async function listMessages() {
  if (MODE === "local") return ensureLocal().messages;
  // TODO: GET /messages
}

export async function markAllRead() {
  if (MODE === "local") {
    const d = ensureLocal();
    d.messages.forEach(m => m.lu = true);
    save(d); return true;
  }
  // TODO: PUT /messages/mark_all_read
}
