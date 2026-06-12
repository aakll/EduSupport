
{/*
interface TeamMember {
  name: string;
  role: string;
  email: string;
  linkedin: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "D",
    role: "",
    email: "E",
    linkedin: "",
  },
  {
    name: "C",
    role: "s",
    email: "e",
    linkedin: "a",
  },
  {
    name: "B",
    role: "",
    email: "e",
    linkedin: "",
  },
  {
    name: "A",
    role: "",
    email: "e",
    linkedin: "",
  },
]; */}

export default function Home() {

  return (

    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* Background image and overlay */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">EduSupport</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Your Gateway to Academic Success</h2>
          <p className="text-lg text-white/90 mb-10">Guide for students in Lebanon to find scholarships</p>

          // Action Cards
          <div className="grid gap-4">
            {["High School Student", "Undergraduate Student", "Volunteer with Us"].map((card, i) => (

              <button key={card}

                className={`group bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent ${i === 0 ? "hover:border-[#4CAF50]" : i === 1 ? "hover:border-[#42A5F5]" : "hover:border-[#81C784]"}`}>

                <div className="flex items-center gap-4">

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${i === 0 ? "bg-gradient-to-br from-[#4CAF50] to-[#81C784]" : i === 1 ? "bg-gradient-to-br from-[#42A5F5] to-[#90CAF9]" : "bg-gradient-to-br from-[#81C784] to-[#4CAF50]"}`}>
                  </div>

                  <span className="text-xl font-bold text-gray-900 flex-1 text-left">{card}</span>

                  <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>

                </div>

              </button>
            ))}
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#1a4d2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="grid md:grid-cols-3 gap-12">

            {/*  About section */}
            <div>
              <span className="text-xl font-bold mb-4 block">EduSupport</span>
              <p className="text-gray-300 leading-relaxed">Dedicated to empowering Lebanese students with access to scholarships, universities, and career opportunities.</p>
            </div>

            {/* Quick Links section */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[["Home", "/"], ["Scholarships", "/scholarships"]].map(([label, path]) => (
                  <li key={path}><a href={path} className="text-gray-300 hover:text-[#4CAF50] transition-colors">{label}</a></li>
                ))}
              </ul>
            </div>

            {/* Team section */}
            {/*
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Team</h4>
              <div className="grid grid-cols-2 gap-4">
                {teamMembers.map(member => (
                  <div key={member.name} className="group relative text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] rounded-full flex items-center justify-center text-xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.role}</p>
                    <div className="absolute inset-0 bg-slate-900/95 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                      <p className="text-xs text-[#4CAF50] mb-1">📧 {member.email}</p>
                      <p className="text-xs text-[#42A5F5]">🔗 {member.linkedin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            */}


          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} EduSupport. Made with ❤️ for students.</p>
          </div>

        </div>
      </footer>

    </div>

  );
}