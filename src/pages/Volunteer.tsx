import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import GuestBanner from "../components/GuestBanner";

type AppStatus = "not_applied" | "pending" | "approved" | "rejected";

const SCHOLARSHIPS = [
  "MEPI",
  "USAID",
  "ULYP",
  "LIFE",
  "Habeeb",
  "Tomooh",
  "Tarraf",
];
const LEVELS = ["1st year", "2nd year", "3rd year", "4th year", "5th year"];

//added
const EXAM_TYPES = ["SAT", "IELTS", "TOEFL"];
//

export default function Volunteer() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [appStatus, setAppStatus] = useState<AppStatus>("not_applied");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExamExpanded, setIsExamExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [scholarshipReceived, setScholarshipReceived] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [level, setLevel] = useState("");
  const [graduationDate, setGraduationDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  //added
  const [examAppStatus, setExamAppStatus] = useState<AppStatus>("not_applied");
  const [showExamForm, setShowExamForm] = useState(false);
  const [examType, setExamType] = useState(" ");
  const [scoreReceived, setScoreReceived] = useState(" ");
  const [examFirstName, setExamFirstName] = useState(" ");
  const [examLastName, setExamLastName] = useState(" ");
  const [examUniversity, setExamUniversity] = useState(" ");
  const [examMajor, setExamMajor] = useState(" ");
  const [examLevel, setExamLevel] = useState(" ");
  const [examGraduationDate, setExamGraduationDate] = useState(" ");
  const [examPhoneNumber, setExamPhoneNumber] = useState(" ");
  const [examIsSubmitting, setExamIsSubmitting] = useState(false);
  const [examMessage, setExamMessage] = useState("");
  const [examError, setExamError] = useState("");
  //

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
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

        //added
        const { data: examData } = await supabase
          .from("volunteer_applications")
          .select("status")
          .eq("user_id", session.user.id)
          .eq("role_applied_for", "Exam Mentor")
          .maybeSingle();
        if (examData) setExamAppStatus(examData.status as AppStatus);
        //
      }
      setIsCheckingAuth(false);
    };
    init();
  }, []);

  const goToLogin = () =>
    navigate("/login", { state: { redirectTo: "/volunteer" } });

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (
      !firstName ||
      !lastName ||
      !scholarshipReceived ||
      !university ||
      !major ||
      !level ||
      !graduationDate ||
      !phoneNumber
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    setMessage("");
    setError("");

    const { error: insertError } = await supabase
      .from("volunteer_applications")
      .insert([
        {
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
          phoneNumber: phoneNumber,
          status: "pending",
        },
      ]);

    if (insertError) {
      setError("Failed to submit: " + insertError.message);
    } else {
      setAppStatus("pending");
      setMessage("Application submitted!");
      setTimeout(() => setShowForm(false), 1200);
    }
    setIsSubmitting(false);
  };

  //added
  const handleExamApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (
      !examFirstName ||
      !examLastName ||
      !examType ||
      !scoreReceived ||
      !examUniversity ||
      !examMajor ||
      !examLevel ||
      !examGraduationDate ||
      !examPhoneNumber
    ) {
      setExamError("Please fill in all required fields.");
      return;
    }
    setExamIsSubmitting(true);
    setExamMessage("");
    setExamError("");

    const { error: insertError } = await supabase
      .from("volunteer_applications")
      .insert([
        {
          user_id: userId,
          role_applied_for: "Exam Mentor",
          first_name: examFirstName,
          last_name: examLastName,
          email: userEmail,
          scholarship_received: null, // Keep null for this role
          exam_type: examType,
          exam_score: scoreReceived,
          university: examUniversity,
          major: examMajor,
          level: examLevel,
          graduation_date: examGraduationDate,
          phoneNumber: examPhoneNumber,
          status: "pending",
        },
      ]);
    if (insertError) {
      setExamError("Failed to submit: " + insertError.message);
    } else {
      setExamAppStatus("pending");
      setExamMessage("Application submitted!");
      setTimeout(() => setShowExamForm(false), 1200);
    }
    setExamIsSubmitting(false);
  };
  //

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="text-black font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  // Reusable Input Style
  const inputClass =
    "w-full px-4 py-3 border-[3px] border-black rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-black transition-all font-medium";

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {!userId && <GuestBanner redirectTo="/volunteer" />}
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden border-b-4 border-black">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage:
              "url('https://conantcrier.com/wp-content/uploads/2020/10/image.png')",
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-black tracking-tighter text-black mb-4 uppercase"
            style={{ WebkitTextStroke: "1px black" }}
          >
            Volunteer
          </h1>
          <p className="text-lg font-bold bg-white max-w-xl mx-auto">
            Join our community of volunteers empowering students in Lebanon
          </p>
        </div>
      </section>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Card */}
        <div className="bg-white border-[3px] border-black rounded-[20px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-8 relative">
          {/* Green Accent Line */}
          <div className="h-3 bg-[#16a34a] w-full"></div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-8 md:p-10 text-left flex items-center justify-between group hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full border-[3px] border-black bg-green-50 flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <svg
                  className="w-8 h-8 text-[#16a34a]"
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
              <div>
                <h2 className="text-2xl font-black text-black group-hover:text-[#16a34a] transition-colors uppercase tracking-tight">
                  Become a Mentor
                </h2>
                <p className="text-sm font-bold text-gray-500 mt-1">
                  Help students with scholarship applications
                </p>
              </div>
            </div>
            <svg
              className={`w-8 h-8 text-black transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="px-8 md:px-10 pb-10 pt-2 border-t-2 border-dashed border-gray-200">
              <p className="text-gray-700 font-medium leading-relaxed mb-4 text-lg">
                Guide high school students through the scholarship application
                process by doing any of the following:
              </p>
              <ol className="text-gray-700 leading-relaxed mb-6 list-decimal list-inside space-y-2 font-medium marker:text-[#16a34a] marker:font-black">
                <li>Introduce the scholarship and what it provides.</li>
                <li>
                  Assist students in understanding the eligibility criteria and
                  requirements.
                </li>
                <li>
                  Give them tips on how to present themselves effectively in
                  their applications, including writing compelling essays and
                  preparing for interviews.
                </li>
                <li>
                  State your experience applying for this scholarship and the
                  challenges you faced, so they can learn from your journey.
                </li>
                <li>
                  Highlight the skills you had and you believe were important
                  for your acceptance, and how they can develop those skills.
                </li>
                <li>Walk them through the application process.</li>
                <li>
                  Provide useful resources and references to help them succeed.
                </li>
                You can provide the content either as written or as a video, or
                both.
              </ol>

              {/* Status / Action Area */}
              {!userId && (
                <div className="bg-gray-100 border-[3px] border-black rounded-xl p-6 text-center shadow-[4px_4px_0px_0px_rgba(22,163,74,1)]">
                  <p className="text-black font-bold mb-4 text-lg">
                    Sign in to apply as a volunteer.
                  </p>
                  <button
                    onClick={goToLogin}
                    className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-[#16a34a] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none"
                  >
                    Log In to Apply
                  </button>
                </div>
              )}

              {userId && appStatus === "approved" && (
                <div className="bg-green-50 border-[3px] border-[#16a34a] rounded-xl p-6 text-center">
                  <p className="text-[#15803d] font-black text-xl uppercase">
                    🎉 Approved Volunteer
                  </p>
                  <p className="text-green-800 font-medium mt-2">
                    Thank you for contributing!
                  </p>
                </div>
              )}

              {userId && appStatus === "pending" && (
                <div className="bg-yellow-50 border-[3px] border-black rounded-xl p-6 text-center">
                  <p className="text-black font-black text-xl uppercase">
                    Under Review
                  </p>
                  <p className="text-gray-700 font-medium mt-2">
                    We'll be in touch soon.
                  </p>
                </div>
              )}

              {userId && appStatus === "rejected" && (
                <div className="bg-red-50 border-[3px] border-red-600 rounded-xl p-6 text-center">
                  <p className="text-red-700 font-black text-xl uppercase">
                    Application Declined
                  </p>
                  <p className="text-red-800 font-medium mt-2">
                    Feel free to reach out if circumstances change.
                  </p>
                </div>
              )}

              {userId && appStatus === "not_applied" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-4 bg-[#16a34a] text-white text-lg font-black rounded-[50px] border-[3px] border-black hover:bg-black transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] uppercase tracking-wide"
                >
                  Fill Out Application
                </button>
              )}
            </div>
          </div>
        </div>
        //added
        {/* SECOND CARD: EXAM MENTOR */}
        <div className="bg-white border-[3px] border-black rounded-[20px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-8 relative">
          <div className="h-3 bg-[#16a34a] w-full"></div>
          <button
            onClick={() => setIsExamExpanded(!isExamExpanded)} 
            className="w-full p-8 md:p-10 text-left flex items-center justify-between group hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full border-[3px] border-black bg-green-50 flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <svg
                  className="w-8 h-8 text-[#16a34a]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-black group-hover:text-[#16a34a] transition-colors uppercase tracking-tight">
                  Become an Exam Mentor
                </h2>
                <p className="text-sm font-bold text-gray-500 mt-1">
                  Help students prepare for SAT, IELTS, TOEFL
                </p>
              </div>
            </div>
            <svg
              className={`w-8 h-8 text-black transition-transform duration-300 ${isExamExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${isExamExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="px-8 md:px-10 pb-10 pt-2 border-t-2 border-dashed border-gray-200">
              <p className="text-gray-700 font-medium leading-relaxed mb-4 text-lg">
                Guide high school students through standardized test preparation
                by sharing your strategies and resources.
              </p>

              {/* Status / Action Area for Exam Mentor */}
              {!userId && (
                <div className="bg-gray-100 border-[3px] border-black rounded-xl p-6 text-center shadow-[4px_4px_0px_0px_rgba(22,163,74,1)]">
                  <p className="text-black font-bold mb-4 text-lg">
                    Sign in to apply as an exam volunteer.
                  </p>
                  <button
                    onClick={goToLogin}
                    className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-[#16a34a] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none"
                  >
                    Log In to Apply
                  </button>
                </div>
              )}
              {userId && examAppStatus === "approved" && (
                <div className="bg-green-50 border-[3px] border-[#16a34a] rounded-xl p-6 text-center">
                  <p className="text-[#15803d] font-black text-xl uppercase">
                    🎉 Approved Exam Volunteer
                  </p>
                  <p className="text-green-800 font-medium mt-2">
                    Thank you for contributing!
                  </p>
                </div>
              )}
              {userId && examAppStatus === "pending" && (
                <div className="bg-yellow-50 border-[3px] border-black rounded-xl p-6 text-center">
                  <p className="text-black font-black text-xl uppercase">
                    Under Review
                  </p>
                  <p className="text-gray-700 font-medium mt-2">
                    We'll be in touch soon.
                  </p>
                </div>
              )}
              {userId && examAppStatus === "rejected" && (
                <div className="bg-red-50 border-[3px] border-red-600 rounded-xl p-6 text-center">
                  <p className="text-red-700 font-black text-xl uppercase">
                    Application Declined
                  </p>
                  <p className="text-red-800 font-medium mt-2">
                    Feel free to reach out if circumstances change.
                  </p>
                </div>
              )}
              {userId && examAppStatus === "not_applied" && (
                <button
                  onClick={() => setShowExamForm(true)}
                  className="w-full py-4 bg-[#16a34a] text-white text-lg font-black rounded-[50px] border-[3px] border-black hover:bg-black transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] uppercase tracking-wide"
                >
                  Fill Out Application
                </button>
              )}
            </div>
          </div>
        </div>
        //
      </main>
      {/* Application Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 py-10">
          <div className="bg-white border-[3px] border-black rounded-[20px] shadow-[8px_8px_0px_0px_rgba(22,163,74,1)] max-w-2xl w-full my-8">
            {/* Modal Header */}
            <div className="border-b-[3px] border-black p-6 bg-gray-50 rounded-t-[17px]">
              <h2 className="text-2xl font-black text-black uppercase tracking-tight">
                Mentor Application
              </h2>
              <p className="text-sm font-bold text-gray-500 mt-1">* Required</p>
            </div>

            <form onSubmit={handleApply} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  disabled
                  className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass}
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass}
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                  Scholarship Received
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SCHOLARSHIPS.map((s) => (
                    <label
                      key={s}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${scholarshipReceived === s ? "border-[#16a34a] bg-green-50" : "border-gray-200 hover:border-black"}`}
                    >
                      <input
                        type="radio"
                        name="scholarship"
                        required
                        value={s}
                        checked={scholarshipReceived === s}
                        onChange={(e) => setScholarshipReceived(e.target.value)}
                        className="w-4 h-4 text-[#16a34a] focus:ring-[#16a34a] border-gray-300"
                      />
                      <span className="font-bold text-sm">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    University
                  </label>
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className={inputClass}
                    placeholder="AUB"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    Major
                  </label>
                  <input
                    type="text"
                    required
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className={inputClass}
                    placeholder="CS"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                  Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((l) => (
                    <label
                      key={l}
                      className={`cursor-pointer px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${level === l ? "bg-black text-white border-black" : "bg-white text-black border-gray-300 hover:border-black"}`}
                    >
                      <input
                        type="radio"
                        name="level"
                        value={l}
                        checked={level === l}
                        onChange={(e) => setLevel(e.target.value)}
                        className="hidden"
                      />
                      {l}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={inputClass}
                    placeholder="..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                  Graduation Date
                </label>
                <input
                  type="date"
                  required
                  value={graduationDate}
                  onChange={(e) => setGraduationDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              {message && (
                <div className="p-3 bg-green-50 border-[2px] border-[#16a34a] rounded-lg text-[#15803d] text-sm font-bold">
                  {message}
                </div>
              )}
              {error && (
                <div className="p-3 bg-red-50 border-[2px] border-red-600 rounded-lg text-red-700 text-sm font-bold">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-black font-bold text-sm uppercase tracking-wide"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#16a34a] text-white font-bold rounded-full border-2 border-black hover:bg-black transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      //added
      {/* EXAM APPLICATION MODAL */}
      {showExamForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 py-10">
          <div className="bg-white border-[3px] border-black rounded-[20px] shadow-[8px_8px_0px_0px_rgba(22,163,74,1)] max-w-2xl w-full my-8">
            <div className="border-b-[3px] border-black p-6 bg-gray-50 rounded-t-[17px]">
              <h2 className="text-2xl font-black text-black uppercase tracking-tight">
                Exam Mentor Application
              </h2>
              <p className="text-sm font-bold text-gray-500 mt-1">* Required</p>
            </div>
            <form onSubmit={handleExamApply} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  disabled
                  className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={examFirstName}
                    onChange={(e) => setExamFirstName(e.target.value)}
                    className={inputClass}
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={examLastName}
                    onChange={(e) => setExamLastName(e.target.value)}
                    className={inputClass}
                    placeholder=""
                  />
                </div>
              </div>

              {/* EXAM TYPE SELECTION */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                  Exam Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {EXAM_TYPES.map((s) => (
                    <label
                      key={s}
                      className={`flex items-center justify-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${examType === s ? "border-[#16a34a] bg-green-50" : "border-gray-200 hover:border-black"}`}
                    >
                      <input
                        type="radio"
                        name="examType"
                        required
                        value={s}
                        checked={examType === s}
                        onChange={(e) => setExamType(e.target.value)}
                        className="hidden"
                      />
                      <span className="font-bold text-sm">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SCORE INPUT */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                  Score Received
                </label>
                <input
                  type="text"
                  required
                  value={scoreReceived}
                  onChange={(e) => setScoreReceived(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 1450, 7.5, 105"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    University
                  </label>
                  <input
                    type="text"
                    required
                    value={examUniversity}
                    onChange={(e) => setExamUniversity(e.target.value)}
                    className={inputClass}
                    placeholder="AUB"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    Major
                  </label>
                  <input
                    type="text"
                    required
                    value={examMajor}
                    onChange={(e) => setExamMajor(e.target.value)}
                    className={inputClass}
                    placeholder="CS"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                  Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((l) => (
                    <label
                      key={l}
                      className={`cursor-pointer px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${examLevel === l ? "bg-black text-white border-black" : "bg-white text-black border-gray-300 hover:border-black"}`}
                    >
                      <input
                        type="radio"
                        name="examLevel"
                        value={l}
                        checked={examLevel === l}
                        onChange={(e) => setExamLevel(e.target.value)}
                        className="hidden"
                      />
                      {l}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={examPhoneNumber}
                    onChange={(e) => setExamPhoneNumber(e.target.value)}
                    className={inputClass}
                    placeholder="..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2 ml-1">
                  Graduation Date
                </label>
                <input
                  type="date"
                  required
                  value={examGraduationDate}
                  onChange={(e) => setExamGraduationDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              {examMessage && (
                <div className="p-3 bg-green-50 border-[2px] border-[#16a34a] rounded-lg text-[#15803d] text-sm font-bold">
                  {examMessage}
                </div>
              )}
              {examError && (
                <div className="p-3 bg-red-50 border-[2px] border-red-600 rounded-lg text-red-700 text-sm font-bold">
                  {examError}
                </div>
              )}
              <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowExamForm(false)}
                  className="text-gray-500 hover:text-black font-bold text-sm uppercase tracking-wide"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={examIsSubmitting}
                  className="px-8 py-3 bg-[#16a34a] text-white font-bold rounded-full border-2 border-black hover:bg-black transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] disabled:opacity-50"
                >
                  {examIsSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
