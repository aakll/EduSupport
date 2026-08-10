import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import GuestBanner from "../components/GuestBanner";

interface Application {
  id: string;
  role_applied_for: string;
  status: "pending" | "approved" | "rejected";
}

const ROLES = ["Scholarship Mentor", "Community Outreach", "Tech & Design Support"];

export default function Volunteer() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const [roleAppliedFor, setRoleAppliedFor] = useState("");
  const [motivation, setMotivation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadApplications = async (uid: string) => {
    const { data } = await supabase
      .from("volunteer_applications")
      .select("id, role_applied_for, status")
      .eq("user_id", uid);
    setApplications(data || []);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setIsCheckingAuth(false); return; }
      setUserId(session.user.id);
      await loadApplications(session.user.id);
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !roleAppliedFor) return;

    setIsSubmitting(true);
    setMessage(""); setError("");

    const { error: insertError } = await supabase.from("volunteer_applications").insert([{
      user_id: userId,
      role_applied_for: roleAppliedFor,
      motivation,
      status: "pending",
    }]);

    if (insertError) {
      setError("Failed to submit application: " + insertError.message);
    } else {
      setMessage("Application submitted! We'll review it and get back to you.");
      setRoleAppliedFor(""); setMotivation("");
      await loadApplications(userId);
    }
    setIsSubmitting(false);
  };

  const goToLogin = () => navigate("/login", { state: { redirectTo: "/volunteer" } });

  const appliedRoles = applications.map((a) => a.role_applied_for);
  const availableRoles = ROLES.filter((r) => !appliedRoles.includes(r));

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  const statusColor = { pending: "bg-blue-50 border-blue-200 text-blue-800", approved: "bg-green-50 border-green-200 text-green-800", rejected: "bg-slate-50 border-slate-200 text-slate-600" };

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
          <button onClick={() => setIsExpanded(!isExpanded)} className="w-full p-8 md:p-10 text-left flex items-center justify-between group hover:bg-slate-50 transition-colors">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">Volunteer Opportunities</h2>
              <p className="text-sm text-slate-500 mt-1">Click to view and apply to roles</p>
            </div>
            <svg className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="px-8 md:px-10 pb-10 pt-2 border-t border-slate-100 space-y-6">

              {!userId && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
                  <p className="text-amber-800 font-medium mb-3">You need to be signed in to apply as a volunteer.</p>
                  <button onClick={goToLogin} className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors">
                    Log In to Apply
                  </button>
                </div>
              )}

              {userId && applications.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900">Your Applications</p>
                  {applications.map((app) => (
                    <div key={app.id} className={`border rounded-lg p-3 flex justify-between items-center ${statusColor[app.status]}`}>
                      <span className="font-medium">{app.role_applied_for}</span>
                      <span className="text-xs uppercase font-semibold">{app.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {userId && availableRoles.length > 0 && (
                <form onSubmit={handleApply} className="space-y-4">
                  <p className="font-semibold text-slate-900">Apply for a New Role</p>
                  <select required value={roleAppliedFor} onChange={(e) => setRoleAppliedFor(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500">
                    <option value="" disabled>Select a role…</option>
                    {availableRoles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <textarea required value={motivation} onChange={(e) => setMotivation(e.target.value)} rows={4} placeholder="Why do you want this role?" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" />

                  {message && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>}
                  {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

                  <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-lg disabled:opacity-50">
                    {isSubmitting ? "Submitting..." : "Apply"}
                  </button>
                </form>
              )}

              {userId && availableRoles.length === 0 && (
                <p className="text-slate-500 text-sm">You've applied to all available roles. Thank you!</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}