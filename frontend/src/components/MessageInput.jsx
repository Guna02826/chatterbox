import { useState, useRef } from "react";
import { Send, Smile, Plus } from "lucide-react";

export default function MessageInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-2">
        {/* <button 
          type="button" 
          className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button> */}
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Type a message..."
            className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-4 pr-12 text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
          {/* <button 
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button> */}
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-3 rounded-2xl transition-all shadow-lg ${
            message.trim() 
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          <Send className={`w-5 h-5 ${message.trim() ? "translate-x-0.5 -translate-y-0.5" : ""}`} />
        </button>
      </form>
    </div>
  );
}
