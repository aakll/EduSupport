import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
    color: "from-blue-500 to-indigo-600",
    path: "/scholarships/mepi",
    image:
      "https://th.bing.com/th/id/R.ebe4fcfce02d27babc125b01a3c74945?rik=rgySSwULdNe80w&pid=ImgRaw&r=0",
  },
  {
    name: "ULYP",
    desc: "Undergraduate Lebanon Youth Program for top Lebanese students.",
    color: "from-emerald-500 to-teal-600",
    path: "/scholarships/ulyp",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.d-_rNnvbWdzXi6UKQ84aYQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "LIFE",
    desc: "Lebanese International Future Education global opportunities.",
    color: "from-violet-500 to-purple-600",
    path: "/scholarships/life",
    image:
      "https://www.scholarhunter.com/wp-content/uploads/2023/10/LIFE-Scholarships-programme-768x576.jpg",
  },
  {
    name: "Habeeb",
    desc: "Community-driven fund for underprivileged high school graduates.",
    color: "from-green-500 to-emerald-600",
    path: "/scholarships/habeeb",
    image:
      "https://static.wixstatic.com/media/d895be_806800b2b18f4176abd0b8e29ad1967a~mv2.png/v1/fill/w_429,h_78,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/d895be_806800b2b18f4176abd0b8e29ad1967a~mv2.png",
  },
  {
    name: "Tomooh",
    desc: "Ambition-focused mentorship and financial aid program.",
    color: "from-orange-500 to-amber-600",
    path: "/scholarships/tomooh",
    image:
      "https://www.middleeast.pepsico.com/images/middleeastksalibraries/lebanon/tomooh-scholarship.png?Status=Master",
  },
  {
    name: "Tarraf",
    desc: "Bridging higher education gaps for rural communities.",
    color: "from-cyan-500 to-blue-600",
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
    <div className="min-h-screen bg-white page-enter">
      {isGuest && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center sticky top-16 z-40">
          <p className="text-sm text-amber-800 font-medium">
            ⚠️ You are browsing as a guest. Your saved scholarships and
            preferences will not be tracked.{" "}
            <Link
              to="/login"
              className="underline hover:text-amber-900 transition-colors"
            >
              Sign in to save your progress
            </Link>
          </p>
        </div>
      )}

      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto"></div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        {/* Programs Grid - Same Box Style */}
        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((p) => (
            <Link
              key={p.name}
              to={p.path}
              className="group bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 block relative"
            >
              {/* Top Accent Bar - Uses program specific gradient */}
              <div className={`h-2 bg-gradient-to-r ${p.color}`} />

              <div className="p-8 md:p-12 text-center">
                {/* Title */}
                <h2 className="text-3xl font-bold text-slate-900 mb-3 group-hover:text-[#4CAF50] transition-colors">
                  {p.name}
                </h2>

                {/* Description */}
                <p className="text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed min-h-[4rem]">
                  {p.desc}
                </p>

                {/* Action Button */}
                <div
                  className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${p.color} text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-lg`}
                >
                  View Program
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m5-4H3"
                    />
                  </svg>
                </div>

                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity"
                  style={{ backgroundImage: `url('${p.image}')` }}
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="my-12">
          <hr className="border-slate-200" />
        </div>

        {/* All Opportunities Section */}
        <section id="all-scholarships" className="pb-16">
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((s) => (
              <div
                key={s.id}
                className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white"
              >
                <h2 className="font-bold text-lg text-slate-900">{s.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {s.university} — {s.country}
                </p>
                <p className="mt-3 text-slate-700 text-sm leading-relaxed line-clamp-3">
                  {s.description}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-500">
                    Deadline: {s.deadline}
                  </span>
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4CAF50] font-semibold text-sm hover:underline"
                  >
                    Apply →
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
