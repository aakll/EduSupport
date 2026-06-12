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
      
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) setIsGuest(true)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white page-enter">
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

      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto"></div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        
        {/* Main Scholarships Box */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden mb-12">
          <div className="h-2 bg-gradient-to-r from-[#4CAF50] via-[#42A5F5] to-indigo-500" />
          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#4CAF50]/10 to-[#42A5F5]/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Scholarships</h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed">
              
            </p>
            <Link
              to="#all-scholarships"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-lg"
            >
              Explore Scholarships
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m5-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Programs Grid - Same Box Style */}
        <div className="grid md:grid-cols-2 gap-6">
          {programs.map((p) => (
            <Link
              key={p.name}
              to={p.path}
              className="group bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Dynamic Top Accent Bar matching the main box style */}
              <div className={`h-2 bg-gradient-to-r ${p.color}`} />
              
              <div className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${p.color.replace('to-', 'to-opacity-20 ')} opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{p.icon}</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#4CAF50] transition-colors">
                  {p.name}
                </h3>
                
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {p.desc}
                </p>
                
                <div className="inline-flex items-center gap-2 text-[#4CAF50] font-semibold text-sm">
                  View Program
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m5-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="my-12"><hr className="border-slate-200" /></div>

        {/* All Opportunities Section */}
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