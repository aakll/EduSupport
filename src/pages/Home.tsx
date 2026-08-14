import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import AuthChoiceModal from "../components/AuthChoiceModal";
import type { UserCategory } from "../components/AuthChoiceModal";

export default function Home() {
  const navigate = useNavigate();
  const [openModalFor, setOpenModalFor] = useState<UserCategory | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    checkAuth();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      },
    );
    setTimeout(() => setMounted(true), 100);
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleCardClick = (category: UserCategory, loggedInPath: string) => {
    if (isLoggedIn) {
      navigate(loggedInPath);
    } else {
      setOpenModalFor(category);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-black overflow-x-hidden">
      {/* --- CSS ANIMATIONS --- */}
      <style>{`
        @keyframes blink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        @keyframes wag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }
        @keyframes steam {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-15px) scale(1.2); opacity: 0; }
        }
        
        /* --- NEW LAYOUT & BUBBLE ANIMATIONS --- */
            
        /* 
            TIMELINE (9s Cycle):
            0-1s: Smile (Empty)
            1-4s: Bubbles Appear (1->2->3)
            4-8s: All Visible (SAD)
            8-11s: Bubbles Disappear Reverse (3->2->1)
            11-12s: Smile (Empty)
        */
        @keyframes moodSwing {
          0%, 30% { d: path("M243 174 Q250 182 257 174"); } /* Smile */
          35%, 75.1% { d: path("M243 178 Q250 172 257 178"); } /* Frown - Ends EXACTLY when Bubble 3 vanishes */
          75.2%, 100% { d: path("M243 174 Q250 182 257 174"); } /* Smile returns immediately after */
        }
        /* Bubble 1 (Exams) - First In, First Out */
        @keyframes bubble1Anim {
          0%, 5% { opacity: 0; transform: scale(0); }
          10%, 70% { opacity: 1; transform: scale(1); }
          75%, 100% { opacity: 0; transform: scale(0); }
        }
        /* Bubble 2 (Major) - Second In, Second Out */
        @keyframes bubble2Anim {
          0%, 15% { opacity: 0; transform: scale(0); }
          20%, 60% { opacity: 1; transform: scale(1); }
          65%, 100% { opacity: 0; transform: scale(0); }
        }
        /* Bubble 3 (Scholarships) - Last In, First Out (Reverse) */
        @keyframes bubble3Anim {
          0%, 25% { opacity: 0; transform: scale(0); }
          30%, 50% { opacity: 1; transform: scale(1); }
          55%, 100% { opacity: 0; transform: scale(0); }
        }

             .animate-blink { transform-origin: center; animation: blink 4s infinite; }
     .animate-wag { transform-origin: bottom left; animation: wag 2s ease-in-out infinite; }
     .animate-steam { animation: steam 2s infinite ease-out; }
     
     /* Mouth Animation */
     .animated-mouth {
       animation: moodSwing 9s infinite ease-in-out;
     }

     /* Base Bubble Styles */
     .bubble-group {
       position: absolute;
       /* No animation on group, handled by children */
     }
     .bubble-dot-1, .bubble-dot-2, .bubble-main {
       position: absolute;
       background: #f0fdf4;
       border: 2px solid #16a34a;
       border-radius: 50%;
       opacity: 0; /* Hidden by default */
       transform: scale(0);
     }
     .bubble-dot-1 { width: 8px; height: 8px; }
     .bubble-dot-2 { width: 14px; height: 14px; }
     .bubble-main { 
       padding: 8px 16px; 
       font-weight: bold; 
       color: #15803d; 
       white-space: nowrap;
       border-radius: 50px;
       border-width: 3px;
     }

     /* --- NEW TIMING (9s Cycle) --- */
     
     /* Group 1 (Exams): Appears 1s-1.6s, Disappears 8.4s-9s */
     .group-1 .bubble-dot-1 { animation: bubble1Anim 9s infinite; animation-delay: 0s; }
     .group-1 .bubble-dot-2 { animation: bubble1Anim 9s infinite; animation-delay: 0.2s; }
     .group-1 .bubble-main  { animation: bubble1Anim 9s infinite; animation-delay: 0.4s; }

     /* Group 2 (Major): Appears 2s-2.6s, Disappears 7.4s-8s */
     .group-2 .bubble-dot-1 { animation: bubble2Anim 9s infinite; animation-delay: 0s; }
     .group-2 .bubble-dot-2 { animation: bubble2Anim 9s infinite; animation-delay: 0.2s; }
     .group-2 .bubble-main  { animation: bubble2Anim 9s infinite; animation-delay: 0.4s; }

     /* Group 3 (Scholarships): Appears 3s-3.6s, Disappears 6.4s-7s (First to go) */
     .group-3 .bubble-dot-1 { animation: bubble3Anim 9s infinite; animation-delay: 0s; }
     .group-3 .bubble-dot-2 { animation: bubble3Anim 9s infinite; animation-delay: 0.2s; }
     .group-3 .bubble-main  { animation: bubble3Anim 9s infinite; animation-delay: 0.4s; }

        /* Hand-drawn border effect */
        .sketch-border {
          border: 3px solid black;
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }
        .sketch-border-green {
          border: 3px solid #16a34a;
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }
      `}</style>

      {/* --- MAIN SPLIT SECTION --- */}
      <main className="flex-1 flex flex-col md:flex-row min-h-[80vh]">
        {/* LEFT SIDE: ILLUSTRATION */}
        <div className="w-full md:w-1/2 flex flex-col justify-between items-center p-8 pt-24 pb-12 relative border-r-0 md:border-r-2 border-black bg-white overflow-hidden">
          {/* Decorative Green Scribble Background */}
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-green-500 rounded-full opacity-20 blur-xl"></div>

          {/* BIG TITLE - Positioned Higher */}
          <h1
            className={`text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600 stroke-black transition-all duration-1000 z-10 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
            style={{ WebkitTextStroke: "2px black" }}
          >
            EduSupport
          </h1>

          {/* THE SCENE (SVG) - Positioned Lower */}
          <div
            className={`relative w-full max-w-lg mt-auto transition-all duration-1000 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <svg
              viewBox="0 0 500 400"
              className="w-full h-auto drop-shadow-xl overflow-visible"
            >
              {/* Desk */}
              <path
                d="M100 350 L400 350 L420 380 L80 380 Z"
                fill="white"
                stroke="black"
                strokeWidth="3"
              />
              <rect
                x="150"
                y="280"
                width="200"
                height="70"
                fill="white"
                stroke="black"
                strokeWidth="3"
              />
              {/* Laptop/Book on desk */}
              <rect
                x="200"
                y="290"
                width="100"
                height="60"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              <path d="M250 290 L250 350" stroke="black" strokeWidth="2" />
              {/* Character Body */}
              <path
                d="M180 280 C180 200, 320 200, 320 280"
                fill="white"
                stroke="black"
                strokeWidth="3"
              />
              {/* Head */}
              <circle
                cx="250"
                cy="160"
                r="50"
                fill="white"
                stroke="black"
                strokeWidth="3"
              />
              {/* Hair (Messy/Sketchy) */}
              <path
                d="M190 160 C180 100, 250 80, 280 90 C320 100, 320 160, 310 180 C330 140, 300 100, 250 100 C200 100, 180 140, 190 160"
                fill="black"
                opacity="0.1"
                stroke="black"
                strokeWidth="2"
              />
              <path
                d="M195 140 Q250 80 305 140"
                fill="none"
                stroke="black"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Eyes (Animated) - CHANGED TO GREEN */}
              <g className="animate-blink">
                <ellipse cx="235" cy="155" rx="4" ry="6" fill="#16a34a" />
                <ellipse cx="265" cy="155" rx="4" ry="6" fill="#16a34a" />
              </g>
              {/* Mouth - Now Animated (Smile -> Sad -> Smile) */}
              <path
                className="animated-mouth"
                d="M243 174 Q250 182 257 174"
                fill="none"
                stroke="black"
                strokeWidth="2"
              />
              {/* Arms */}
              <path
                d="M180 240 Q150 280 200 300"
                fill="none"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M320 240 Q350 280 300 300"
                fill="none"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* COFFEE/PLANT (NOW RIGHT SIDE) */}
              <g transform="translate(360, 300)">
                {/* Cup/Pot */}
                <path
                  d="M10 70 L30 70 L25 30 L15 30 Z"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />
                {/* Steam/Leaves (Animated) - CHANGED TO GREEN */}
                <path
                  className="animate-steam"
                  d="M20 25 Q10 10 20 0"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                />
                <path
                  className="animate-steam"
                  style={{ animationDelay: "0.5s" }}
                  d="M20 25 Q30 10 20 0"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                />
              </g>
              {/* CAT (NOW LEFT SIDE) */}
              <g transform="translate(60, 280)">
                {/* Tail (Animated) - SWAPPED DIRECTION & REDUCED RANGE */}
                <path
                  className="animate-wag"
                  d="M20 50 Q0 30 5 0"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Body */}
                <path
                  d="M10 70 C10 30, 40 30, 40 70"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />
                {/* Head */}
                <circle
                  cx="25"
                  cy="25"
                  r="15"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />
                {/* Ears */}
                <path
                  d="M15 15 L10 0 L25 10"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M35 15 L40 0 L25 10"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />
                {/* Face */}
                <circle cx="20" cy="25" r="1" fill="black" />
                <circle cx="30" cy="25" r="1" fill="black" />
                <path d="M23 30 L27 30" stroke="black" strokeWidth="1" />
              </g>
            </svg>

            {/* --- SEQUENTIAL THOUGHT BUBBLES --- */}
            {/* Positioned absolutely relative to the SVG container, originating near the head (cx=250, cy=160) */}

            {/* Bubble 1: Exams? (Top Left of head) */}
            <div
              className="bubble-group group-1"
              style={{ top: "25%", left: "15%" }}
            >
              <div
                className="bubble-dot-1"
                style={{ bottom: "-30px", left: "60px" }}
              ></div>
              <div
                className="bubble-dot-2"
                style={{ bottom: "-15px", left: "40px" }}
              ></div>
              <div
                className="bubble-main"
                style={{ bottom: "0px", left: "0px" }}
              >
                Exams?
              </div>
            </div>

            {/* Bubble 2: Major? (Top Right of head) */}
            <div
              className="bubble-group group-2"
              style={{ top: "15%", right: "35%" }}
            >
              <div
                className="bubble-dot-1"
                style={{ bottom: "-35px", left: "10px" }}
              ></div>
              <div
                className="bubble-dot-2"
                style={{ bottom: "-18px", left: "25px" }}
              ></div>
              <div
                className="bubble-main"
                style={{ bottom: "0px", left: "40px" }}
              >
                Major?
              </div>
            </div>

            {/* Bubble 3: Scholarships? (Mid Right of head) */}
            <div
              className="bubble-group group-3"
              style={{ top: "30%", right: "28%" }}
            >
              <div
                className="bubble-dot-1"
                style={{ bottom: "-25px", left: "5px" }}
              ></div>
              <div
                className="bubble-dot-2"
                style={{ bottom: "-12px", left: "15px" }}
              ></div>
              <div
                className="bubble-main"
                style={{ bottom: "0px", left: "30px" }}
              >
                Scholarships?
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: CONTENT */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 gap-10 bg-slate-50/50">
          {/* Founder Card */}
          <div
            className={`w-full max-w-md sketch-border-green bg-white p-6 relative transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            {/* Green scribble accent */}
            <div className="absolute -top-3 -left-3 w-full h-full border-2 border-green-500 rounded-lg -z-10 opacity-50"></div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-black flex-shrink-0 bg-gray-100"></div>
              <div>
                <h3 className="text-xl font-bold text-black">Ali Kawar</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                  Founder
                </p>
              </div>
            </div>
            <div className="mt-4 relative">
              <span className="absolute -left-4 -top-2 text-4xl text-green-500 opacity-30 font-serif">
                "
              </span>
              <p className="text-gray-700 italic pl-2 leading-relaxed">
                We believe every student deserves a clear path to their future.
                EduSupport is here to guide you through exams, majors, and
                scholarships.
              </p>
              <span className="absolute -right-2 -bottom-4 text-4xl text-green-500 opacity-30 font-serif">
                "
              </span>
            </div>
          </div>

          {/* Action Buttons (Ovals) */}
          <div
            className={`flex flex-col gap-6 w-full max-w-md items-center transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <button
              onClick={() => handleCardClick("high_school", "/high-school")}
              className="w-full py-5 rounded-[50px] border-[3px] border-black bg-white text-xl font-bold hover:bg-black hover:text-white transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
            >
              High-School Student
            </button>

            <button
              onClick={() => handleCardClick("volunteer", "/volunteer")}
              className="w-full py-5 rounded-[50px] border-[3px] border-black bg-white text-xl font-bold hover:bg-black hover:text-white transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
            >
              Volunteer with us
            </button>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <span className="text-2xl font-black mb-3 block text-white tracking-tighter">
                EduSupport
              </span>
              <div className="flex gap-2 mt-2">
                <div className="w-8 h-1 bg-white"></div>
                <div className="w-4 h-1 bg-white"></div>
                <div className="w-12 h-1 bg-white"></div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-white underline decoration-wavy decoration-green-500">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-white rounded-full"></span> Home
                  </a>
                </li>
                <li>
                  <a
                    href="/scholarships"
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-white rounded-full"></span>{" "}
                    Scholarships
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-white underline decoration-wavy decoration-pink-500">
                Team
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">•</span> Founder
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">•</span> Co-Founders
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">•</span> Volunteers
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm font-mono">
              © {new Date().getFullYear()} EduSupport. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {openModalFor && (
        <AuthChoiceModal
          category={openModalFor}
          onClose={() => setOpenModalFor(null)}
        />
      )}
    </div>
  );
}
