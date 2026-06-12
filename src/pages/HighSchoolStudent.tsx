import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function HighSchoolStudent() {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setIsGuest(true);
      }
    };
    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Guest Warning Banner */}
      {isGuest && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-center">
          <p className="text-sm text-yellow-800">
            ⚠️ You are browsing as a guest. Your progress and preferences will not be saved.{" "}
            <a href="/login" className="font-semibold underline hover:text-yellow-900">
              Sign in to save your info
            </a>
          </p>
        </div>
      )}

      {/* Scholarships Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scholarships for High School Students</h1>
        <p className="text-gray-600 mb-8">Find scholarships tailored to your grade level and school.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Scholarship Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4CAF50] to-[#42A5F5] flex items-center justify-center text-white font-bold mb-4">S</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sample Scholarship</h3>
            <p className="text-sm text-gray-600 mb-4">Description of this scholarship opportunity...</p>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Open</span>
          </div>
        </div>
      </section>
    </div>
  );
}