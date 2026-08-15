import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  // Category is always chosen by the user in the dropdown below —
  // no pre-fill from AuthChoiceModal / router state.
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    schoolName: "",
    grade: "",
    graduationDate: "",
    universityName: "",
    major: "",
    standing: "undergrad",
    expectedGraduation: "",
    organization: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!category) {
      setError("Please select which category best describes you.");
      return;
    }

    setIsLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            category,
            first_name: formData.firstName,
            last_name: formData.lastName,
            age: formData.age,
            school_name: formData.schoolName,
            grade: formData.grade,
            graduation_date: formData.graduationDate,
            university_name: formData.universityName,
            major: formData.major,
            standing: formData.standing,
            expected_graduation: formData.expectedGraduation,
            organization: formData.organization,
            role: formData.role,
          },
        },
      });
      if (signUpError) throw signUpError;
      setMessage("Account created! Check your email to confirm, then log in.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Styles matching Home.tsx
  const inputClass =
    "w-full px-4 py-3 border-[3px] border-black rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-black transition-all placeholder:text-gray-400 font-medium";
  const labelClass =
    "block text-xs font-black uppercase tracking-wider text-gray-500 mb-1 ml-1";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans text-black relative overflow-hidden">
      <div className="absolute top-10 right-10 w-32 h-32 border-4 border-green-500 rounded-full opacity-10 blur-xl pointer-events-none"></div>

      <div className="bg-white max-w-xl w-full p-4 md:p-8 relative z-10 my-8">
        <div className="border-[3px] border-black p-6 md:p-8 rounded-[20px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors font-bold"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="absolute -top-3 -left-3 w-full h-full border-2 border-[#16a34a] rounded-[25px] -z-10 opacity-60 pointer-events-none"></div>

          <h3 className="text-3xl font-black text-black mb-6 text-center tracking-tighter uppercase">
            Create Account
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className={labelClass}>Which best describes you?</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="" disabled>
                  Select one…
                </option>
                <option value="high_school">High School Student</option>
                <option value="university">University Student</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  placeholder=""
                  required
                  value={formData.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  placeholder=""
                  required
                  value={formData.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {category === "high_school" && (
              <div className="space-y-4 pt-2 border-t-2 border-dashed border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Age</label>
                    <input
                      type="number"
                      placeholder="16"
                      required
                      value={formData.age}
                      onChange={(e) => update("age", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Grade</label>
                    <input
                      type="text"
                      placeholder="11th"
                      required
                      value={formData.grade}
                      onChange={(e) => update("grade", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>School Name</label>
                  <input
                    type="text"
                    placeholder="Lincoln High"
                    required
                    value={formData.schoolName}
                    onChange={(e) => update("schoolName", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Expected Graduation</label>
                  <input
                    type="date"
                    required
                    value={formData.graduationDate}
                    onChange={(e) => update("graduationDate", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {category === "university" && (
              <div className="space-y-4 pt-2 border-t-2 border-dashed border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Age</label>
                    <input
                      type="number"
                      placeholder="20"
                      required
                      value={formData.age}
                      onChange={(e) => update("age", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Standing</label>
                    <select
                      required
                      value={formData.standing}
                      onChange={(e) => update("standing", e.target.value)}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="undergrad">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>University Name</label>
                  <input
                    type="text"
                    placeholder="State University"
                    required
                    value={formData.universityName}
                    onChange={(e) => update("universityName", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Major</label>
                  <input
                    type="text"
                    placeholder="Computer Science"
                    required
                    value={formData.major}
                    onChange={(e) => update("major", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Expected Graduation</label>
                  <input
                    type="date"
                    required
                    value={formData.expectedGraduation}
                    onChange={(e) =>
                      update("expectedGraduation", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {category === "other" && (
              <div className="space-y-4 pt-2 border-t-2 border-dashed border-gray-100">
                <div>
                  <label className={labelClass}>Organization</label>
                  <input
                    type="text"
                    placeholder="EduSupport"
                    required
                    value={formData.organization}
                    onChange={(e) => update("organization", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Your Role</label>
                  <input
                    type="text"
                    placeholder="Volunteer"
                    required
                    value={formData.role}
                    onChange={(e) => update("role", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                required
                value={formData.password}
                onChange={(e) => update("password", e.target.value)}
                className={inputClass}
              />
            </div>

            {message && (
              <div className="p-3 bg-green-50 border-[2px] border-[#16a34a] rounded-lg text-[#15803d] text-sm font-bold flex items-center gap-2">
                <span>✓</span> {message}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border-[2px] border-red-600 rounded-lg text-red-700 text-sm font-bold flex items-center gap-2">
                <span>!</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-black text-white text-lg font-bold rounded-[50px] hover:bg-[#16a34a] transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(22,163,74,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm font-medium text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#16a34a] font-black underline decoration-2 underline-offset-2 hover:text-black transition-colors"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
