import { useNavigate } from "react-router-dom";

export type UserCategory = "high_school" | "university" | "other" | "volunteer";

interface CategoryConfig {
  label: string;
  guestPath: string;       // where "Continue as Guest" sends them
  iconBg: string;           // tailwind bg class for icon circle
  iconColor: string;        // tailwind text class for icon
  gradientFrom: string;
  gradientTo: string;
}

export const CATEGORY_CONFIG: Record<UserCategory, CategoryConfig> = {
  high_school: {
    label: "High School Student",
    guestPath: "/high-school",
    iconBg: "bg-green-100",
    iconColor: "text-[#4CAF50]",
    gradientFrom: "from-[#4CAF50]",
    gradientTo: "to-[#42A5F5]",
  },
  university: {
    label: "University Student",
    guestPath: "/university",
    iconBg: "bg-blue-100",
    iconColor: "text-[#42A5F5]",
    gradientFrom: "from-[#42A5F5]",
    gradientTo: "to-indigo-500",
  },
  other: {
    label: "Other",
    guestPath: "/dashboard",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    gradientFrom: "from-slate-500",
    gradientTo: "to-slate-700",
  },
  volunteer: {
    label: "Volunteer with Us",
    guestPath: "/volunteer",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    gradientFrom: "from-red-400",
    gradientTo: "to-red-600",
  },
};

interface AuthChoiceModalProps {
  category: UserCategory;
  onClose: () => void;
}

export default function AuthChoiceModal({ category, onClose }: AuthChoiceModalProps) {
  const navigate = useNavigate();
  const config = CATEGORY_CONFIG[category];

  const handleSignup = () => {
    onClose();
    // Pass the category along so Signup.tsx knows which fields/table to use
    navigate("/signup", { state: { category } });
  };

  const handleLogin = () => {
    onClose();
    navigate("/login", { state: { redirectTo: config.guestPath } });
  };

  const handleGuest = () => {
    onClose();
    // Guests land on the category page with a visible, consistent warning
    navigate(config.guestPath, { state: { guestWarning: true } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative transform transition-all scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className={`w-14 h-14 ${config.iconBg} ${config.iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{config.label}</h3>
          <p className="text-gray-500 mt-2">Choose how you'd like to continue</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSignup}
            className={`w-full py-3.5 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all`}
          >
            Sign Up
          </button>

          <button
            onClick={handleLogin}
            className="w-full py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Log In
          </button>

          <button
            onClick={handleGuest}
            className="w-full py-3 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}