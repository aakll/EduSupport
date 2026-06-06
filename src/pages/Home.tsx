import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {supabase} from "c:/Users/USER/Downloads/courses/Website/scholarships-lb/src/supabaseClient";

export default function Home() {

interface User {
  id: string;
  email: string;
}

interface TeamMember {
  name: string;
  role: string;
  email: string;
  linkedin: string;
}

const teamMembers: TeamMember[] = [
  { name: 'Sarah Haddad', role: 'Founder & CEO', email: 'sarah@edusupport.lb', linkedin: 'linkedin.com/in/sarahhaddad' },
  { name: 'Karim Nassar', role: 'Head of Partnerships', email: 'karim@edusupport.lb', linkedin: 'linkedin.com/in/karimnassar' },
  { name: 'Lina Khoury', role: 'Student Relations', email: 'lina@edusupport.lb', linkedin: 'linkedin.com/in/linakhoury' },
  { name: 'Omar Bitar', role: 'Tech Lead', email: 'omar@edusupport.lb', linkedin: 'linkedin.com/in/omarbitar' },
];

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
      }
    };

    getUser();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    setIsModalOpen(true);
    setAuthMessage('');
    setAuthError('');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage('');
    setAuthError('');

    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || '' });
          setAuthMessage('Login successful!');
          setTimeout(() => {
            setIsModalOpen(false);
            setEmail('');
            setPassword('');
          }, 1500);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          setAuthMessage('Account created! Please check your email to verify.');
          setTimeout(() => {
            setAuthMode('login');
            setPassword('');
          }, 2000);
        }
      }
    } catch (error: any) {
      setAuthError(error.message || 'An error occurred');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsDropdownOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEmail('');
    setPassword('');
    setAuthMessage('');
    setAuthError('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <span className={`text-xl font-bold transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                EduSupport
              </span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'
                }`}
              >
                <svg
                  className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://image.qwenlm.ai/public_source/0615c6d7-b7a9-4ff1-ba41-a65ac8786487/115440773-87b2-40b9-b4ed-df879626adfc.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] rounded-2xl flex items-center justify-center shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white">EduSupport</h1>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            Your Gateway to Academic Success
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in-up-delay">
            Empowering Lebanese students to find scholarships, universities, and opportunities
          </p>

          <div className="grid gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => handleCardClick('High School Student')}
              className="group relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-[#4CAF50]/50 hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-[#4CAF50]"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#81C784] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">High School Student</h3>
                  <p className="text-gray-600">Discover scholarships and opportunities for your future</p>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-[#4CAF50] group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => handleCardClick('Undergraduate Student')}
              className="group relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-[#42A5F5]/50 hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-[#42A5F5]"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#42A5F5] to-[#90CAF9] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Undergraduate Student</h3>
                  <p className="text-gray-600">Access funding and resources for your degree</p>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-[#42A5F5] group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => handleCardClick('Volunteer with Us')}
              className="group relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-[#81C784]/50 hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-[#81C784]"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#81C784] to-[#4CAF50] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Volunteer with Us</h3>
                  <p className="text-gray-600">Join our mission to support Lebanese students</p>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-[#81C784] group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Auth Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCard}
              </h3>
              <p className="text-gray-600">
                {authMode === 'login' ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
              </p>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthMessage('');
                  setAuthError('');
                }}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setAuthMessage('');
                  setAuthError('');
                }}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              {authMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {authMessage}
                </div>
              )}
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#1a4d2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">EduSupport</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                EduSupport is dedicated to empowering Lebanese students with access to scholarships, 
                universities, and career opportunities. We believe every student deserves a chance to succeed.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-[#4CAF50] transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/scholarships" className="text-gray-300 hover:text-[#4CAF50] transition-colors">Scholarships</Link>
                </li>
                <li>
                  <Link to="/universities" className="text-gray-300 hover:text-[#4CAF50] transition-colors">Universities</Link>
                </li>
                <li>
                  <Link to="/majors" className="text-gray-300 hover:text-[#4CAF50] transition-colors">Majors</Link>
                </li>
                <li>
                  <Link to="/opportunities" className="text-gray-300 hover:text-[#4CAF50] transition-colors">Opportunities</Link>
                </li>
              </ul>
            </div>

            {/* Team */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Team</h4>
              <div className="grid grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.name} className="group relative">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-center text-sm font-medium text-white">{member.name}</p>
                    <p className="text-center text-xs text-gray-400">{member.role}</p>
                    
                    {/* Hover Contact Info */}
                    <div className="absolute inset-0 bg-slate-900/95 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 pointer-events-none group-hover:pointer-events-auto">
                      <p className="text-xs text-[#4CAF50] mb-1">📧 {member.email}</p>
                      <p className="text-xs text-[#42A5F5]">🔗 {member.linkedin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} EduSupport. All rights reserved. Made with ❤️ for Lebanese students.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-fade-in-up-delay {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
}