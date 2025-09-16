// API simplifiée pour démonstration.
// Dans un vrai projet, ce module encapsule les appels HTTP vers l’API FastAPI
// protégée par JWT Supabase. Ici nous utilisons un jeu de données statique
// stocké en mémoire pour alimenter l’interface.

const sampleFiches = [
  {
    id: '1',
    title: 'Composter au lycée',
    author_name: 'Alice',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    level: 'Lycée',
    skills: 'Jardinage, Sciences',
    resume: 'Organiser un atelier compost pour sensibiliser les élèves.',
    content: 'Contenu détaillé de la fiche.',
    status: 'published'
  },
  {
    id: '2',
    title: 'Réparer un vélo',
    author_name: 'Bob',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    level: 'Collège',
    skills: 'Mécanique, DIY',
    resume: 'Atelier participatif pour apprendre à réparer des vélos.',
    content: 'Contenu détaillé de la fiche.',
    status: 'published'
  },
  {
    id: '3',
    title: 'Atelier cuisine low-tech',
    author_name: 'Claire',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    level: 'Primaire',
    skills: 'Cuisine, Zéro déchet',
    resume: 'Préparer un repas avec des ustensiles low-tech.',
    content: 'Contenu détaillé de la fiche.',
    status: 'published'
  }
];

// Fonction de filtrage de recherche simple
function filterFiches({ q = '', status = '' }) {
  return sampleFiches.filter(f => {
    const matchQ =
      !q ||
      f.title.toLowerCase().includes(q.toLowerCase()) ||
      f.resume.toLowerCase().includes(q.toLowerCase());
    const matchStatus = !status || f.status === status;
    return matchQ && matchStatus;
  });
}

// API Fiches simplifiée
export const API = {
  list: async ({ q, status, limit = 20, offset = 0 } = {}) => {
    const data = filterFiches({ q, status });
    const slice = data.slice(offset, offset + limit);
    return Promise.resolve(slice);
  },
  get: async (id) => {
    const fiche = sampleFiches.find(f => f.id === id);
    return Promise.resolve(fiche);
  },
  create: async (payload) => {
    const id = String(sampleFiches.length + 1);
    sampleFiches.push({ id, ...payload });
    return Promise.resolve({ id });
  },
  update: async (id, payload) => {
    const idx = sampleFiches.findIndex(f => f.id === id);
    if (idx >= 0) sampleFiches[idx] = { ...sampleFiches[idx], ...payload };
    return Promise.resolve({ id });
  },
  remove: async (id) => {
    const idx = sampleFiches.findIndex(f => f.id === id);
    if (idx >= 0) sampleFiches.splice(idx, 1);
    return Promise.resolve({ id });
  },
  export: async (id, format) => {
    return Promise.resolve({ ok: true });
  }
};
