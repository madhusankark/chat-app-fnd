import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import EmojiPicker from 'emoji-picker-react';

// Connect to the backend socket server
const socket = io.connect("https://chat-app-bnd.onrender.com");

export default function Chat({ roomId, setJoined }) {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", roomId);

    const messageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", messageHandler);

    // Close emoji picker when clicking outside
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      socket.off("receive_message", messageHandler);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        room: roomId,
        author: user.username,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage("");
      setShowEmoji(false);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] p-4 font-sans">
      {/* Main Glassmorphism Container */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 p-5 text-white flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <span className="text-xl">💬</span>
            </div>
            <div>
              <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold">Live Room</p>
              <h2 className="text-lg font-bold tracking-tight">{roomId}</h2>
            </div>
          </div>
          <button 
            onClick={() => setJoined(false)}
            className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 px-4 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            Leave
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-grow overflow-hidden bg-transparent custom-scrollbar">
          <ScrollToBottom className="h-full p-4">
            {messageList.map((msg, index) => (
              <div 
                key={index} 
                className={`flex flex-col mb-4 ${msg.author === user.username ? "items-end" : "items-start"}`}
              >
                <span className="text-[10px] font-semibold text-slate-400 mb-1 px-2 uppercase">
                  {msg.author === user.username ? "You" : msg.author}
                </span>
                
                <div 
                  className={`p-3.5 rounded-2xl max-w-[80%] shadow-lg ${
                    msg.author === user.username 
                      ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-none shadow-indigo-500/20" 
                      : "bg-white/10 text-slate-100 rounded-tl-none border border-white/10 backdrop-blur-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-500 mt-1.5 font-medium px-1">{msg.time}</span>
              </div>
            ))}
          </ScrollToBottom>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/10 relative">
          {showEmoji && (
            <div className="absolute bottom-20 left-4 z-50 shadow-2xl" ref={emojiRef}>
              <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} height={400} width={300} />
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-2xl hover:scale-110 transition-transform grayscale hover:grayscale-0"
              type="button"
            >
              😊
            </button>
            
            <input 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-slate-500 transition-all"
              placeholder="Type your message..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
            />

            <button 
              onClick={sendMessage} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-500/30 active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}