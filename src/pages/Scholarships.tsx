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
      // Load scholarships data
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
      
      {/* Guest Warning Banner - Identical to HS Page */}
      {isGuest && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center sticky top-16 z-40">
          <p className="text-sm text-amber-800 font-medium">
            ⚠️ You are browsing as a guest. Your saved scholarships and preferences will not be tracked.{" "}
            <Link to="/login" className="underline hover:text-amber-900 transition-colors">
              Sign in to save your progress
            </Link>
          </p>
        </div>
      )}

      {/* Hero Section - Matches HS Page Design */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* New Academic Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=80')" }}
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-slate-900/60" />
        
        {/* Content Container - Empty as requested, just maintains layout spacing */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
           {/* Intentionally left blank per request */}
        </div>
      </section>

      {/* Main Content Area - Floating Box Layout */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-32 relative z-20">
        
        {/* The White Floating Box */}
        <div className="bg-white rounded-2xl shadow-xl border-t-4 border-[#4CAF50] p-8 md:p-12 text-center transform transition-all hover:scale-[1.01] duration-300">
          
          {/* Icon */}
          <div className="w-20 h-20 mx-auto bg-green-50 rounded-2xl flex items-center justify-center text-4xl mb-6">
            🎓
          </div>
          
          {/* Title */}
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Scholarships</h2>
          
          {/* Button */}
          <Link
            to="#all-scholarships"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300"
          >
            Explore Scholarships
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m5-4H3" />
            </svg>
          </Link>

        </div>

        {/* Programs Gateway Section (Below the box) */}
        <section className="mt-16">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-left">Featured Programs</h3>
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
                <div className="text-left">
                  <h4 className="font-semibold text-slate-900 group-hover:text-[#4CAF50] transition-colors">{p.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="my-12">
          <hr className="border-slate-200" />
        </div>

        {/* Existing Scholarships Listings */}
        <section id="all-scholarships" className="pb-16">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-left">All Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map(s => (
              <div key={s.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                <h2 className="font-bold text-lg text-slate-900">{s.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{s.university} — {s.country}</p>
                <p className="mt-3 text-slate-700 text-sm leading-relaxed line-clamp-3">{s.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-500">Deadline: {s.deadline}</span>
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-[#4CAF50] font-semibold text-sm hover:underline">Apply →</a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}