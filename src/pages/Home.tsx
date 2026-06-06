import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from '../supabaseClient';

interface TeamMember {
  name: string;
  role: string;
  email: string;
  linkedin: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Sarah Haddad",
    role: "Founder & CEO",
    email: "sarah@edusupport.lb",
    linkedin: "linkedin.com/in/sarahhaddad",
  },
  {
    name: "Karim Nassar",
    role: "Head of Partnerships",
    email: "karim@edusupport.lb",
    linkedin: "linkedin.com/in/karimnassar",
  },
  {
    name: "Lina Khoury",
    role: "Student Relations",
    email: "lina@edusupport.lb",
    linkedin: "linkedin.com/in/linakhoury",
  },
  {
    name: "Omar Bitar",
    role: "Tech Lead",
    email: "omar@edusupport.lb",
    linkedin: "linkedin.com/in/omarbitar",
  },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
      }
    };
    getUser();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    setIsModalOpen(true);
    setAuthMessage("");
    setAuthError("");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage("");
    setAuthError("");
    try {
      if (authMode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || "" });
          setAuthMessage("Login successful!");
          setTimeout(() => { setIsModalOpen(false); setEmail(""); setPassword(""); }, 1500);
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setAuthMessage("Account created! Please check your email to verify.");
        setTimeout(() => { setAuthMode("login"); setPassword(""); }, 2000);
      }
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsDropdownOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setPassword("");
    setAuthMessage("");
    setAuthError("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <span className={`text-xl font-bold transition-colors ${isScrolled ? "text-gray-900" : "text-white"}`}>EduSupport</span>
            </Link>

            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`p-2 rounded-full transition-colors ${isScrolled ? "hover:bg-gray-100" : "hover:bg-white/20"}`}>
                <svg className={`w-6 h-6 ${isScrolled ? "text-gray-700" : "text-white"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                    </>
                  ) : (
                    <button onClick={() => { setIsDropdownOpen(false); setIsModalOpen(true); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Login</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">EduSupport</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Your Gateway to Academic Success</h2>
          <p className="text-lg text-white/90 mb-10">Empowering Lebanese students to find scholarships, universities, and opportunities</p>

          <div className="grid gap-4">
            {["High School Student", "Undergraduate Student", "Volunteer with Us"].map((card, i) => (
              <button key={card} onClick={() => handleCardClick(card)}
                className={`group bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent ${i === 0 ? "hover:border-[#4CAF50]" : i === 1 ? "hover:border-[#42A5F5]" : "hover:border-[#81C784]"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${i === 0 ? "bg-gradient-to-br from-[#4CAF50] to-[#81C784]" : i === 1 ? "bg-gradient-to-br from-[#42A5F5] to-[#90CAF9]" : "bg-gradient-to-br from-[#81C784] to-[#4CAF50]"}`}>
                    {i === 0 ? "📚" : i === 1 ? "🎓" : "❤️"}
                  </div>
                  <span className="text-xl font-bold text-gray-900 flex-1 text-left">{card}</span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
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

      {/* Auth Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">{selectedCard}</h3>
            <p className="text-gray-600 text-center mb-6">{authMode === "login" ? "Welcome back! Please sign in." : "Create your account to get started."}</p>

            <div className="flex gap-2 mb-6">
              {(["login", "signup"] as const).map(mode => (
                <button key={mode} onClick={() => { setAuthMode(mode); setAuthMessage(""); setAuthError(""); }}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${authMode === mode ? "bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {mode === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent" />
              {authMessage && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{authMessage}</div>}
              {authError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{authError}</div>}
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-lg hover:scale-[1.02] transition-all">
                {authMode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#1a4d2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <span className="text-xl font-bold mb-4 block">EduSupport</span>
              <p className="text-gray-300 leading-relaxed">Dedicated to empowering Lebanese students with access to scholarships, universities, and career opportunities.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[["Home", "/"], ["Scholarships", "/scholarships"], ["Universities", "/universities"], ["Majors", "/majors"], ["Opportunities", "/opportunities"]].map(([label, path]) => (
                  <li key={path}><Link to={path} className="text-gray-300 hover:text-[#4CAF50] transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Team</h4>
              <div className="grid grid-cols-2 gap-4">
                {teamMembers.map(member => (
                  <div key={member.name} className="group relative text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] rounded-full flex items-center justify-center text-xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.role}</p>
                    <div className="absolute inset-0 bg-slate-900/95 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                      <p className="text-xs text-[#4CAF50] mb-1">📧 {member.email}</p>
                      <p className="text-xs text-[#42A5F5]">🔗 {member.linkedin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} EduSupport. All rights reserved. Made with ❤️ for Lebanese students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}