import { useState } from "react";
import { MessageSquare, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function UserLogin({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <MessageSquare className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white text-center mb-2">Chatterbox</h1>
        <p className="text-blue-100 text-center mb-8">Join the conversation in real-time</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pick a username"
              className="w-full bg-white/20 border border-white/30 text-white placeholder-blue-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl shadow-lg hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center gap-2 group text-lg"
          >
            Start Chatting
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <p className="mt-8 text-center text-blue-100/60 text-sm">
          No sign-up required. Just jump in!
        </p>
      </motion.div>
    </div>
  );
}
