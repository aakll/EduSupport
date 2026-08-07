import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError(""); setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate(redirectTo), 1500);
    } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]" />
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50]" />
          {message && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between gap-3">
              <span>{error}</span>
            </div>
          )}
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-[#4CAF50] to-[#42A5F5] text-white font-semibold rounded-lg hover:scale-[1.02] transition-all disabled:opacity-50">
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-500">Don't have an account? <Link to="/signup" className="text-[#4CAF50] font-semibold">Sign Up</Link></p>
      </div>
    </div>
  );
}