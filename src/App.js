import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Auth from './components/Auth';
import Chat from './components/Chat';

function App() {
  const { user, logout } = useContext(AuthContext);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (roomId.trim() !== "") setJoined(true);
  };

  // 1. If not logged in, show Auth (Login/Signup)
  if (!user) return <Auth />;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      {!joined ? (
        /* EXCELLENT JOIN ROOM UI */
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl w-full max-w-md text-center">
          <button onClick={logout} className="absolute top-4 right-4 text-slate-400 hover:text-red-400 text-xs">Logout</button>
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg rotate-3">
               <span className="text-4xl">🚀</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Create or Join</h1>
            <p className="text-slate-400 text-sm mt-2">Logged in as: <span className="text-indigo-400 font-bold">{user.username}</span></p>
          </div>

          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Enter Room ID (e.g. Gamers)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-center font-mono tracking-widest"
              onChange={(e) => setRoomId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
            />
            <button 
              onClick={handleJoin}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
            >
              Start Chatting →
            </button>
          </div>
        </div>
      ) : (
        <Chat roomId={roomId} setJoined={setJoined} />
      )}
    </div>
  );
}

export default App;