import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

// web/src/components/AuthBox.tsx
import React from 'react'
import { supabase } from '../lib/supabase'

export default function AuthBox() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null))
    return () => sub.subscription.unsubscribe()
  }, [])

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      }
      setEmail('')
      setPassword('')
    } catch (err: any) {
      setError(err?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm opacity-80">Connecté : {user.email}</span>
        <button onClick={signOut} className="px-3 py-1 rounded-2xl bg-sage text-pine text-sm">Se déconnecter</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleAuth} className="flex items-end gap-2">
      <div>
        <label className="block text-sm">Email</label>
        <input className="border rounded px-2 py-1" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm">Mot de passe</label>
        <input className="border rounded px-2 py-1" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button disabled={loading} className="px-3 py-2 rounded-2xl bg-pine text-white text-sm">
        {mode === 'signin' ? 'Se connecter' : 'Créer un compte'}
      </button>
      <button type="button" onClick={() => setMode(m => (m === 'signin' ? 'signup' : 'signin'))} className="text-sm underline opacity-80">
        {mode === 'signin' ? "Créer un compte" : "J'ai déjà un compte"}
      </button>
      {error && <span className="text-red-700 text-sm">{error}</span>}
    </form>
  )
}

// web/src/components/FicheForm.tsx
import React from 'react'
import { supabase } from '../lib/supabase'

export default function FicheForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = React.useState('')
  const [summary, setSummary] = React.useState('')
  const [visibility, setVisibility] = React.useState<'public' | 'private'>('public')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function createFiche(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Connexion requise pour créer une fiche')

      // NOTE : adapte les noms de colonnes si besoin (title, summary, visibility, created_by)
      const { error } = await supabase.from('fiches').insert({
        title,
        summary,
        visibility,
        created_by: user.id,
      })
      if (error) throw error

      setTitle('')
      setSummary('')
      setVisibility('public')
      onCreated()
    } catch (err: any) {
      setError(err?.message || 'Création impossible (vérifier RLS/policies).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={createFiche} className="card space-y-3">
      <h3 className="font-medium">Créer une fiche</h3>
      <input className="border rounded px-3 py-2 w-full" placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea className="border rounded px-3 py-2 w-full" placeholder="Résumé" value={summary} onChange={e => setSummary(e.target.value)} />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1 text-sm">
          <input type="radio" name="vis" checked={visibility==='public'} onChange={() => setVisibility('public')} />
          Public
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input type="radio" name="vis" checked={visibility==='private'} onChange={() => setVisibility('private')} />
          Privé
        </label>
      </div>
      <div className="flex items-center gap-2">
        <button disabled={loading} className="px-4 py-2 rounded-2xl bg-pine text-white">{loading ? 'Ajout…' : 'Ajouter'}</button>
        {error && <span className="text-red-700 text-sm">{error}</span>}
      </div>
    </form>
  )
}

// web/src/components/FichesList.tsx
import React from 'react'
import { supabase } from '../lib/supabase'

export type Fiche = {
  id: string
  title: string
  summary: string | null
  visibility: string
  created_at: string
}

export default function FichesList() {
  const [rows, setRows] = React.useState<Fiche[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const load = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('fiches')
        .select('id,title,summary,visibility,created_at')
        .order('created_at', { ascending: false })
      if (error) throw error
      setRows(data || [])
    } catch (err: any) {
      setError(err?.message || 'Lecture impossible (vérifier policies).')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  if (loading && rows === null) return <p>Chargement…</p>
  if (error) return <p className="text-red-700">{error}</p>
  if (!rows?.length) return <p className="opacity-70">Aucune fiche pour l’instant.</p>

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rows!.map((f) => (
        <li key={f.id} className="card">
          <h3 className="font-medium mb-1">{f.title}</h3>
          {f.summary && <p className="text-sm opacity-80 mb-2">{f.summary}</p>}
          <div className="text-xs opacity-70">{new Date(f.created_at).toLocaleString()}</div>
          <div className="mt-2"><span className="badge">{f.visibility}</span></div>
        </li>
      ))}
    </ul>
  )
}

// web/src/App.tsx
import React from 'react'
import AuthBox from './components/AuthBox'
import FicheForm from './components/FicheForm'
import FichesList from './components/FichesList'
import { supabase } from './lib/supabase'

export default function App() {
  const [user, setUser] = React.useState<any>(null)
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null))
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Äerdschëff – Collaborative Lab</h1>
        <AuthBox />
      </header>

      {user && (
        <section>
          <FicheForm onCreated={() => { /* reload list via a simple event */ }} />
        </section>
      )}

      <section>
        <h2 className="sr-only">Fiches</h2>
        <FichesList />
      </section>
    </main>
  )
}
