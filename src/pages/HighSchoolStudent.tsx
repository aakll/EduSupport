import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function HighSchoolStudent() {
  const [isGuest, setIsGuest] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          setIsGuest(true);
        } else {
          // Fetch user's first name for personalization
          const { data: profile } = await supabase
            .from("high_school_students")
            .select("first_name")
            .eq("user_id", data.session.user.id)
            .maybeSingle();
            
          if (profile?.first_name) {
            setUserName(profile.first_name);
          }
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setIsGuest(true);
      }
    };
    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Guest Warning Banner */}
      {isGuest && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center">
          <p className="text-sm text-amber-800 font-medium">
            ⚠️ You are browsing as a guest. Your saved scholarships and preferences will not be tracked.{" "}
            <Link to="/login" className="underline hover:text-amber-900 transition-colors">
              Sign in to save your progress
            </Link>
          </p>
        </div>
      )}

      {/* Hero Section - Similar to Home Page Style */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-[#1a4d2e]">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4CAF50 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome, {userName || "Student"}!
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Your dedicated space for high school academic opportunities in Lebanon.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-20">
        
        {/* Scholarships Gateway Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 text-center transform transition-all hover:scale-[1.01] duration-300">
          
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] rounded-2xl flex items-center justify-center text-white text-4xl mb-6 shadow-lg shadow-green-500/20">
            🎓
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Scholarships</h2>
          
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover curated scholarship opportunities tailored for high school students. 
            Filter by grade level, school type, and academic interests to find your perfect match.
          </p>
          
          <Link
            to="/scholarships"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300"
          >
            Browse Scholarships
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m5-4H3" />
            </svg>
          </Link>

          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h4 className="font-semibold text-slate-900">Smart Filters</h4>
                <p className="text-sm text-slate-500">Find scholarships by grade, school, or major.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl"></span>
              <div>
                <h4 className="font-semibold text-slate-900">Deadline Tracking</h4>
                <p className="text-sm text-slate-500">Never miss an application date again.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💾</span>
              <div>
                <h4 className="font-semibold text-slate-900">Save Favorites</h4>
                <p className="text-sm text-slate-500">{isGuest ? "Sign in to save scholarships." : "Keep track of your top choices."}</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}