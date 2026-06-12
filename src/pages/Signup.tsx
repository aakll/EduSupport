import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", age: "", schoolName: "", grade: "", graduationDate: "", email: "", password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError(""); setIsLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email, password: formData.password,
      });
      if (signUpError) throw signUpError;
      if (data.user) {
        const { error: insertError } = await supabase.from("high_school_students").insert([{
          user_id: data.user.id, first_name: formData.firstName, last_name: formData.lastName,
          age: parseInt(formData.age), school_name: formData.schoolName, grade: formData.grade,
          graduation_date: formData.graduationDate,
        }]);
        if (insertError) throw insertError;
        setMessage("Account created! Redirecting...");
        setTimeout(() => navigate("/high-school"), 1500);
      }
    } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]" />
            <input type="text" placeholder="Last Name" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Age" required value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]" />
            <input type="text" placeholder="Grade" required value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]" />
          </div>
          <input type="text" placeholder="School Name" required value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]" />
          <input type="date" required value={formData.graduationDate} onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]" />
          <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]" />
          <input type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]" />
          {message && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>}
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-lg hover:scale-[1.02] transition-all disabled:opacity-50">
            {isLoading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-500">Already have an account? <a href="/login" className="text-[#4CAF50] font-semibold">Log In</a></p>
      </div>
    </div>
  );
}