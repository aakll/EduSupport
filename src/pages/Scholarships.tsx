import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import GuestBanner from "../components/GuestBanner"; // Assuming you want to use the component now

interface Scholarship {
  id: string;
  title: string;
  description: string;
  deadline: string;
  amount: string;
  university: string;
  country: string;
  link: string;
}

const programs = [
  {
    name: "MEPI",
    desc: "Full Funded. For HighSchool Students intersted in LAU and AUB.",
    path: "/scholarships/mepi",
    image:
      "https://th.bing.com/th/id/R.ebe4fcfce02d27babc125b01a3c74945?rik=rgySSwULdNe80w&pid=ImgRaw&r=0",
  },
  {
    name: "ULYP",
    desc: "Undergraduate Lebanon Youth Program for top Lebanese students.",
    path: "/scholarships/ulyp",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.d-_rNnvbWdzXi6UKQ84aYQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "LIFE",
    desc: "Lebanese International Future Education global opportunities.",
    path: "/scholarships/life",
    image:
      "https://www.scholarhunter.com/wp-content/uploads/2023/10/LIFE-Scholarships-programme-768x576.jpg",
  },
  {
    name: "Habeeb",
    desc: "Community-driven fund for underprivileged high school graduates.",
    path: "/scholarships/habeeb",
    image:
      "https://static.wixstatic.com/media/d895be_806800b2b18f4176abd0b8e29ad1967a~mv2.png/v1/fill/w_429,h_78,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/d895be_806800b2b18f4176abd0b8e29ad1967a~mv2.png",
  },
  {
    name: "Tomooh",
    desc: "Ambition-focused mentorship and financial aid program.",
    path: "/scholarships/tomooh",
    image:
      "https://www.middleeast.pepsico.com/images/middleeastksalibraries/lebanon/tomooh-scholarship.png?Status=Master",
  },
  {
    name: "Tarraf",
    desc: "Bridging higher education gaps for rural communities.",
    path: "/scholarships/tarraf",
    image:
      "https://cdn.firespring.com/images/880a2126-e1e4-4421-8500-d3da4fb69cf7.png",
  },
];

export default function Scholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("scholarships")
        .select("*")
        .order("deadline", { ascending: true });
      if (data) setScholarships(data);
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) setIsGuest(true);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Using the GuestBanner component for consistency, or keep your inline version if preferred */}
      {isGuest && <GuestBanner redirectTo="/scholarships" />}

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden border-b-4 border-black bg-gray-100">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" 
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=80')",
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-black tracking-tighter text-black mb-4 uppercase"
            style={{ WebkitTextStroke: "1px black" }}
          >
            Scholarships
          </h1>
          <p className="text-lg font-bold text-gray-600">Find your funding.</p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Programs Grid - RESTORED IMAGES, UNIFIED STYLE */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {programs.map((p) => (
            <Link
              key={p.name}
              to={p.path}
              className="group bg-white border-[3px] border-black rounded-[20px] p-0 relative overflow-hidden hover:bg-black hover:text-white transition-colors duration-300 shadow-[8px_8px_0px_0px_rgba(22,163,74,1)] active:shadow-none active:translate-x-[8px] active:translate-y-[8px] flex flex-col h-full"
            >
              {/* Top Accent Bar - Now Solid Green instead of gradient */}
              <div className="h-2 bg-[#16a34a] w-full group-hover:bg-white transition-colors" />

              <div className="p-8 md:p-10 text-center relative z-10 flex flex-col h-full">
                {/* Title */}
                <h2 className="text-2xl font-black mb-3 uppercase tracking-tight relative z-20">
                  {p.name}
                </h2>

                {/* Description */}
                <p className="text-gray-600 group-hover:text-gray-300 font-medium mb-8 flex-grow relative z-20 leading-relaxed">
                  {p.desc}
                </p>

                {/* Action Button - Outline style that fills on hover */}
                <div className="mt-auto relative z-20">
                  <span className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black group-hover:border-white text-black group-hover:text-white font-bold rounded-full transition-all text-sm uppercase tracking-wide group-hover:bg-[#16a34a] group-hover:border-[#16a34a]">
                    View Program
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>

                {/* BACKGROUND IMAGE - Restored but Grayscale/Opacity to fit theme */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity grayscale pointer-events-none"
                  style={{ backgroundImage: `url('${p.image}')` }}
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-12">
          <div className="h-1 bg-black flex-grow"></div>
          <span className="font-black text-xl uppercase tracking-widest text-[#16a34a]">
            All Opportunities
          </span>
          <div className="h-1 bg-black flex-grow"></div>
        </div>

        {/* All Opportunities List */}
        <section id="all-scholarships">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((s) => (
              <div
                key={s.id}
                className="border-[3px] border-black rounded-xl p-6 bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col"
              >
                <h2 className="font-black text-xl text-black mb-1 uppercase">
                  {s.title}
                </h2>
                <p className="text-xs font-bold text-[#16a34a] uppercase tracking-wide mb-3">
                  {s.university} — {s.country}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow font-medium">
                  {s.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-dashed border-gray-200">
                  <span className="text-xs font-bold text-black bg-gray-100 px-2 py-1 rounded">
                    {s.deadline}
                  </span>
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black font-black text-sm hover:text-[#16a34a] transition-colors flex items-center gap-1"
                  >
                    APPLY <span className="text-lg">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
