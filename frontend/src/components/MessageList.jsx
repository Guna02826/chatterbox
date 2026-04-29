import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function MessageList({ messages, currentUser, typingUsers }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      <AnimatePresence initial={false}>
        {messages.map((msg, idx) => {
          const isMe = msg.username === currentUser;
          const isSystem = msg.system;

          if (isSystem) {
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={`sys-${idx}`}
                className="flex justify-center"
              >
                <span className="bg-slate-200 text-slate-500 text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider">
                  {msg.message}
                </span>
              </motion.div>
            );
          }

          return (
            <motion.div
              initial={{ opacity: 0, x: isMe ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={msg._id || idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-bold text-slate-500">
                    {isMe ? "You" : msg.username}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {msg.createdAt ? format(new Date(msg.createdAt), "HH:mm") : format(new Date(), "HH:mm")}
                  </span>
                </div>
                
                <div 
                  className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    isMe 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {typingUsers.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 items-center text-slate-400 text-xs font-medium"
        >
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
          {typingUsers.length === 1 
            ? `${typingUsers[0]} is typing...` 
            : `${typingUsers.length} people are typing...`}
        </motion.div>
      )}
      
      <div ref={scrollRef} />
    </div>
  );
}
