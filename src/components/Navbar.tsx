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
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(
          session?.user
            ? { id: session.user.id, email: session.user.email || "" }
            : null,
        );
      },
    );
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

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        setProfileData(null);
        return;
      }
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
      {/* Inject Sketch Styles */}
      <style>{`
        .sketch-border {
          border: 3px solid black;
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }
        .sketch-border-sm {
          border: 2px solid black;
          border-radius: 15px 225px 15px 255px/255px 15px 225px 15px;
        }
      `}</style>

      <nav className="sticky top-0 z-50 w-full border-b-2 border-black bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* 1. LOGO (Left) - Sketch Style */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border-[3px] border-black bg-white sketch-border-sm">
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xl font-black tracking-tighter text-black">
                    EduSupport
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Guide for Students
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. NAV LINKS (Center) - Sketch Style */}
            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`sketch-border px-6 py-1.5 text-lg font-bold transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                      : "bg-white text-black hover:bg-gray-100 hover:translate-y-[-2px]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* 3. ACCOUNT + MOBILE TOGGLE (Right) */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="sketch-border-sm px-4 py-1.5 font-bold bg-white hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    aria-label="Account menu"
                  >
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">
                      {profileData?.first_name?.[0] ||
                        profileData?.last_name?.[0] ||
                        "U"}
                    </div>
                    <span className="hidden sm:inline">Profile</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 border-2 border-black z-50">
                      <div className="px-4 py-3 border-b-2 border-black border-dashed">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold border-2 border-black">
                            {profileData?.first_name?.[0] ||
                              profileData?.last_name?.[0] ||
                              "U"}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-black">
                              {profileData
                                ? `${profileData.first_name} ${profileData.last_name}`
                                : "User"}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              {STATUS_LABELS[profileData?.status] || ""}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 truncate font-mono">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                      >
                        ✏️ Edit Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={goToLogin}
                  className="hidden md:inline-flex sketch-border px-6 py-1.5 text-lg font-bold bg-white hover:bg-black hover:text-white transition-colors duration-200"
                >
                  Log In
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 text-black md:hidden"
                aria-label="Toggle menu"
              >
                <svg
                  className={`h-6 w-6 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
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
            </div>
          </div>
        </div>

        {/* Mobile Menu - Sketch Style */}
        <div
          className={`overflow-hidden border-t-2 border-black bg-white transition-all duration-300 ease-in-out md:hidden ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block sketch-border px-4 py-3 text-center text-lg font-bold transition-colors ${
                  isActive(link.path)
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="mt-2 block w-full sketch-border px-4 py-3 text-center text-lg font-bold text-red-600 bg-white"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={goToLogin}
                className="mt-2 block w-full sketch-border px-4 py-3 text-center text-lg font-bold bg-black text-white"
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
