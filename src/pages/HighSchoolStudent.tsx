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
        console.error("Auth check error:", err);
        setIsGuest(true);
      }
    };
    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-white page-enter">
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

      {/* Hero Section - Same style as Home for consistency */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome{userName ? `, ${userName}` : ""}! 
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Discover scholarships for high school students in Lebanon!
          </p>
        </div>
      </section>

      {/* Main Content - Centered Scholarship Box */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* Colorful Top Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-[#4CAF50] via-[#42A5F5] to-indigo-500" />
          
          <div className="p-8 md:p-12 text-center">
            {/* Icon */}
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
              to="/scholarships"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-lg"
            >
              Explore Scholarships
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m5-4H3" />
              </svg>
            </Link>
          </div>
        </div>

  
      </main>
    </div>
  );
}