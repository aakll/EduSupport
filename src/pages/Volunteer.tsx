import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import GuestBanner from "../components/GuestBanner";

type VolunteerStatus = "not_applied" | "pending" | "approved" | "rejected";

export default function Volunteer() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [volunteerStatus, setVolunteerStatus] = useState<VolunteerStatus>("not_applied");
  const [isExpanded, setIsExpanded] = useState(false);

  const [motivation, setMotivation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuthAndStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setIsCheckingAuth(false);
        return;
      }

      setUserId(session.user.id);

      const { data: volunteerRow } = await supabase
        .from("volunteer_profiles")
        .select("status")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (volunteerRow) {
        setVolunteerStatus(volunteerRow.status as VolunteerStatus);
      }

      setIsCheckingAuth(false);
    };
    checkAuthAndStatus();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSubmitting(true);
    setMessage(""); setError("");

    const { error: insertError } = await supabase.from("volunteer_profiles").insert([{
      user_id: userId,
      motivation,
      status: "pending",
    }]);

    if (insertError) {
      setError("Failed to submit application: " + insertError.message);
    } else {
      setVolunteerStatus("pending");
      setMessage("Application submitted! We'll review it and get back to you.");
    }
    setIsSubmitting(false);
  };

  const goToLogin = () => {
    navigate("/login", { state: { redirectTo: "/volunteer" } });
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
      {!userId && !isCheckingAuth && <GuestBanner redirectTo="/volunteer" />}
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://conantcrier.com/wp-content/uploads/2020/10/image.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Volunteer With Us
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Join our community of mentors and changemakers dedicated to
            empowering Lebanese students through education and opportunity.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        {/* Expandable Scholarship Help Box */}
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

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-8 md:px-10 pb-10 pt-2 border-t border-slate-100">
              <p className="text-slate-600 leading-relaxed mb-6">
                Guide high school students through the scholarship application
                process by doing any of the following: 1. Introduce the
                scholarship and what it provides. 2. Assist students in
                understanding the eligibility criteria and requirements. 3. Give
                them tips on how to present themselves effectively in their
                applications, including writing compelling essays and preparing
                for interviews. 4. State your experience applying for this
                scholarship and the challenges you faced, so they can learn from
                your journey. 5. Highlight the skills you had and you believe
                were important for your acceptance, and how they can develop
                those skills. 6. Walk them through the application process 7.
                Provide useful resources and references to help them succeed.
              </p>

              {/* --- Apply logic starts here --- */}
              {!userId && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
                  <p className="text-amber-800 font-medium mb-3">
                    You need to be signed in to apply as a volunteer.
                  </p>
                  <button
                    onClick={goToLogin}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Log In to Apply
                  </button>
                </div>
              )}

              {userId && volunteerStatus === "approved" && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                  <p className="text-green-800 font-semibold">
                    🎉 You're an approved volunteer. Thank you for contributing!
                  </p>
                </div>
              )}

              {userId && volunteerStatus === "pending" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
                  <p className="text-blue-800 font-medium">
                    Your application is under review. We'll be in touch soon.
                  </p>
                </div>
              )}

              {userId && volunteerStatus === "rejected" && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                  <p className="text-slate-600 font-medium">
                    Your previous application wasn't approved. Feel free to reach out if your circumstances have changed.
                  </p>
                </div>
              )}

              {userId && volunteerStatus === "not_applied" && (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Why do you want to volunteer with us?
                    </label>
                    <textarea
                      required
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Tell us a bit about your motivation..."
                    />
                  </div>

                  {message && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>}
                  {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-lg disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Apply to Volunteer"}
                  </button>
                </form>
              )}
              {/* --- Apply logic ends here --- */}
            </div>
          </div>
        </div>

        {/* Additional Volunteer Opportunities Boxes (Placeholder) */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden p-8 text-center opacity-75 cursor-not-allowed">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center text-3xl">
              📢
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Community Outreach</h3>
            <p className="text-sm text-slate-500">Coming Soon</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden p-8 text-center opacity-75 cursor-not-allowed">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center text-3xl"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Tech & Design Support</h3>
            <p className="text-sm text-slate-500">Coming Soon</p>
          </div>
        </div>
      </main>
    </div>
  );
}