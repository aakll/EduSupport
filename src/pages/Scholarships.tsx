import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

interface Scholarship {
  id: string
  title: string
  description: string
  deadline: string
  amount: string
  university: string
  country: string
  link: string
}

export default function Scholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('scholarships').select('*').order('deadline', { ascending: true })
      if (data) setScholarships(data)
    }
    load()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {scholarships.map(s => (
        <div key={s.id} className="border rounded p-4">
          <h2 className="font-bold text-lg">{s.title}</h2>
          <p className="text-sm text-gray-600">{s.university} — {s.country}</p>
          <p className="mt-2">{s.description}</p>
          <p className="text-sm mt-2">Deadline: {s.deadline}</p>
          <a href={s.link} target="_blank" className="text-blue-600 underline text-sm">Apply</a>
        </div>
      ))}
    </div>
  )
}