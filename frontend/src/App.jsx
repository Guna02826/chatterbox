import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import UserLogin from "./components/UserLogin";
import Sidebar from "./components/Sidebar";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import { MessageSquare, LogOut } from "lucide-react";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    // Socket Listeners
    const onReceiveMessage = (data) => setMessages((prev) => [...prev, data]);
    const onUserList = (users) => setOnlineUsers(users);
    const onUserTyping = ({ username: typingUser, isTyping }) => {
      setTypingUsers((prev) => 
        isTyping 
          ? [...new Set([...prev, typingUser])] 
          : prev.filter(u => u !== typingUser)
      );
    };

    socket.on("receiveMessage", onReceiveMessage);
    socket.on("userList", onUserList);
    socket.on("userTyping", onUserTyping);

    // Fetch message history on mount
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchHistory();

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("userList", onUserList);
      socket.off("userTyping", onUserTyping);
    };
  }, []);

  const handleLogin = (name) => {
    setUsername(name);
    setIsLoggedIn(true);
    socket.emit("join", name);
  };

  const handleSendMessage = (message) => {
    socket.emit("sendMessage", { username, message });
    socket.emit("typing", { username, isTyping: false });
  };

  const handleTyping = (isTyping) => {
    socket.emit("typing", { username, isTyping });
  };

  const handleLogout = () => {
    window.location.reload(); // Simple way to reset state and disconnect
  };

  if (!isLoggedIn) {
    return <UserLogin onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans antialiased text-slate-900">
      <Sidebar users={onlineUsers} currentUser={username} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="md:hidden bg-blue-600 p-2 rounded-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">General Chat</h1>
              <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {onlineUsers.length} active members
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <span>Exit</span>
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* Chat Area */}
        <MessageList 
          messages={messages} 
          currentUser={username} 
          typingUsers={typingUsers.filter(u => u !== username)} 
        />

        {/* Input Area */}
        <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
      </div>
    </div>
  );
}

export default App;
