import { Link } from "react-router-dom";

interface GuestBannerProps {
  redirectTo?: string;
}

export default function GuestBanner({ redirectTo }: GuestBannerProps) {
  return (
    <div className="w-full flex justify-center pt-4 px-4 sticky top-20 z-40 pointer-events-none">
      <div className="bg-white border-2 border-black rounded-full px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 pointer-events-auto max-w-2xl">
        <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
          Guest
        </span>
        <p className="text-sm text-black font-medium truncate">
          Preferences not tracked.{" "}
          <Link
            to="/login"
            state={redirectTo ? { redirectTo } : undefined}
            className="font-bold underline decoration-2 underline-offset-2 hover:text-[#16a34a] transition-colors whitespace-nowrap"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}