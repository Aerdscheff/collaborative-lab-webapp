import React from 'react'
import { supabase } from './lib/supabase' // adapte en '../lib/supabase' si tu le mets dans /components

type Fiche = {
  id: string
  title: string
  summary: string | null
  visibility: string
  created_at: string
}

export default function FichesList() {
  const [rows, setRows] = React.useState<Fiche[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('fiches')
        .select('id,title,summary,visibility,created_at')
        .order('created_at', { ascending: false })
      if (error) setError(error.message)
      setRows(data ?? [])
    })()
  }, [])

  if (error) return <p className="text-red-700">{error}</p>
  if (!rows?.length) return <p className="opacity-70">Aucune fiche pour l’instant.</p>

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rows.map(f => (
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
