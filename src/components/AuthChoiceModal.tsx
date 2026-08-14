import { useNavigate } from "react-router-dom";

export type UserCategory = "high_school" | "university" | "other" | "volunteer";

interface CategoryConfig {
  label: string;
  guestPath: string;
  // We keep these for logic, but styling is now unified
  iconBg: string;
  iconColor: string;
}

export const CATEGORY_CONFIG: Record<UserCategory, CategoryConfig> = {
  high_school: {
    label: "High School Student",
    guestPath: "/high-school",
    iconBg: "bg-green-100",
    iconColor: "text-[#16a34a]",
  },
  university: {
    label: "University Student",
    guestPath: "/university",
    iconBg: "bg-green-100",
    iconColor: "text-[#16a34a]",
  },
  other: {
    label: "Other",
    guestPath: "/dashboard",
    iconBg: "bg-gray-100",
    iconColor: "text-black",
  },
  volunteer: {
    label: "Volunteer with Us",
    guestPath: "/volunteer",
    iconBg: "bg-green-100",
    iconColor: "text-[#16a34a]",
  },
};

interface AuthChoiceModalProps {
  category: UserCategory;
  onClose: () => void;
}

export default function AuthChoiceModal({
  category,
  onClose,
}: AuthChoiceModalProps) {
  const navigate = useNavigate();
  const config = CATEGORY_CONFIG[category];

  const handleSignup = () => {
    onClose();
    navigate("/signup", { state: { category } });
  };

  const handleLogin = () => {
    onClose();
    navigate("/login", { state: { redirectTo: config.guestPath } });
  };

  const handleGuest = () => {
    onClose();
    navigate(config.guestPath, { state: { guestWarning: true } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container - Sketchy Style */}
      <div className="bg-white max-w-md w-full p-8 relative transform transition-all scale-100 border-[3px] border-black rounded-[20px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Decorative Green Offset Border (like Home cards) */}
        <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#16a34a] rounded-[25px] -z-10 opacity-60 pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors border-2 border-transparent hover:border-black"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-8 mt-2">
          {/* Icon Circle */}
          <div
            className={`w-16 h-16 ${config.iconBg} border-[3px] border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
          >
            <svg
              className={`w-8 h-8 ${config.iconColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

          <h3 className="text-2xl font-black text-black tracking-tight uppercase">
            {config.label}
          </h3>
          <p className="text-gray-500 mt-2 font-medium">
            Choose how you'd like to continue
          </p>
        </div>

        <div className="space-y-4">
          {/* Primary Action: Sign Up (Green/Black Style) */}
          <button
            onClick={handleSignup}
            className="w-full py-4 bg-white text-black text-lg font-bold rounded-[50px] border-[3px] border-black hover:bg-[#16a34a] transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
          >
            Sign Up
          </button>

          {/* Secondary Action: Log In (White/Black Style) */}
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-white text-black text-lg font-bold rounded-[50px] border-[3px] border-black hover:bg-[#16a34a] transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
          >
            Log In
          </button>

          {/* Tertiary Action: Guest */}
          <button
            onClick={handleGuest}
            className="w-full py-3 mt-2 text-black font-bold bg-[#16a34a]/20 hover:bg-[#16a34a] hover:text-white border-2 border-[#16a34a] rounded-xl transition-all text-sm uppercase tracking-wide"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
