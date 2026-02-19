import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Chat from './Chat';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [myId, setMyId] = useState("");

  const handleCreate = () => {
    const newId = Math.random().toString(36).substring(2, 9).toUpperCase();
    setMyId(newId);
    setRoomId(newId);
  };

  if (joined) return <Chat roomId={roomId} setJoined={setJoined} />;

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg mt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">Hi, {user.username}!</h1>
          <button onClick={logout} className="text-red-500 text-sm hover:underline">Logout</button>
        </div>
        
        <input className="w-full p-3 border-2 border-slate-200 rounded-lg mb-4" 
          placeholder="Enter Room ID..." value={roomId} onChange={e => setRoomId(e.target.value)} />
        
        <button onClick={() => setJoined(true)} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-indigo-700">
          Join Chat Room
        </button>

        <div className="mt-8 pt-6 border-t text-center">
          <button onClick={handleCreate} className="text-indigo-600 font-semibold hover:text-indigo-800">
            + Generate a New Room ID
          </button>
          {myId && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800">
              <p className="text-xs uppercase font-bold">Your Generated ID (Share this):</p>
              <p className="text-2xl font-mono font-black">{myId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}