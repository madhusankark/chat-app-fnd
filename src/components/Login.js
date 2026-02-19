import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(''); // State to hold error messages
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    const url = isLogin 
      ? 'http://localhost:5000/api/auth/login' 
      : 'http://localhost:5000/api/auth/signup';
    
    try {
      const { data } = await axios.post(url, formData);
      if (isLogin) {
        login(data);
      } else {
        alert("Account Created! Please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      // Capture the message from the backend and show it in the UI
      const errorMsg = err.response?.data?.message || "Connection failed. Is the backend running?";
      setError(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? "Login" : "Sign Up"}</h2>
        
        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full p-3 border rounded focus:outline-indigo-500" 
            placeholder="Username" 
            required
            onChange={e => setFormData({...formData, username: e.target.value})} 
          />
          <input 
            className="w-full p-3 border rounded focus:outline-indigo-500" 
            type="password" 
            placeholder="Password" 
            required
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
          
          <button className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 transition">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p onClick={() => { setIsLogin(!isLogin); setError(''); }} className="mt-4 text-center text-indigo-600 cursor-pointer text-sm font-medium">
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}