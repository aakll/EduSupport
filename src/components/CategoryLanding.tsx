import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import GuestBanner from "./GuestBanner";

interface CategoryLandingProps {
  tableName: string;           // e.g. "high_school_students" | "university_students"
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  gradientFrom: string;        // tailwind class, e.g. "from-[#4CAF50]"
  gradientTo: string;          // tailwind class, e.g. "to-[#42A5F5]"
  iconColor: string;           // tailwind text class
  ctaLabel: string;
  ctaPath: string;
  selfPath: string;            // this page's own route, used as redirectTo for the guest banner login link
}

export default function CategoryLanding({
  tableName,
  heroImage,
  heroTitle,
  heroSubtitle,
  gradientFrom,
  gradientTo,
  iconColor,
  ctaLabel,
  ctaPath,
  selfPath,
}: CategoryLandingProps) {
  const location = useLocation();
  const [isGuest, setIsGuest] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // A guest arriving via the modal's "Continue as Guest" already knows the
    // warning is coming (navigate state), so show it immediately without
    // waiting on the session check flickering the banner in.
    if (location.state?.guestWarning) {
      setIsGuest(true);
    }

    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          setIsGuest(true);
        } else {
          setIsGuest(false);
          const { data: profile } = await supabase
            .from(tableName)
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
  }, [tableName, location.state]);

  return (
    <div className="min-h-screen bg-white page-enter">
      {isGuest && <GuestBanner redirectTo={selfPath} />}

      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {heroTitle}{userName ? `, ${userName}` : ""}!
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">{heroSubtitle}</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${gradientFrom} ${gradientTo}`} />

          <div className="p-8 md:p-12 text-center">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${gradientFrom}/10 ${gradientTo}/10 flex items-center justify-center`}>
              <svg className={`w-10 h-10 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-3">Scholarships</h2>

            <Link
              to={ctaPath}
              className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-lg`}
            >
              {ctaLabel}
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