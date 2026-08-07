import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AuthChoiceModal  from "../components/AuthChoiceModal";
import type { UserCategory } from "../components/AuthChoiceModal";


export default function Home() {
  const navigate = useNavigate();
  const [openModalFor, setOpenModalFor] = useState<UserCategory | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    setTimeout(() => setMounted(true), 100);

    return () => listener.subscription.unsubscribe();
  }, []);

  // Same rule for every card: logged-in users skip straight to their page,
  // logged-out users see the same sign up / log in / guest modal.
  const handleCardClick = (category: UserCategory, loggedInPath: string) => {
    if (isLoggedIn) {
      navigate(loggedInPath);
    } else {
      setOpenModalFor(category);
    }
  };

  const cards: {
    name: string;
    category: UserCategory;
    loggedInPath: string;
    icon: JSX.Element;

  }[] = [
    {
      name: "High School Student",
      category: "high_school",
      loggedInPath: "/high-school",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
    },
    {
      name: "Undergraduate Student",
      category: "university",
      loggedInPath: "/university",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.216 50.552 50.552 0 00-2.658.813m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15v4.5a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25V15" />
        </svg>
      ),
    },
    {
      name: "Volunteer with Us",
      category: "volunteer",
      loggedInPath: "/volunteer",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl animate-float-medium" />
          <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-red-500/5 rounded-full blur-2xl animate-float-fast" />
        </div>

        <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto mb-20 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-green-500 via-blue-500 to-green-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
            EduSupport
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-slate-700 mb-4">
            Your Gateway to Academic Success
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A comprehensive guide for students in Lebanon.
          </p>
        </div>

        <div className={`relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl px-4 transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {cards.map((card, i) => {
            const isCenter = i === 0;
            const isLeft = i === 1;

            let themeColor = "";
            let bgHover = "";

            if (isCenter) {
              themeColor = "border-green-500 text-green-600";
              bgHover = "group-hover:bg-green-50 group-hover:border-green-500";
            } else if (isLeft) {
              themeColor = "border-blue-500 text-blue-600";
              bgHover = "group-hover:bg-blue-50 group-hover:border-blue-500";
            } else {
              themeColor = "border-red-500 text-red-600";
              bgHover = "group-hover:bg-red-50 group-hover:border-red-500";
            }

            return (
              <button
                key={card.name}
                onClick={() => handleCardClick(card.category, card.loggedInPath)}
                className={`
                  group relative bg-white rounded-3xl p-8 shadow-lg border border-slate-100
                  transition-all duration-300 ease-out flex flex-col items-center text-center gap-5
                  ${bgHover}
                  ${isCenter ? "w-full md:w-80 h-80 scale-110 z-20 shadow-2xl border-2 order-2 " + themeColor : isLeft ? "w-full md:w-64 h-64 hover:-translate-y-2 order-1" : "w-full md:w-64 h-64 hover:-translate-y-2 order-3"}
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                `}
                style={{ transitionDelay: `${(i + 1) * 150}ms` }}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 
                  ${isCenter ? "bg-green-100 text-green-600 group-hover:scale-110" : isLeft ? "bg-blue-100 text-blue-600 group-hover:scale-110" : "bg-red-100 text-orange-600 group-hover:scale-110"}`}
                >
                  {card.icon}
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-xl font-bold text-slate-900">{card.name}</span>
                  {isCenter && (
                    <p className="text-sm text-slate-400 mt-2 font-medium">Start your journey here</p>
                  )}
                </div>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all 
                  ${isCenter ? "bg-green-600 text-white group-hover:bg-green-700" : isLeft ? "bg-blue-600 text-white group-hover:bg-blue-700" : "bg-orange-600 text-white group-hover:bg-red-700"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Same modal, any card */}
      {openModalFor && (
        <AuthChoiceModal category={openModalFor} onClose={() => setOpenModalFor(null)} />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <span className="text-xl font-bold mb-3 block text-blue-400">EduSupport</span>
              <p className="text-slate-400 leading-relaxed text-sm">
                Dedicated to empowering Lebanese students with finding scholarships, universities, and career opportunities.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[["Home", "/"], ["Scholarships", "/scholarships"]].map(([label, path]) => (
                  <li key={path}>
                    <a href={path} className="text-slate-400 hover:text-blue-400 transition-colors text-sm">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-xs">© {new Date().getFullYear()} EduSupport. Made with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}