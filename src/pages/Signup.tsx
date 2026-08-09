import { useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import type { UserCategory } from "../components/AuthChoiceModal";

const CATEGORY_LABELS: Record<string, string> = {
  high_school: "High School Student",
  university: "University Student",
  other: "Other",
};

export default function Signup() {
  const location = useLocation();

  // Category passed from the AuthChoiceModal. If it's missing or "volunteer"
  // (arrived via the Volunteer card), the user must pick their real category
  // below before the category-specific fields appear.
  const incomingCategory = location.state?.category as UserCategory | undefined;
  const cameFromVolunteer = incomingCategory === "volunteer";

  const [category, setCategory] = useState<string>(
    incomingCategory && incomingCategory !== "volunteer" ? incomingCategory : ""
  );
  const [wantsVolunteer, setWantsVolunteer] = useState(cameFromVolunteer);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "",
    age: "",
    // high school
    schoolName: "", grade: "", graduationDate: "",
    // university
    universityName: "", major: "", standing: "undergrad", expectedGraduation: "",
    // other
    organization: "", role: "",
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
            wants_volunteer: wantsVolunteer,
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

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h3>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category picker — only shown if not preselected by the modal */}
          {!incomingCategory || cameFromVolunteer ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which best describes you?
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>Select one…</option>
                <option value="high_school">High School Student</option>
                <option value="university">University Student</option>
                <option value="other">Other</option>
              </select>
            </div>
          ) : (
            <div className="text-sm text-slate-500 -mt-2 mb-2">
              Signing up as: <span className="font-semibold text-slate-700">{CATEGORY_LABELS[category]}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" required value={formData.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputClass} />
            <input type="text" placeholder="Last Name" required value={formData.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputClass} />
          </div>

          {/* Category-specific fields */}
          {category === "high_school" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Age" required value={formData.age} onChange={(e) => update("age", e.target.value)} className={inputClass} />
                <input type="text" placeholder="Grade" required value={formData.grade} onChange={(e) => update("grade", e.target.value)} className={inputClass} />
              </div>
              <input type="text" placeholder="School Name" required value={formData.schoolName} onChange={(e) => update("schoolName", e.target.value)} className={inputClass} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation Date</label>
                <input type="date" required value={formData.graduationDate} onChange={(e) => update("graduationDate", e.target.value)} className={inputClass} />
              </div>
            </>
          )}

          {category === "university" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Age" required value={formData.age} onChange={(e) => update("age", e.target.value)} className={inputClass} />
                <select required value={formData.standing} onChange={(e) => update("standing", e.target.value)} className={inputClass}>
                  <option value="undergrad">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                </select>
              </div>
              <input type="text" placeholder="University Name" required value={formData.universityName} onChange={(e) => update("universityName", e.target.value)} className={inputClass} />
              <input type="text" placeholder="Major" required value={formData.major} onChange={(e) => update("major", e.target.value)} className={inputClass} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation Date</label>
                <input type="date" required value={formData.expectedGraduation} onChange={(e) => update("expectedGraduation", e.target.value)} className={inputClass} />
              </div>
            </>
          )}

          {category === "other" && (
            <>
              <input type="text" placeholder="Organization" required value={formData.organization} onChange={(e) => update("organization", e.target.value)} className={inputClass} />
              <input type="text" placeholder="Your Role" required value={formData.role} onChange={(e) => update("role", e.target.value)} className={inputClass} />
            </>
          )}

          <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
          <input type="password" placeholder="Password" required value={formData.password} onChange={(e) => update("password", e.target.value)} className={inputClass} />

          {/* Volunteer opt-in — independent of category, available to everyone */}
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={wantsVolunteer}
              onChange={(e) => setWantsVolunteer(e.target.checked)}
              className="rounded border-gray-300"
            />
            I'd also like to sign up as a volunteer
          </label>

          {message && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>}
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-lg hover:scale-[1.02] transition-all disabled:opacity-50">
            {isLoading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-500">Already have an account? <a href="/login" className="text-[#4CAF50] font-semibold">Log In</a></p>
      </div>
    </div>
  );
}