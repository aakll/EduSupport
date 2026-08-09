import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

type Status = "high_school" | "university_undergrad" | "university_graduate" | "other";

const STATUS_LABELS: Record<Status, string> = {
  high_school: "High School Student",
  university_undergrad: "University Student (Undergraduate)",
  university_graduate: "University Student (Graduate)",
  other: "Other",
};

const TRANSITIONS: Record<Status, Status[]> = {
  high_school: ["university_undergrad", "other"],
  university_undergrad: ["university_graduate", "other"],
  university_graduate: ["other"],
  other: [],
};

function tableForStatus(status: Status) {
  if (status.startsWith("university")) return "university_students";
  if (status === "high_school") return "high_school_students";
  return "other_users";
}

export default function Profile() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [status, setStatus] = useState<Status | null>(null);
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "" });
  const [categoryData, setCategoryData] = useState<any>({});

  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [statusStep, setStatusStep] = useState<0 | 1 | 2 | 3>(0);
  const [pendingStatus, setPendingStatus] = useState<Status | null>(null);
  const [newFields, setNewFields] = useState<any>({});
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/"); return; }

      setUserId(session.user.id);
      setEmail(session.user.email || "");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profileError || !profile) {
        setError("Profile not found");
        setIsLoading(false);
        return;
      }

      setStatus(profile.status as Status);
      setProfileForm({ firstName: profile.first_name || "", lastName: profile.last_name || "" });

      const { data: catRow } = await supabase
        .from(tableForStatus(profile.status))
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setCategoryData(catRow || {});
      setIsLoading(false);
    };
    load();
  }, [navigate]);

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsChangingPassword(true);
    setMessage(""); setError("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setError("Error updating password: " + error.message);
    else {
      setMessage("Password updated successfully!");
      setNewPassword("");
      setTimeout(() => setMessage(""), 3000);
    }
    setIsChangingPassword(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !status) return;
    setIsSaving(true);
    setMessage(""); setError("");

    const { error: profileErr } = await supabase
      .from("profiles")
      .update({ first_name: profileForm.firstName, last_name: profileForm.lastName })
      .eq("user_id", userId);

    const { error: catErr } = await supabase
      .from(tableForStatus(status))
      .update({ ...categoryData, first_name: profileForm.firstName, last_name: profileForm.lastName })
      .eq("user_id", userId);

    if (profileErr || catErr) setError("Failed to update profile");
    else {
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
    setIsSaving(false);
  };

  const startStatusChange = () => { setStatusStep(1); setPendingStatus(null); setNewFields({}); };
  const cancelStatusChange = () => { setStatusStep(0); setPendingStatus(null); setNewFields({}); };
  const pickNewStatus = (s: Status) => { setPendingStatus(s); setStatusStep(2); };
  const confirmWarning = () => setStatusStep(3);

  const submitStatusChange = async () => {
    if (!userId || !status || !pendingStatus) return;
    setIsChangingStatus(true);
    setError("");

    try {
      const oldTable = tableForStatus(status);
      const newTable = tableForStatus(pendingStatus);

      if (oldTable === newTable) {
        const { error: updateErr } = await supabase
          .from(newTable)
          .update({ standing: pendingStatus === "university_graduate" ? "graduate" : "undergrad", ...newFields })
          .eq("user_id", userId);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase.from(newTable).insert([{
          user_id: userId,
          first_name: profileForm.firstName,
          last_name: profileForm.lastName,
          ...newFields,
        }]);
        if (insertErr) throw insertErr;
      }

      const { error: historyErr } = await supabase.from("category_history").insert([{
        user_id: userId,
        old_status: status,
        new_status: pendingStatus,
      }]);
      if (historyErr) throw historyErr;

      const { error: flipErr } = await supabase
        .from("profiles")
        .update({ status: pendingStatus })
        .eq("user_id", userId);
      if (flipErr) throw flipErr;

      setStatus(pendingStatus);
      setStatusStep(0);
      setMessage(`Status updated to ${STATUS_LABELS[pendingStatus]}`);
      setTimeout(() => setMessage(""), 4000);

      const { data: catRow } = await supabase
        .from(tableForStatus(pendingStatus))
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      setCategoryData(catRow || {});
    } catch (err: any) {
      setError("Failed to update status: " + err.message);
    } finally {
      setIsChangingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] flex items-center justify-center text-white text-4xl font-bold">
              {profileForm.firstName[0]}{profileForm.lastName[0]}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Current Status</p>
              <p className="text-lg font-bold text-slate-900">{status && STATUS_LABELS[status]}</p>
            </div>
            {status && TRANSITIONS[status].length > 0 && statusStep === 0 && (
              <button
                onClick={startStatusChange}
                className="px-4 py-2 text-sm font-semibold text-[#42A5F5] border border-[#42A5F5]/30 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Change Status
              </button>
            )}
          </div>

          {statusStep === 1 && status && (
            <div className="border border-slate-200 rounded-xl p-5 space-y-3">
              <p className="font-semibold text-slate-900">What's your new status?</p>
              {TRANSITIONS[status].map((s) => (
                <button
                  key={s}
                  onClick={() => pickNewStatus(s)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-[#42A5F5] hover:bg-blue-50 transition-colors"
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
              <button onClick={cancelStatusChange} className="text-sm text-slate-400 hover:text-slate-600">Cancel</button>
            </div>
          )}

          {statusStep === 2 && pendingStatus && (
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-5 space-y-3">
              <p className="font-semibold text-amber-900">
                You're about to change your status to {STATUS_LABELS[pendingStatus]}.
              </p>
              <p className="text-sm text-amber-800">
                Your current info will be kept but will no longer be shown as active. This is self-reported —
                make sure it's accurate.
              </p>
              <div className="flex gap-3">
                <button onClick={confirmWarning} className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors">
                  Continue
                </button>
                <button onClick={cancelStatusChange} className="px-4 py-2 text-slate-500 hover:text-slate-700">Cancel</button>
              </div>
            </div>
          )}

          {statusStep === 3 && pendingStatus && (
            <div className="border border-slate-200 rounded-xl p-5 space-y-4">
              <p className="font-semibold text-slate-900">A few details for your new status</p>

              {pendingStatus === "university_undergrad" && (
                <>
                  <input type="number" placeholder="Age" value={newFields.age || ""} onChange={(e) => setNewFields({ ...newFields, age: e.target.value })} className={inputClass} />
                  <input type="text" placeholder="University Name" value={newFields.university_name || ""} onChange={(e) => setNewFields({ ...newFields, university_name: e.target.value })} className={inputClass} />
                  <input type="text" placeholder="Major" value={newFields.major || ""} onChange={(e) => setNewFields({ ...newFields, major: e.target.value })} className={inputClass} />
                  <input type="date" value={newFields.expected_graduation || ""} onChange={(e) => setNewFields({ ...newFields, expected_graduation: e.target.value })} className={inputClass} />
                </>
              )}

              {pendingStatus === "university_graduate" && (
                <input type="date" placeholder="New expected graduation date" value={newFields.expected_graduation || ""} onChange={(e) => setNewFields({ ...newFields, expected_graduation: e.target.value })} className={inputClass} />
              )}

              {pendingStatus === "other" && (
                <>
                  <input type="text" placeholder="Organization" value={newFields.organization || ""} onChange={(e) => setNewFields({ ...newFields, organization: e.target.value })} className={inputClass} />
                  <input type="text" placeholder="Your Role" value={newFields.role || ""} onChange={(e) => setNewFields({ ...newFields, role: e.target.value })} className={inputClass} />
                </>
              )}

              <div className="flex gap-3">
                <button
                  onClick={submitStatusChange}
                  disabled={isChangingStatus}
                  className="px-4 py-2 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {isChangingStatus ? "Saving..." : "Confirm Change"}
                </button>
                <button onClick={cancelStatusChange} className="px-4 py-2 text-slate-500 hover:text-slate-700">Cancel</button>
              </div>
            </div>
          )}

          {statusStep === 0 && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" required value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} className={inputClass} />
                <input type="text" placeholder="Last Name" required value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} className={inputClass} />
              </div>

              {status === "high_school" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Age" value={categoryData.age || ""} onChange={(e) => setCategoryData({ ...categoryData, age: e.target.value })} className={inputClass} />
                    <input type="text" placeholder="Grade" value={categoryData.grade || ""} onChange={(e) => setCategoryData({ ...categoryData, grade: e.target.value })} className={inputClass} />
                  </div>
                  <input type="text" placeholder="School Name" value={categoryData.school_name || ""} onChange={(e) => setCategoryData({ ...categoryData, school_name: e.target.value })} className={inputClass} />
                  <input type="date" value={categoryData.graduation_date || ""} onChange={(e) => setCategoryData({ ...categoryData, graduation_date: e.target.value })} className={inputClass} />
                </>
              )}

              {(status === "university_undergrad" || status === "university_graduate") && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Age" value={categoryData.age || ""} onChange={(e) => setCategoryData({ ...categoryData, age: e.target.value })} className={inputClass} />
                    <input type="text" placeholder="Major" value={categoryData.major || ""} onChange={(e) => setCategoryData({ ...categoryData, major: e.target.value })} className={inputClass} />
                  </div>
                  <input type="text" placeholder="University Name" value={categoryData.university_name || ""} onChange={(e) => setCategoryData({ ...categoryData, university_name: e.target.value })} className={inputClass} />
                  <input type="date" value={categoryData.expected_graduation || ""} onChange={(e) => setCategoryData({ ...categoryData, expected_graduation: e.target.value })} className={inputClass} />
                </>
              )}

              {status === "other" && (
                <>
                  <input type="text" placeholder="Organization" value={categoryData.organization || ""} onChange={(e) => setCategoryData({ ...categoryData, organization: e.target.value })} className={inputClass} />
                  <input type="text" placeholder="Your Role" value={categoryData.role || ""} onChange={(e) => setCategoryData({ ...categoryData, role: e.target.value })} className={inputClass} />
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={email} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500" />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                <div className="flex gap-2">
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password (min 6 chars)" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent" />
                  <button type="button" onClick={handlePasswordChange} disabled={isChangingPassword || !newPassword} className="px-6 py-3 bg-[#42A5F5] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 whitespace-nowrap">
                    {isChangingPassword ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>

              {message && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>}
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

              <button type="submit" disabled={isSaving} className="w-full py-3 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-lg hover:scale-[1.02] transition-all disabled:opacity-50">
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}