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

  // Matching Home.tsx input style
  const inputClass = "w-full px-4 py-3 border-[3px] border-black rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-black transition-all placeholder:text-gray-400 font-medium";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans text-black relative overflow-hidden">
      {/* Decorative Background Elements matching Home */}
      <div className="absolute top-10 left-10 w-32 h-32 border-4 border-green-500 rounded-full opacity-10 blur-xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-black rounded-full opacity-5 blur-xl pointer-events-none"></div>

      <div className="bg-white max-w-md w-full p-8 relative z-10">
        {/* Sketchy Border Container */}
        <div className="border-[3px] border-black p-8 rounded-[20px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            
            {/* Green Accent Scribble (CSS approximation of sketch) */}
            <div className="absolute -top-3 -left-3 w-full h-full border-2 border-[#16a34a] rounded-[25px] -z-10 opacity-60 pointer-events-none"></div>

            <h3 className="text-3xl font-black text-black mb-8 text-center tracking-tighter uppercase">
              Welcome Back
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-bold ml-1">Email</label>
                <input 
                  type="email" 
                  placeholder="student@edu.com" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className={inputClass} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold ml-1">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className={inputClass} 
                />
              </div>

              {message && (
                <div className="p-3 bg-green-50 border-[2px] border-[#16a34a] rounded-lg text-[#15803d] text-sm font-bold flex items-center gap-2">
                  <span>✓</span> {message}
                </div>
              )}
              
              {error && (
                <div className="p-3 bg-red-50 border-[2px] border-red-600 rounded-lg text-red-700 text-sm font-bold flex items-center gap-2">
                  <span>!</span> {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full py-4 bg-black text-white text-lg font-bold rounded-[50px] hover:bg-[#16a34a] transition-colors duration-300 shadow-[4px_4px_0px_0px_rgba(22,163,74,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p className="text-center mt-8 text-sm font-medium text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#16a34a] font-black underline decoration-2 underline-offset-2 hover:text-black transition-colors">
                Sign Up
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
}