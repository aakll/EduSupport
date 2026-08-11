import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import GuestBanner from "../components/GuestBanner";

type AppStatus = "not_applied" | "pending" | "approved" | "rejected";

const SCHOLARSHIPS = ["MEPI", "USAID", "ULYP", "LIFE", "Habeeb", "Tomooh", "Tarraf"];
const LEVELS = ["1st year", "2nd year", "3rd year", "4th year", "5th year"];

export default function Volunteer() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [appStatus, setAppStatus] = useState<AppStatus>("not_applied");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [scholarshipReceived, setScholarshipReceived] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [level, setLevel] = useState("");
  const [graduationDate, setGraduationDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        setUserEmail(session.user.email || "");

        const { data } = await supabase
          .from("volunteer_applications")
          .select("status")
          .eq("user_id", session.user.id)
          .eq("role_applied_for", "Scholarship Mentor")
          .maybeSingle();

        if (data) setAppStatus(data.status as AppStatus);
      }
      setIsCheckingAuth(false);
    };
    init();
  }, []);

  const goToLogin = () => navigate("/login", { state: { redirectTo: "/volunteer" } });

  const handleApply = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!userId) return;

  if (!firstName || !lastName || !scholarshipReceived || !university || !major || !level || !graduationDate) {
    setError("Please fill in all required fields.");
    return;
  }

  setIsSubmitting(true);
  setMessage(""); setError("");

    const { error: insertError } = await supabase.from("volunteer_applications").insert([{
      user_id: userId,
      role_applied_for: "Scholarship Mentor",
      first_name: firstName,
      last_name: lastName,
      email: userEmail,
      scholarship_received: scholarshipReceived,
      university,
      major,
      level,
      graduation_date: graduationDate,
      status: "pending",
    }]);

    if (insertError) {
      setError("Failed to submit: " + insertError.message);
    } else {
      setAppStatus("pending");
      setMessage("Application submitted!");
      setTimeout(() => setShowForm(false), 1200);
    }
    setIsSubmitting(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white page-enter">
      {!userId && <GuestBanner redirectTo="/volunteer" />}

      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://conantcrier.com/wp-content/uploads/2020/10/image.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Volunteer With Us</h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Join our community of mentors and changemakers dedicated to empowering Lebanese students through education and opportunity.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden mb-8 transition-all duration-300">
          <div className="h-2 bg-gradient-to-r from-red-400 to-red-600" />

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-8 md:p-10 text-left flex items-center justify-between group hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-400/10 to-red-600/10 flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14v7m-3-3h6" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  Help Students Know about Scholarships & their Application Process
                </h2>
                <p className="text-sm text-slate-500 mt-1">Click to learn more and apply as a mentor</p>
              </div>
            </div>

            <svg
              className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="px-8 md:px-10 pb-10 pt-2 border-t border-slate-100">
              <p className="text-slate-600 leading-relaxed mb-2">
                Guide high school students through the scholarship application process by doing any of the following:
              </p>
              <ol className="text-slate-600 leading-relaxed mb-4 list-decimal list-inside space-y-1">
                <li>Introduce the scholarship and what it provides.</li>
                <li>Assist students in understanding the eligibility criteria and requirements.</li>
                <li>Give them tips on how to present themselves effectively in their applications, including writing compelling essays and preparing for interviews.</li>
                <li>State your experience applying for this scholarship and the challenges you faced, so they can learn from your journey.</li>
                <li>Highlight the skills you had and you believe were important for your acceptance, and how they can develop those skills.</li>
                <li>Walk them through the application process.</li>
                <li>Provide useful resources and references to help them succeed.</li>
              </ol>
              <p className="text-slate-600 leading-relaxed mb-6">
                You can provide the content either as written or as a video, or both.
              </p>

              {!userId && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
                  <p className="text-amber-800 font-medium mb-3">You need to be signed in to apply as a volunteer.</p>
                  <button onClick={goToLogin} className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors">
                    Log In to Apply
                  </button>
                </div>
              )}

              {userId && appStatus === "approved" && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                  <p className="text-green-800 font-semibold">🎉 You're an approved volunteer. Thank you for contributing!</p>
                </div>
              )}

              {userId && appStatus === "pending" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
                  <p className="text-blue-800 font-medium">Your application is under review. We'll be in touch soon.</p>
                </div>
              )}

              {userId && appStatus === "rejected" && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                  <p className="text-slate-600 font-medium">Your previous application wasn't approved. Feel free to reach out if your circumstances have changed.</p>
                </div>
              )}

              {userId && appStatus === "not_applied" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-lg"
                >
                  Fill Out Application Form
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Google Form-style application modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
            <div className="border-t-8 border-red-500 rounded-t-lg p-8 pb-6">
              <h2 className="text-2xl font-normal text-slate-900">Scholarship Mentor Application</h2>
              <p className="text-sm text-slate-500 mt-2">* Indicates required question</p>
            </div>

            <form onSubmit={handleApply} className="px-8 pb-8 space-y-6">
              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-800 mb-2">Email *</label>
                <input type="email" required value={userEmail} disabled className="w-full border-b border-slate-300 outline-none py-2 text-sm bg-slate-50 text-slate-500" />
              </div>

              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-800 mb-2">Name *</label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border-b border-slate-300 focus:border-red-500 outline-none py-2 text-sm" placeholder="Your answer" />
              </div>

              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-800 mb-2">Family name *</label>
                <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border-b border-slate-300 focus:border-red-500 outline-none py-2 text-sm" placeholder="Your answer" />
              </div>

              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-800 mb-3">Which scholarship have you received? *</label>
                <div className="space-y-2">
                  {SCHOLARSHIPS.map((s) => (
                    <label key={s} className="flex items-center gap-3 text-sm text-slate-700">
                      <input type="radio" name="scholarship" required value={s} checked={scholarshipReceived === s} onChange={(e) => setScholarshipReceived(e.target.value)} className="text-red-600 focus:ring-red-500" />
                      {s}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-800 mb-2">University *</label>
                <input type="text" required value={university} onChange={(e) => setUniversity(e.target.value)} className="w-full border-b border-slate-300 focus:border-red-500 outline-none py-2 text-sm" placeholder="Your answer" />
              </div>

              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-800 mb-2">Major *</label>
                <input type="text" required value={major} onChange={(e) => setMajor(e.target.value)} className="w-full border-b border-slate-300 focus:border-red-500 outline-none py-2 text-sm" placeholder="Your answer" />
              </div>

              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-800 mb-3">Level</label>
                <div className="space-y-2">
                  {LEVELS.map((l) => (
                    <label key={l} className="flex items-center gap-3 text-sm text-slate-700">
                      <input type="radio" name="level" value={l} checked={level === l} onChange={(e) => setLevel(e.target.value)} className="text-red-600 focus:ring-red-500" />
                      {l}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-800 mb-2">Graduation date *</label>
                <input type="date" required value={graduationDate} onChange={(e) => setGraduationDate(e.target.value)} className="w-full border-b border-slate-300 focus:border-red-500 outline-none py-2 text-sm" />
              </div>

              {message && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>}
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

              <div className="flex items-center justify-between pt-4">
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-700 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}