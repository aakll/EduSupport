import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

const programs = [
  { name: "MEPE", desc: "Middle East Partnership Initiative supporting educational excellence.", icon: "", color: "from-blue-500 to-indigo-600", path: "/scholarships/mepe" },
  { name: "ULYP", desc: "Undergraduate Lebanon Youth Program for top Lebanese students.", icon: "", color: "from-emerald-500 to-teal-600", path: "/scholarships/ulyp" },
  { name: "LIFE", desc: "Lebanese International Future Education global opportunities.", icon: "✨", color: "from-violet-500 to-purple-600", path: "/scholarships/life" },
  { name: "Habeeb", desc: "Community-driven fund for underprivileged high school graduates.", icon: "💚", color: "from-green-500 to-emerald-600", path: "/scholarships/habeeb" },
  { name: "Tomooh", desc: "Ambition-focused mentorship and financial aid program.", icon: "", color: "from-orange-500 to-amber-600", path: "/scholarships/tomooh" },
  { name: "Tarraf", desc: "Bridging higher education gaps for rural communities.", icon: "️", color: "from-cyan-500 to-blue-600", path: "/scholarships/tarraf" },
]

export default function Scholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('scholarships').select('*').order('deadline', { ascending: true })
      if (data) setScholarships(data)
      
      // Check guest status
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) setIsGuest(true)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white page-enter">
      {/* Guest Warning Banner */}
      {isGuest && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center sticky top-16 z-40">
          <p className="text-sm text-amber-800 font-medium">
            ⚠️ You are browsing as a guest. Your saved scholarships will not be tracked.{" "}
            <Link to="/login" className="underline hover:text-amber-900">Sign in to save progress</Link>
          </p>
        </div>
      )}

      {/* Programs Gateway Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Scholarship Programs</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p) => (
            <Link
              key={p.name}
              to={p.path}
              className="group bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-[#4CAF50]/40 transition-all duration-300 flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-xl shrink-0`}>
                {p.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-[#4CAF50] transition-colors">{p.name}</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-slate-200 my-8" />
      </div>

      {/* Existing Scholarships Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">All Scholarships</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map(s => (
            <div key={s.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <h2 className="font-bold text-lg text-slate-900">{s.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{s.university} — {s.country}</p>
              <p className="mt-3 text-slate-700 text-sm leading-relaxed">{s.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-500">Deadline: {s.deadline}</span>
                <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-[#4CAF50] font-semibold text-sm hover:underline">Apply →</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}