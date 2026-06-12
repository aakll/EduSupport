import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  // State for High School Student Modal
  const [isHSModalOpen, setIsHSModalOpen] = useState(false);
  const [hsAuthMode, setHsAuthMode] = useState<"login" | "signup">("login");

  // State for Form Data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    schoolName: "",
    grade: "",
    graduationDate: "",
    email: "",
    password: "",
  });

  // State for Messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // If they are already logged in, we could pre-fill data here if needed
        // For now, we just know they are authenticated
      }
    };
    checkUser();
  }, []);

  // Handle "Later" button - Just closes modal, allows access
  const handleLater = () => {
    setIsHSModalOpen(false);
    setMessage("");
    setError("");
  };

  // Handle Form Submission (Signup or Login)
  const handleHSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      if (hsAuthMode === "signup") {
        // 1. Sign up the user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // 2. Save their details to the 'high_school_students' table
          const { error: insertError } = await supabase
            .from("high_school_students")
            .insert([
              {
                user_id: data.user.id,
                first_name: formData.firstName,
                last_name: formData.lastName,
                age: parseInt(formData.age),
                school_name: formData.schoolName,
                grade: formData.grade,
                graduation_date: formData.graduationDate,
              },
            ]);

          if (insertError) throw insertError;

          setMessage("Account created! Please check your email to verify.");
          setTimeout(() => {
            setHsAuthMode("login");
            setFormData((prev) => ({ ...prev, password: "" }));
          }, 2000);
        }
      } else {
        // Login Mode
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;

        setMessage("Login successful!");
        setTimeout(() => {
          setIsHSModalOpen(false);
          setFormData({
            firstName: "",
            lastName: "",
            age: "",
            schoolName: "",
            grade: "",
            graduationDate: "",
            email: "",
            password: "",
          });
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image and overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            EduSupport
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Your Gateway to Academic Success
          </h2>
          <p className="text-lg text-white/90 mb-10">
            Guide for students in Lebanon to find scholarships
          </p>

          {/* Action Cards */}
          <div className="grid gap-4">
            {[
              {
                name: "High School Student",
                color: "from-[#4CAF50] to-[#81C784]",
                border: "hover:border-[#4CAF50]",
                path: "/high-school",
              },
              {
                name: "Undergraduate Student",
                color: "from-[#42A5F5] to-[#90CAF9]",
                border: "hover:border-[#42A5F5]",
                path: null,
              },
              {
                name: "Volunteer with Us",
                color: "from-[#81C784] to-[#4CAF50]",
                border: "hover:border-[#81C784]",
                path: null,
              },
            ].map((card, i) => (
              <button
                key={card.name}
                onClick={() => card.path && navigate(card.path)}
                title={i === 1 ? "Coming Soon" : ""}
                className={`group relative bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent ${card.border} ${!card.path ? "cursor-default" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br ${card.color}`}
                  ></div>
                  <span className="text-xl font-bold text-gray-900 flex-1 text-left">
                    {card.name}
                  </span>
                  {card.path && (
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
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
                  )}
                </div>

                {/* Coming Soon Tooltip for Undergraduate */}
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white/70"
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
      </section>

      {/* High School Student Modal */}
      {isHSModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsHSModalOpen(false)}
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
              High School Student
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {hsAuthMode === "login"
                ? "Welcome back! Sign in to continue."
                : "Create your profile to get started."}
            </p>

            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-6">
              {(["login", "signup"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setHsAuthMode(mode);
                    setMessage("");
                    setError("");
                  }}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                    hsAuthMode === mode
                      ? "bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {mode === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleHSSubmit} className="space-y-4">
              {/* Signup Fields Only */}
              {hsAuthMode === "signup" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Age"
                      required
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Grade (e.g. 11th)"
                      required
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="School Name"
                    required
                    value={formData.schoolName}
                    onChange={(e) =>
                      setFormData({ ...formData, schoolName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  />
                  <div className="text-sm text-gray-500">
                    Expected Graduation Date
                  </div>
                  <input
                    type="date"
                    required
                    value={formData.graduationDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        graduationDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  />
                </>
              )}

              {/* Common Fields (Email/Pass) */}
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />

              {message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {message}
                </div>
              )}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isLoading
                  ? "Processing..."
                  : hsAuthMode === "login"
                    ? "Log In"
                    : "Create Account"}
              </button>
            </form>

            {/* Later Button */}
            <button
              onClick={handleLater}
              className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Continue as Guest (Later)
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#1a4d2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            {/* About section */}
            <div>
              <span className="text-xl font-bold mb-4 block">EduSupport</span>
              <p className="text-gray-300 leading-relaxed">
                Dedicated to empowering Lebanese students with access to
                scholarships, universities, and career opportunities.
              </p>
            </div>
            {/* Quick Links section */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  ["Home", "/"],
                  ["Scholarships", "/scholarships"],
                ].map(([label, path]) => (
                  <li key={path}>
                    <a
                      href={path}
                      className="text-gray-300 hover:text-[#4CAF50] transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Copyright */}
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} EduSupport. Made with ❤️ for
              students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
