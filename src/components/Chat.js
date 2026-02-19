import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';

// Connect to the backend socket server
const socket = io.connect("http://localhost:5000");

export default function Chat({ roomId, setJoined }) {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    // 1. Join the specific room when component loads
    socket.emit("join_room", roomId);

    // 2. Listen for incoming messages
    const messageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", messageHandler);

    // 3. Cleanup: Remove the listener when the component unmounts
    return () => {
      socket.off("receive_message", messageHandler);
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

      // Emit message to server
      await socket.emit("send_message", messageData);
      
      // Update local UI immediately for the sender
      setMessageList((list) => [...list, messageData]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Chat Header */}
        <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
          <div>
            <p className="text-xs opacity-75 uppercase font-bold">Group Room</p>
            <h2 className="text-lg font-mono font-bold">{roomId}</h2>
          </div>
          <button 
            onClick={() => setJoined(false)}
            className="bg-indigo-500 hover:bg-indigo-400 px-4 py-1 rounded-lg text-sm transition"
          >
            Leave Room
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-grow p-4 overflow-hidden bg-slate-50">
          <ScrollToBottom className="h-full">
            {messageList.map((msg, index) => (
              <div 
                key={index} 
                className={`flex flex-col mb-4 ${msg.author === user.username ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{msg.author}</span>
                </div>
                <div 
                  className={`p-3 rounded-2xl max-w-[85%] shadow-sm ${
                    msg.author === user.username 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1">{msg.time}</span>
              </div>
            ))}
          </ScrollToBottom>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t flex items-center gap-2">
          <input 
            className="flex-1 bg-slate-100 border-none rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            placeholder="Type your message..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
          />
          <button 
            onClick={sendMessage} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full transition shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}