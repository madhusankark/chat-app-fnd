import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- DYNAMIC URL LOGIC ---
    // If you are testing on your PC, it uses localhost. 
    // If you are on the web, it uses your Render link.
    const backendURL = window.location.hostname === "localhost" 
      ? "http://localhost:5000" 
      : "https://chat-app-bnd.onrender.com"; // Updated to match your server.js

    const url = `${backendURL}/api/auth/${isLogin ? 'login' : 'signup'}`;
    
    try {
      const { data } = await axios.post(url, formData);
      if (isLogin) {
        // Data usually contains { token, username }
        login(data); 
      } else {
        alert("🎉 Account Created! Please log in now.");
        setIsLogin(true);
        setFormData({ username: '', password: '' }); // Clear form
      }
    } catch (err) {
      // This catches the specific message from your backend (like "Need a symbol")
      const errorMsg = err.response?.data?.message || "Connection failed. Is the backend running?";
      setError(errorMsg);
      console.error("Auth Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      {/* Excellent Glassmorphism Card */}
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md transform transition-all">
        
        {/* Header Section */}
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-3xl">🔑</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">
                {isLogin ? "Welcome Back" : "Join Us"}
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
                {isLogin ? "Great to see you again!" : "Passwords need 8+ chars & 1 symbol"}
            </p>
        </div>

        {/* Error Alert */}
        {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl mb-6 text-xs text-center animate-pulse">
                {error}
            </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input 
              className="w-full bg-white/5 border border-white/10 p-4 pl-5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              placeholder="Username" 
              value={formData.username}
              required
              onChange={e => setFormData({...formData, username: e.target.value})} 
            />
          </div>
          <div className="relative">
            <input 
              className="w-full bg-white/5 border border-white/10 p-4 pl-5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500" 
              type="password" 
              placeholder="Password" 
              value={formData.password}
              required
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            {isLogin ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        {/* Switcher */}
        <p 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="mt-8 text-center text-slate-400 cursor-pointer text-sm hover:text-white transition-colors"
        >
          {isLogin ? "New here? " : "Already a member? "}
          <span className="text-indigo-400 font-bold underline decoration-indigo-500/30 underline-offset-4">
            {isLogin ? "Create an account" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}