import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Scholarships", path: "/scholarships" },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
      }
    };
    getUser();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage("");
    setAuthError("");
    try {
      if (authMode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || "" });
          setAuthMessage("Login successful!");
          setTimeout(() => {
            setIsModalOpen(false);
            setEmail("");
            setPassword("");
          }, 1500);
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setAuthMessage("Account created! Please check your email to verify.");
        setTimeout(() => {
          setAuthMode("login");
          setPassword("");
        }, 2000);
      }
    } catch (error: unknown) {
      setAuthError(
        error instanceof Error ? error.message : "An error occurred",
      );
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
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid h-16 grid-cols-3 items-center">

            <div className="flex h-16 items-center justify-between">

              {/* 1. LOGO (Left) - Force to left edge */}
              <div className="flex items-center gap-3 justify-self-start w-full">
                <Link
                  to="/"
                  className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 shadow-md shadow-indigo-500/20">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] shadow-md shadow-indigo-500/20">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                    </div>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-base font-bold tracking-tight text-slate-900">
                      EduSupport
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                      Guide for Students
                    </span>
                  </div>
                </Link>
              </div>

              {/* 2. NAV LINKS (Center) - Unchanged */}
              <div className="hidden items-center gap-1 md:flex md:justify-self-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* 3. HUMAN ICON (Right) - Force to right edge */}
              <div className="flex items-center gap-3 justify-self-end w-full justify-end">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
                  aria-label="Toggle menu"
                >
                  <svg
                    className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {isOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Account menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50">
                      {user ? (
                        <>
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm text-gray-500">
                              Signed in as
                            </p>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.email}
                            </p>
                          </div>
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
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsModalOpen(true);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Login
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out md:hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="mt-2 block w-full rounded-lg bg-slate-900 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {authMode === "login"
                ? "Welcome back! Please sign in."
                : "Create your account to get started."}
            </p>

            <div className="flex gap-2 mb-6">
              {(["login", "signup"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setAuthMode(mode);
                    setAuthMessage("");
                    setAuthError("");
                  }}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${authMode === mode ? "bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {mode === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
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
                className="w-full py-3 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-lg hover:scale-[1.02] transition-all"
              >
                {authMode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
