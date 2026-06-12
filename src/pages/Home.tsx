import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [isHSModalOpen, setIsHSModalOpen] = useState(false);
  const [hasVisitedHS, setHasVisitedHS] = useState(false);

  // Check localStorage on mount to see if user already made a choice
  useEffect(() => {
    const visited = localStorage.getItem("hs_student_visited");
    if (visited === "true") {
      setHasVisitedHS(true);
    }
  }, []);

  const handleHighSchoolClick = () => {
    if (hasVisitedHS) {
      // Already visited before → go directly to page
      navigate("/high-school");
    } else {
      // First time → show the login/signup/later modal
      setIsHSModalOpen(true);
    }
  };

  const handleLater = () => {
    localStorage.setItem("hs_student_visited", "true");
    setHasVisitedHS(true);
    setIsHSModalOpen(false);
    navigate("/high-school");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">EduSupport</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Your Gateway to Academic Success</h2>
          <p className="text-lg text-white/90 mb-10">Guide for students in Lebanon to find scholarships</p>

          {/* Action Cards */}
          <div className="grid gap-4">
            {[
              { name: "High School Student", color: "from-[#4CAF50] to-[#81C784]", border: "hover:border-[#4CAF50]" },
              { name: "Undergraduate Student", color: "from-[#42A5F5] to-[#90CAF9]", border: "hover:border-[#42A5F5]" },
              { name: "Volunteer with Us", color: "from-[#81C784] to-[#4CAF50]", border: "hover:border-[#81C784]" },
            ].map((card, i) => (
              <button
                key={card.name}
                onClick={() => {
                  if (i === 0) handleHighSchoolClick();
                }}
                title={i === 1 ? "Coming Soon" : ""}
                className={`group relative bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent ${card.border}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br ${card.color}`}
                  ></div>
                  <span className="text-xl font-bold text-gray-900 flex-1 text-left">{card.name}</span>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Coming Soon Tooltip */}
                {i === 1 && (
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    Coming Soon
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* High School Student Modal (First Time Only) */}
      {isHSModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setIsHSModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">High School Student</h3>
            <p className="text-gray-600 text-center mb-6">Choose how you'd like to continue</p>

            <div className="space-y-3">
              {/* Sign Up Button */}
              <button
                onClick={() => {
                  localStorage.setItem("hs_student_visited", "true");
                  setHasVisitedHS(true);
                  setIsHSModalOpen(false);
                  navigate("/signup"); // Redirect to your signup page
                }}
                className="w-full py-3 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-lg hover:scale-[1.02] transition-all"
              >
                Sign Up
              </button>

              {/* Login Button */}
              <button
                onClick={() => {
                  localStorage.setItem("hs_student_visited", "true");
                  setHasVisitedHS(true);
                  setIsHSModalOpen(false);
                  navigate("/login"); // Redirect to your login page
                }}
                className="w-full py-3 bg-white border-2 border-[#4CAF50] text-[#4CAF50] font-semibold rounded-lg hover:bg-green-50 transition-all"
              >
                Log In
              </button>

              {/* Later / Guest Button */}
              <button
                onClick={handleLater}
                className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                Continue as Guest (Later)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#1a4d2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <span className="text-xl font-bold mb-4 block">EduSupport</span>
              <p className="text-gray-300 leading-relaxed">
                Dedicated to empowering Lebanese students with access to scholarships, universities, and career opportunities.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  ["Home", "/"],
                  ["Scholarships", "/scholarships"],
                ].map(([label, path]) => (
                  <li key={path}>
                    <a href={path} className="text-gray-300 hover:text-[#4CAF50] transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} EduSupport. Made with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}