import { Link } from "react-router-dom";

interface GuestBannerProps {
  redirectTo?: string; // where Login should send them back to after signing in
}

export default function GuestBanner({ redirectTo }: GuestBannerProps) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center sticky top-16 z-40">
      <p className="text-sm text-amber-800 font-medium">
        ⚠️ You are browsing as a guest. Your saved scholarships and preferences will not be tracked.{" "}
        <Link
          to="/login"
          state={redirectTo ? { redirectTo } : undefined}
          className="underline hover:text-amber-900 transition-colors"
        >
          Sign in to save your progress
        </Link>
      </p>
    </div>
  );
}