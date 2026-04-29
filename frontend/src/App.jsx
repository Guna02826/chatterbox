import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import UserLogin from "./components/UserLogin";
import Sidebar from "./components/Sidebar";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import { MessageSquare, LogOut } from "lucide-react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: !!SOCKET_URL, // Only connect if URL is available
});

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [historyError, setHistoryError] = useState(null);

  useEffect(() => {
    if (!SOCKET_URL) {
      console.error("VITE_SOCKET_URL is missing. Socket connection aborted.");
    }

    // Socket Listeners
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onReceiveMessage = (data) => setMessages((prev) => [...prev, data]);
    const onUserList = (users) => setOnlineUsers(users);
    const onUserTyping = ({ username: typingUser, isTyping }) => {
      setTypingUsers((prev) => 
        isTyping 
          ? [...new Set([...prev, typingUser])] 
          : prev.filter(u => u !== typingUser)
      );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receiveMessage", onReceiveMessage);
    socket.on("userList", onUserList);
    socket.on("userTyping", onUserTyping);

    // Fetch message history on mount
    const fetchHistory = async () => {
      setHistoryError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (!apiUrl) {
          if (import.meta.env.DEV) {
            console.warn("VITE_API_URL is missing. Falling back to localhost for development.");
          } else {
            throw new Error("API URL is not configured. Please check environment variables.");
          }
        }

        const base = apiUrl || "http://localhost:5000/api";
        const res = await fetch(`${base}/messages`);
        
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setHistoryError(err.message);
      }
    };
    fetchHistory();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
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
              <div className="flex items-center gap-3">
                <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  {onlineUsers.length} active
                </p>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700 animate-pulse"
                }`}>
                  {isConnected ? "Connected" : "Disconnected"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {historyError && (
              <div className="hidden md:flex items-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                <span>History Sync Failed</span>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium"
            >
              <span>Exit</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Error Banner for History */}
        {historyError && (
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 flex items-center justify-between">
            <p className="text-xs text-amber-700">
              <b>Warning:</b> Unable to load chat history. Real-time chat may still work.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="text-[10px] font-bold text-amber-800 underline hover:no-underline"
            >
              Retry Sync
            </button>
          </div>
        )}

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
