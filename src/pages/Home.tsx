import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Home() {
  const navigate = useNavigate();
  const [isHSModalOpen, setIsHSModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      },
    );

    // Trigger entrance animations after a short delay
    setTimeout(() => setMounted(true), 100);

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleHighSchoolClick = () => {
    if (isLoggedIn) {
      navigate("/high-school");
    } else {
      setIsHSModalOpen(true);
    }
  };

  const handleLater = () => {
    setIsHSModalOpen(false);
    navigate("/high-school");
  };

  // Card configuration with specific icons and accent colors
  const cards = [
    {
      name: "High School Student",
      path: null,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
        </svg>
      ),
      accent: "group-hover:border-l-[#4CAF50]",
      textAccent: "text-[#4CAF50]",
    },
    {
      name: "Undergraduate Student",
      path: null,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.216 50.552 50.552 0 00-2.658.813m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15v4.5a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25V15"
          />
        </svg>
      ),
      accent: "group-hover:border-l-[#42A5F5]",
      textAccent: "text-[#42A5F5]",
    },
    {
      name: "Volunteer with Us",
      path: "/volunteer",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      accent: "group-hover:border-l-[#F44336]",
      textAccent: "text-[#F44336]",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#E0F2FE] via-[#F0F9FF] to-[#FFFFFF]">
        {/* Floating Motion Elements - Bright & Energetic */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Left Floating Circle */}
          <div
            className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float-slow"
            style={{ animationDelay: "0s" }}
          />
          {/* Bottom Right Floating Circle */}
          <div
            className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl animate-float-medium"
            style={{ animationDelay: "1s" }}
          />
          {/* Center Right Accent */}
          <div
            className="absolute top-[30%] right-[15%] w-64 h-64 bg-emerald-400/15 rounded-full blur-2xl animate-float-fast"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div
          className={`relative z-10 text-center px-4 max-w-3xl mx-auto transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-lg">
            EduSupport
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-slate-700 mb-4">
            Your Gateway to Academic Success
          </h2>
          <p className="text-lg text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed">
            A comprehensive guide designed specifically for students in Lebanon.
            Find scholarships, universities, and career paths.
          </p>

          {/* Modern Action Cards */}
          <div className="grid gap-5 max-w-md mx-auto">
            {cards.map((card, i) => (
              <button
                key={card.name}
                onClick={() => {
                  if (i === 0) handleHighSchoolClick();
                  else if (i === 2 && card.path) navigate(card.path);
                }}
                title={i === 1 ? "Coming Soon" : ""}
                className={`group relative w-full bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/20 border-l-4 border-l-transparent ${card.accent} text-left flex items-center gap-5 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${(i + 1) * 150}ms` }}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center transition-colors duration-300 group-hover:bg-slate-100 ${card.textAccent}`}
                >
                  {card.icon}
                </div>

                <span className="text-lg font-semibold text-slate-800 flex-1">
                  {card.name}
                </span>

                <svg
                  className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-600 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>

                {/* Coming Soon Badge */}
                {i === 1 && (
                  <span className="absolute -right-2 -top-2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-1000 delay-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          <div className="animate-bounce p-2 rounded-full bg-slate-900/10 backdrop-blur-sm">
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* High School Student Modal */}
      {isHSModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative transform transition-all scale-100">
            <button
              onClick={() => setIsHSModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-green-100 text-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                High School Student
              </h3>
              <p className="text-gray-500 mt-2">
                Choose how you'd like to continue
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsHSModalOpen(false);
                  navigate("/signup");
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Sign Up for Free
              </button>

              <button
                onClick={() => {
                  setIsHSModalOpen(false);
                  navigate("/login");
                }}
                className="w-full py-3.5 bg-white border-2 border-[#4CAF50]/30 text-[#4CAF50] font-semibold rounded-xl hover:bg-green-50 hover:border-[#4CAF50] transition-all"
              >
                Log In
              </button>

              <button
                onClick={handleLater}
                className="w-full py-3 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <span className="text-xl font-bold mb-3 block text-blue-400">
                EduSupport
              </span>
              <p className="text-slate-400 leading-relaxed text-sm">
                Dedicated to empowering Lebanese students with finding
                scholarships, universities, and career opportunities.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  ["Home", "/"],
                  ["Scholarships", "/scholarships"],
                ].map(([label, path]) => (
                  <li key={path}>
                    <a
                      href={path}
                      className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} EduSupport. Made with ❤️ for
              students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
