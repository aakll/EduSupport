import { Link } from "react-router-dom";

interface GuestBannerProps {
  redirectTo?: string;
}

export default function GuestBanner({ redirectTo }: GuestBannerProps) {
  return (
    <div className="bg-black border-b-4 border-[#16a34a] px-4 py-3 text-center sticky top-16 z-40 shadow-[0_4px_0_0_rgba(0,0,0,0.5)]">
      <p className="text-sm text-white font-bold tracking-wide flex items-center justify-center gap-2 flex-wrap">
        <span className="bg-white text-black px-2 py-0.5 rounded text-xs uppercase font-black">Guest Mode</span>
        Your saved scholarships and preferences will not be tracked.
        <Link
          to="/login"
          state={redirectTo ? { redirectTo } : undefined}
          className="underline decoration-2 underline-offset-2 hover:text-[#16a34a] transition-colors font-black ml-1 text-white"
        >
          Sign in to save progress →
        </Link>
      </p>
    </div>
  );
}