import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Navbar = () => {

  const STATUS_LABELS: Record<string, string> = {
  high_school: "High School Student",
  university_undergrad: "University Student (Undergrad)",
  university_graduate: "University Student (Graduate)",
  other: "Other",
};

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Scholarships", path: "/scholarships" },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email || "" } : null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

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

  // A logged-in user could be in any of the three category tables — check
  // each until one matches instead of assuming high_school_students.
  useEffect(() => {
  const fetchProfileData = async () => {
    if (!user?.id) { setProfileData(null); return; }
    const { data } = await supabase
      .from("profiles")
      .select("first_name, last_name, status")
      .eq("user_id", user.id)
      .maybeSingle();
    setProfileData(data);
  };
  fetchProfileData();
}, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileData(null);
    setIsDropdownOpen(false);
  };

  const goToLogin = () => {
    setIsDropdownOpen(false);
    setIsOpen(false);
    navigate("/login", { state: { redirectTo: location.pathname } });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* 1. LOGO (Left) */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 shadow-md shadow-indigo-500/20">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] shadow-md shadow-indigo-500/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-base font-bold tracking-tight text-slate-900">EduSupport</span>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Guide for Students</span>
                </div>
              </Link>
            </div>

            {/* 2. NAV LINKS (Center) */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(link.path) ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* 3. ACCOUNT + MOBILE TOGGLE (Right) */}
            <div className="flex items-center gap-3">

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Account menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] flex items-center justify-center text-white font-bold">
                            {profileData?.first_name?.[0] || profileData?.last_name?.[0] || "U"}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {profileData ? `${profileData.first_name} ${profileData.last_name}` : "User"}
                            </p>
                            <p className="text-xs text-gray-500">{STATUS_LABELS[profileData?.status] || ""}</p>
              
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                      >
                        ✏️ Edit Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={goToLogin}
                  className="hidden md:inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Log In
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
                aria-label="Toggle menu"
              >
                <svg
                  className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
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
                  isActive(link.path) ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="mt-2 block w-full rounded-lg bg-red-50 px-3 py-2.5 text-center text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={goToLogin}
                className="mt-2 block w-full rounded-lg bg-slate-900 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};


export default Navbar;