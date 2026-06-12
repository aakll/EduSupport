import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function HighSchoolStudent() {
  const [isGuest, setIsGuest] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        setIsGuest(true);
      } else {
        // Fetch user's first name for personalization
        const { data: profile } = await supabase
          .from("high_school_students")
          .select("first_name")
          .eq("user_id", data.session.user.id)
          .single();
          
        if (profile?.first_name) {
          setUserName(profile.first_name);
        }
      }
    };
    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Guest Warning Banner */}
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

      {/* Hero / Welcome Section */}
      <section className="relative bg-gradient-to-br from-[#4CAF50] via-[#42A5F5] to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, {userName || "Student"}! 👋
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
            Your personalized hub for academic opportunities. Track your applications, 
            discover new scholarships, and stay on top of your graduation goals.
          </p>
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { label: "Saved Scholarships", value: isGuest ? "--" : "0", icon: "🔖" },
              { label: "Applications", value: isGuest ? "--" : "0", icon: "📝" },
              { label: "Deadlines Soon", value: isGuest ? "--" : "0", icon: "⏰" },
              { label: "Profile Complete", value: isGuest ? "--" : "85%", icon: "✅" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-white/70 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        
        {/* Scholarships Gateway Section */}
        <section className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] flex items-center justify-center text-white text-xl">
                    🎓
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Scholarships</h2>
                </div>
                <p className="text-slate-600 max-w-xl">
                  Browse curated scholarship opportunities matched to your grade level, 
                  school, and academic interests. Save your favorites and track application deadlines.
                </p>
              </div>
              
              <Link
                to="/scholarships"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all whitespace-nowrap"
              >
                Explore Scholarships
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m5-4H3" />
                </svg>
              </Link>
            </div>

            {/* Preview Cards (Non-clickable teasers) */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Merit-Based Awards", desc: "For students with outstanding academic records", tag: "Academic", color: "bg-blue-50 text-blue-700" },
                { title: "Need-Based Grants", desc: "Financial aid based on family income", tag: "Financial", color: "bg-green-50 text-green-700" },
                { title: "Community Service", desc: "Rewarding volunteer work and leadership", tag: "Service", color: "bg-purple-50 text-purple-700" },
              ].map((card) => (
                <div key={card.title} className="group p-5 rounded-xl border border-slate-200 hover:border-[#4CAF50]/50 hover:bg-slate-50 transition-all cursor-default">
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mb-3 ${card.color}`}>
                    {card.tag}
                  </span>
                  <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-[#4CAF50] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-500">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Placeholder for Future Sections */}
        <section className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4">📅</div>
            <h3 className="font-semibold text-slate-900 mb-1">Application Tracker</h3>
            <p className="text-sm text-slate-500">Coming Soon</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4">💡</div>
            <h3 className="font-semibold text-slate-900 mb-1">Study Resources</h3>
            <p className="text-sm text-slate-500">Coming Soon</p>
          </div>
        </section>

      </main>
    </div>
  );
}